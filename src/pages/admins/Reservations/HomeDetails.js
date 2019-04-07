import React, { Component } from 'react'
import * as Services from './ReservationsServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Alert, Button, Col, Icon, Modal, notification, Radio, Row, Tooltip} from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../Constants';
import AddRoom from "../RoomsNew/AddRoom";
import ReactSlick from "../../../components/commons/ReactSlick/ReactSlick";
import {GoogleMapSearchBox} from "../../../components/GoogleMaps/GoogleMapSearchBox";
import ViewTopUtilities from "../Homes/HomeComponents/ViewTopUtilities";
import FilterRooms from "./HomeComponents/FilterRooms";
import "./Reservations.scss";
import "./HomeDetails.scss";
import {getHomeDetails} from "../Homes/HomesServices";
import InputNumber from "../../../components/commons/InputNumber/InputNumber";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import { ViewReservationsDetails } from "./HomeComponents/ViewReservationsDetails";
import {ViewPaymentDetails} from "./HomeComponents/ViewPaymentDetails";
import CheckInCustomerInfo from "./HomeComponents/CheckInCustomerInfo";
import DropdownList from "../../../components/commons/DropdownList/DropdownList";
import {checkRoomsStatus} from "./ReservationsServices";
import {createReservation} from "./ReservationsServices";
import OutputNumber from "../../../components/commons/OutputNumber/OutputNumber";
import {numberDaysBetweenTwoDates} from "../../../utils/utils";


const confirmModal = Modal.confirm;
const RadioGroup = Radio.Group;

const STRINGS = {
  ROOMS: <FormattedMessage id="ROOMS" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  TYPES_OFF_ROOMS: <FormattedMessage id="TYPES_OFF_ROOMS" />,
  ACTION: <FormattedMessage id="ACTION" />,
  VIEW: <FormattedMessage id="VIEW" />,
}

const MAX_GUEST = 10;

class HomeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      reservations: [],
      customer: {},
      tableSettings: {
        pagination: {},
        filters: {},
        sorter: {},
        searchText: ""
      },
      selected: {
        homeName: '',
        homeDescription: '',
        address: {},
        location: {},
        media: {},
        outcome_service: [],
        income_service: [],
        extra_service: [],
        home_out_furniture: []
      },
      outcome_service: [],
      income_service: [],
      extra_service: [],
      selectedStep: 0,
      loading: null,
      homeId: '',
      filterObject: {
        checkin: '',
        checkout: '',
        numGuest: 0
      },
      numberDays: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)})),
    }
  }

  componentWillMount() {
    const { homeId } = this.props.match.params;
    const searchHome = localStorage.getItem("searchHome");
    const filterObject = JSON.parse(searchHome);

    if (homeId) {
      this.setState(
        {
          homeId: homeId,
          filterObject: {
            ...this.state.filterObject,
            checkin: filterObject.checkin,
            checkout: filterObject.checkout
          }
        }, () => {
        this.getHomeDetails(homeId, this.onChange);
      });
    }
  }

  getHomeDetails = (id, callback)  => {
    const { dispatch } = this.props;
    dispatch(spinActions.showSpin());
    this.setState({loading: true});
    getHomeDetails(id, response => {
      dispatch(spinActions.hideSpin());
      if (response.data) {
        let selected = { ...this.state.selected, ...response.data};
        let { extraFees, outcomeUtilities, incomeUtilities} = response.data;
        selected.income_service = incomeUtilities.map(item => item.id);
        selected.outcome_service = outcomeUtilities.map(item => item.id);
        selected.extra_service = extraFees.map(item => item.id);
        this.setState({selected: selected, outcome_service: outcomeUtilities, income_service: incomeUtilities, extra_service: extraFees }, () => {
          this.setState({loading: false});
        });
        callback();
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { homeId } = this.props.match.params;
    if (nextProps.match.params && nextProps.match.params.homeId !== homeId) {
      this.setState({homeId: nextProps.match.params.homeId}, () => this.onChange());
    }
  }

  columns = [
    {
      title: STRINGS.TYPES_OFF_ROOMS,
      dataIndex: 'roomName',
      render: (roomName, row) => (
        <div>
          <p style={{fontWeight: 'bold'}}>{ roomName + '( ' + row.maxGuest + ' người ở )'}</p>
          { row.roomMedia && row.roomMedia.images && row.roomMedia.images.length > 0 && (
            <p>
              <img src={row.roomMedia.images[0]} alt={roomName} style={{width: '100%'}}/>
            </p>
          )}
          { Number(row.roomArea) > 0 && <p>{ 'Diện tích: ' + row.roomArea + ' m2' }</p>}
        </div>
      ),
      width: '25%'
    }, {
      title: "Giá phòng",
      dataIndex: 'roomDatePrice',
      align: 'center',
      centered: true,
      render: (field, row) => (
        <div style={{textAlign: 'center'}}>
          <p>Giá 1 đêm</p>
          <OutputNumber value={row.roomDatePrice} unit="đ" />
          <p>Giá dài ngày</p>
          <OutputNumber value={row.roomMonthPrice} unit="đ" />
        </div>
      ),
      width: '20%'
    }, {
      title: "Tiện ích phòng",
      dataIndex: 'room_utilities',
      render: room_utilities => {
        if (room_utilities && room_utilities.length > 0) {
          return (
            <div>
              {room_utilities.map(item => <p key={item.id}>{item.name}</p>)}
            </div>
          );
        }
        return '-'
      } ,
      width: '20%'
    }, {
      title: "Thiết bị phòng",
      dataIndex: 'inFurnitures',
      render: inFurnitures => {
        if (inFurnitures && inFurnitures.length > 0) {
          return (
            <div>
              {inFurnitures.map(item => <p key={item.id}>{item.name}</p>)}
            </div>
          );
        }
        return '-'
      } ,
      width: '20%',
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render:  (id, roomDetails) => {
        if (this.findReservationById(id)) {
          return <Button onClick={() => this.destroyReservationRoom(id)}>Hủy phòng</Button>
        } else {
          return <Button type="primary" onClick={() => this.reservationRoom(roomDetails)}>Đặt phòng</Button>
        }
      },
      width: '15%',
      align: 'center'
    }
  ];


  numberGuest = maxGuest => ([...Array(maxGuest)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)})));

  calculateReservationDays = () => {
    const {filterObject} = this.state;
    return numberDaysBetweenTwoDates(filterObject.checkin, filterObject.checkout);
  };

  roomColumns = [
    {
      title: 'Đơn hàng của bạn',
      dataIndex: 'roomName',
      render: (roomName, roomDetails) => {
        return (
          <div>
            <div><b>Phòng : {roomName}</b></div>
            <RadioGroup name="radiogroup" defaultValue={roomDetails.priceType} onChange={e => this.onChangePriceType(e, roomDetails.id)}>
              <Radio value={1}>Giá 1 đêm</Radio>
              <Radio value={0}>Giá dài ngày</Radio>
            </RadioGroup>
            <InputNumber name={roomDetails.id} title="Đặt trước" placeholder="VND" value={roomDetails.prePayment} onChange={(name, value) => this.onChangePrePayment(name, value)}/>
            <DropdownList
              name={roomDetails.id}
              title="Số lượng người"
              list={this.numberGuest(roomDetails.maxGuest)}
              value={roomDetails.guestNumber}
              onChange={(name, value) => this.onChangeGuestNumber(name, value)}
            />
          </div>
        );
      }
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'priceType',
      width: '40%',
      render: (priceType, roomDetails) => {
        return (
          <div>
            <div>
              <OutputNumber value={priceType ? roomDetails.roomDatePrice : roomDetails.roomMonthPrice} unit="đ" />
              { ' x' + ' ' + this.calculateReservationDays() + ' Ngày'}
            </div>
            <div>
              { roomDetails.prePayment > 0 && <OutputNumber value={roomDetails.prePayment > 0 ? '-' + roomDetails.prePayment : ''} unit="đ" />}
            </div>
          </div>
        )
      },
      align: 'center'
    },
    {
      dataIndex: 'id',
      render: id => <a onClick={() => this.destroyReservationRoom(id)}><Icon type="delete"/></a>,
      width: "50px"
    }
  ];

  onChangePrePayment = (id, value) => {
    const {reservations} = this.state;
    this.setState({reservations: reservations.map(room => {
        return room.id === id ? { ...room, prePayment : value} : room;
      })});
  };


  onChangeGuestNumber = (id, value) => {
    const {reservations} = this.state;
    this.setState({reservations: reservations.map(room => {
        return room.id === id ? { ...room, guestNumber : value} : room;
      })});
  };

  onChangePriceType = (e, id) => {
    const { value } = e.target;
    const {reservations} = this.state;
    this.setState({reservations: reservations.map(room => {
        return room.id === id ? { ...room, priceType: value} : room;
      })});
  };

  findReservationById = roomId => {
    const {reservations} = this.state;
    return reservations.find(room => room.id === roomId)
  };

  reservationRoom = selectedRoom => {
    const {reservations, filterObject} = this.state;
    if (!filterObject.checkin || !filterObject.checkout) {
      this.openNotification('error', 'Ngày nhận phòng và ngày trả phòng là bắt buộc. Vui lòng kiểm tra lại!');
      return;
    }
    selectedRoom.priceType = 1;
    selectedRoom.prePayment = 0;
    selectedRoom.guestNumber = 1;
    selectedRoom.listExtraFee = [];
    this.setState({reservations: [...reservations, selectedRoom]});
  };

  destroyReservationRoom = id => {
    const {reservations} = this.state;
    this.setState({reservations: [...(reservations.filter(room => room.id !== id))]});
  };

  totalAfterPayment = () => {
    const {reservations} = this.state;
    return reservations.reduce((total, item) => total + (item.priceType ? item.roomDatePrice : item.roomMonthPrice) - item.prePayment, 0);
  };

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  viewHome = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Room/Details/' + id + '/View');
  };

  onChange = (pagination = {}, filters = {}, sorter = {}, extra, searchText) => {
    const { homeId, filterObject } = this.state;
    const tableSettings = {
      ...this.state.tableSettings,
      pagination,
      filters,
      searchText,
      sorter
    };
    const { dispatch } = this.props;

    let isActive = filters.isActive;
    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      isActive,
      ...filterObject,
      homeId : !!homeId ? homeId : null
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true
    });
    dispatch(spinActions.showSpin());
    Services.getListRoomOfHome({ ...params, }, (response) => {
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

  onAddRoom = (success) => {
    const { history } = this.props;
    const { homeId } = this.state;
    if (!!homeId) {
      history.push(`/Room/AddRoom/${homeId}`);
    } else {
      history.push('/Room/AddRoom')
    }
  };


  isDisabled = () => {
    const { customer } = this.state;
    return customer && (
      !customer.customerName ||
      !customer.customerPhone ||
      !customer.customerEmail ||
      !customer.sellerId ||
      !customer.bookerId
    );
  };

  checkStatusRooms = callback => {
    const { reservations, filterObject } = this.state;
    const params = {
      checkin: filterObject.checkin,
      checkout: filterObject.checkout,
      roomIds: reservations.map(room => room.id )
    };
    checkRoomsStatus(params, response => {
      console.log(response);
      const reservattedRooms = response.filter(room => room.status > 1);
      if (reservattedRooms.length ) {
        forEach(reservattedRooms, room => {
          this.openNotification('error', `Phòng ${room.name} không trống. Vui lòng chọn phòng khác!`);
        })
      } else {
        callback();
      }
    })
  };


  createReservation = params => {
    const { dispatch, history } = this.props;
    dispatch(spinActions.showSpin());
    createReservation(params, response => {
      dispatch(spinActions.hideSpin());
      this.openNotification('info', "Đặt phòng thành công!");
      history.push('/Reservations');
    }, error => {
      this.openNotification('info', "Đặt phòng thất bạn!");
      dispatch(spinActions.hideSpin());
    })
  };

  postReservations = () => {
    const { user } = this.props;
    const { reservations, customer, filterObject } = this.state;
    const reservation = {
      userId: user.id,
      ...customer,
      ...filterObject,
      rooms: reservations.map(room => (
        {
          roomId: room.id,
          totalMoney: room.priceType ? room.roomDatePrice : room.roomMonthPrice,
          prePay: room.prePayment,
          guestNumber: room.guestNumber,
          listExtraFee: room.listExtraFee
        }
      )),
      numGuest: null
    };

    this.checkStatusRooms(() => {
      this.createReservation(reservation);
    });
  };

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  buttonListGoBack = [
    { title: "Danh sách khách sạn", icon: 'arrow-left', onClick: this.goBack}
  ];

  selectedStep = step => {
    this.setState({selectedStep: step});
  };

  onChangeFilterRooms = params => {
    this.setState({ filterObject: params},
      () => this.onChange()
    );
  };

  onChangeCustomer = customer => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.setState({ customer})
    }, 500)
  };

  render() {
    const { intl } = this.props;
    const { tableSettings, dataSource, selected, homeId, loading, extra_service, numberDays, reservations, selectedStep, filterObject} = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media} = selected;
    const { images, videos} = media;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };

    const RoomTableConfig = {
      columns: this.roomColumns,
      dataSource: reservations,
      isHideTableHeader: true,
      pagination: false
    };

    const buttonList = [
      { title: "Quay lại", onClick: () => this.selectedStep(0) },
      { title: "Hoàn tất đặt phòng", type: "primary", icon: "save", disabled: this.isDisabled(), onClick: this.postReservations}
    ];

    return (
      <div className="page-wrapper home-details-wrapper">
        <div className="page-headding">
          <span>
            <div style={{width: "100%"}}>{ `Khách sạn ${homeName}`}</div>
            <div style={{fontWeight: 'normal', fontSize: '20px'}}>{ address && address.address_text ? address.address_text : '-' }</div>
          </span>
          <ButtonList list={this.buttonListGoBack} />
        </div>
        <div className="steps-wrapper"  style={{display: (selectedStep === 0 ? 'block' : 'none')}}>
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : ''} alt="Ảnh tòa nhà"/>
            </div>
            <div className="home-details">
              <Alert
                message="Giới thiệu:"
                description={homeDescription}
                type="info"
              />
              <div style={{marginTop: '15px'}}>
                { loading === false && <GoogleMapSearchBox location={location} disabled={true}/>}
              </div>
            </div>
          </div>
          <div>
            {
              images && images.length > 1 && <ReactSlick list={images}/>
            }
          </div>
          {
            extra_service && extra_service.length > 0 && (
              <div className="group-box">
                <div className="group-header">
                  <div className="group-title">Tiện nghi nổi bật</div>
                </div>
                <div className="group-content">
                  <ViewTopUtilities
                    list={extra_service}
                    emptyMessage='Chưa có tiện nghi nào.'/>
                </div>
              </div>
            )
          }
          <div className="page-contents-wrapper">
            <FilterRooms params={filterObject} onChange={this.onChangeFilterRooms}/>
          </div>
          <Row>
            <Col span={16}>
              <TableCustom {...TableConfig} />
            </Col>
            <Col span={8} style={{padding: '57px 0 0 15px'}}>
              <TableCustom {...RoomTableConfig}/>
              { reservations.length > 0 && (
                <div className="reservations-footer">
                  <div>Số tiền chưa thanh toán:<span className="is-required"><OutputNumber value={this.totalAfterPayment()} unit="VNĐ" /></span></div>
                  <Button type="primary" onClick={() => this.selectedStep(1)}>Bước tiếp theo</Button>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div className="steps-wrapper" style={{display: (selectedStep === 1 ? 'block' : 'none')}}>
          <div className="box-contents">
            <div className="box-left">
              <ViewReservationsDetails reservations={reservations} checkin={filterObject.checkin} checkout={filterObject.checkout}/>
              <ViewPaymentDetails reservations={reservations} />
            </div>
            <div className="box-right">
              <CheckInCustomerInfo onChange={this.onChangeCustomer}/>
              <div className="text-right">
                <ButtonList list={ buttonList} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  }
}

export default injectIntl(withRouter(connect(mapStateToProps)(HomeDetails)));