import {Button, Input, Table, Select, Icon} from 'antd';
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
    let { pagination, filters, sorter} = {...this.props.tableSettings};
    let newPagination = { ...pagination, current: 1};
    this.props.onChange(newPagination, filters, sorter, {}, text ? text : null);
  };

  onChange = (pagination = {}, filters = {}, sorter = {}, extra) => {
    const { onChange } = this.props;
    const { searchText } = this.state;
    onChange(pagination, filters, sorter, extra, searchText);
  };

  onChangeInput = e => {
    const { value } = e.target;
    this.setState({ searchText: value});
  };

  onClearButton = () => {
    this.setState({ searchText: ''});
    let { pagination, filters, sorter} = {...this.props.tableSettings};
    let newPagination = { ...pagination, current: 1};
    this.props.onChange(newPagination, filters, sorter, {}, null);
  };

  render() {
    const config = { ...defaultProps, ...this.props, onChange: this.onChange };
    const { pagination, intl } = this.props;
    const { searchText } = this.state;
    return (
      <div className="table-custom-wrapper">
        <div className="table-header" style={{display: config.isHideTableHeader ? 'none': ''}}>
          <Search
            placeholder={ config.placeholder ? config.placeholder : intl.formatMessage({id: 'ENTER_INPUT_SEARCH'})}
            onSearch={this.onSearchText}
            style={{display: config.isHideInputSearch ? 'none': ''}}
            value={searchText}
            onChange={this.onChangeInput}
            prefix={<Icon type="search"/>}
            suffix={searchText ? <Icon type="close" onClick={this.onClearButton} /> : ""}
            enterButton="Search"
            // allowClear
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