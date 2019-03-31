import React, { Component } from 'react'
import * as Services from './HomesServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import { Modal, notification, Tooltip } from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddHome from "./AddHome";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewHome from "./ViewHome";
import * as CONSTANTS from '../../Constants';
import FilterLocationHome from "./HomeComponents/FilterLocationHome";

const confirmModal = Modal.confirm;

const STRINGS = {
  HOMES: <FormattedMessage id="HOMES" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  CREATE_BY: <FormattedMessage id="CREATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  TYPES_OFF_HOMES: <FormattedMessage id="TYPES_OFF_HOMES" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  VIEW_ROOM_DETAILS: 'Danh sách phòng',
  DELETE_QUESTION_WARNING: " Hiện bạn còn phòng đang hoạt động. Không thể xóa tòa nhà.",
  DELETE_QUESTION: "Mọi thông tin bạn đã đăng tải về chỗ nghỉ này như hình ảnh, video, phòng khách sạn, ... sẽ bị xóa khỏi webstite sarepi.com và không thể khôi phục được. Bạn có chắc chắn muốn xóa chỗ nghỉ này?",
}

class Homes extends Component {
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
      filterObject: {}
    }
  }

  componentWillMount() {
    this.onChange();
  }

  columns = [
    {
      title: STRINGS.TYPES_OFF_HOMES,
      dataIndex: 'homeName',
      width: '10%'
    }, {
      title: "Loại hình",
      dataIndex: 'homeCatalog',
      render: homeCatalog => homeCatalog && homeCatalog.catalogName ? homeCatalog.catalogName : '-',
      width: '10%'
    }, {
      title: "Ngày tạo",
      dataIndex: 'create_at',
      render: create_at => {
        if (create_at) {
          const day = new Date(create_at);
          return day.getDate() + '-' + (day.getMonth() + 1) + '-' + day.getFullYear();
        }
        return '-'
      },
      width: '6%'
    }, {
      title: "Người quản trị",
      dataIndex: 'manager',
      render: manager => {
        if (manager && manager.userName ) {
          return (
            <Tooltip title={<div className="text-center"><p>{manager.email}</p>{manager.phoneNumber}</div>}>
              <span>{manager.userName}</span>
            </Tooltip>
          )
        }
        return '-'
      },
      width: '10%'
    }, {
      title: "Địa chỉ",
      dataIndex: 'address',
      render: address => address && address.address_text ? address.address_text : '-',
      width: '20%'
    }, {
      title: "Số tầng",
      dataIndex: 'numFloor',
      width: '5%',
    }, {
      title: "Số phòng",
      dataIndex: 'numRoom',
      width: '5%',
    }, {
      title: "Hotline",
      dataIndex: 'hotline',
      width: '10%',
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isActive',
      render: isActive => isActive ? STRINGS.ACTION_ACTIVE : STRINGS.ACTION_DEACTIVE,
      filters: CONSTANTS.STATUS,
      width: '10%',
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render: (id, home) => {
        return (
          <div className="actions-column">
            <Tooltip title={STRINGS.VIEW_ROOM_DETAILS}>
              <span className="icon icon-view-details" onClick={() =>this.viewRooms(id, home.homeName)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() =>this.viewHome(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.EDIT}>
              <span className="icon icon-edit" onClick={() => this.editHome(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.ACTION_DELETE}>
              <span className="icon icon-delete" onClick={() => this.deleteHome(id)}></span>
            </Tooltip>
          </div>
        )
      },
      width: '10%',
      align: 'center'
    }
  ];

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  editHome = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Home/' + id + '/Edit');
  }

  viewRooms = (homeId, homeName) => {
    const { history } = this.props;
    if (!homeId && !homeName) {
      return;
    }
    history.push('/Room/Home/' + homeId + '/' + homeName);
  }

  viewHome = (id) => {
    const { history } = this.props;
    if (!id) {
      return;
    }
    history.push('/Home/' + id + '/View');
  }

  deleteHome = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    if (selectedUtility.numRoom === 0) {
      confirmModal({
        title: 'Xóa tòa nhà ' + selectedUtility.homeName,
        content: STRINGS.DELETE_QUESTION,
        okText: intl.formatMessage({ id: 'YES' }),
        centered: true,
        cancelText: intl.formatMessage({ id: 'NO' }),
        okType: 'danger',
        onOk: () => {
          dispatch(spinActions.showSpin());
          Services.deleteHome(id, response => {
            dispatch(spinActions.hideSpin());
            this.openNotification('success', intl.formatMessage({ id: 'DELETE_HOME_SUCCESS' }));
            this.onReload()
          }, error => {
            dispatch(spinActions.hideSpin());
            this.openNotification('error', intl.formatMessage({ id: 'DELETE_HOME_FAIL' }))
          })
        }
      });
    } else {
      Modal.warning({
        title: 'Xóa tòa nhà ' + selectedUtility.homeName,
        content: STRINGS.DELETE_QUESTION_WARNING,
        centered: true,
        okText: intl.formatMessage({ id: 'OK' })
      });
    }

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

  onAddHome = (success) => {
    const { history } = this.props;
    history.push('/Home/AddHome')
  }

  onChangeVisibleViewDetails = () => {
    this.setState({ selected: {}, isShowViewDetails: !this.state.isShowViewDetails })
  }

  onChangeFilterLocation = filterObject => {
    console.log(filterObject);
    this.setState({filterObject: filterObject} , () => this.onChange())
  }

  render() {
    const { tableSettings, dataSource, isShowAddOrEdit, isShowViewDetails, selected } = this.state;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };
    const buttonList = [
      { title: "Thêm", type: "primary", icon: "plus", onClick: () => this.onAddHome() }
    ];
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          {STRINGS.HOMES}
          <ButtonList list={buttonList} />
        </div>
        <FilterLocationHome onChangeFilter={ this.onChangeFilterLocation}/>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddHome selected={selected} onChangeVisible={this.onChangeVisible} />
        }
        {
          isShowViewDetails && <ViewHome selected={selected} onChangeVisible={this.onChangeVisibleViewDetails} />
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Homes)));