import React from "react";
import {Col, Row} from "antd";
import OutputNumber from "../../../../components/commons/OutputNumber/OutputNumber";

const totalAfterPayment = reservations => {
  return reservations.reduce((total, item) => total + (item.priceType ? item.roomDatePrice : item.roomMonthPrice) - item.prePayment, 0);
};

export const ViewPaymentDetails = props => {
  const { reservations } = props;
  return (
    <div className="group-box">
      <div className="group-sub-heading">Tóm tắt giá</div>
      <div className="group-content">
        {
          reservations.map(room => (
            <div key={room.id}>
              <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Phòng: {room.roomName}</div>
              <Row>
                <Col span={12}>Giá</Col>
                <Col span={12}>
                  <OutputNumber value={room.priceType ? room.roomDatePrice : room.roomMonthPrice} unit="VNĐ" />
                </Col>
              </Row>
              { !!room.prePayment && (
                <Row>
                  <Col span={12}>Đặt trước</Col>
                  <Col span={12}>
                    <OutputNumber value={room.prePayment} unit="VNĐ" />
                  </Col>
                </Row>
              )}
            </div>
          ))
        }
        <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Số tiền chưa thanh toán: :<span className="is-required"><OutputNumber value={ totalAfterPayment(reservations)} unit="VNĐ" /></span></div>
      </div>
    </div>
  );
};

ViewPaymentDetails.defaultProps = {
  reservations: []
};