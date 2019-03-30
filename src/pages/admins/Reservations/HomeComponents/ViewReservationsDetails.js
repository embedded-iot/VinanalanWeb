import React from "react";

export const ViewReservationsDetails = props => {
  const { reservations } = props;
  return (
    <div className="group-box">
      <div className="group-sub-heading">Chi tiết đặt phòng của bạn</div>
      <div className="group-content">
        <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Nhận phòng:</div>
        <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Trả phòng:</div>
        <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Nhận phòng:</div>
        <div style={{margin: "10px 0 7px", fontWeight: 'bold'}}>Phòng đã chọn:</div>
        {
          reservations.map(room => <div key={room.id}>- {room.roomName}</div>)
        }
      </div>
    </div>
  );
};

ViewReservationsDetails.defaultProps = {
  reservations: []
};