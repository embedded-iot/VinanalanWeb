import React, { Component } from "react";
import {Slider as SliderAntd, Icon, Tooltip} from "antd";
import "./Slider.scss"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
import OutputNumber from "../OutputNumber/OutputNumber";

const STRINGS = {
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
}

class Slider extends Component {

  handleOnChange = (e) => {
    this.props.onChange(this.props.name, e.target.value);
  };

  onChange = (value) => {
    const { name, onChange } = this.props;
    // console.log('onChange: ', value);
    onChange(name, value)
  };

  onAfterChange = (value) => {
    // console.log('onAfterChange: ', value);
  };

  render() {
    const { title, isRequired, value, min, max, step, defaultValue, unit, placeholder, titleInfo, placeholderInfo, isSubmitted, disabled} = this.props;
    return (
      <div className="slider-wrapper" style={ !title ? {margin: 0} : {}}>
        {
          !!title && (<div className="heading">{ title }
            { isRequired && <span className="is-required">*</span> }
            {
              titleInfo && (<Tooltip placement={ placeholderInfo || "top" } title={titleInfo}><Icon type="info-circle" /></Tooltip>)
            }
          </div>)
        }
        <div className="slider-bar">
          <span><OutputNumber value={min} unit={!!min ? unit : ''} /> </span>
          <SliderAntd range min={min} max={max} step={step} defaultValue={ defaultValue || [min, max]} onChange={this.onChange} onAfterChange={this.onAfterChange} />
          <span><OutputNumber value={max} unit={!!max ? unit : ''} /> </span>
        </div>

        {isSubmitted && isRequired && !value && <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>}
      </div>
    );
  }
}

Slider.propTypes = {
  name: PropTypes.string,
  onChange:PropTypes.func,
};

Slider.defaultProps = {
  name: '',
  onChange: f => f
};

export default Slider;