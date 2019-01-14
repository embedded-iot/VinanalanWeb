import { authHeader } from '../../../helper/index';
import { makeGetRequest, makePostRequest, makePatchRequest } from "../../../utils/cuiResource";

export function register(user, successCallback, failCallback) {
  const requestOptions = {
    url: '/api/users',
    headers: { 'Content-Type': 'application/json' },
    data: user
  };

  makePostRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function resetPass(email, successCallback, failCallback) {
  let requestOptions = {
    url: '/api/account/request-password-reset',
    headers: { 'Content-Type': 'application/json', },
    data: {
      "email": email
    }
  };

  makePostRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function login(user, successCallback, failCallback) {
  let requestOptions = {
    url: '/api/users/signin/',
    headers: { 'Content-Type': 'application/json', },
    data: user
  };

  makePostRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function isHost() {
  const roles = JSON.parse(localStorage.getItem('roles'));
  if (roles && roles.includes("host")) {
    return true;
  } else {
    return false;
  }
}

export function isAdmin() {
  const roles = JSON.parse(localStorage.getItem('roles'));
  if (roles && roles.includes("admin")) {
    return true;
  } else {
    return false;
  }
}

export function logout() {
  // remove user from local storage to log user out
  localStorage.clear();
}

//http://207.148.122.234:3300/api/account/5b011166cff9d9710d3732ea?filter={"include": "company"}&access_token=2y1RBy89BoMgzDBGjRQmQzJU1UlhTgNIEq0BHYdv6ApqprTzwbgvhwAsqlBvNyVX

export function getUserInfo(id, successCallback, failCallback) {
  let token = localStorage.getItem('token');
  let config = {
    url: '/api/account/' + id + '?filter={"include": "company"}&access_token=' + token,
    headers: { 'Content-Type': 'application/json' }
  };
  makeGetRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function upgradeHostUser(userInfo, successCallback, failCallback) {
  let token = localStorage.getItem('token');
  let config = {
    url: '/api/account/become-host?access_token=' + token,
    headers: { 'Content-Type': 'application/json' },
    data: userInfo
  };
  makePostRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function updateUserInfo(id, userInfo, successCallback, failCallback) {
  let token = localStorage.getItem('token');
  let config = {
    url: '/api/account/' + id + '?access_token=' + token,
    headers: { 'Content-Type': 'application/json' },
    data: userInfo
  };
  makePatchRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function updateUserBusinessInfo(id, userInfo, successCallback, failCallback) {
  let token = localStorage.getItem('token');
  let config = {
    url: '/api/account/' + id + '/update-user-business?access_token=' + token,
    headers: { 'Content-Type': 'application/json' },
    data: userInfo
  };
  makePostRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}