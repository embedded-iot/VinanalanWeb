import * as Services from "../../../utils/cuiResource";

export function getRoomUtilities(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/RoomUtilities/getAllRoomutilitiess',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteRoomUtility(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/RoomUtilities/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createRoomUtility(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/RoomUtilities/createRoomutilities',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error.response.data);
    });
}

export function editRoomUtility(id, data, successCallback, failCallback) {

    let requestOptions = {
        url: '/api/RoomUtilities/updateRoomUtilities',
        data: {
            ...data,
            id: id
        }
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error.response);
    });
}
