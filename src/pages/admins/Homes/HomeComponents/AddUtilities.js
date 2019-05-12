import React, { Component } from "react";
import './AddUtilities.scss'
import PropTypes from "prop-types";
import {Modal, Checkbox, Row, Col} from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {spinActions} from "../../../../actions";
import {getIncomeUtilities} from "../../../config/IncomeUtilities/IncomeUtilitiesServices";
import {getOutcomeUtilities} from "../../../config/OutcomeUtilities/OutcomeUtilitiesServices";
import {getExtraFees} from "../../../config/ExtraFees/ExtraFeesServices";
import {getOutFurnitures} from "../../../config/OutFurnitures/OutFurnituresServices";

const CheckboxGroup = Checkbox.Group;

const STRINGS = {
  ADD_INCOME_UTILITY_IN_HOME_PAGE: 'Xin mời chọn tiện ích trong cho toàn nhà',
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
      case 'income_service':
        this.fetchInitData(getIncomeUtilities);
        break;
      case 'outcome_service':
        this.fetchInitData(getOutcomeUtilities);
        break;
      case 'out_furniture':
        this.fetchInitData(getOutFurnitures);
        break;
      default:
        this.fetchInitData(getExtraFees);
    }
  }

  onChange = checkedValues => {
    this.setState({
      selected: checkedValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < this.state.list.length),
      checkAll: checkedValues.length === this.state.list.length,
    });
  };

  onCheckAllChange = (e) => {
    const { list } = this.state;
    console.log(list);
    this.setState({
      selected: e.target.checked ? list.map(item => item.id) : [],
      indeterminate: false,
      checkAll: e.target.checked,
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
  onChange: PropTypes.func,
}

AddUtilities.defaultProps = {
  type: '',
  selected: [],
  onChange: f => f
};

export default injectIntl(withRouter(connect()(AddUtilities)));