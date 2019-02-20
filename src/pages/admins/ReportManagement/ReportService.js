import * as Services from "../../../utils/cuiResource";

export function getReportByStatus(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/getReservationsByStatus?status=' + data.status + '&numDays=' + data.numDays,
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function getCountReservation(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/countReservation?numDays=' + data,
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


