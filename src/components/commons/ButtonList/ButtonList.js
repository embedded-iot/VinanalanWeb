import React from "react";
import {Button} from "antd";
import "./ButtonList.scss"

const ButtonList = (props) => {
  const {list, size} = props;
  return (
    <div className="button-list">
      {
        list.length && list.map((item, index) => {
          const propsButton = { shape: 'round', ...item};
          return <Button key={index} {...propsButton}>{item.title}</Button>
        })
      }
    </div>
  )
}

export default ButtonList;