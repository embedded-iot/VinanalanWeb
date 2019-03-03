import PropTypes from "prop-types";
import React from "react";
import {Modal, Row, Col} from "antd";
import {FormattedMessage} from "react-intl";

const STRINGS = {
  VIEW_ROOM_CATALOG: <FormattedMessage id="VIEW_ROOM_CATALOG" />,
  ROOM_CATALOG_NAME: <FormattedMessage id="ROOM_CATALOG_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const ViewRoomsCatalog = (props) => {
  const { onChangeVisible, selected} = props;
  const { catalogName, catalogDescription, isActive} = selected;
  return (
    <Modal title={ STRINGS.VIEW_ROOM_CATALOG}
           className="modal-view-details"
           centered
           width="600px"
           visible={true}
           cancelText={STRINGS.CLOSE}
           maskClosable={false}
           onCancel={() => onChangeVisible()}
    >
      <Row>
        <Col span={8}>{STRINGS.ROOM_CATALOG_NAME}</Col>
        <Col span={16}>{catalogName}</Col>
      </Row>
      <Row>
        <Col span={8}>{ STRINGS.DESCRIPTION}</Col>
        <Col span={16}>{catalogDescription}</Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.STATUS}</Col>
        <Col span={16}>{ isActive ? STRINGS.ACTION_ACTIVE: STRINGS.ACTION_DEACTIVE }</Col>
      </Row>
    </Modal>
  );
}

ViewRoomsCatalog.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewRoomsCatalog.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewRoomsCatalog;
