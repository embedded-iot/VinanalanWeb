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

export function getRoomById(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/'+ id,
        headers: { 'Content-Type': 'application/json', }
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function lockRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/lockroom',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function constructingRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/constructingroom',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function BookRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/createReservation',
        headers: { 'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


