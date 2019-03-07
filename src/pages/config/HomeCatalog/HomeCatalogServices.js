import * as Services from "../../../utils/cuiResource";

export function getHomeCatalog(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog/getAllHomeCatalogs',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteHomeCatalog(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createHomeCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog/createHomeCatalog',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editHomeCatalog(id, data, successCallback, failCallback) {
    if (data.id) {
        delete data.id;
    }
    let requestOptions = {
        url: '/api/home-catalog/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
