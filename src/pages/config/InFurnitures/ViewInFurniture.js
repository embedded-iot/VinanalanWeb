import PropTypes from "prop-types";
import React from "react";
import {Modal, Row, Col} from "antd";
import {FormattedMessage} from "react-intl";

const STRINGS = {
  VIEW_IN_FURNITURE: <FormattedMessage id="VIEW_IN_FURNITURE" />,
  FURNITURE_NAME: <FormattedMessage id="FURNITURE_NAME" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const ViewInFurniture = (props) => {
  const { onChangeVisible, selected} = props;
  const { name, icon_link, isActive} = selected;
  return (
    <Modal title={ STRINGS.VIEW_IN_FURNITURE}
           className="modal-view-details"
           centered
           width="600px"
           visible={true}
           cancelText={STRINGS.CLOSE}
           maskClosable={false}
           onCancel={() => onChangeVisible()}
    >
      <Row>
        <Col span={8}>{STRINGS.FURNITURE_NAME}</Col>
        <Col span={16}>{name}</Col>
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

ViewInFurniture.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewInFurniture.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewInFurniture;
