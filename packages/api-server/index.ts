import express from 'express';
import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';

const app = express();
// to allow communication between port 8080/server and 3000/client
app.use(cors());
const port = 8080;

// create an empty context | otherwise used for something like authentication
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

// initializing trpc
const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;

// creating a router with procedure
const appRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC!!'),
});

// exporting trpc types to maintain end-to-end types | to be used by client
export type AppRouter = typeof appRouter;

// middleware to intercept any requests coming for trpc
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/hello', (req, res) => {
  res.send('Hello from api-server');
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
