import React, { Component } from "react";
import {Input, Icon, Tooltip} from "antd";
import "./InputEmail.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
import validator from "validator";

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  INVALID_EMAIL: <FormattedMessage id="INVALID_EMAIL" />,
}

class InputEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validEmail: true
    }
  }

  handleOnChange = (e) => {
    const {value} = e.target;
    let validateEmail = true;
    if (!validator.isEmail(value)) {
      validateEmail = false;
    }
    this.setState({ validEmail: validateEmail});
    this.props.onChange(this.props.name, value, validateEmail);
  }

  render() {
    const { title, isRequired, value, placeholder, titleInfo, placeholderInfo, isSubmitted, disabled} = this.props;
    const { validEmail } = this.state;
    return (
      <div className="input-email-wrapper" style={ !title ? {margin: 0} : {}}>
        {
          !!title && (<div className="heading">{ title }
            { isRequired && <span className="is-required">*</span> }
            {
              titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
            }
          </div>)
        }
        <Input value={value} onChange={ this.handleOnChange } placeholder={placeholder} disabled={disabled}/>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
        {!!value && !validEmail && <span style={{ color: "red" }}>{STRINGS.INVALID_EMAIL}</span>}
      </div>
    );
  }
}

InputEmail.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputEmail.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputEmail;