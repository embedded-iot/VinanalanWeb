import React, { Component } from "react";
import './AddUtilities.scss'
import PropTypes from "prop-types";
import {Modal, Checkbox, Row, Col} from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {spinActions} from "../../../../actions";
import {getInFurnitures} from "../../../config/InFurnitures/InFurnituresServices";
import {getRoomUtilities} from "../../../config/RoomUtilities/RoomUtilitiesServices";
import {getExtraFees} from "../../../config/ExtraFees/ExtraFeesServices";

const CheckboxGroup = Checkbox.Group;

const STRINGS = {
  ADD_ROOM_UTILITIES_IN_ROOM_PAGE: 'Xin mời chọn tiện ích cho phòng',
  ADD_IN_FURNITURES_IN_ROOM_PAGE: 'Xin mời chọn dịch vụ cho phòng',
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddUtilities extends Component {

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

  onChange = checkedValues => {
    this.setState({
      selected: checkedValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < this.state.list.length),
      checkAll: checkedValues.length === this.state.list.length,
    });
    this.props.onChange(this.props.type, checkedValues);
  };

  onCheckAllChange = (e) => {
    const { list } = this.state;
    this.setState({
      selected: e.target.checked ? list.map(item => item.id) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => {
      this.props.onChange(this.props.type, this.state.selected);
    });
  };

  render() {
    const { list, selected} = this.state;
    return(
        <div className="add-utilities-wrapper">
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
                !!list.length && list.map(item => (
                    <Col span={6} key={item.id}>
                      <Checkbox value={item.id}>
                        <div className="checkbox-text">
                          { item.icon_link && <img src={item.icon_link} className="icon-item" />}
                          <span className="break-word">{item.name}</span>
                        </div>
                      </Checkbox>
                    </Col>))
              }
            </Row>
          </Checkbox.Group>
        </div>
    );
  }
}

AddUtilities.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.array,
  onChange: PropTypes.func
};

AddUtilities.defaultProps = {
  type: '',
  selected: [],
  onChange: f => f
};

export default injectIntl(withRouter(connect()(AddUtilities)));