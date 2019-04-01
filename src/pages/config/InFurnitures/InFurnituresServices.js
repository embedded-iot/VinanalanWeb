import * as Services from "../../../utils/cuiResource";

export function getInFurnitures(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/InFurnitures/getAllInfurnitures',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteInFurniture(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/InFurnitures/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createInFurniture(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/InFurnitures/createInfurniture',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error.response.data);
    });
}

export function editInFurniture(id, data, successCallback, failCallback) {
    if (data.id) {
        delete data.id;
    }
    let requestOptions = {
        url: '/api/InFurnitures/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error.response.data);
    });
}
