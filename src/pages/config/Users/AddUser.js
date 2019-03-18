import PropTypes from "prop-types";
import React, { Component } from "react";
import { Modal, Row, Col, Input, Select, Button, notification, Radio } from "antd";
import * as Services from "./UsersServices";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { spinActions } from "../../../actions";
import * as CONSTANTS from "../../Constants";
import InputNumber from "../../../components/commons/InputNumber/InputNumber";
import './User.scss'
import InputText from "../../../components/commons/InputText/InputText";
import validator from "validator";
import InputEmail from "../../../components/commons/InputEmail/InputEmail";

const Option = Select.Option;
const RadioGroup = Radio.Group;

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
  EDIT_USER: <FormattedMessage id="EDIT_USER" />,
  REQUIRED_ALERT: <FormattedMessage id="REQUIRED_ALERT" />,
  CREATE: <FormattedMessage id="CREATE" />,
  SAVE: <FormattedMessage id="SAVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const [...workingTimes] = CONSTANTS.WORKING_TIME;
const [...titles] = CONSTANTS.USER_TITLE;
const [...status] = CONSTANTS.STATUS;
const [...permissions] = CONSTANTS.USER_PERMISSION;

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: permissions[0].value,
        title: titles[0].value,
        typeJob: workingTimes[0].value,
        isActive: true,
        ...props.selected
      },
      isEdit: props.selected && Object.getOwnPropertyNames(props.selected).length,
      isSubmitted: false,
      validEmail: false
    };
  }

  componentDidMount() {
    const { selected } = this.state;
    console.log(validator.isEmail(selected.email))
    this.setState({validEmail: validator.isEmail(selected.email)})
  }

  onChangeInput = (name, value) => {
    let selected = { ...this.state.selected };
    selected[name] = value;
    this.setState({ selected: selected });
  };

  onChangeEmail = (name, value, validate) => {
    const selected = { ...this.state.selected, email: value };
    this.setState({ selected: selected, validEmail: validate });
  };

  onChangePassword = e => {
    const selected = { ...this.state.selected, password: e.target.value };
    this.setState({ selected: selected });
  };

  onChangePhone = (name, value) => {
    const selected = { ...this.state.selected, phoneNumber: value };
    this.setState({ selected: selected });
  };

  setWorkingTime = typeJob => {
    const selected = { ...this.state.selected, typeJob: typeJob };
    this.setState({ selected: selected });
  };

  setUserTitle = title => {
    const selected = { ...this.state.selected, title: title };
    this.setState({ selected: selected });
  };

  setStatus = status => {
    const selected = { ...this.state.selected, isActive: !!status };
    this.setState({ selected: selected });
  };

  onChangeRole = e => {
    const selected = { ...this.state.selected, role: e.target.value };
    this.setState({ selected: selected });
  };

  openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description
    });
  };

  handleSubmit = () => {
    const { selected, isEdit, validEmail } = this.state;
    const { onChangeVisible, intl, dispatch, user } = this.props;
    this.setState({ isSubmitted: true });
    if (!selected.userName || !selected.email || !validEmail) return;
    if (!isEdit && !selected.password) {
      return;
    }
    dispatch(spinActions.showSpin());
    if (isEdit) {
      if (!selected.password) {
        // remove password when update not reset password
        delete selected.password;
      }

      Services.editUser(
        selected,
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({ id: "EDIT_USER_SUCCESS" })
          );
          onChangeVisible(true);
        },
        error => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "error",
            intl.formatMessage({ id: "EDIT_USER_FAIL" })
          );
        }
      );
    } else {
      selected.name = selected.userName;
      let useInfo = {...selected};
      delete useInfo.userName;
      Services.createUser(
        { ...useInfo, userId: user.id },
        response => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "success",
            intl.formatMessage({ id: "ADD_USER_SUCCESS" })
          );
          onChangeVisible(true);
        },
        er => {
          dispatch(spinActions.hideSpin());
          this.openNotification(
            "error",
            intl.formatMessage({ id: "ADD_USER_FAIL" })
          );
        }
      );
    }
  };

  render() {
    const { selected, isEdit, isSubmitted } = this.state;
    const { userName, email, password, role, phoneNumber, title, isActive, typeJob } = selected;
    const { onChangeVisible } = this.props;
    const roles = permissions.map(({ text, value }) => {
      return { label: text, value };
    });
    return (
      <Modal
        title={isEdit ? STRINGS.EDIT_USER : STRINGS.ADD_USER}
        wrapClassName='add-user-modal'
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
          <Col span={8}>
            {STRINGS.USER_FULL_NAME}
            <span className="is-required">*</span>
          </Col>
          <Col span={16}>
            <InputText name='userName' value={userName} isRequired='true' onChange={this.onChangeInput} isSubmitted={isSubmitted}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {STRINGS.EMAIL}
            <span className="is-required">*</span>
          </Col>
          <Col span={16}>
            {/*<Input value={email} onChange={this.onChangeEmail} />
            {isSubmitted && !email && (
              <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>
            )}*/}
            <InputEmail name='email' value={email} isRequired='true' onChange={this.onChangeEmail} isSubmitted={isSubmitted}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            Password {!isEdit && <span className="is-required">*</span>}
          </Col>
          <Col span={16}>
            {!!isEdit && (
              <span style={{ color: "red" }}>
                Trường này chỉ dành cho Reset password cho User.
              </span>
            )}
            {/*<Input value={password} onChange={this.onChangePassword} />
            {!isEdit && isSubmitted && !password && (
              <span style={{ color: "red" }}>{STRINGS.REQUIRED_ALERT}</span>
            )}*/}
            <InputText name='password' value={password} isRequired={!isEdit} onChange={this.onChangeInput} isSubmitted={isSubmitted}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.PHONE}</Col>
          <Col span={16}>
            {/*<Input value={phoneNumber} onChange={this.onChangePhone} />*/}
            <InputNumber type='phone' name="phoneNumber" value={phoneNumber} onChange={this.onChangePhone}/>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.WORKING_TIME}</Col>
          <Col span={16}>
            <Select
              defaultValue={typeJob || workingTimes[0].value}
              onChange={this.setWorkingTime}
            >
              {workingTimes.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.USER_TITLE}</Col>
          <Col span={16}>
            <Select
              defaultValue={title || titles[0].value}
              onChange={this.setUserTitle}
            >
              {titles.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.STATUS}</Col>
          <Col span={16}>
            <Select defaultValue={Number(isActive)} onChange={this.setStatus}>
              {status.map((item, index) => (
                <Option key={index} value={Number(item.value)}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>{STRINGS.USER_PERMISSION}</Col>
          <Col span={16}>
            <RadioGroup
              options={roles}
              onChange={this.onChangeRole}
              value={role}
            />
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

const mapStateToProps = function(state) {
  return {
    user: state.authentication.user
  };
};

export default injectIntl(connect(mapStateToProps)(AddUser));
