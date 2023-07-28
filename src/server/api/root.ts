import { housingCloudRouter } from "~/server/api/routers/housingCloud";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  housingCloud: housingCloudRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
