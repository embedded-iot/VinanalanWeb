import React, { Component } from 'react'
import * as Services from './ReservationsServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Button, Col, Modal, notification, Row, Tooltip} from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import "./Reservations.scss"
import SearchHome from "./HomeComponents/SearchHome";

const confirmModal = Modal.confirm;

const STRINGS = {
  RESERVATIONS: <FormattedMessage id="RESERVATIONS" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  TYPES_OFF_HOMES: <FormattedMessage id="TYPES_OFF_HOMES" />,
  VIEW: <FormattedMessage id="VIEW" />,
}

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
      searchHome: {},
      isShowAddOrEdit: false,
      isShowViewDetails: false,
      selected: {},
      filterObject: {},
      roomCatalogs: [],
      selectedStep: 0
    };

    this.sortTypesByHomes = [
      { text: "Gợi ý của chúng tôi", value: 'normal'},
      { text: "Giá tăng dần", value: 'ascending'},
      { text: "Giá giảm dần", value: 'descending'},
    ]
  }

  componentWillMount() {
    this.onChange();
  }

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

  onChangeSearchHome = params => {
    console.log('params', params);
  };

  render() {
    const { tableSettings, dataSource, selected, selectedStep, searchHome } = this.state;
    const { isSubmitted, homes, selectedHome, roomCatalogs, utilitiesModal, isShowUploadModal, inFurnituresAll, room_utilities_all, homeIdFromProps} = this.state;
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
      { title: "Tìm khách sạn", type: "primary", icon: "search", onClick: () => this.selectedStep(1) }
    ];

    return (
      <div className="page-wrapper reservations-wrapper">
        <div className="page-headding">
          {STRINGS.RESERVATIONS}
        </div>
        { !selectedStep && (
          <div className="steps-wrapper">
            <SearchHome params={searchHome} onChange={this.onChangeSearchHome} buttonList={buttonList} />
          </div>
        )}
        { !!selectedStep && (
          <div className="steps-wrapper homes-wrapper">
            <div className="box-contents">
              <div className="box-left">
                <SearchHome params={searchHome} onChange={this.onChangeSearchHome} buttonList={buttonList}/>
              </div>
              <div className="box-right">
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
        )}
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Reservations)));