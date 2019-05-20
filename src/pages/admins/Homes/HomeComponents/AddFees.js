import React, { Component } from "react";
import './AddFees.scss'
import PropTypes from "prop-types";
import {Modal, Checkbox, Row, Col} from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {spinActions} from "../../../../actions";
import {getInFurnitures} from "../../../config/InFurnitures/InFurnituresServices";
import {getRoomUtilities} from "../../../config/RoomUtilities/RoomUtilitiesServices";
import {getExtraFees} from "../../../config/ExtraFees/ExtraFeesServices";
import InputNumber from "../../../../components/commons/InputNumber/InputNumber";

const CheckboxGroup = Checkbox.Group;

const STRINGS = {
  ADD_ROOM_UTILITIES_IN_ROOM_PAGE: 'Xin mời chọn tiện ích cho phòng',
  ADD_IN_FURNITURES_IN_ROOM_PAGE: 'Xin mời chọn dịch vụ cho phòng',
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddFees extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      selected: [...this.props.selected],
      indeterminate: true,
      checkAll: false
    }
  }

  fetchInitData = service => {
    const { dispatch} = this.props;
    dispatch(spinActions.showSpin());
    let param = {skip: 0, limit: 100, isActive: true};
    return service(param, response => {
      dispatch(spinActions.hideSpin());
      if (response.data && response.data.length) {
        this.setState({list: response.data} , () => this.initState())
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  initState = () => {
    const { selected, list } = this.state;
    this.setState({
      indeterminate: !!selected.length && selected.length > 0 && selected.length < list.length,
      checkAll: selected.length === list.length,
    });
  };

  componentWillMount() {
    const { type} = this.props;
    switch (type) {
      case 'inFurnitures':
        this.setState( {nameModal: STRINGS.ADD_IN_FURNITURES_IN_ROOM_PAGE});
        this.fetchInitData(getInFurnitures);
        break;
      case 'room_utilities':
        this.setState( {nameModal: STRINGS.ADD_ROOM_UTILITIES_IN_ROOM_PAGE});
        this.fetchInitData(getRoomUtilities);
        break;
      case 'extraFees':
        this.setState( {nameModal: STRINGS.ADD_ROOM_UTILITIES_IN_ROOM_PAGE});
        this.fetchInitData(getExtraFees);
        break;
    }
  }

  onUpdateParent = () => {
    const { selected } = this.state;
    const selectedList = this.state.list.filter(item => {
      return selected.indexOf(item.id) >= 0;
    });
    this.props.onChange(this.props.type, selected, selectedList);
  };

  onChange = checkedValues => {
    this.setState({
      selected: checkedValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < this.state.list.length),
      checkAll: checkedValues.length === this.state.list.length,
    }, () => {
      this.onUpdateParent();
    });
  };



  onCheckAllChange = (e) => {
    const { list } = this.state;
    this.setState({
      selected: e.target.checked ? list.map(item => item.id) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => {
      this.onUpdateParent();
    });
  };

  isDisabled = id => {
    return this.state.selected.indexOf(id) < 0;
  };

  onChangeInput = (name, value) => {
    let { list } = this.state;
    list[Number(name)].cost = value;
    this.setState({list}, () => {
      this.onUpdateParent();
    });
  };


  render() {
    const { list, selected} = this.state;
    return(
        <div className="add-fees-wrapper">
          <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
          >
            Tất cả
          </Checkbox>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={selected}>
            <Row>
              {
                !!list.length && list.map((item, index) => (
                    <Col span={12} key={item.id}>
                      <Checkbox value={item.id}>
                        <div className="checkbox-text">
                          { item.icon_link && <img src={item.icon_link} className="icon-item" />}
                          <span className="break-word">{item.name}</span>
                        </div>
                        <InputNumber
                            name={index.toString()}
                            description={item.unit || ''}
                            value={item.cost || 0}
                            disabled={this.isDisabled(item.id)}
                            onChange={this.onChangeInput}
                        />
                      </Checkbox>
                    </Col>))
              }
            </Row>
          </Checkbox.Group>
        </div>
    );
  }
}

AddFees.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.array,
  onChange: PropTypes.func
};

AddFees.defaultProps = {
  type: '',
  selected: [],
  onChange: f => f
};

export default injectIntl(withRouter(connect()(AddFees)));