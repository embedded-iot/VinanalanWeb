import React, { Component } from "react";
import {InputNumber as InputNumberAntd, Icon, Tooltip} from "antd";
import "./InputNumber.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}

class InputNumber extends Component {

  handleOnChange = (value) => {
    this.props.onChange(this.props.name, value);
  }

  render() {
    const { isSubmitted, title, value, defaultValue, min, max, disabled, isRequired, placeholder, titleInfo, placeholderInfo} = this.props;
    return (
      <div className="input-number-wrapper">
        <div className="heading">{ title }
          { isRequired && title && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <InputNumberAntd value={value} defaultValue={defaultValue} min={min} max={max} disabled={disabled} placeholder={placeholder} onChange={ this.handleOnChange } />
        {isSubmitted && isRequired && value === undefined && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

InputNumber.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputNumber.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputNumber;