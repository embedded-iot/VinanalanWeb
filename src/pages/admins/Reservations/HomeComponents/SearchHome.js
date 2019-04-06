import React, {Component} from "react";
import {injectIntl} from "react-intl";
import InputSearchHome from "./InputSearchHome";
import InputDatePicker from "../../../../components/commons/InputDatePicker/InputDatePicker";
import DropdownList from "../../../../components/commons/DropdownList/DropdownList";
import DropdownInputSearch from "../../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import Slider from "../../../../components/commons/Slider/Slider";
import ButtonList from "../../../../components/commons/ButtonList/ButtonList";
import {getRoomsCatalog} from "../../../config/RoomsCatalog/RoomsCatalogServices";
import "./SearchHome.scss"
import {Button} from "antd";


const MAX_GUEST = 10;
const MIN_COST = 0;
const MAX_COST = 3000000;
const STEPS_COST = 50000;


class SearchHome extends Component{

  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      params: {
        searchText: '',
        homeName: '',
        country_code: '',
        province_code: '',
        district_code: '',
        checkin: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
        checkout: '',
        roomTypeId: '',
        numGuest: 1,
        minCost: MIN_COST,
        maxCost: MAX_COST,
        ...props.params
      },
      roomCatalogs: [],
      numberGuest: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)})),
      numberDays: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)}))
    }
  }

  componentWillMount = () => {
    this.getInnitData();
  };

  getInnitData = () => {
    let param = {skip: 0, limit: 100};
    getRoomsCatalog(param, response => {
      if (response.data && response.data.length) {
        const roomCatalogs = response.data.map(item => ({
          text: item.catalogName,
          value: item.id
        }));
        this.setState({roomCatalogs: roomCatalogs});
      }
    });
  };

  onChange = (name, value, searchText) => {
    const { params } = this.state;
    if (typeof searchText === "string") {
      params.searchText = searchText;
    }
    switch (name) {
      case 'homeName':
        params.country_code = '';
        params.province_code = '';
        params.district_code = '';
        break;
      case 'country_code':
      case 'province_code':
      case 'district_code':
        params.homeName = '';
        break;
    }

    if (name === "slider") {
      params.minCost = value[0];
      params.maxCost = value[1];
    } else {
      params[name] = value;
    }
    this.setState({ params: params});
  };

  onSearch = () => {
    const { onChange } = this.props;
    const { params } = this.state;
    onChange(params);
  };

  render() {
    const { buttonList, intl } = this.props;
    const { params, roomCatalogs, numberGuest, numberDays } = this.state;
    const { homeName, checkin, checkout, roomTypeId, numGuest, minCost, maxCost, searchText } = params;
    return (
      <div className="group-box search-home-wrapper">
        <div className="group-sub-heading">Tìm kiếm khách sạn</div>
        <div className="group-content">
          <InputSearchHome
            title="Thành phố, địa điểm hoặc tên khách sạn"
            defaultValue={ searchText ? searchText : ''}
            onChange={this.onChange}
          />
          <div className="search-home-box">
            <div className="search-home-item">
              <InputDatePicker title="Ngày nhận phòng"
                               name="checkin"
                               defaultValue={checkin}
                               onChange={this.onChange}
              />
            </div>
            <div className="search-home-item">
              <InputDatePicker title="Ngày trả phòng"
                               name="checkout"
                               defaultValue={checkout}
                               onChange={this.onChange}
              />
            </div>
            <div className="search-home-item">
              <DropdownInputSearch
                name="roomTypeId"
                title="Chọn loại phòng"
                list={roomCatalogs}
                value={roomTypeId}
                onChange={this.onChange}
              />
            </div>
            <div className="search-home-item">
              <DropdownList
                name="numGuest"
                title="Số lượng người"
                list={numberGuest}
                value={numGuest}
                onChange={this.onChange}
              />
            </div>
            <div className="search-home-item">
              <Slider
                title="Khoảng giá cho 1 đêm"
                name="slider"
                min={MIN_COST}
                max={MAX_COST}
                step={STEPS_COST}
                defaultValue={ [minCost, maxCost] }
                unit="VNĐ"
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="text-right" style={{marginButton: '15px'}}>
            <Button type="primary" icon="search" onClick={this.onSearch}>{intl.formatMessage({id: 'SEARCH_HOME'})}</Button>
          </div>
        </div>
      </div>
    );
  }
}

SearchHome.defaultProps = {
  params: {},
  onChange: f => f
};

export default injectIntl(SearchHome)