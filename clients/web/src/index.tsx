/**
 * Common configuration for the app in both dev an prod mode
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import initializeStore from './state/store';
import App from './pages/_app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reduxStore = initializeStore((window as any).REDUX_INITIAL_DATA);

ReactDOM.render(
    <Provider store={reduxStore}>
        <App />
    </Provider>,
    document.getElementById('app')
);
