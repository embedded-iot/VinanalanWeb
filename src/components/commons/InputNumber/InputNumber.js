import React, { Component } from "react";
import {InputNumber as InputNumberAntd, Icon, Tooltip, Input} from "antd";
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

  onChange = (e) => {
    const { value } = e.target;
    const {type} = this.props;
    let reg = /^-?([0-9]+)(\.[0-9]*)?$/;
    if (type === 'phone') {
      reg = /^-?([0-9]+)(\.[0-9]*){0}$/;
    }
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (type === 'phone') {
        this.props.onChange(this.props.name, value);
      } else {
        this.props.onChange(this.props.name, value ? ( value === '-' ? value : Number(value)) : '');
      }
    }
  }

  render() {
    const { isSubmitted, type, title, value, defaultValue, maxLength, min, max, disabled, isRequired, placeholder, titleInfo, placeholderInfo, description} = this.props;

    return (
      <div className="input-number-wrapper" style={ !title ? {margin: 0} : {}}>
        { !!title && <div className="heading"> {title }
          { isRequired && title && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>}
        {/*<InputNumberAntd value={value} defaultValue={defaultValue} min={min} max={max} disabled={disabled} placeholder={placeholder} onChange={ this.handleOnChange } />*/}
        <Input
          value={value} defaultValue={defaultValue} min={min} max={max} disabled={disabled} placeholder={placeholder}
          onChange={this.onChange}
          maxLength={type === 'phone' ? 10 : (maxLength || 20)}
        />
        {isSubmitted && isRequired && value === '' && <p style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</p>}
        {description && <span>{ description }</span>}
      </div>
    );
  }
}

InputNumber.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  onChange:PropTypes.func,
};

InputNumber.defaultProps = {
  name: '',
  type: '',
  onChange: f => f
};

export default InputNumber;