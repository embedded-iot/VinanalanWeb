import React, { Component } from "react";
import {Input, Icon, Tooltip} from "antd";
import "./InputTextArea.scss"
import PropTypes from 'prop-types';

const { TextArea } = Input;

class InputTextArea extends Component {

  handleOnChange = (e) => {
    this.props.onChange(this.props.name, e.target.value);
  }

  render() {
    const { title, value, isRequired, placeholder, titleInfo, placeholderInfo, style} = this.props;
    return (
      <div className="input-text-area-wrapper" style={style}>
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <TextArea value={value} autosize={{ minRows: 2, maxRows: 6 }}
                  placeholder={placeholder}
                  onChange={this.handleOnChange}/>
      </div>
    );
  }
}

InputTextArea.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputTextArea.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputTextArea;