/**
 * Common configuration for the app in both dev an prod mode
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import initializeStore from './state/store';
import App from './pages/_app';

const reduxStore = initializeStore(window.REDUX_INITIAL_DATA);

ReactDOM.render(
    <Provider store={reduxStore}>
        <App />
    </Provider>,
    document.getElementById('app')
);
