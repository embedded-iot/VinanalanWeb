import React, { Component } from "react";
import './ViewUtilities.scss'

export default class ViewUtilities extends Component {
  render() {
    const { list, emptyMessage } = this.props;
    return(
      <div className="view-utilities-wrapper">
        { list.length === 0 && emptyMessage}
        { list.length !== 0 && list.map((item, index) => (
            <div className='utility-item' key={index}>
              <img className='utility-icon' src={item.icon_link}/>
              <span className='utility-text'>{item.name}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

ViewUtilities.defaultProps = {
  list: []
}