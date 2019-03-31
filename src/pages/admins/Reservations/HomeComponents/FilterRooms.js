import React, { Component } from "react";
import DropdownList from "../../../../components/commons/DropdownList/DropdownList";
import InputDatePicker from "../../../../components/commons/InputDatePicker/InputDatePicker";
import {Button} from "antd";
import {injectIntl} from "react-intl";
import "./FilterRooms.scss"

const MAX_GUEST = 10;

class FilterRooms extends Component {

  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      params: {
        checkin: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
        checkout: '',
        numGuest: 1,
        ...props.params
      },
      numberGuest: [
        {text: 'Mặc định', value: 0},
        ...[ ...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)}))]
    };
  }


  onChange = (name, value) => {
    const { params } = this.state;
    params[name] = value;
    this.setState({ params: params});
  };

  onSearch = () => {
    const { onChange } = this.props;
    const { params } = this.state;
    onChange(params);
  };

  render() {
    const { intl } = this.props;
    const { params, numberGuest } = this.state;
    const { checkin, checkout, numGuest } = params;
    return(
      <div className="group-box">
        <div className="group-sub-heading">Tìm kiếm phòng</div>
        <div className="group-content">
          <div className="search-home-box filter-room-box">
            <div className="search-home-item">
              <InputDatePicker title="Ngày nhận phòng"
                               name="checkin"
                               defaultValue={checkin}
                               isRequired={true}
                               onChange={this.onChange}
              />
            </div>
            <div className="search-home-item">
              <InputDatePicker title="Ngày trả phòng"
                               name="checkout"
                               defaultValue={checkout}
                               isRequired={true}
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
            <Button type="primary" icon="search" onClick={this.onSearch}>{intl.formatMessage({id: 'SEARCH_ROOMS'})}</Button>
          </div>
        </div>
      </div>
    );
  }
}

FilterRooms.defaultProps = {
  params: {},
  onChange: f => f
}

export default injectIntl(FilterRooms)