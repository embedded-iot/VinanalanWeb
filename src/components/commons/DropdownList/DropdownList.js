import React, { Component } from "react";
import {Select, Icon, Tooltip} from "antd";
import "./DropdownList.scss"
import PropTypes from 'prop-types';
const Option = Select.Option;

class DropdownList extends Component {

  handleOnChange = (value) => {
    this.props.onChange(this.props.name, value);
  }

  render() {
    const { defaultValue, list, title, isRequired, titleInfo, placeholderInfo} = this.props;
    const value = defaultValue ? defaultValue : (list.length ? list[0].value : '');
    return (
      <div className="dropdown-list-wrapper">
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <Select
          defaultValue={value}
          onChange={this.handleOnChange}
        >
          {list && list.length && list.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.text}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

DropdownList.propTypes = {
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  list: PropTypes.array,
  onChange:PropTypes.func,
};

DropdownList.defaultProps = {
  name: '',
  defaultValue: '',
  list: [],
  onChange: f => f
};

export default DropdownList;
