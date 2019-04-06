import * as Services from "../../../utils/cuiResource";

export function getExtraFees(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/extra_fees/getAllExtrafees',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteExtraFee(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/extra_fees/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createExtraFee(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/extra_fees/createExtrafee',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error.response.data);
    });
}

export function editExtraFee(id, data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/extra_fees/updateExtrafee',
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
