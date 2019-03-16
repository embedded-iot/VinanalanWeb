import React, { Component } from "react";
import {Col, Row} from "antd";
import InputNumber from "../../../../components/commons/InputNumber/InputNumber";


export default class EditFurniture extends Component {
  render() {
    const { list, emptyMessage, disabled, onChange} = this.props;
    return(
      <div className="view-utilities-wrapper">
        { list.length === 0 && emptyMessage}
        { list.length !== 0 && (
          <Row>
            {
              list.map( (item, index) => (
                <Col span={6} key={item.id} style={{ paddingRight: '20px'}}>
                  <InputNumber
                    title={item.name}
                    description='(Đơn vị: VND)'
                    name={index.toString()}
                    value={item.cost}
                    onChange={onChange}
                    disabled={disabled}
                  />
                </Col>
              ))
            }
          </Row>
        )
        }
      </div>
    );
  }
}

EditFurniture.defaultProps = {
  list: [],
  onChange: f => f,
  disabled: false
}