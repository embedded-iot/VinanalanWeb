import * as Services from "../../../utils/cuiResource";

export function getHomeCatalog(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/getAllHomes',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteHome(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createNewHome(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/addNewHome',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editHomeCatalog(id, data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
