import * as Services from "../../../utils/cuiResource";

export function getHomes(params, successCallback, failCallback) {
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

export function getSearchHomeAddress(searchText, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/searchHomeAddress',
        params: {
            searchText
        }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function getHomeDetails(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/homeInfo',
        params: { id: id}
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function getAllMediaHome(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/homes/getAllMedia',
        params: { id: id}
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
