import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// common styling
import '../styles/main.scss';
import { history } from '../state/utils';

import Home from './index';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from './not-found';

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss');

const ReactApp = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Header />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="" component={NotFound} />
                    </Switch>
                    <Footer />
                </Router>
            </ThemeProvider>
        </>
    );
};

export default ReactApp;
