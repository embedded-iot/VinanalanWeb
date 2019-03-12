import React, { Component } from "react";
import {Input, Icon, Tooltip} from "antd";
import "./InputTextArea.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";

const { TextArea } = Input;

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}


class InputTextArea extends Component {

  handleOnChange = (e) => {
    this.props.onChange(this.props.name, e.target.value);
  }

  render() {
    const { title, value, defaultValue, isRequired, placeholder, titleInfo, placeholderInfo, style, isSubmitted, disabled} = this.props;
    return (
      <div className="input-text-area-wrapper" style={style}>
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <TextArea value={value} autosize={{ minRows: 2, maxRows: 6 }}
                  defaultValue={defaultValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  onChange={this.handleOnChange}/>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
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