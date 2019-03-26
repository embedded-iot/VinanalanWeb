import React, { Component } from "react";
import DropdownList from "../../../../components/commons/DropdownList/DropdownList";
import InputDatePicker from "../../../../components/commons/InputDatePicker/InputDatePicker";
import ButtonList from "../../../../components/commons/ButtonList/ButtonList";

export default class FilterRooms extends Component {
  render() {
    const { numberDays } = this.props;
    const buttonList = [
      { title: "Tìm phòng", type: "primary", icon: "search", onClick: () => this.selectedStep(1) }
    ];
    return(
      <div className="group-box">
        <div className="group-sub-heading">Tìm kiếm phòng</div>
        <div className="group-content search-home-wrapper filter-room-box">
          <div className="search-home-box">
            <div className="search-home-item">
              <InputDatePicker title="Ngày nhận phòng"
                               name="homeDescription"/>
            </div>
            <div className="search-home-item">
              <InputDatePicker title="Ngày trả phòng"
                               name="homeDescription"/>
            </div>
            <div className="search-home-item">
              <DropdownList
                name="maxGuest"
                title="Số đêm"
                list={numberDays}
                onChange={this.onChangeDropdown}
              />
            </div>
            <ButtonList list={ buttonList}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterRooms.defaultProps = {
  numberDays: []
}