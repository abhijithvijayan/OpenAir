/**
 *  v7
 *
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

import 'emoji-log';
import React, {useEffect} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';

function App({Component, pageProps}: AppProps): JSX.Element {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.emoji('🦄', "Wouldn't you like to know!");
  }, []);

  return (
    <>
      <Head>
        {/* See: https://git.io/Jfnla */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </>
  );
}

export default App;
