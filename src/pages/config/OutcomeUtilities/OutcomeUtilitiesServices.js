import * as Services from "../../../utils/cuiResource";

export function getOutcomeUtilities(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/outcome_utilities/getAllOutcomeUtilities',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteOutcomeUtility(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/outcome_utilities/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createOutcomeUtility(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/outcome_utilities/outcomeUtilities',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editOutcomeUtility(id, data, successCallback, failCallback) {
    if (data.id) {
        delete data.id;
    }
    let requestOptions = {
        url: '/api/outcome_utilities/' + id,
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
