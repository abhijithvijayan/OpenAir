/* eslint-disable no-use-before-define */

import * as AuthTypes from './types';

export const authUser = data => {
    return {
        type: AuthTypes.AUTH_USER,
        payload: data,
    };
};

export const authSuccess = user => {
    return {
        type: AuthTypes.AUTH_USER_SUCCEEDED,
        payload: user,
    };
};

export const authFailed = err => {
    return {
        type: AuthTypes.AUTH_USER_FAILED,
        payload: err,
    };
};
