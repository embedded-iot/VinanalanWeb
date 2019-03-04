import PropTypes from "prop-types";
import React, { Component } from "react";
import {Modal, Row, Col, Input, Select, Button, notification} from "antd";
import * as Services from "./UsersServices";
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {spinActions} from "../../../actions";
import * as CONSTANTS from "../../Constants";

const Option = Select.Option;

const STRINGS = {
  VIEW_USER: <FormattedMessage id="VIEW_USER" />,
  USER_FULL_NAME: <FormattedMessage id="USER_FULL_NAME" />,
  EMAIL: <FormattedMessage id="EMAIL" />,
  PHONE: <FormattedMessage id="PHONE" />,
  USER_PERMISSION: <FormattedMessage id="USER_PERMISSION" />,
  ADMIN: <FormattedMessage id="ADMIN" />,
  MANAGER: <FormattedMessage id="MANAGER" />,
  STAFF: <FormattedMessage id="STAFF" />,
  HOME_MANAGER: <FormattedMessage id="HOME_MANAGER" />,
  WORKING_TIME: <FormattedMessage id="WORKING_TIME" />,
  FULL_TIME: <FormattedMessage id="FULL_TIME" />,
  PART_TIME: <FormattedMessage id="PART_TIME" />,
  USER_TITLE: <FormattedMessage id="USER_TITLE" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,

  ADD_USER: <FormattedMessage id="ADD_USER" />,
  EDIT_USER: <FormattedMessage id="EDIT_HOME_CATALOG" />,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  CREATE: <FormattedMessage id="CREATE" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        catalogName: '',
        catalogDescription: '',
        isActive: true,
        ...props.selected
      },
      isEdit: Object.getOwnPropertyNames(props.selected).length,
      isSubmitted: false
    };
  }

  onChangeName = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, catalogName: value };
    this.setState({ selected: selected});
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    const selected = {...this.state.selected, catalogDescription: value };
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
    if (!selected.catalogName || !selected.catalogDescription) return;

    dispatch(spinActions.showSpin());
    if (isEdit) {
      Services.editUser(selected.id, selected, response => {
        dispatch(spinActions.hideSpin());
        this.openNotification('success', intl.formatMessage({ id: 'EDIT_USER_SUCCESS' }));
        onChangeVisible(true);
      }, error => {
        dispatch(spinActions.hideSpin());
        this.openNotification('error', intl.formatMessage({ id: 'EDIT_HOME_CATALOG_FAIL' }));
      });
    } else {
      Services.createUser({...selected, userId: user.id},response => {
          dispatch(spinActions.hideSpin());
          this.openNotification('success', intl.formatMessage({ id: 'ADD_USER_SUCCESS' }));
          onChangeVisible(true);
        },
        er => {
          dispatch(spinActions.hideSpin());
          this.openNotification('error', intl.formatMessage({ id: 'ADD_USER_FAIL' }));
        }
      );
    }
  };

  render() {
    const {selected, isEdit, isSubmitted} = this.state;
    const { name, email, role, phoneNumber, title, isActive, typeJob} = selected;
    const { onChangeVisible} = this.props;
    const [ , ...workingTimes] = CONSTANTS.WORKING_TIME;
    const [ , ...titles] = CONSTANTS.USER_TITLE;
    const [ , ...status] = CONSTANTS.STATUS;
    return (
      <Modal title={ isEdit ? STRINGS.EDIT_HOME_CATALOG : STRINGS.ADD_USER}
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
          <Col span={8}>{STRINGS.USER_FULL_NAME}</Col>
          <Col span={16}>
            <Input value={name} onChange={this.onChangeName} />
            { isSubmitted && !name && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.EMAIL}</Col>
          <Col span={16}>
            <Input value={email} onChange={this.onChangeName} />
            { isSubmitted && !email && <span style={{color: 'red'}}>{STRINGS.REQUIRED_ALERT}</span>}
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.PHONE}</Col>
          <Col span={16}><Input value={phoneNumber} onChange={this.onChangeName} /></Col>
        </Row>
        <Row>
          <Col span={8}>{ STRINGS.WORKING_TIME}</Col>
          <Col span={16}>
            <Select defaultValue={typeJob || workingTimes[0].value} onChange={this.setStatus}>
              {workingTimes.map((item, index) => <Option key={index} value={item.value}>{item.text}</Option>)}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{ STRINGS.USER_TITLE}</Col>
          <Col span={16}>
            <Select defaultValue={title || titles[0].value} onChange={this.setStatus}>
              {titles.map((item, index) => <Option key={index} value={item.value}>{item.text}</Option>)}
            </Select>
          </Col>
        </Row>
        {/*<Row>
          <Col span={8}>{STRINGS.USER_PERMISSION}</Col>
          <Col span={16}>
            <Select defaultValue={Number(role)} onChange={this.setStatus}>
              {status.map((item, index) => <Option key={index} value={item.value}>{item.title}</Option>)}
            </Select>
          </Col>
        </Row>*/}
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

AddUser.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = function (state) {
  return {
    user: state.authentication.user
  }
}


export default injectIntl(connect(mapStateToProps)(AddUser));
