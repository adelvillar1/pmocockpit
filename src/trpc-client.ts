"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

/** Typed tRPC React hooks for the whole app (type-only import of AppRouter). */
export const trpc = createTRPCReact<AppRouter>();
