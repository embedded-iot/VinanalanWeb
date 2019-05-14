import React, { Component } from "react";
import {Icon, Tooltip} from "antd";
import "./OutputText.scss"
import PropTypes from 'prop-types';


class OutputText extends Component {

  render() {
    const { title, isRequired, value, titleInfo, placeholderInfo, horizontal} = this.props;
    return (
      <div className={"output-text-wrapper" + (horizontal ? " horizontal" : "") } >
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
        <div>{value || '-'}</div>
      </div>
    );
  }
}

OutputText.propTypes = {
  name: PropTypes.string,
};

OutputText.defaultProps = {
  name: '',
};

export default OutputText;