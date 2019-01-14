import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./Dropdown.scss";
import ic_dropdown from "../../../public/images/icons/ic_dropdown.png";

export default class Dropdown extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="dropdown">
        <button type="button" className="btn custom-dropdown" data-toggle="dropdown">
          {
            this.props.selected ? this.props.selected.title : this.props.title
          }
          <img src={ic_dropdown} />
        </button>
        <div className="dropdown-menu">
          {
            this.props.listDropdown.length > 0 && this.props.listDropdown.map((item, index) => {
              return <a key={index} className="dropdown-item" onClick={() => this.props.onSelect(item)}>{item.title}</a>
            })
          }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  selected: PropTypes.object,
  title: PropTypes.string,
  listDropdown: PropTypes.array
}
Dropdown.defaultProps = {
  selected: null,
  title: "Dropdown",
  listDropdown: []
}