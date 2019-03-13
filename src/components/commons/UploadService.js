import {makePostRequest, URL_SERVER} from "../../utils/cuiResource";

export const url_upload_image = URL_SERVER + '/api/container/images/upload';

export function uploadImage(data, successCallback, failCallback) {
    let config = {
        url: '/api/container/images/upload',
        data: data
    };
    makePostRequest(config, (response) => {
        successCallback(response);
    }, (error)=>{
        failCallback(error);
    });
}
export function postIcon(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/container/images/upload',
        data: data
    };

    makePostRequest(requestOptions, (response) => {
        successCallback(response.data.data.result.files);
    }, (error) => {
        failCallback(error);
    });
}


export function uploadVideo(data, successCallback, failCallback) {
    let config = {
        url: '/api/container/videos/upload',
        data: data
    };
    makePostRequest(config, (response) => {
        successCallback(response);
    }, (error)=>{
        failCallback(error);
    });
}

