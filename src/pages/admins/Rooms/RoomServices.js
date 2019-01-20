import * as Services from "../../../utils/cuiResource";

export function getListRooms(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms',
        headers: {'Content-Type': 'application/json',}
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function createRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms',
        headers: {'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function getRoomById(id, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/' + id,
        headers: {'Content-Type': 'application/json',}
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function lockRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/lockroom',
        headers: {'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function constructingRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/constructingroom',
        headers: {'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function BookRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/createReservation',
        headers: {'Content-Type': 'application/json'},
        data: data
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function UpDateReversation(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation',
        headers: {'Content-Type': 'application/json'},
        data: data
    };

    Services.makePutRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function getRoomByStatus(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/getRoomByStatus?status=' + data,
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function lookRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/lockroom',
        headers: {'Content-Type': 'application/json'},
        data: {
            roomId: data
        }
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}

export function unLookRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/unlockroom',
        headers: {'Content-Type': 'application/json'},
        data: {
            roomId: data
        }
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function getCountRoomByStatus(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/rooms/countRoomByStatus',
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function checkInRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/checkin',
        headers: {'Content-Type': 'application/json'},
        data: {
            reservationId: data
        }
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function checkOutRoom(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/checkout',
        headers: {'Content-Type': 'application/json'},
        data: {
            reservationId: data
        }
    };

    Services.makePostRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}



export function getRevervationById(data, successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation/' + data,
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}


export function getAllRevervation(successCallback, failCallback) {
    let requestOptions = {
        url: '/api/reversation',
        headers: {'Content-Type': 'application/json'},
    };

    Services.makeGetRequest(requestOptions, (response) => {
        successCallback(response);
    }, (error) => {
        failCallback(error);
    });
}




