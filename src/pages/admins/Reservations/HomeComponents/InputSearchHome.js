import React, { Component } from "react";
import {Input, Icon, Tooltip} from "antd";
import "./InputSearchHome.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
const Search = Input.Search;

const STRINGS = {
}

class InputSearchHome extends Component {

  onSearchText = text => {
    console.log("searchText", text)
  }

  render() {
    const { title, isRequired, value, placeholder, titleInfo, placeholderInfo, isSubmitted, disabled} = this.props;
    return (
      <div className="input-search-home-wrapper" style={ !title ? {margin: 0} : {}}>
        {
          !!title && (<div className="heading">{ title }
            { isRequired && <span className="is-required">*</span> }
            {
              titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
            }
          </div>)
        }
        <div className='search-box'>
          <Search
            placeholder="Nhập thông tin tìm kiếm"
            onSearch={this.onSearchText}
          />
        </div>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

InputSearchHome.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

InputSearchHome.defaultProps = {
  name: '',
  onChange: f => f
};

export default InputSearchHome;