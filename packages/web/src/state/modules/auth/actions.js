/* eslint-disable no-use-before-define */

import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

export const syncAction = () => {
    return dispatch => {
        dispatch({
            type: types.USER_AUTH_SUCCEEDED,
        });
    };
};

export const asyncAction = ({ email }) => {
    return async dispatch => {
        try {
            await api({
                method: 'POST',
                url: endpoints.SIGNUP_SUBMIT_ENDPOINT,
                data: {
                    email,
                },
            });

            dispatch({
                type: types.USER_SIGNUP_SUCCEEDED,
            });
        } catch (err) {
            console.log(err);
        }
    };
};
