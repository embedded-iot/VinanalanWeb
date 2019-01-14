import { makeGetRequest, makePostRequest, makeDeleteRequest } from "../utils/cuiResource";

export function getContries(successCallback, failCallback) {
  let config = {
    url: '/api/country'
  };
  makeGetRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function getProvinces(countryCode, successCallback, failCallback) {
  let config = {
    url: `/api/province?filter={"where":{"country_code":{"like":"${countryCode}"}}}`
  };

  makeGetRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function getDistricts(provinceCode, successCallback, failCallback) {
  let config = {
    url: `/api/district?filter={"where":{"province_code":{"like":"${provinceCode}"}}}`
  };
  makeGetRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}

export function getWards(districtCode, successCallback, failCallback) {
  let config = {
    url: '/api/ward?filter={"where":{"district_code":{"like":"' + districtCode + '"}}}'
  };
  makeGetRequest(config, (response) => {
    successCallback(response);
  }, (error) => {
    failCallback(error);
  });
}