/**
 *  @openair/web
 *
 *  @author   abhijithvijayan <abhijithvijayan.in>
 *  @license  GNU GPLv3 License
 */

import 'emoji-log';
import React, {useEffect} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {ThemeProvider} from 'styled-components';

// common styles
import '../styles/main.scss';

// ToDo: types
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-webpack-loader-syntax, import/no-unresolved
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss'); // extract sass variables

export interface Theme {
  [key: string]: string;
}

function App({Component, pageProps}: AppProps): JSX.Element {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.emoji('🦄', "Wouldn't you like to know!");
  }, []);

  return (
    <>
      <Head>
        {/* See: https://git.io/Jfnla */}
        <title>OpenAir | Dashboard</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default App;
