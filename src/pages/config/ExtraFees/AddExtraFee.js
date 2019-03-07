import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./ExtraFeesServices";
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from '../../Constants';

const Option = Select.Option;

const STRINGS = {
  ADD_EXTRA_FEE: <FormattedMessage id="ADD_EXTRA_FEE" />,
  EDIT_EXTRA_FEE: <FormattedMessage id="EDIT_EXTRA_FEE" />,
  EXTRA_FEE_NAME: <FormattedMessage id="EXTRA_FEE_NAME" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  CREATE: <FormattedMessage id="CREATE" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};


class AddExtraFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        name: '',
        icon_link: '',
        isActive: true,
        ...props.selected
      },
      isEdit: Object.getOwnPropertyNames(props.selected).length,
      isSubmitted: false
    };
  }

  onChangeName = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, name: value };
    this.setState({ selected: selected});
  }

  onChangeIconLink = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, icon_link: value };
    this.setState({ selected: selected});
  }

  setStatus = status => {
    const selected = {...this.state.selected, isActive: !!status };
    this.setState({ selected: selected});
  }

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  handleSubmit = () => {
    const { selected, isEdit } = this.state;
    const { onChangeVisible, intl, dispatch, user } = this.props;
    this,this.setState({isSubmitted: true});
    if (!selected.name) return;

    dispatch(spinActions.showSpin());
    if (isEdit) {
      Services.editExtraFee(selected.id, selected, response => {
        dispatch(spinActions.hideSpin());
        this.openNotification('success', intl.formatMessage({ id: 'EXTRA_FEE_SUCCESS' }));
        onChangeVisible(true);
      }, error => {
        dispatch(spinActions.hideSpin());
        this.openNotification('error', intl.formatMessage({ id: 'EDIT_EXTRA_FEE_FAIL' }));
      });
    } else {
      Services.createExtraFee({...selected, userId: user.id},response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'ADD_EXTRA_FEE_SUCCESS' }));
          onChangeVisible(true);
        },
        er => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'ADD_EXTRA_FEE_FAIL' }));
        }
      );
    }
  };

  render() {
    const {selected, isEdit, isSubmitted} = this.state;
    const { name, icon_link, isActive} = selected;
    const { onChangeVisible} = this.props;
    const [...status] = CONSTANTS.STATUS;
    return (
      <Modal title={ isEdit ? STRINGS.EDIT_EXTRA_FEE : STRINGS.ADD_EXTRA_FEE}
             centered
             width="600px"
             visible={true}
             okText={isEdit ? STRINGS.SAVE : STRINGS.CREATE}
             cancelText={STRINGS.CLOSE}
             maskClosable={false}
             onOk={() => this.handleSubmit()}
             onCancel={() => onChangeVisible()}
      >
        <Row>
          <Col span={8}>{STRINGS.EXTRA_FEE_NAME}<span className="is-required">*</span></Col>
          <Col span={16}>
            <Input value={name} onChange={this.onChangeName} />
            { isSubmitted && !name && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>Icon</Col>
          <Col span={16}><Input value={icon_link} onChange={this.onChangeIconLink} /></Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.STATUS}</Col>
          <Col span={16}>
            <Select defaultValue={Number(isActive)} onChange={this.setStatus}>
              {status.map((item, index) => <Option key={index} value={Number(item.value)}>{item.text}</Option>)}
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

AddExtraFee.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  }
}


export default injectIntl(connect(mapStateToProps)(AddExtraFee));
