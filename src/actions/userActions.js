import { userConstants } from '../constants';
import * as services from '../pages/users/services/userService';
import {alertActions, spinActions} from './';
import cookie from 'react-cookies';
import { FormattedMessage } from 'react-intl';
import React from "react";

const STRINGS = {
  CONGRATULATIONS_YOU_REGISTERED_SUCESSFULLY_PLEASE_LOGIN: <FormattedMessage id="CONGRATULATIONS_YOU_REGISTERED_SUCESSFULLY_PLEASE_LOGIN" />,
}
export const userActions = {
  resetPass,
  login,
  logout,
  register
  // getAll,
  // delete: _delete
};

function login(user, remember, history) {
  return dispatch => {
    dispatch(request({ user }));
    dispatch(spinActions.showSpin());
    services.login(user, response => {
      if (response.data.isSucess) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.id);
        if (remember) {
          cookie.save("vinaland_email_login", user.email, { path: '/' });
        }
        dispatch(success(response.data.data.user));
        dispatch(spinActions.hideSpin());
        history.push('/');
      } else {
        dispatch(failure(response.data.description));
        dispatch(alertActions.error(response.data.description));
        dispatch(spinActions.hideSpin());
      }
    }
      , error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error.response.data.error.message));
      });
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function resetPass(email) {
  return dispatch => {
    services.resetPass(email, response => {
      if (response.data.isSucess) {
        dispatch(alertActions.success(response.data.description));
        // history.push('/login');
      } else {
        dispatch(failure(response.data.description));
        dispatch(alertActions.error(response.data.description));
      }
    }
      , error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  };

  // function request(user) { retu?rn { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  services.logout();
  return { type: userConstants.LOGOUT };
}

function register(user, history) {
  return dispatch => {
    dispatch(request(user));

    services.register(user, response => {
      if (response.status === 200) {
        dispatch(success());
        history.push('/login');
        dispatch(alertActions.success(STRINGS.CONGRATULATIONS_YOU_REGISTERED_SUCESSFULLY_PLEASE_LOGIN));
      } else {
        dispatch(failure(response.data.description));
        dispatch(alertActions.error(response.data.description));
      }
    }, error => {
      dispatch(failure(error));
      dispatch(alertActions.error(error));
    })
  };

  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}