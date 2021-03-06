import React, { Component } from 'react'
import * as Services from './UsersServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import { Modal, notification, Tooltip } from 'antd';
import { spinActions } from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddUser from "./AddUser";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewUser from "./ViewUser";
import * as CONSTANTS from '../../Constants';
import {convertDatetimeToString} from "../../../utils/utils";


const confirmModal = Modal.confirm;

const STRINGS = {
  USERS: <FormattedMessage id="USERS" />,
  USER_FULL_NAME: <FormattedMessage id="USER_FULL_NAME" />,
  EMAIL: <FormattedMessage id="EMAIL" />,
  PHONE: <FormattedMessage id="PHONE" />,
  USER_PERMISSION: <FormattedMessage id="USER_PERMISSION" />,
  ADMIN: <FormattedMessage id="ADMIN" />,
  MANAGER: <FormattedMessage id="MANAGER" />,
  STAFF: <FormattedMessage id="STAFF" />,
  HOME_MANAGER: <FormattedMessage id="HOME_MANAGER" />,
  WORKING_TIME: <FormattedMessage id="WORKING_TIME" />,
  FULL_TIME: <FormattedMessage id="FULL_TIME" />,
  PART_TIME: <FormattedMessage id="PART_TIME" />,
  USER_TITLE: <FormattedMessage id="USER_TITLE" />,
  UPDATE_BY: <FormattedMessage id="UPDATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ALL: <FormattedMessage id="ALL" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_USER_QUESTION: <FormattedMessage id="DELETE_USER_QUESTION" />,
}

class Users extends Component {
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
      selected: {}
    }
  }

  componentWillMount() {
    this.onChange();
  }

  getNameByValue = (list, searchValue) => {
    let result = list.find(item => item.value === searchValue);
    return result ? result.text : searchValue;
  }

  columns = [
    {
      title: STRINGS.USER_FULL_NAME,
      dataIndex: 'userName',
      width: '15%'
    }, {
      title: STRINGS.EMAIL,
      dataIndex: 'email'
    }, {
      title: STRINGS.USER_PERMISSION,
      dataIndex: 'role',
      width: '10%',
      align: 'center',
      render: role => this.getNameByValue(CONSTANTS.USER_PERMISSION, role),
      filters: CONSTANTS.USER_PERMISSION
    }, {
      title: STRINGS.PHONE,
      dataIndex: 'phoneNumber',
      width: '10%',
      align: 'center'
    }, {
      title: STRINGS.WORKING_TIME,
      dataIndex: 'typeJob',
      width: '10%',
      align: 'center',
      render: typeJob => this.getNameByValue(CONSTANTS.WORKING_TIME, typeJob),
      filters: CONSTANTS.WORKING_TIME
    }, {
      title: STRINGS.USER_TITLE,
      dataIndex: 'title',
      width: '10%',
      align: 'center',
      render: title => this.getNameByValue(CONSTANTS.USER_TITLE, title),
      filters: CONSTANTS.USER_TITLE
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isActive',
      render: isActive => isActive ? STRINGS.ACTION_ACTIVE : STRINGS.ACTION_DEACTIVE,
      filters: CONSTANTS.STATUS,
      width: '10%',
    }, {
      title: STRINGS.UPDATE_BY,
      dataIndex: 'update_by',
      render: (update_by = {}, { update_at }) => (
        <Tooltip title={update_by.userName || update_by.email ? <div className="text-center"><p>{update_by.userName}</p>{update_by.email}</div> : ''}>
          <span>{ update_at ? convertDatetimeToString(update_at) : '-'}</span>
        </Tooltip>
      ),
      width: '10%'
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render: id => {
        return (
          <div className="actions-column">
            <Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() => this.viewIncomeUtility(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.EDIT}>
              <span className="icon icon-edit" onClick={() => this.editIncomeUtility(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.ACTION_DELETE}>
              <span className="icon icon-delete" onClick={() => this.deleteIncomeUtility(id)}></span>
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

  editIncomeUtility = (id) => {
    const selectedUser = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUser) {
      return;
    }
    this.setState({ selected: selectedUser, isShowAddOrEdit: !this.state.isShowAddOrEdit })
  }

  viewIncomeUtility = (id) => {
    const selectedUser = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUser) {
      return;
    }
    this.setState({ selected: selectedUser, isShowViewDetails: !this.state.isShowViewDetails })
  }

  deleteIncomeUtility = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUser = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUser) {
      return;
    }
    confirmModal({
      title: intl.formatMessage({ id: 'DELETE_USER_QUESTION' }),
      content: <b>{selectedUser.userName}</b>,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      autoFocusButton: null,
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteUser(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_USER_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_USER_FAIL' }))
        })
      },
      onCancel() {

      },
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

    let isActive = filters.isActive;
    let role = filters.role;
    let typeJob = filters.typeJob;
    let title = filters.title;

    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      role,
      typeJob,
      title,
      isActive
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true
    });
    dispatch(spinActions.showSpin());
    Services.getUsers({ ...params, }, (response) => {
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

  onChangeVisible = (success) => {
    this.setState({ selected: {}, isShowAddOrEdit: !this.state.isShowAddOrEdit })
    if (success) {
      this.onReload()
    }
  }

  onChangeVisibleViewDetails = () => {
    this.setState({ selected: {}, isShowViewDetails: !this.state.isShowViewDetails })
  }

  render() {
    const { tableSettings, dataSource, isShowAddOrEdit, isShowViewDetails, selected } = this.state;
    const { intl } = this.props;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings,
      placeholder: intl.formatMessage({id: 'ENTER_INPUT_SEARCH_FOR_ACCOUNTS'})
    };
    const buttonList = [
      { title: "Thêm", type: "primary", icon: "plus", onClick: () => this.onChangeVisible() }
    ];
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          {STRINGS.USERS}
          <ButtonList list={buttonList} />
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddUser selected={selected} onChangeVisible={this.onChangeVisible} />
        }
        {
          isShowViewDetails && <ViewUser selected={selected} onChangeVisible={this.onChangeVisibleViewDetails} onOk={this.editIncomeUtility}/>
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Users)));
