import React, { Component } from "react";
import {Select, Icon, Tooltip} from "antd";
import "./DropdownInputSearch.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
const Option = Select.Option;

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}

class DropdownInputSearch extends Component {

  handleOnChange = (value) => {
    this.props.onChange(this.props.name, value);
  }

  render() {
    const { list, title, placeholder, isRequired, disabled, titleInfo, placeholderInfo, style, isSubmitted, value} = this.props;
    return (
      <div className="dropdown-input-search-wrapper">
        <div className="heading">{ title }
          { isRequired && title &&  <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <Select
          showSearch
          style={style}
          placeholder={placeholder}
          value={value}
          optionFilterProp="children"
          onChange={ this.handleOnChange}
          disabled={disabled}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            list && list.length && list.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.text}
              </Option>
              )
            )
          }
        </Select>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

DropdownInputSearch.propTypes = {
  name: PropTypes.string,
  list: PropTypes.array,
  onChange:PropTypes.func,
};

DropdownInputSearch.defaultProps = {
  name: '',
  list: [],
  onChange: f => f
};

export default DropdownInputSearch;
