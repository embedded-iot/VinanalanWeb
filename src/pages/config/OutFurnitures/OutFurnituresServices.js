import * as Services from "../../../utils/cuiResource";

export function getOutFurnitures(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/OutFurnitures/getAllOutFurnitures',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteOutFurniture(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/OutFurnitures/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createOutFurniture(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/OutFurnitures/createOutFurniture',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editOutFurniture(id, data, successCallback, failCallback) {
    if (data.id) {
        delete data.id;
    }
    let requestOptions = {
        url: '/api/OutFurnitures/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
