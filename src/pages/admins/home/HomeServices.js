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

// export function getListHome(data, successCallback, failCallback) {
// //   const province = data &&  data.province_code ? '&province_code=' + data.province_code: '';
// //   const district = data &&  data.district_code ? '&district_code=' + data.district_code : ''
// //   let requestOptions = {
// //     url: '/api/homes/searchHome?skip=0' + '&limit=30' + province + district,
// //     headers: { 'Content-Type': 'application/json', }
// //   };
// //
// //   makeGetRequest(requestOptions, (response) => {
// //     successCallback(response);
// //   }, (error) => {
// //     failCallback(error);
// //   });
// // }

export function getListHome(data, successCallback, failCallback) {
    const country = data && data.country ? '&country_code=' + data.country : ''
    const province = data && data.provinces ? '&province_code=' + data.provinces : '';
    const district = data && data.districts ? '&district_code=' + data.districts : '';
    const ward = data && data.wards ? '&ward_code=' + data.wards : '';
    const skip = data && data.skip ? 'skip=' + data.skip : 'skip=0';
    const limit = data && data.limit ? '&limit=' + data.limit : '&limit=10';
    let requestOptions = {
        url: '/api/homes/searchHome?' + skip + limit + country + province + district + ward,
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

