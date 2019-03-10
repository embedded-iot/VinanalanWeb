import React, { Component } from "react";
import {Input, Icon, Tooltip} from "antd";
import "./InputText.scss"
import PropTypes from 'prop-types';


class InputText extends Component {

  handleOnChange = (e) => {
    this.props.onChange(this.props.name, e.target.value);
  }

  render() {
    const { title, isRequired, defaultValue, placeholder, titleInfo, placeholderInfo} = this.props;
    return (
      <div className="input-text-wrapper">
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <Input defaultValue={defaultValue} onChange={ this.handleOnChange } placeholder={placeholder}/>
      </div>
    );
  }
}

InputText.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputText.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputText;