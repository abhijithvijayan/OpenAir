import React from 'react';
import Head from 'next/head';
import App from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';

import { siteTitle, siteDescription } from '../config';
import { initializeStore } from '../state/store';

/* Common SASS styles */
import 'normalize.css/normalize.css';
import '../styles/main.scss';

// eslint-disable-next-line import/no-webpack-loader-syntax
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss');
// Require sass variables using sass-extract-loader and specify the plugin

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        // https://github.com/kirill-konshin/next-redux-wrapper#usage
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return { pageProps };
    }

    render() {
        const { Component, pageProps, store } = this.props;
        return (
            <>
                <Head>
                    <title>{siteTitle}</title>
                    <meta name="description" content={siteDescription} />
                </Head>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Provider>
            </>
        );
    }
}

export default withRedux(initializeStore)(MyApp);
