/* eslint-disable no-use-before-define */
import { combineReducers } from 'redux';

import * as types from './types';
import { createReducer } from '../../utils';

const initialSignUpState = {};

const initialLoginState = {
    isAuthenticated: false,
};

const signUpReducer = createReducer(initialSignUpState)({
    [types.USER_SIGNUP_SUCCEEDED]: finishSignUp,
});

const loginReducer = createReducer(initialLoginState)({
    [types.USER_AUTH_SUCCEEDED]: onSuccessfulLogin,
});

/**
 * SIGNUP reducer functions
 */

function finishSignUp(state) {
    return { ...state, hasSignedUp: true };
}

/**
 * LOGIN / LOGOUT reducer functions
 */

function onSuccessfulLogin(state, actions) {
    return { ...state, isAuthenticated: true };
}

/* ------------------------------------- */

export default combineReducers({
    login: loginReducer,
    signup: signUpReducer,
});
