import {Button, Input, Table, Select } from 'antd';
import React, {Component} from "react";
import './TableCustom.scss'
const Option = Select.Option;
const Search = Input.Search;

const defaultProps = {
  columns: [],
  dataSource: [],
  bordered: false,
  rowKey: record => record.id,
  pagination: {},
  loading: false,
  onChange: () => { }
}

const pageSizes = [
  { title: "10 hàng", value: 10},
  { title: "15 hàng", value: 15},
  { title: "20 hàng", value: 20},
];

export default class TableCustom extends Component {

  constructor(props) {
    super(props);
  }

  setPageSize = pageSize => {
    let { pagination, filters, sorter, searchText } = {...this.props.tableSettings};
    let newPagination = { ...pagination, pageSize, current: 1};
    this.props.onChange(newPagination, filters, sorter, {}, searchText);
  }

  onSearchText = text => {
    console.log("searchText", text)
    let { pagination, filters, sorter} = {...this.props.tableSettings};
    this.props.onChange(pagination, filters, sorter, {}, text ? text : null);
  }

  render() {
    const config = { ...defaultProps, ...this.props };
    return (
      <div className="table-custom-wrapper">
        <div className="table-header">
          <Search
            placeholder="Nhập thông tin tìm kiếm"
            onSearch={this.onSearchText}
          />
          <div className="dropdown-page-size">
            <span>Hiển thị</span>
            <Select defaultValue={pageSizes[0].value} style={{ width: 120 }} onChange={this.setPageSize}>
              {pageSizes.map((item, index) => <Option key={index} value={item.value}>{item.title}</Option>)}
            </Select>
          </div>
        </div>
        <Table {...config}/>
      </div>
    );
  }
}

