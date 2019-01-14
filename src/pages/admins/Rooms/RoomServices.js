import * as Services from "../../../utils/cuiResource";

export function getListRooms(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms',
        headers: { 'Content-Type': 'application/json', }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function createRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}