import React, { Component } from 'react'
import * as Services from './IncomeUtilitiesServices';
import { FormattedMessage } from 'react-intl';
import TableCustom from "../../../components/commons/TableCustom/TableCustom";

const STRINGS = {
  INCOME_UTILITIES: <FormattedMessage id="INCOME_UTILITIES" />,
  ACTIVE: <FormattedMessage id="ACTIVE" />,
  DEACTIVE: <FormattedMessage id="DEACTIVE" />,
  TYPES_OFF_UTILITIES: <FormattedMessage id="TYPES_OFF_UTILITIES" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
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
      render: icon_link => {
        return (
          <div className="actions-column">
            <span className="icon icon-view"></span>
            <span className="icon icon-edit"></span>
            <span className="icon icon-delete"></span>
          </div>
        )
      },
      width: '20%',
      align: 'center'
    }
  ];

  onChange = (pagination = {}, filters = {}, sorter  = {}, extra, searchText) => {
    const tableSettings = {
      ...this.state.tableSettings,
      pagination,
      filters,
      searchText,
      sorter
    };

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
    Services.getIncomeUtilities({...params,}, (response) => {
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
    }
    return (
      <div className="page-wrapper">
        <div className="page-headding">{STRINGS.INCOME_UTILITIES}</div>
        <TableCustom {...TableConfig} />
      </div>
    );
  }
}

export default IncomeUtilities;