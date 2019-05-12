import PropTypes from "prop-types";
import React from "react";
import {Modal, Row, Col} from "antd";
import {FormattedMessage} from "react-intl";

const STRINGS = {
  VIEW_ROOM_UTILITY: <FormattedMessage id="VIEW_ROOM_UTILITY" />,
  UTILITY_NAME: <FormattedMessage id="UTILITY_NAME" />,
  DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  UPDATE_BY: <FormattedMessage id="UPDATE_BY" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const ViewRoomUtility = (props) => {
  const { onChangeVisible, selected} = props;
  const { name, description, icon_link, isActive} = selected;
  return (
    <Modal title={ STRINGS.VIEW_ROOM_UTILITY}
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
        <Col span={8}>{STRINGS.UTILITY_NAME}</Col>
        <Col span={16}>{name}</Col>
      </Row>
      <Row>
        <Col span={8}>{ STRINGS.DESCRIPTION}</Col>
        <Col span={16}>
          {description || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8}>Icon</Col>
        <Col span={16}>
          { icon_link ? <img src={icon_link} style={{width: '32px', height: '32px'}}/> : '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8}>{STRINGS.STATUS}</Col>
        <Col span={16}>{ isActive ? STRINGS.ACTION_ACTIVE: STRINGS.ACTION_DEACTIVE }</Col>
      </Row>
    </Modal>
  );
}

ViewRoomUtility.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewRoomUtility.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewRoomUtility;
