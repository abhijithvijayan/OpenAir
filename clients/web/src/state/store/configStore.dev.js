import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import * as reducers from '../modules';
import sagas from '../modules/rootSaga';
import { registerWithMiddleware } from '../utils';

const sagaMiddleware = createSagaMiddleware();

function createMiddleware() {
    return composeWithDevTools(applyMiddleware(sagaMiddleware));
}

const initializeStore = initialState => {
    const rootReducer = combineReducers(reducers);

    const Store = createStore(rootReducer, initialState, createMiddleware());

    // registers the sagas programmatically
    registerWithMiddleware(sagaMiddleware, sagas);

    return Store;
};

export default initializeStore;
