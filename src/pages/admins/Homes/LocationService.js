import { makeGetRequest } from "../../../utils";

export function getAllContries(successCallback, failCallback) {
  let config = {
    url: "/api/country"
  };
  makeGetRequest(
    config,
    response => {
      successCallback(response.data);
    },
    error => {
      failCallback(error);
    }
  );
}

export function getProvincesByCountry( countryCode, successCallback, failCallback) {
  let config = {
    url: `/api/province?filter={"where":{"country_code":{"like":"${countryCode}"}}}`
  };

  makeGetRequest(
    config,
    response => {
      successCallback(response.data);
    },
    error => {
      failCallback(error);
    }
  );
}

export function getDistrictsByProvince(provinceCode, successCallback, failCallback) {
  let config = {
    url: `/api/district?filter={"where":{"province_code":{"like":"${provinceCode}"}}}`
  };
  makeGetRequest(
    config,
    response => {
      successCallback(response.data);
    },
    error => {
      failCallback(error);
    }
  );
}

export function getWardsByDistrict( districtCode, successCallback, failCallback) {
  let config = {
    url:
      '/api/ward?filter={"where":{"district_code":{"like":"' +
      districtCode +
      '"}}}'
  };
  makeGetRequest(
    config,
    response => {
      successCallback(response.data);
    },
    error => {
      failCallback(error);
    }
  );
}
