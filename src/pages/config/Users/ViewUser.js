import PropTypes from "prop-types";
import React from "react";
import { Modal, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import * as CONSTANTS from '../../Constants';

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
  CLOSE: <FormattedMessage id="CLOSE" />
};

const getNameByValue = (list, searchValue) => {
  let result = list.find(item => item.value === searchValue);
  return result ? result.text : searchValue;
}

const ViewUser = (props) => {
  const { onChangeVisible, selected } = props;
  const { userName, email, role, phoneNumber, title, isActive, typeJob } = selected;
  return (
    <Modal title={STRINGS.VIEW_USER}
           className="modal-view-details"
           centered
           width="600px"
           visible={true}
           cancelText={STRINGS.CLOSE}
           maskClosable={false}
           onCancel={() => onChangeVisible()}
    >
      <Row>
        <Col span={8}>{STRINGS.USER_FULL_NAME}</Col>
        <Col span={16}>{userName}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.EMAIL}</Col>
        <Col span={16}>{email}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.PHONE}</Col>
        <Col span={16}>{phoneNumber}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.WORKING_TIME}</Col>
        <Col span={16}>{getNameByValue(CONSTANTS.WORKING_TIME, typeJob)}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.USER_TITLE}</Col>
        <Col span={16}>{getNameByValue(CONSTANTS.USER_TITLE, title)}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.STATUS}</Col>
        <Col span={16}>{getNameByValue(CONSTANTS.STATUS, isActive)}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.USER_PERMISSION}</Col>
        <Col span={16}>{role}</Col>
      </Row>
    </Modal>
  );
}

ViewUser.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewUser.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewUser;
