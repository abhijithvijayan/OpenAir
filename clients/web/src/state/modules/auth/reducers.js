/* eslint-disable no-use-before-define */
import * as AuthTypes from './types';
import { createReducer } from '../../utils';

const initialSignUpState = {
    isAuthenticated: null,
};

const authReducer = createReducer(initialSignUpState)({
    [AuthTypes.AUTH_USER_SUCCEEDED]: authSuccess,
    [AuthTypes.AUTH_USER_FAILED]: authFailed,
});

function authSuccess(state, action) {
    const user = action.payload;
    return { ...state, user, isAuthenticated: true };
}

function authFailed(state, action) {
    const error = action.payload;
    return { ...state, error, isAuthenticated: false };
}

/* ------------------------------------- */

export default authReducer;
