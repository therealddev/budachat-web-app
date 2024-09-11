import React from 'react';
import { type AppProps } from 'next/app';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { BusinessProvider } from '../contexts/BusinessContext';
import '../app/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <BusinessProvider>
        <Component {...pageProps} />
      </BusinessProvider>
    </SessionContextProvider>
  );
};

export default MyApp;
