import axios from "axios";
import { isFunction, isObject, extend } from 'lodash';
import { history } from '../../src/helper';

const SERVER = "http://35.185.47.170:3300";
const header = [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos = [
      { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
      { name: 'Windows', value: 'Win', version: 'NT' },
      { name: 'iPhone', value: 'iPhone', version: 'OS' },
      { name: 'iPad', value: 'iPad', version: 'OS' },
      { name: 'Kindle', value: 'Silk', version: 'Silk' },
      { name: 'Android', value: 'Android', version: 'Android' },
      { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
      { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
      { name: 'Macintosh', value: 'Mac', version: 'OS X' },
      { name: 'Linux', value: 'Linux', version: 'rv' },
      { name: 'Palm', value: 'Palm', version: 'PalmOS' }
    ],
    databrowser = [
      { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
      { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
      { name: 'Safari', value: 'Safari', version: 'Version' },
      { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
      { name: 'Opera', value: 'Opera', version: 'Opera' },
      { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
      { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
    ];

export function matchItem(string, data) {
  var i = 0,
    j = 0,
    html = '',
    regex,
    regexv,
    match,
    matches,
    version;

  for (i = 0; i < data.length; i += 1) {
    regex = new RegExp(data[i].value, 'i');
    match = regex.test(string);
    if (match) {
      regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
      matches = string.match(regexv);
      version = '';
      if (matches) { if (matches[1]) { matches = matches[1]; } }
      if (matches) {
        matches = matches.split(/[._]+/);
        for (j = 0; j < matches.length; j += 1) {
          if (j === 0) {
            version += matches[j] + '.';
          } else {
            version += matches[j];
          }
        }
      } else {
        version = '0';
      }
      return {
        name: data[i].name,
        version: parseFloat(version)
      };
    }
  }
  return { name: 'unknown', version: 0 };
}

export function makeGetRequest(config, successCallback, failCallback) {
  let link_api = SERVER + config.url;
  let requestConfig = {
    method: 'GET',
    url: link_api,
    headers: config.headers
  };

  let agent = header.join(' ');
  let os = matchItem(agent, dataos);

  const user = JSON.parse(localStorage.getItem('user'));
  let userId = "";
  if (user) {
    userId = user.id;
  }
  if (requestConfig.headers) {
    requestConfig.headers = extend(requestConfig.headers, { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId });
  } else {
    requestConfig.headers = { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId };
  }
  axios(requestConfig)
    .then(res => {
      if (!res.data.isSucess && res.data.description === "Authorization Required") {
        history.push("/Login");
      } else {
        successCallback(res);
      }
    }).catch(function (error) {
      failCallback(error);
    });
}

export function makePostRequest(config, successCallback, failCallback) {
  let link_api = SERVER + config.url;
  let requestConfig = {
    method: 'POST',
    url: link_api,
    headers: config.headers,
    data: config.data
  };

  
  let agent = header.join(' ');
  let os = matchItem(agent, dataos);
  const user = JSON.parse(localStorage.getItem('user'));
  let userId = "";
  if (user) {
    userId = user.id;
  }
  if (requestConfig.headers) {
    requestConfig.headers = extend(requestConfig.headers, { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId });
  } else {
    requestConfig.headers = { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId };
  }
  axios(requestConfig)
    .then(res => {
      if (!res.data.isSucess && res.data.description === "Authorization Required") {
        history.push("/Login");
      } else {
        successCallback(res);
      }
    }).catch(function (error) {
      failCallback(error);
    });
}

export function makePatchRequest(config, successCallback, failCallback) {
  let link_api = SERVER + config.url;
  let requestConfig = {
    method: 'PATCH',
    url: link_api,
    headers: config.headers,
    data: config.data
  };

  let agent = header.join(' ');
  let os = matchItem(agent, dataos);
  const user = JSON.parse(localStorage.getItem('user'));
  let userId = "";
  if (user) {
    userId = user.id;
  }
  if (requestConfig.headers) {
    requestConfig.headers = extend(requestConfig.headers, { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId });
  } else {
    requestConfig.headers = { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId };
  }
  axios(requestConfig)
    .then(res => {
      if (!res.data.isSucess && res.data.description === "Authorization Required") {
        history.push("/Login");
      } else {
        successCallback(res);
      }
    }).catch(function (error) {
      failCallback(error);
    });
}

export function makePutRequest(config, successCallback, failCallback) {
  let link_api = SERVER + config.url;
  let requestConfig = {
    method: 'PUT',
    url: link_api,
    headers: config.headers,
    data: config.data
  };

  let agent = header.join(' ');
  let os = matchItem(agent, dataos);
  const user = JSON.parse(localStorage.getItem('user'));
  let userId = "";
  if (user) {
    userId = user.id;
  }
  if (requestConfig.headers) {
    requestConfig.headers = extend(requestConfig.headers,{ "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId });
  } else {
    requestConfig.headers = { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId };
  }
  axios(requestConfig)
    .then(res => {
      if (!res.data.isSucess && res.data.description === "Authorization Required") {
        history.push("/Login");
      } else {
        successCallback(res);
      }
    }).catch(function (error) {
      failCallback(error);
    });
}

export function makeDeleteRequest(config, successCallback, failCallback) {
  let link_api = SERVER + config.url;
  let requestConfig = {
    method: 'DELETE',
    url: link_api,
    headers: config.headers
  };

  let agent = header.join(' ');
  let os = matchItem(agent, dataos);
  const user = JSON.parse(localStorage.getItem('user'));
  let userId = "";
  if (user) {
    userId = user.id;
  }
  if (requestConfig.headers) {
    requestConfig.headers = extend(requestConfig.headers, { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId });
  } else {
    requestConfig.headers = { "device-name": os.name, "app-version": os.version, "platform": os.value, "user": userId };
  }
  axios(requestConfig)
    .then(res => {
      if (!res.data.isSucess && res.data.description === "Authorization Required") {
        history.push("/Login");
      } else {
        successCallback(res);
      }
    }).catch(function (error) {
      failCallback(error);
    });
}