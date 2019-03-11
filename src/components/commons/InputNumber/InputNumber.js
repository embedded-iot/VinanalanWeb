import React, { Component } from "react";
import {InputNumber as InputNumberAntd, Icon, Tooltip} from "antd";
import "./InputNumber.scss"
import PropTypes from 'prop-types';


class InputNumber extends Component {

  handleOnChange = (value) => {
    this.props.onChange(this.props.name, value);
  }

  render() {
    const { title, min, max, disabled, isRequired, defaultValue, placeholder, titleInfo, placeholderInfo} = this.props;
    return (
      <div className="input-number-wrapper">
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <InputNumberAntd defaultValue={defaultValue} min={min} max={max} disabled={disabled} placeholder={placeholder} onChange={ this.handleOnChange } />
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