import React, { Component } from 'react'
import * as Services from '../RoomsNew/RoomsServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Alert, Modal, notification, Tooltip} from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CONSTANTS from '../../Constants';
import {getHomeDetails} from "./HomesServices";
import AddRoom from "../RoomsNew/AddRoom";
import ReactSlick from "../../../components/commons/ReactSlick/ReactSlick";
import {GoogleMapSearchBox} from "../../../components/GoogleMaps/GoogleMapSearchBox";
import ViewTopUtilities from "../Homes/HomeComponents/ViewTopUtilities";
import FilterRooms from "./HomeComponents/FilterRooms";
import "./Reservations.scss";
import "./HomeDetails.scss";


const confirmModal = Modal.confirm;

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
      loading: false,
      homeId: '',
      numberDays: [...Array(MAX_GUEST)].map((item, index) => ({ text: (index + 1).toString(), value: (index + 1)})),
    }
  }

  componentDidMount() {
    const { homeId } = this.props.match.params;
    if (homeId) {
      this.setState({ homeId: homeId}, () => {
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
          <p>{row.roomDatePrice} đ</p>
          <p>Giá dài ngày</p>
          <p>{row.roomMonthPrice} đ</p>
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
      render: id => {
        return (
          <div className="actions-column">
            <Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() =>this.viewHome(id)}></span>
            </Tooltip>
          </div>
        )
      },
      width: '15%',
      align: 'center'
    }
  ];

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
  }

  onChange = (pagination = {}, filters = {}, sorter = {}, extra, searchText) => {
    const { homeId } = this.state;
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
      homeId : !!homeId ? homeId : null
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true
    });
    dispatch(spinActions.showSpin());
    Services.getRooms({ ...params, }, (response) => {
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
  }


  render() {
    const { intl } = this.props;
    const { tableSettings, dataSource, isShowAddOrEdit, selected, homeId, loading, extra_service, numberDays } = this.state;
    const {homeName, homeDescription, homeTypeId, address, location, media} = selected;
    const { images, videos} = media;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };

    return (
      <div className="page-wrapper add-home-page-wrapper home-details-wrapper reservations-wrapper">
        <div className="page-headding">
          <div style={{width: "100%"}}>{ `Khách sạn ${homeName}`}</div>
          <div style={{fontWeight: 'normal', fontSize: '20px'}}>{ address && address.address_text ? address.address_text : '-' }</div>
        </div>
        <div className="steps-wrapper">
          <div className='images-wrapper'>
            <div className='home-image'>
              <img src={ images && images.length > 0 ? images[0] : ''} alt="Ảnh tòa nhà"/>
            </div>
            <div className='home-details'>
              <Alert
                message="Giới thiệu:"
                description={homeDescription}
                type="info"
              />
              <div style={{marginTop: '15px'}}>
                { !loading && <GoogleMapSearchBox location={location} disabled={true}/>}
              </div>
            </div>
          </div>
          <div>
            {
              images && images.length > 1 && <ReactSlick list={images}/>
            }
          </div>
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
          <FilterRooms numberDays={numberDays}/>
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddRoom selected={selected} onChangeVisible={this.onChangeVisible} />
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(HomeDetails)));