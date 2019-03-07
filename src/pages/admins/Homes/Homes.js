import React, { Component } from 'react'
import * as Services from './HomesServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Modal, notification, Tooltip} from 'antd';
import {spinActions} from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddHome from "./AddHome";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewHome from "./ViewHome";
import * as CONSTANTS from '../../Constants';

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
  DELETE_HOME_QUESTION: <FormattedMessage id="DELETE_HOME_QUESTION" />,
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
      selected: {}
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
      title: "Người quản trị",
      dataIndex: 'manager',
      render: manager => manager && manager.userName ? manager.userName : '-',
      width: '10%'
    }, {
      title: "Địa chỉ",
      dataIndex: 'location',
      render: location => location && location.address_text ? location.address_text : '-',
      width: '20%'
    }, {
      title: "Số tầng",
      dataIndex: 'numFloor',
      width: '10%',
    }, {
      title: "Số phòng",
      dataIndex: 'numRoom',
      width: '10%',
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
      render: id => {
        return (
          <div className="actions-column">
            {/*<Tooltip title={STRINGS.VIEW}>
              <span className="icon icon-view" onClick={() =>this.viewIncomeUtility(id)}></span>
            </Tooltip>*/}
            <Tooltip title={STRINGS.EDIT}>
              <span className="icon icon-edit" onClick={() =>this.editIncomeUtility(id)}></span>
            </Tooltip>
            <Tooltip title={STRINGS.ACTION_DELETE}>
              <span className="icon icon-delete" onClick={() =>this.deleteIncomeUtility(id)}></span>
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
    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    this.setState({ selected: selectedUtility, isShowAddOrEdit: !this.state.isShowAddOrEdit})
  }

  viewIncomeUtility = (id) => {
    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    this.setState({ selected: selectedUtility, isShowViewDetails: !this.state.isShowViewDetails})
  }

  deleteIncomeUtility = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    confirmModal({
      title: intl.formatMessage({ id: 'DELETE_HOME_QUESTION' }),
      content: <b>{selectedUtility.catalogName}</b>,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteHomeCatalog(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_HOME_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_HOME_FAIL' }))
        })
      },
      onCancel() {

      },
    });
  };

  onChange = (pagination = {}, filters = {}, sorter  = {}, extra, searchText) => {
    const tableSettings = {
      ...this.state.tableSettings,
      pagination,
      filters,
      searchText,
      sorter
    };
    const { dispatch } = this.props;

    let isActive =  filters.isActive;
    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      isActive
    };


    this.setState({
      tableSettings: tableSettings,
      loading: true });
    dispatch(spinActions.showSpin());
    Services.getHomeCatalog({...params,}, (response) => {
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
    let { pagination, filters, sorter, searchText } = {...this.state.tableSettings};
    this.onChange(pagination, filters, sorter, {}, searchText);
  }

  onChangeVisible = (success) => {
    this.setState({ selected: {}, isShowAddOrEdit: !this.state.isShowAddOrEdit})
    if (success) {
      this.onReload()
    }
  }

  onChangeVisibleViewDetails = () => {
    this.setState({ selected: {}, isShowViewDetails: !this.state.isShowViewDetails})
  }

  render() {
    const { tableSettings, dataSource, isShowAddOrEdit, isShowViewDetails, selected} = this.state;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };
    const buttonList = [
      { title: "Thêm", type: "primary",  icon: "plus", onClick: () => this.onChangeVisible()}
    ];
    return (
      <div className="page-wrapper">
        <div className="page-headding">
          {STRINGS.HOMES}
          <ButtonList list={buttonList}/>
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddHome selected={selected} onChangeVisible={this.onChangeVisible}/>
        }
        {
          isShowViewDetails && <ViewHome selected={selected} onChangeVisible={this.onChangeVisibleViewDetails}/>
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(Homes)));