import React, { Component } from "react";
import "./Checkbox.scss";

export default class Checkbox extends Component {

  handleOnCheck = (e) => {
    this.props.onChange(this.props.value, e.target.checked);
  }

  render() {
    return (
      <div className={this.props.disable ? "checkbox disable" : "checkbox"}>
        <input className="styled-checkbox" type="checkbox" checked={this.props.checked} id={`${this.props.id}-checkbox-${this.props.value}`} onChange={this.handleOnCheck} />
        <label htmlFor={`${this.props.id}-checkbox-${this.props.value}`}>{this.props.title} &nbsp;</label>
      </div>
    );
  }
}