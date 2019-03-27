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

export function getListRoomOfHome(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/listRoomOfHome',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback({ data: response.data, count: response.count ? response.count : response.data.length });
    }, (error) => {
        failCallback(error);
    });
}
