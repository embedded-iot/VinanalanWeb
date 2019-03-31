import * as Services from "../../../utils/cuiResource";

export function getHomes(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/searchHome',
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
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function checkRoomsStatus(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/checkRoomsStatus',
        params: {
            roomIds: params.roomIds,
            checkin: params.checkin,
            checkout: params.checkout
        }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createReservation(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/createReservation',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
