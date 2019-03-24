import React, { Component } from "react";
import DropdownInputSearch from "../../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import {getAllContries, getDistrictsByProvince, getProvincesByCountry, getWardsByDistrict} from "../LocationService";
import {Button, Col, Row} from "antd";
import './FilterLocationHome.scss'
import {FormattedMessage} from "react-intl";

const STRINGS = {
  CLEAR_FILTER: <FormattedMessage id="CLEAR_FILTER"/>,
}

export default class FilterLocationHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {
        country_code: null,
        district_code: null,
        province_code : null
      },
      countries: [],
      provinces: [],
      districts: []
    }
  }

  componentDidMount() {
    this.getAllContries();
  }


  getAllContries = () => {
    getAllContries(response => {
      if (response.data && response.data.length) {
        const countries = response.data.map(item => ({
          text: item.name,
          value: item.countryCode
        }));
        this.setState({countries: countries});
      }
    });
  };

  getProvincesByCountry = countryCode => {
    getProvincesByCountry(countryCode, response => {
      if (response.data && response.data.length) {
        const provinces = response.data.map(item => ({
          text: item.name,
          value: item.code
        }));
        this.setState({provinces: provinces});
      }
    });
  };

  getDistrictsByProvince = countryCode => {
    getDistrictsByProvince(countryCode, response => {
      if (response.data && response.data.length) {
        const districts = response.data.map(item => ({
          text: item.name,
          value: item.code
        }));
        this.setState({districts: districts});
      }
    });
  };

  onChangeAddress = (name, value) => {
    let { countries, provinces, districts} = this.state;
    let selected = { ...this.state.selected};
    selected[name] = value;
    switch (name) {
      case "country_code":
        selected.province_code = null;
        provinces: [];
        this.getProvincesByCountry(value);
        break;
      case "province_code":
        selected.district_code = null;
        districts: [];
        this.getDistrictsByProvince(value);
        break;
    }
    this.setState({ selected: { ...selected} , provinces: provinces, districts: districts}, () => this.onChangeFilter());
  }

  clearFilter = () => {
    this.setState({selected: {}, provinces: [], districts: []} , () => this.onChangeFilter())
  }

  onChangeFilter = () => {
    const { onChangeFilter} = this.props;
    const { selected} = this.state;
    onChangeFilter(selected);
  }

  render() {
    const { countries, provinces, districts, selected } = this.state;
    const { country_code, district_code, province_code} = selected;
    return(
      <div className="filter-location-home-wrapper">
        <Row>
          <Col span={6}>
            <DropdownInputSearch
              title="Quốc gia"
              list={countries}
              value={country_code}
              name="country_code"
              onChange={this.onChangeAddress}
            />
          </Col>
          <Col span={6}>
            <DropdownInputSearch
              title="Tỉnh/Thành phố"
              list={provinces}
              value={province_code}
              name="province_code"
              onChange={this.onChangeAddress}
            />
          </Col>
          <Col span={6}>
            <DropdownInputSearch
              title="Quận/Huyện"
              list={districts}
              value={district_code}
              name="district_code"
              onChange={this.onChangeAddress}
            />
          </Col>
          <Col span={6}>
            { (country_code || district_code || province_code) && <span className='clear-filter' onClick={this.clearFilter} >{STRINGS.CLEAR_FILTER}</span>}
          </Col>
        </Row>
      </div>
    );
  }
}

FilterLocationHome.defaultProps = {
  onChangeFilter: f => f
}