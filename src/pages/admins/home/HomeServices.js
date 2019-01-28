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
export function getListHome(data, successCallback, failCallback) {
  const province = data &&  data.province_code ? '&province_code=' + data.province_code: '';
  const district = data &&  data.district_code ? '&district_code=' + data.district_code : ''
  let requestOptions = {
    url: '/api/homes/searchHome?skip=0' + '&limit=30' + province + district,
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

export function changeStatus(data, successCallback, failCallback) {
    let requestOptions = {
        url: `/api/homes/changeStatus?id=${data.id}&status=${data.status}`,
        headers: { 'Content-Type': 'application/json', }
    };

    makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

