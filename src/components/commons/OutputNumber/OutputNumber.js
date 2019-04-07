import React, { Component } from "react";
import {Icon, Tooltip} from "antd";
import "./OutputNumber.scss"
import PropTypes from 'prop-types';


class OutputNumber extends Component {

  formatterValue = value => {
    const {type} = this.props;
    if (type === 'phone') {
      return value;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  render() {
    const { title, isRequired, value, unit, titleInfo, placeholderInfo} = this.props;
    return (
      <div className="output-number-wrapper">
        {
          !!title && (
            <div className="heading">{ title }
              { isRequired && <span className="is-required">*</span> }
              {
                titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
              }
            </div>
          )
        }
        <div className="contents">{this.formatterValue(value || '0')} <span>{unit}</span></div>
      </div>
    );
  }
}

OutputNumber.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  unit: PropTypes.string
};

OutputNumber.defaultProps = {
  name: '',
  value: '',
  unit: ''
};

export default OutputNumber;