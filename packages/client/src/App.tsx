import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import './index.scss';

const AppContent = () => {
  const greeting = trpc.greeting.useQuery();
  console.log(greeting.data);
  return (
    <div className='mt-10 text-3xl mx-auto max-w-6xl'>
      <div>{JSON.stringify(greeting.data)}</div>
    </div>
  );
};

const App = () => {
  // manages all the caching
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:8080/trpc',
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
