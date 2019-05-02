import {Button, Input, Table, Select } from 'antd';
import React, {Component} from "react";
import './TableCustom.scss'
import {injectIntl} from "react-intl";
const Option = Select.Option;
const Search = Input.Search;

const defaultProps = {
  columns: [],
  dataSource: [],
  bordered: false,
  rowKey: record => record.id,
  pagination: {},
  loading: false,
  onChange: () => { },
  isHideInputSearch: false,
  isHideTableHeader: false,
  placeholder: null
}

const pageSizes = [
  { title: "10 hàng", value: 10},
  { title: "15 hàng", value: 15},
  { title: "20 hàng", value: 20},
];

class TableCustom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    }
  }

  setPageSize = pageSize => {
    let { pagination, filters, sorter } = {...this.props.tableSettings};
    const { searchText } = this.state;
    let newPagination = { ...pagination, pageSize, current: 1};
    this.props.onChange(newPagination, filters, sorter, {}, searchText);
  };

  onSearchText = text => {
    console.log("searchText", text);
    this.setState({ searchText: text});
    let { pagination, filters, sorter} = {...this.props.tableSettings};
    let newPagination = { ...pagination, current: 1};
    this.props.onChange(newPagination, filters, sorter, {}, text ? text : null);
  };

  onChange = (pagination = {}, filters = {}, sorter = {}, extra) => {
    const { onChange } = this.props;
    const { searchText } = this.state;
    onChange(pagination, filters, sorter, extra, searchText);
  };

  render() {
    const config = { ...defaultProps, ...this.props, onChange: this.onChange };
    const { pagination, intl } = this.props;
    return (
      <div className="table-custom-wrapper">
        <div className="table-header" style={{display: config.isHideTableHeader ? 'none': ''}}>
          <Search
            placeholder={ config.placeholder ? config.placeholder : intl.formatMessage({id: 'ENTER_INPUT_SEARCH'})}
            onSearch={this.onSearchText}
            style={{display: config.isHideInputSearch ? 'none': ''}}
          />
          <div className="dropdown-page-size">
            <span>Hiển thị</span>
            <Select defaultValue={pageSizes[0].value} style={{ width: 120 }} onChange={this.setPageSize}>
              {pageSizes.map((item, index) => <Option key={index} value={item.value}>{item.title}</Option>)}
            </Select>
          </div>
        </div>
        <Table {...config}/>
        { pagination && pagination.total !== undefined && <div className='table-total-count'>Tổng số: {pagination.total}</div>}

      </div>
    );
  }
}

export default injectIntl(TableCustom);