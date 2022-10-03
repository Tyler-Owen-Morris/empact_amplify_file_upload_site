// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { s3Router } from "./s3";
// import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("s3.", s3Router);
// .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
