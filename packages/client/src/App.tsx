import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import './index.scss';

// Manages cache on react-query side
const queryClient = new QueryClient();

const AppContent = () => {
  // states to maintain a new user and message
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  // querying the greeting prodecure
  const greeting = trpc.greeting.useQuery();

  // querying the getMessages procedure, which by default returns last 10 messages
  const getLastTenMessages = trpc.getMessages.useQuery();

  // querying the getMessages procedure with an argument, which returns last message
  const getLastMessage = trpc.getMessages.useQuery(1);

  // create and addMessage procedure call which can be used to mutate data
  const newMessage = trpc.addMessage.useMutation();
  const addMessage = () => {
    newMessage.mutate(
      {
        user: user,
        message: message,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return (
    <div className='mt-10 text-3xl mx-auto max-w-6xl'>
      <div>{JSON.stringify(greeting.data)}</div>
      <br />
      <p className='text-red-400 underline mb-2'>Last 10 Messages</p>
      <div>
        {(getLastTenMessages.data ?? []).map((row) => (
          <div key={row.message}>{JSON.stringify(row)}</div>
        ))}
      </div>
      <br />
      <p className='text-red-400 underline mb-2'>Last Message</p>
      <div>{JSON.stringify(getLastMessage.data)}</div>
      <br />
      <p className='text-red-400 underline mb-2'>Add New Message</p>
      <div className='mt-10 mb-5'>
        <input
          type='text'
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className='p-5 border-2 border-gray-300 rounded-lg w-full'
          placeholder='User'
        />
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='p-5 border-2 border-gray-300 rounded-lg w-full'
          placeholder='Message'
        />
      </div>
      <button
        className='border hover:bg-green-400 bg-green-700 text-white rounded-lg px-2'
        onClick={addMessage}
      >
        Add
      </button>
    </div>
  );
};

const App = () => {
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
