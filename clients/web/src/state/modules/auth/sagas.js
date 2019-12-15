/* eslint-disable no-use-before-define */
import { takeLatest, put, call } from 'redux-saga/effects';

import * as AuthTypes from './types';
import baseApi from '../../../api';
import { authSuccess, authFailed } from './operations';

export default function* watcherSaga() {
    yield takeLatest(AuthTypes.AUTH_USER, authWorker);
}

function login(data) {
    return baseApi({
        method: 'POST',
        url: '/auth',
        data,
    });
}

function* authWorker(action) {
    console.log('saga invoked');
    const loginData = action.payload;

    try {
        // request API
        const { data } = yield call(login, loginData);

        // dispatch success action
        yield put(authSuccess(data));
    } catch (err) {
        // dispatch fail action
        yield put(authFailed(err));
    }
}
