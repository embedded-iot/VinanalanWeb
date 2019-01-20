import * as Services from "../../../utils/cuiResource";

export function getRoomsCatalog(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog',
        headers: { 'Content-Type': 'application/json', }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function createRoomsCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function upDateRoomsCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}



