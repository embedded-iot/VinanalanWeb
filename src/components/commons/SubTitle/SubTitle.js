import React, { Component } from "react";
import { Icon, Tooltip } from "antd";
import "./SubTitle.scss"

class SubTitle extends Component {

  render() {
    const { title, isRequired, titleInfo, placeholderInfo} = this.props;
    return (
      <div className="sub-title-wrapper">
        <div className="heading">{ title }
          { isRequired && <span className="is-required">*</span> }
          {
            titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
          }
        </div>
      </div>
    );
  }
}

export default SubTitle;