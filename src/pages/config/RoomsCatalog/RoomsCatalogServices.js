import * as Services from "../../../utils/cuiResource";

export function getRoomsCatalog(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog/getAllRoomCatalogs',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteRoomCatalog(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createRoomCatalog(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog/createRoomcatalog',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error.response.data);
    });
}

export function editRoomCatalog(id, data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/room-catalog/updateRoomCatalog',
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
