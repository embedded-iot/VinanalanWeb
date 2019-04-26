import React, { Component } from 'react'
import * as Services from './HomeCatalogServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Modal, notification, Tooltip} from 'antd';
import {spinActions} from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddHomeCatalog from "./AddHomeCatalog";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewHomeCatalog from "./ViewHomeCatalog";
import * as CONSTANTS from '../../Constants';
import {convertDatetimeToString} from "../../../utils/utils";

const confirmModal = Modal.confirm;

const STRINGS = {
  HOME_CATALOGS: <FormattedMessage id="HOME_CATALOGS" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  UPDATE_BY: <FormattedMessage id="UPDATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  TYPES_OFF_HOME_CATALOGS: <FormattedMessage id="TYPES_OFF_HOME_CATALOGS" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_HOME_CATALOG_QUESTION: <FormattedMessage id="DELETE_HOME_CATALOG_QUESTION" />,
}

class HomeCatalog extends Component {
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
      title: STRINGS.TYPES_OFF_HOME_CATALOGS,
      dataIndex: 'catalogName',
      width: '15%',
    }, {
      title: STRINGS.DESCRIPTION,
      dataIndex: 'catalogDescription'
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isActive',
      render: isActive => isActive ? STRINGS.ACTION_ACTIVE : STRINGS.ACTION_DEACTIVE,
      filters: CONSTANTS.STATUS,
      width: '10%',
    }, {
      title: STRINGS.UPDATE_BY,
      dataIndex: 'update_by',
      render: (update_by = {}, { create_at }) => (
        <Tooltip title={update_by.userName || update_by.email ? <div className="text-center"><p>{update_by.userName}</p>{update_by.email}</div> : ''}>
          <span>{ create_at ? convertDatetimeToString(create_at) : '-'}</span>
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
              <span className="icon icon-view" onClick={() =>this.viewIncomeUtility(id)}></span>
            </Tooltip>
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
      title: intl.formatMessage({ id: 'DELETE_HOME_CATALOG_QUESTION' }),
      content: <b>{selectedUtility.catalogName}</b>,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteHomeCatalog(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_HOME_CATALOG_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_HOME_CATALOG_FAIL' }))
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
          {STRINGS.HOME_CATALOGS}
          <ButtonList list={buttonList}/>
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddHomeCatalog selected={selected} onChangeVisible={this.onChangeVisible}/>
        }
        {
          isShowViewDetails && <ViewHomeCatalog selected={selected} onChangeVisible={this.onChangeVisibleViewDetails}/>
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(HomeCatalog)));