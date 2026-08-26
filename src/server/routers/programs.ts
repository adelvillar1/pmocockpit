import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "@/server/trpc";
import {
  CATALOG_SCHEMA_VERSION,
  PHASE_IDS,
  PROGRAM_TYPE_IDS,
  getPhaseContent,
} from "@/content/catalog";
import { overallProgress, type ItemLike } from "@/server/progress";

const typeIdEnum = z.enum(PROGRAM_TYPE_IDS as readonly [string, ...string[]]);
const programStatusEnum = z.enum(["active", "paused", "complete", "archived"]);
const itemStatusEnum = z.enum(["todo", "done", "na"]);

/**
 * Materialize every catalog item (all 7 phases, activities + nonNeg) for a
 * program type as checklist-item rows. Slugs and groups come straight from
 * the catalog — this is the load-bearing invariant for derived progress.
 */
function materializeCatalogItems(typeId: string): {
  itemKey: string;
  group: string;
}[] {
  const rows: { itemKey: string; group: string }[] = [];
  for (const phaseId of PHASE_IDS) {
    const content = getPhaseContent(typeId, phaseId);
    for (const item of content.activities) {
      rows.push({ itemKey: item.slug, group: "activities" });
    }
    for (const item of content.nonNeg) {
      rows.push({ itemKey: item.slug, group: "nonNeg" });
    }
  }
  return rows;
}

/** Expected itemKey -> group map for a program type, derived from the catalog. */
function catalogKeyMap(typeId: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of materializeCatalogItems(typeId)) {
    map.set(row.itemKey, row.group);
  }
  return map;
}

const importPayloadSchema = z.object({
  schemaVersion: z.number(),
  exportedAt: z.string(),
  program: z.object({
    typeId: typeIdEnum,
    name: z.string().min(1),
    context: z.string().nullish(),
    status: programStatusEnum,
  }),
  items: z.array(
    z.object({
      itemKey: z.string().min(1),
      group: z.string(),
      status: itemStatusEnum,
      notes: z.string().nullish(),
      owner: z.string().nullish(),
      dueDate: z.date().nullish(),
      completedAt: z.date().nullish(),
    }),
  ),
});

export const programsRouter = router({
  /** All programs, newest first, with derived (non-stored) progress. */
  list: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.program.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return programs.map((program) => ({
      id: program.id,
      typeId: program.typeId,
      name: program.name,
      context: program.context,
      status: program.status,
      createdAt: program.createdAt,
      progress: overallProgress(program.items as ItemLike[], program.typeId),
    }));
  }),

  /** Create a program and materialize the full catalog checklist for its type. */
  create: publicProcedure
    .input(
      z.object({
        typeId: typeIdEnum,
        name: z.string().min(1),
        context: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = materializeCatalogItems(input.typeId);
      const program = await ctx.db.$transaction(async (tx) => {
        const created = await tx.program.create({
          data: {
            typeId: input.typeId,
            name: input.name,
            context: input.context,
          },
        });
        await tx.checklistItem.createMany({
          data: rows.map((row) => ({ programId: created.id, ...row })),
          skipDuplicates: true,
        });
        await tx.programEvent.create({
          data: {
            programId: created.id,
            kind: "program_created",
            payload: { typeId: input.typeId, name: input.name },
          },
        });
        return created;
      });
      return { id: program.id };
    }),

  /** One program with all items and its 100 most recent events. */
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: { id: input.id },
        include: {
          items: true,
          events: { orderBy: { createdAt: "desc" }, take: 100 },
        },
      });
      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Program ${input.id} not found`,
        });
      }
      return program;
    }),

  /** Change program status and record the transition as an event. */
  setStatus: publicProcedure
    .input(z.object({ id: z.string(), status: programStatusEnum }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.program.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Program ${input.id} not found`,
        });
      }
      const [program] = await ctx.db.$transaction([
        ctx.db.program.update({
          where: { id: input.id },
          data: { status: input.status },
        }),
        ctx.db.programEvent.create({
          data: {
            programId: input.id,
            kind: "status_changed",
            payload: { from: existing.status, to: input.status },
          },
        }),
      ]);
      return program;
    }),

  /** Delete a program; items and events cascade. */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.program.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Program ${input.id} not found`,
        });
      }
      await ctx.db.program.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  /** Portable JSON export of one program (schema version + items). */
  exportJson: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const program = await ctx.db.program.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
      if (!program) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Program ${input.id} not found`,
        });
      }
      return {
        schemaVersion: CATALOG_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        program: {
          // Parse through the catalog enums so the export is directly
          // consumable by importJson (fails loudly on legacy/unknown values).
          typeId: typeIdEnum.parse(program.typeId),
          name: program.name,
          context: program.context,
          status: programStatusEnum.parse(program.status),
        },
        items: program.items.map((item) => ({
          itemKey: item.itemKey,
          group: item.group,
          status: itemStatusEnum.parse(item.status),
          notes: item.notes,
          owner: item.owner,
          dueDate: item.dueDate,
          completedAt: item.completedAt,
        })),
      };
    }),

  /**
   * Import a previously exported program. Validates the schema version and
   * that every imported itemKey exists in the catalog for the program type —
   * unknown keys are rejected, never written as orphan rows.
   */
  importJson: publicProcedure
    .input(importPayloadSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.schemaVersion !== CATALOG_SCHEMA_VERSION) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Schema version mismatch: expected ${CATALOG_SCHEMA_VERSION}, got ${input.schemaVersion}`,
        });
      }
      const keyMap = catalogKeyMap(input.program.typeId);
      for (const item of input.items) {
        if (!keyMap.has(item.itemKey)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unknown itemKey for type "${input.program.typeId}": ${item.itemKey}`,
          });
        }
      }
      const program = await ctx.db.$transaction(async (tx) => {
        const created = await tx.program.create({
          data: {
            typeId: input.program.typeId,
            name: input.program.name,
            context: input.program.context ?? undefined,
            status: input.program.status,
          },
        });
        await tx.checklistItem.createMany({
          data: input.items.map((item) => ({
            programId: created.id,
            itemKey: item.itemKey,
            // Group comes from the catalog, not the import payload.
            group: keyMap.get(item.itemKey)!,
            status: item.status,
            notes: item.notes ?? undefined,
            owner: item.owner ?? undefined,
            dueDate: item.dueDate ?? undefined,
            completedAt: item.completedAt ?? undefined,
          })),
          skipDuplicates: true,
        });
        await tx.programEvent.create({
          data: {
            programId: created.id,
            kind: "program_created",
            payload: {
              typeId: input.program.typeId,
              name: input.program.name,
              imported: true,
            },
          },
        });
        return created;
      });
      return { id: program.id };
    }),
});
