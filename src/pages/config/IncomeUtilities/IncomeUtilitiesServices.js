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
