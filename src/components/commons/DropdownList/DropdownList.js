import React, { Component } from "react";
import {Select, Icon, Tooltip} from "antd";
import "./DropdownList.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
const Option = Select.Option;

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}

class DropdownList extends Component {

  handleOnChange = (value) => {
    this.props.onChange(this.props.name, value);
  }

  render() {
    const { defaultValue, value, disabled, list, title, isRequired, titleInfo, placeholderInfo, isSubmitted} = this.props;
    return (
      <div className="dropdown-list-wrapper">
        {
          title && (
            <div className="heading">{ title }
            { isRequired && title && <span className="is-required">*</span> }
            {
              !!titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
            }
          </div>
          )
        }

        <Select
          defaultValue={defaultValue}
          value={value}
          onChange={this.handleOnChange}
          disabled={disabled}
        >
          { !!list && list.length && list.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.text}
            </Option>
          ))}
        </Select>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
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
