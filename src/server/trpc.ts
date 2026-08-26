import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "@/server/db";
import type { PrismaClient } from "@/generated/prisma/client";

/**
 * tRPC context: the Prisma client. No auth procedures here — the middleware
 * already gates every route (including /api/trpc) at the HTTP layer.
 */
export interface Context {
  db: PrismaClient;
}

export function createContext(): Context {
  return { db: prisma };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
