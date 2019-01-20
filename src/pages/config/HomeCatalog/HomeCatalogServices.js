import * as Services from "../../../utils/cuiResource";

export function getHomeCatalog(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog',
        headers: { 'Content-Type': 'application/json', }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function createHomeCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editHomeCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/home-catalog',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


