import React, { Component } from 'react'
import * as Services from './IncomeUtilitiesServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import {Modal, notification, Tooltip} from 'antd';
import {spinActions} from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIncomeUtility from "./AddIncomeUtility";
import ButtonList from "../../../components/commons/ButtonList/ButtonList";
import ViewIncomeUtility from "./ViewIncomeUtility";
import * as CONSTANTS from '../../Constants';
import {convertDatetimeToString} from "../../../utils/utils";


const confirmModal = Modal.confirm;

const STRINGS = {
  INCOME_UTILITIES: <FormattedMessage id="INCOME_UTILITIES" />,
  UPDATE_BY: <FormattedMessage id="UPDATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  TYPES_OFF_UTILITIES: <FormattedMessage id="TYPES_OFF_UTILITIES" />,
  ACTION: <FormattedMessage id="ACTION" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_UTILITY_QUESTION: <FormattedMessage id="DELETE_UTILITY_QUESTION" />,
}

class IncomeUtilities extends Component {
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
      title: STRINGS.TYPES_OFF_UTILITIES,
      dataIndex: 'name',
      width: '20%'
    }, {
      title: STRINGS.DESCRIPTION,
      dataIndex: 'description',
      render: description => description || '-'
    }, {
      title: 'Icon',
      dataIndex: 'icon_link',
      render: icon_link => icon_link && <img src={icon_link} style={{width: '32px', height: '32px'}}></img>,
      width: '10%',
      align: 'center'
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
      title: intl.formatMessage({ id: 'DELETE_UTILITY_QUESTION' }),
      content: <b>{selectedUtility.name}</b>,
      okText: intl.formatMessage({ id: 'YES' }),
      centered: true,
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      autoFocusButton: null,
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteIncomeUtility(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_UTILITY_SUCCESS' }));
          this.onReload()
        }, error => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'DELETE_UTILITY_FAIL' }))
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
    Services.getIncomeUtilities({...params,}, (response) => {
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
          {STRINGS.INCOME_UTILITIES}
          <ButtonList list={buttonList}/>
        </div>
        <TableCustom {...TableConfig} />
        {
          isShowAddOrEdit && <AddIncomeUtility selected={selected} onChangeVisible={this.onChangeVisible}/>
        }
        {
          isShowViewDetails && <ViewIncomeUtility selected={selected} onChangeVisible={this.onChangeVisibleViewDetails}/>
        }
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(IncomeUtilities)));