import React, { Component } from 'react'
import * as Services from './IncomeUtilitiesServices';
import { injectIntl, FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";
import { Modal, notification } from 'antd';
import {spinActions} from "../../../actions/spinAction";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const confirmModal = Modal.confirm;

const STRINGS = {
  INCOME_UTILITIES: <FormattedMessage id="INCOME_UTILITIES" />,
  ACTIVE: <FormattedMessage id="ACTIVE" />,
  DEACTIVE: <FormattedMessage id="DEACTIVE" />,
  TYPES_OFF_UTILITIES: <FormattedMessage id="TYPES_OFF_UTILITIES" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  DELETE_INCOME_UTILITY: <FormattedMessage id="DELETE_INCOME_UTILITY" />,
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
      }
    }
  }

  componentWillMount() {
    this.onChange();
  }

  columns = [
    {
      title: STRINGS.TYPES_OFF_UTILITIES,
      dataIndex: 'name'
    }, {
      title: 'Icon',
      dataIndex: 'icon_link',
      render: icon_link => icon_link && <img src={icon_link} style={{width: '32px', height: '32px'}}></img>,
      width: '10%',
      align: 'center'
    }, {
      title: STRINGS.STATUS,
      dataIndex: 'isStatus',
      render: isStatus => isStatus ? STRINGS.ACTIVE : STRINGS.DEACTIVE,
      filters: [
        { text: STRINGS.ACTIVE, value: true },
        { text: STRINGS.DEACTIVE, value: false },
      ],
      width: '10%',
    }, {
      title: STRINGS.ACTION,
      dataIndex: 'id',
      render: id => {
        return (
          <div className="actions-column">
            <span className="icon icon-view"></span>
            <span className="icon icon-edit"></span>
            <span className="icon icon-delete" onClick={() =>this.deleteIncomeUtility(id)}></span>
          </div>
        )
      },
      width: '20%',
      align: 'center'
    }
  ];

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  deleteIncomeUtility = (id) => {
    const { intl, dispatch } = this.props;

    const selectedUtility = this.state.dataSource.find(utility => utility.id === id);
    if (!selectedUtility) {
      return;
    }
    confirmModal({
      title: intl.formatMessage({ id: 'DELETE_INCOME_UTILITY' }),
      okText: intl.formatMessage({ id: 'YES' }),
      cancelText: intl.formatMessage({ id: 'NO' }),
      okType: 'danger',
      onOk: () => {
        dispatch(spinActions.showSpin());
        Services.deleteIncomeUtility(id, response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'DELETE_UTILITY_SUCCESS' }));
          this.onChange();
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

    let params = {
      limit: pagination.pageSize || 10,
      skip: (pagination.current - 1) * pagination.pageSize || 0,
      sortField: sorter.field,
      sortOrder: sorter.order,
      searchText,
      ...filters,
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

  render() {
    const { tableSettings, dataSource} = this.state;
    const TableConfig = {
      columns: this.columns,
      dataSource: dataSource,
      pagination: tableSettings.pagination,
      onChange: this.onChange,
      tableSettings: tableSettings
    };
    return (
      <div className="page-wrapper">
        <div className="page-headding">{STRINGS.INCOME_UTILITIES}</div>
        <TableCustom {...TableConfig} />
      </div>
    );
  }
}

export default injectIntl(withRouter(connect()(IncomeUtilities)));