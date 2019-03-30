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


const MAX_GUEST = 10;

class SearchHome extends Component{

  constructor(props) {
    super(props);
    this.state = {
      params: {
        homeName: '',
        checkin: '',
        checkout: '',
        roomTypeId: '',
        numGuest: 0,
        minCost: 0,
        maxCost: 10000000
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

  render() {
    const { buttonList } = this.props;
    const { params, roomCatalogs, numberGuest, numberDays } = this.state;
    const { homeName, checkin, checkout, roomTypeId, numGuest, minCost, maxCost } = params;
    return (
      <div className="group-box search-home-wrapper">
        <div className="group-sub-heading">Tìm kiếm khách sạn</div>
        <div className="group-content">
          <InputSearchHome
            title="Thành phố, địa điểm hoặc tên khách sạn"
          />
          <div className="search-home-box">
            <div className="search-home-item">
              <InputDatePicker title="Ngày nhận phòng"
                               name="homeDescription"/>
            </div>
            <div className="search-home-item">
              <InputDatePicker title="Ngày trả phòng"
                               name="homeDescription"/>
            </div>
            {/*<div className="search-home-item">
              <DropdownList
                name="numberGuest"
                title="Số đêm"
                list={numberDays}
                value={numberGuest}
                onChange={this.onChangeDropdown}
              />
            </div>*/}
            <div className="search-home-item">
              <DropdownInputSearch
                name="roomTypeId"
                title="Chọn loại phòng"
                list={roomCatalogs}
                value={roomTypeId}
                onChange={this.onChangeDropdown}
              />
            </div>
            <div className="search-home-item">
              <DropdownList
                name="numGuest"
                title="Số lượng người"
                list={numberGuest}
                value={numGuest}
                onChange={this.onChangeDropdown}
              />
            </div>
            <div className="search-home-item">
              <Slider
                title="Khoảng giá cho 1 đêm"
                max={300000}
                step={50000}
              />
            </div>
          </div>
          <div className="button-list text-right">
            <ButtonList list={ buttonList}/>
          </div>
        </div>
      </div>
    );
  }

}

export default injectIntl(SearchHome)