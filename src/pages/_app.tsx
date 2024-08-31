// _app.js (or _app.tsx)
import React from 'react';
import { type AppProps } from 'next/app';
import RootLayout from '@/app/layout';
// import { GeistSans } from 'geist/font/sans';

const MyApp: React.FC<AppProps> = ({ Component, pageProps, router }) => {
  return (
    <>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  );
};

export default MyApp;
