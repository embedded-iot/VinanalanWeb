import { makePostRequest} from "../../utils/cuiResource";

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

