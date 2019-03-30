import React, { Component } from "react";
import {DatePicker, Icon, Tooltip} from "antd";
import "./InputDatePicker.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
import moment from 'moment';

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}

class InputDatePicker extends Component {

  handleOnChange = (date, dateString) => {
    this.props.onChange(this.props.name, dateString, date);
  };

  render() {
    const { title, isRequired, value, defaultValue, placeholder, titleInfo, placeholderInfo, isSubmitted, disabled} = this.props;
    return (
      <div className="input-date-picker-wrapper" style={ !title ? {margin: 0} : {}}>
        {
          !!title && (<div className="heading">{ title }
            { isRequired && <span className="is-required">*</span> }
            {
              titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
            }
          </div>)
        }
        <DatePicker defaultValue={defaultValue ? moment(defaultValue, 'YYYY-MM-DD') : null} style={{ width: '50%' }} onChange={this.handleOnChange}/>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

InputDatePicker.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputDatePicker.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputDatePicker;