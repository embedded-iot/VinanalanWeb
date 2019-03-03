import * as Services from "../../../utils/cuiResource";

export function getIncomeUtilities(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/income_utilities/getAllIncomeUtilities',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteIncomeUtility(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/income_utilities/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createIncomeUtility(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/income_utilities/incomeUtilities',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editIncomeUtility(id, data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/income_utilities/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
