import * as Services from "../../../utils/cuiResource";

export function getRooms(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/getAllRooms',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteRoom(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createNewRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/addNewRoom',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/updateRoom',
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function getRoomDetails(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/roomDetail',
        params: { roomId: id}
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
