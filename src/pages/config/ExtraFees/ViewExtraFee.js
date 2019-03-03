import PropTypes from "prop-types";
import React from "react";
import {Modal, Row, Col} from "antd";
import {FormattedMessage} from "react-intl";

const STRINGS = {
  VIEW_EXTRA_FEE: <FormattedMessage id="VIEW_EXTRA_FEE" />,
  EXTRA_FEE_NAME: <FormattedMessage id="EXTRA_FEE_NAME" />,
  STATUS: <FormattedMessage id="STATUS" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  CLOSE: <FormattedMessage id="CLOSE" />
};

const ViewExtraFee = (props) => {
  const { onChangeVisible, selected} = props;
  const { name, icon_link, isActive} = selected;
  return (
    <Modal title={ STRINGS.VIEW_EXTRA_FEE}
           className="modal-view-details"
           centered
           width="600px"
           visible={true}
           cancelText={STRINGS.CLOSE}
           maskClosable={false}
           onCancel={() => onChangeVisible()}
    >
      <Row>
        <Col span={8}>{STRINGS.EXTRA_FEE_NAME}</Col>
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

ViewExtraFee.propTypes = {
  selected: PropTypes.object,
  onChangeVisible: PropTypes.func
}

ViewExtraFee.defaultProps = {
  selected: {},
  onChangeVisible: f => f
}

export default ViewExtraFee;