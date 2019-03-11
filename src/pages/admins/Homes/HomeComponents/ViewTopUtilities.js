import React, { Component } from "react";
import './ViewTopUtilities.scss'

export default class ViewTopUtilities extends Component {
  render() {
    const { list, emptyMessage } = this.props;
    return(
      <div className="view-top-utilities-wrapper">
        { list.length === 0 && emptyMessage}
        { list.length !== 0 && list.map((item, index) => (
            <div className='utility-item' key={index}>
              <img className='utility-icon' src={item.icon_link}/>
              <div className='utility-text'>{item.name}</div>
            </div>
          ))
        }
      </div>
    );
  }
}

ViewTopUtilities.defaultProps = {
  list: []
}