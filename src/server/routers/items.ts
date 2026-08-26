import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, type Context } from "@/server/trpc";
import { PHASE_IDS, getPhaseContent } from "@/content/catalog";

const itemStatusEnum = z.enum(["todo", "done", "na"]);

/**
 * Catalog lookup: group for an itemKey within a program type, or null if the
 * key is not part of that type's catalog. Unknown keys are rejected at the
 * API boundary so progress (derived from the catalog) can never be corrupted.
 */
function catalogGroupFor(typeId: string, itemKey: string): string | null {
  for (const phaseId of PHASE_IDS) {
    const content = getPhaseContent(typeId, phaseId);
    if (content.activities.some((i) => i.slug === itemKey)) return "activities";
    if (content.nonNeg.some((i) => i.slug === itemKey)) return "nonNeg";
  }
  return null;
}

async function requireProgram(
  db: Context["db"],
  programId: string,
): Promise<{ id: string; typeId: string }> {
  const program = await db.program.findUnique({ where: { id: programId } });
  if (!program) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Program ${programId} not found`,
    });
  }
  return program;
}

export const itemsRouter = router({
  /**
   * Set an item's status. Upserts by (programId, itemKey); completedAt is
   * stamped when an item becomes "done" and cleared when it leaves "done".
   * Writes an item_done / item_reopened / item_na event accordingly.
   */
  setStatus: publicProcedure
    .input(
      z.object({
        programId: z.string(),
        itemKey: z.string().min(1),
        status: itemStatusEnum,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const program = await requireProgram(ctx.db, input.programId);
      const group = catalogGroupFor(program.typeId, input.itemKey);
      if (!group) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown itemKey for type "${program.typeId}": ${input.itemKey}`,
        });
      }
      const completedAt = input.status === "done" ? new Date() : null;
      const [item] = await ctx.db.$transaction([
        ctx.db.checklistItem.upsert({
          where: {
            programId_itemKey: {
              programId: input.programId,
              itemKey: input.itemKey,
            },
          },
          create: {
            programId: input.programId,
            itemKey: input.itemKey,
            group,
            status: input.status,
            completedAt,
          },
          update: { status: input.status, completedAt },
        }),
        ctx.db.programEvent.create({
          data: {
            programId: input.programId,
            itemKey: input.itemKey,
            kind:
              input.status === "done"
                ? "item_done"
                : input.status === "na"
                  ? "item_na"
                  : "item_reopened",
            payload: { status: input.status },
          },
        }),
      ]);
      return item;
    }),

  /**
   * Update item metadata (notes / owner / dueDate). Upserts by
   * (programId, itemKey) and writes a note_edited event listing the fields
   * that actually changed.
   */
  updateMeta: publicProcedure
    .input(
      z.object({
        programId: z.string(),
        itemKey: z.string().min(1),
        notes: z.string().nullish(),
        owner: z.string().nullish(),
        dueDate: z.date().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const program = await requireProgram(ctx.db, input.programId);
      const group = catalogGroupFor(program.typeId, input.itemKey);
      if (!group) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown itemKey for type "${program.typeId}": ${input.itemKey}`,
        });
      }

      const existing = await ctx.db.checklistItem.findUnique({
        where: {
          programId_itemKey: {
            programId: input.programId,
            itemKey: input.itemKey,
          },
        },
      });

      const data: { notes?: string | null; owner?: string | null; dueDate?: Date | null } = {};
      const fields: string[] = [];
      if (input.notes !== undefined && input.notes !== existing?.notes) {
        data.notes = input.notes;
        fields.push("notes");
      }
      if (input.owner !== undefined && input.owner !== existing?.owner) {
        data.owner = input.owner;
        fields.push("owner");
      }
      if (
        input.dueDate !== undefined &&
        (input.dueDate ?? null)?.getTime() !== (existing?.dueDate ?? null)?.getTime()
      ) {
        data.dueDate = input.dueDate ?? null;
        fields.push("dueDate");
      }

      const item = await ctx.db.checklistItem.upsert({
        where: {
          programId_itemKey: {
            programId: input.programId,
            itemKey: input.itemKey,
          },
        },
        create: {
          programId: input.programId,
          itemKey: input.itemKey,
          group,
          notes: input.notes ?? undefined,
          owner: input.owner ?? undefined,
          dueDate: input.dueDate ?? undefined,
        },
        update: data,
      });

      if (fields.length > 0) {
        await ctx.db.programEvent.create({
          data: {
            programId: input.programId,
            itemKey: input.itemKey,
            kind: "note_edited",
            payload: { itemKey: input.itemKey, fields },
          },
        });
      }
      return item;
    }),
});
