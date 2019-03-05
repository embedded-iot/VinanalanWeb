import * as Services from "../../../utils/cuiResource";

export function getUsers(params, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/users/getAllUsers',
        params: params
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function deleteUser(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/users/' + id
    };
    Services.makeDeleteRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}

export function createUser(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/users/addNewAccount',
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function editUser(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/users/updateUser',
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response.data);
    }, (error) => {
        failCallback(error);
    });
}
