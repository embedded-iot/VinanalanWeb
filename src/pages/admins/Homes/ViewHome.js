import PropTypes from "prop-types";
import React from "react";
import {Modal, Row, Col} from "antd";
import {FormattedMessage} from "react-intl";
import * as CONSTANTS from '../../Constants';

const STRINGS = {
  VIEW_HOME_CATALOG: <FormattedMessage id="VIEW_HOME_CATALOG" />,
  HOME_CATALOG_NAME: <FormattedMessage id="HOME_CATALOG_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  UPDATE_BY: <FormattedMessage id="UPDATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const getNameByValue = (list, searchValue) => {
  let result = list.find(item => item.value === searchValue);
  return result ? result.text : '-';
}

const ViewHome = (props) => {
  const { onChangeVisible, selected} = props;
  const { catalogName, catalogDescription, isActive} = selected;
  return (
    <Modal title={ STRINGS.VIEW_HOME_CATALOG}
           className="modal-view-details"
           centered
           width="600px"
           visible={true}
           cancelText={STRINGS.CLOSE}
           maskClosable={false}
           okText={STRINGS.UPDATE_BY}
           onOk={() => {onChangeVisible(); props.onOk(selected.id)}}
           onCancel={() => onChangeVisible()}
    >
      <Row>
        <Col span={8}>{STRINGS.HOME_CATALOG_NAME}</Col>
        <Col span={16}>{catalogName}</Col>
      </Row>
      <Row>
        <Col span={8}>{ STRINGS.DESCRIPTION}</Col>
        <Col span={16}>{catalogDescription}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.STATUS}</Col>
        <Col span={16}>{ getNameByValue(CONSTANTS.STATUS, isActive) }</Col>
      </Row>
    </Modal>
  );
}

ViewHome.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewHome.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewHome;
