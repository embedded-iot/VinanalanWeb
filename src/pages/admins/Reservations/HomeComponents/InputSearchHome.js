import React, { Component } from "react";
import {Input, Icon, Tooltip, AutoComplete} from "antd";
import "./InputSearchHome.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
import * as Services from '../ReservationsServices';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
const Search = Input.Search;

const STRINGS = {
}

class InputSearchHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchOptions: []
    };
    this.timeout = null;
  }

  generateOptions = source =>(
    source.map(group => (
      <OptGroup key={group.title} label={<span>{group.title}</span>}>
        {group && group.children && group.children.length > 0 && group.children.map(opt => (
          <Option
            key={opt.value}
            value={ opt.key === 'homeName' ?  opt.title : opt.description }
            className="search-item"
          >
            <span className="title">{opt.title}</span>
            <span className="description">{opt.description}</span>
          </Option>
        ))}
      </OptGroup>
    ))
  );

  concatAddress = (originAddress, address, key, description) => [
    ...originAddress,
    ...address.map(item => ({
      title: item.name,
      value: item.code,
      description: item.path_with_type || (description + ' ' + item.name),
      key
    }))
  ];

  convertResponse = ({ address, homes }) => {
    const { country, province, district } = address;

    let addressGroup = {
      title: "Khu vực",
      children: []
    };

    let homeGroup = {
      title: "Khách sạn",
      children: []
    };

    if (country && country.length > 0) {
      addressGroup.children = this.concatAddress(
        addressGroup.children,
        country,
        "country_code",
        "Quốc gia"
      );
    }
    if (province && province.length > 0) {
      addressGroup.children = this.concatAddress(
        addressGroup.children,
        province,
        "province_code",
        "Tỉnh"
      );
    }
    if (district && district.length > 0) {
      addressGroup.children = this.concatAddress(
        addressGroup.children,
        district,
        "district_code",
        "Quận/Huyện"
      );
    }

    homeGroup.children = homes && homes.home && homes.home.map(home => ({
      title: home.homeName,
      description: home.address.address_text,
      key: "homeName",
      value: home.homeName
    }));

    let source = [];
    if (addressGroup.children.length > 0) {
      source = [...source, addressGroup]
    }
    if (homeGroup.children.length > 0) {
      source = [...source, homeGroup]
    }

    return source;
  };


  fetchSearchHomeAddress = text => {
    Services.getSearchHomeAddress(text, response => {
      if (response.data) {
        const source = this.convertResponse(response.data);
        this.setState({ searchOptions: source})
      }
    });
  };

  findObjectByText = text => {
    const { searchOptions } = this.state;
    let obj;
    for ( let i = 0; i < searchOptions.length; i++) {
      obj =  searchOptions[i].children.find(option => {
        return  option.title === text || option.description === text;
      });
      if (obj) {
        break;
      }
    }
    if (obj) {
      this.props.onChange(obj.key, obj.value, text);
    } else {
      this.props.onChange('homeName', text, text);
    }
  };

  onSearchText = value => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      this.findObjectByText(value);
      if (value.length >= 2) {
        this.fetchSearchHomeAddress(value);
      } else {
        this.setState({ searchOptions: []})
      }
    }, 1000);
  };

  render() {
    const { title, isRequired, value, defaultValue, placeholder, titleInfo, placeholderInfo, isSubmitted, disabled} = this.props;
    const { searchOptions } = this.state;
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
        <div className="certain-category-search-wrapper">
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            size="large"
            style={{ width: "100%" }}
            dataSource={this.generateOptions(searchOptions)}
            optionLabelProp="value"
            placeholder="Nhập thông tin tìm kiếm"
            defaultValue={defaultValue}
            onChange={this.onSearchText}
          >
            <Input
              prefix={<Icon type="search" className="certain-category-icon" />}
            />
          </AutoComplete>
        </div>
        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

InputSearchHome.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
  defaultValue: PropTypes.string
};

InputSearchHome.defaultProps = {
  name: '',
  defaultValue: '',
  onChange: f => f
};

export default InputSearchHome;

