import React, { Component } from 'react'
import * as Services from './RoomsServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import { Modal, notification, Tooltip } from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddRoom from "./AddRoom";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import * as CONSTANTS from '../../Constants';

const confirmModal = Modal.confirm;

const STRINGS = {
  ROOMS: <FormattedMessage id="ROOMS" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  CREATE_BY: <FormattedMessage id="CREATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  TYPES_OFF_ROOMS: <FormattedMessage id="TYPES_OFF_ROOMS" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_QUESTION_WARNING: " Hiện bạn còn phòng đang hoạt động. Không thể xóa tòa nhà.",
  DELETE_QUESTION: "Mọi thông tin bạn đã đăng tải về chỗ nghỉ này như hình ảnh, video, phòng khách sạn, ... sẽ bị xóa khỏi webstite sarepi.com và không thể khôi phục được. Bạn có chắc chắn muốn xóa chỗ nghỉ này?",
}

class Rooms extends Component {
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
      selected: {},
      homeId: '',
      homeName: ''
    }
  }

  componentDidMount() {
    const { homeId, homeName } = this.props.match.params;
    if (homeId) {
      this.setState({ homeId: homeId, homeName: homeName}, () => this.onChange());
    } else {
      this.onChange();
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
      )
    }, {
      title: "Tòa nhà",
      dataIndex: 'homes',
      centered: true,
      render: homes => <span>{homes && homes.homeName ? homes.homeName : '-'}</span>,
      width: '15%'
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
      width: '10%'
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
      width: '15%'
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
      width: '15%'
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isActive',
      render: isActive => isActive ? STRINGS.ACTION_ACTIVE : STRINGS.ACTION_DEACTIVE,
      filters: CONSTANTS.STATUS,
      align: 'center',
      width: '10%',
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render: id => {
        return (
          <div className="actions-column">
            <Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() =>this.viewHome(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.EDIT}>
              <span className="icon icon-edit" onClick={() => this.editRoom(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.ACTION_DELETE}>
              <span className="icon icon-delete" onClick={() => this.deleteRoom(id)}></span>
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

  editRoom = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Room/' + id + '/Edit');
  }

  viewHome = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Room/' + id + '/View');
  }

  deleteRoom = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUtility = this.state.dataSource.find(room => room.id === id);
    if (!selectedUtility) {
      return;
    }
    confirmModal({
      title: 'Xóa phòng ' + selectedUtility.roomName,
      content: STRINGS.DELETE_QUESTION,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteRoom(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_ROOM_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_ROOM_FAIL' }))
        })
      }
    });

  };

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
      homeId
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
      history.push(`/AddRoom/${homeId}`);
    } else {
      history.push('/AddRoom')
    }
  }


  render() {
    const { intl } = this.props;
    const { tableSettings, dataSource, isShowAddOrEdit, selected, homeId, homeName } = this.state;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };
    const buttonList = [
      { title: "Thêm", type: "primary", icon: "plus", onClick: () => this.onAddRoom() }
    ];
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          <span>
            { !homeId ? intl.formatMessage({ id: 'ROOMS' }) : intl.formatMessage({ id: 'ROOMS' }) + ` ( Tòa nhà ${homeName} )`}
          </span>
          <ButtonList list={buttonList} />
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddRoom selected={selected} onChangeVisible={this.onChangeVisible} />
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Rooms)));