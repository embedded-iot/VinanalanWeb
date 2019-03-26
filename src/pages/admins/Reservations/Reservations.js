import React, { Component } from 'react'
import * as Services from './HomesServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Button, Col, Modal, notification, Row, Tooltip} from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import InputSearchHome from "./HomeComponents/InputSearchHome";
import InputDatePicker from "../../../components/commons/InputDatePicker/InputDatePicker";
import DropdownInputSearch from "../../../components/commons/DropdownInputSearch/DropdownInputSearch";
import {getRoomsCatalog} from "../../config/RoomsCatalog/RoomsCatalogServices";
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import Slider from "../../../components/commons/Slider/Slider";
import "./Reservations.scss"

const confirmModal = Modal.confirm;

const STRINGS = {
  RESERVATIONS: <FormattedMessage id="RESERVATIONS" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  TYPES_OFF_HOMES: <FormattedMessage id="TYPES_OFF_HOMES" />,
  VIEW: <FormattedMessage id="VIEW" />,
}

const MAX_GUEST = 10;

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tableSettings: {
        pagination: {},
        filters: {},
        sorter: {},
        searchText: ""
      },
      isShowAddOrEdit: false,
      isShowViewDetails: false,
      selected: {},
      filterObject: {},
      roomCatalogs: [],
      selectedStep: 0,
      numberGuest: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)})),
      numberDays: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)}))
    }

    this.sortTypesByHomes = [
      { text: "Gợi ý của chúng tôi", value: 'normal'},
      { text: "Giá tăng dần", value: 'ascending'},
      { text: "Giá giảm dần", value: 'descending'},
    ]
  }

  componentWillMount() {
    this.onChange();
    this.getInnitData();
  }

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

  columns = [
    {
      title: STRINGS.TYPES_OFF_HOMES,
      dataIndex: 'homeName',
      render: (homeName, homeDetails) => {
        return (
          <div className="home-details">
            <div className="home-img">
              <img src={ homeDetails.media && homeDetails.media.images && homeDetails.media.images.length > 0 ? homeDetails.media.images[0] : ''} alt={ homeName }/>
            </div>
            <div className="home-contents">
              <div className="home-name">{homeName}</div>
              <div className="home-address">{homeDetails.address && homeDetails.address.address_text ? homeDetails.address.address_text : '-'}</div>
            </div>
          </div>
        );
      },
      width: "80%"
    }, {
      title: "Loại hình",
      dataIndex: 'id',
      render:  (id, homeDetails) => {
        return <Button onClick={() => this.viewRoomsOfHomeId(id)}>Xem phòng</Button>
      },
      align: "center",
      width: '20%'
    }
  ];

  viewRoomsOfHomeId = homeId => {
    console.log("homeId", homeId);
    const { history } = this.props;
    history.push('/Reservations/HomeDetails/' + homeId);
  };

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  onChange = (pagination = {}, filters = {}, sorter = {}, extra, searchText) => {
    const tableSettings = {
      ...this.state.tableSettings,
      pagination,
      filters,
      searchText,
      sorter
    };
    const { dispatch } = this.props;
    const { filterObject } = this.state;

    let isActive = filters.isActive;
    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      ...filterObject,
      isActive
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true
    });
    dispatch(spinActions.showSpin());
    Services.getHomes({ ...params, }, (response) => {
      dispatch(spinActions.hideSpin());
      const tableSettings = {
        ...this.state.tableSettings,
        pagination: { ...this.state.tableSettings.pagination, total: response.count }
      };

      this.setState({
        loading: false,
        dataSource: response.data,
        tableSettings,
      });
    }, (error) => {
      dispatch(spinActions.hideSpin());
      console.log("error:", error)
    })
  }

  onReload = () => {
    let { pagination, filters, sorter, searchText } = { ...this.state.tableSettings };
    this.onChange(pagination, filters, sorter, {}, searchText);
  }


  selectedStep = step => {
    this.setState({selectedStep: step});
  };

  render() {
    const { tableSettings, dataSource, selected, selectedStep } = this.state;
    const { isSubmitted, homes, selectedHome, roomCatalogs, utilitiesModal, isShowUploadModal, numberGuest, numberDays, inFurnituresAll, room_utilities_all, homeIdFromProps} = this.state;
    const {roomName, roomDescription, roomArea, homeId, roomTypeId, roomMedia, maxGuest, roomDatePrice, roomMonthPrice, inFurnitures, room_utilities, isActive} = selected;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings,
      showHeader: false,
      isHideInputSearch: true
    };
    const buttonList = [
      { title: "Quay lại", onClick: () => this.selectedStep(0) },
      { title: "Tìm khách sạn", type: "primary", icon: "search", onClick: () => this.selectedStep(1) }
    ];
    return (
      <div className="page-wrapper reservations-wrapper">
        <div className="page-headding">
          {STRINGS.RESERVATIONS}
        </div>
        <div className={ selectedStep === 0 ? "page-contents-wrapper" : "page-contents-wrapper homes-contents-wrapper"}>
          <div className="search-home-wrapper">
            <div className="group-box">
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
                  <div className="search-home-item">
                    <DropdownList
                      name="maxGuest"
                      title="Số đêm"
                      list={numberDays}
                      value={maxGuest}
                      onChange={this.onChangeDropdown}
                    />
                  </div>
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
                      name="maxGuest"
                      title="Số lượng người"
                      list={numberGuest}
                      value={maxGuest}
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
                <div>
                  <div className="search-home-item">
                    <div style={{textAlign: 'right', marginBottom: "15px"}}><ButtonList list={ buttonList}/></div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="homes-wrapper" style={{display: (selectedStep === 1 ? 'block' : 'none')}}>
            <div className="homes-heading">Danh sách tòa nhà</div>
            <div className="sort-home-wrapper">
              <span>Sắp xếp theo:</span>
              <DropdownList
                name="maxGuest"
                list={this.sortTypesByHomes}
                value={'normal'}
                onChange={this.onChangeDropdown}
              />
            </div>
            <TableCustom {...TableConfig} />
          </div>
        </div>

      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Reservations)));