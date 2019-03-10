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
      nameModal: ''
    }
  }

  fetchInitData = service => {
    const { dispatch} = this.props;
    dispatch(spinActions.showSpin());
    let param = {skip: 0, limit: 100};
    return service(param, response => {
      dispatch(spinActions.hideSpin());
      if (response.data && response.data.length) {
        this.setState({list: response.data})
      }
    }, error => {
      dispatch(spinActions.hideSpin());
    })
  }

  componentWillMount() {
    const { type} = this.props;

    switch (type) {
      case 'income_utilities':
        this.setState( {nameModal: 'Xin mời chọn tiện ích trong cho toà nhà'});
        this.fetchInitData(getIncomeUtilities);
        break;
      case 'outcome_utilities':
        this.setState( {nameModal: 'Xin mời chọn tiện ích ngoài cho toà nhà'});
        this.fetchInitData(getOutcomeUtilities);
        break;
      default:
        this.setState( {nameModal: 'Xin mời chọn phụ phí cho toà nhà'});
        this.fetchInitData(getExtraFees);
    }
  }

  onChange = checkedValues => {
    console.log(checkedValues);
  }


  render() {
    const { onCancel, selected} = this.props;
    const { list} = this.state;
    const { nameModal } = this.state;
    return(
      <Modal title={ nameModal }
             centered
             width="800px"
             visible={true}
             okText={STRINGS.SAVE}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => this.saveUtilities()}
             onCancel={() => onCancel()}
      >
        <div className="add-utilities-wrapper">
          { list.length && (
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
              <Row>
                {
                  list.map(item => (
                    <Col span={8} key={item.id}>
                      <Checkbox value={item.id}>{item.name}</Checkbox>
                      { item.icon_link && <img src={item.icon_link} style={{width: '32px', height: '32px'}}/>}
                    </Col>))
                }
              </Row>
            </Checkbox.Group>
            )
          }
        </div>
      </Modal>
    );
  }
}

AddUtilities.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.array,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

AddUtilities.defaultProps = {
  type: '',
  selected: [],
  onOk: f => f,
  onCancel: f => f
}

export default injectIntl(withRouter(connect()(AddUtilities)));