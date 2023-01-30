import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from 'api-server';

export const trpc = createTRPCReact<AppRouter>();
