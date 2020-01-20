import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

// common styling
import '../styles/main.scss';
import { history } from '../state/utils';

import Home from './index';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from './not-found';

const ReactApp = (): JSX.Element => {
    return (
        <>
            <Router history={history}>
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="" component={NotFound} />
                </Switch>
                <Footer />
            </Router>
        </>
    );
};

export default ReactApp;
