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
