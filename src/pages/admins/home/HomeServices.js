import { makeGetRequest, makePostRequest, makeDeleteRequest, makePatchRequest } from "../../../utils/cuiResource";

export function getHomeById(id, successCallback, failCallback) {
  let requestOptions = {
    url: `/api/homes/${id}`,
    headers: { 'Content-Type': 'application/json', }
  };

  makeGetRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}
export function getListHome(successCallback, failCallback) {
  let requestOptions = {
    url: '/api/homes',
    headers: { 'Content-Type': 'application/json', }
  };

  makeGetRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}
export function createHome(data, successCallback, failCallback) {
  let requestOptions = {
    url: '/api/homes',
    headers: { 'Content-Type': 'application/json', },
    data: data
  };

  makePostRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}
export function updateHome(id, data, successCallback, failCallback) {
  let requestOptions = {
    url: `/api/homes/${id}`,
    headers: { 'Content-Type': 'application/json', },
    data: data
  };

  makePatchRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}
export function deleteHome(id, successCallback, failCallback) {
  let requestOptions = {
    url: `/api/homes/${id}`,
    headers: { 'Content-Type': 'application/json', }
  };

  makeDeleteRequest(requestOptions, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}