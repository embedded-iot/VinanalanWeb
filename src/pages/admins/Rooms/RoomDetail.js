import React, { Component } from "react";
import { connect } from 'react-redux';
import './RoomDetail.scss'
import * as Service from './RoomServices'
import { Link } from 'react-router-dom';
import { showModal, success } from "../../../actions";
import BookRoomModal from './BookRoomModal';
import AddRoomModal from './AddRoomModal';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    ROOM_NUMBER: <FormattedMessage id="ROOM_NUMBER" />,
    HIGHTLIGHT: <FormattedMessage id="HIGHTLIGHT" />,
    PRICE_OF_ROOM: <FormattedMessage id="PRICE_OF_ROOM" />,
    CAPACITY: <FormattedMessage id="CAPACITY" />,
    DISCOUNT: <FormattedMessage id="DISCOUNT" />,
    ROOM_PRIVATE: <FormattedMessage id="ROOM_PRIVATE" />,
    IMAGES: <FormattedMessage id="IMAGES" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    HOME_NAME: <FormattedMessage id="HOME_NAME" />,
    BATHROOM: <FormattedMessage id="BATHROOM" />,
    ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
    SAVE: <FormattedMessage id="SAVE" />,
    CREATE_NEW_ROOM: <FormattedMessage id="CREATE_NEW_ROOM" />,
    UPDATE_ROOM: <FormattedMessage id="UPDATE_ROOM" />,
    CREATE: <FormattedMessage id="CREATE" />,
    TOWER: <FormattedMessage id="TOWER" />,
    HIGHTLIGHT: <FormattedMessage id="HIGHTLIGHT" />,
    CUSTOMER_NAME: <FormattedMessage id="CUSTOMER_NAME" />,
    ACTION_UPDATE: <FormattedMessage id="ACTION_UPDATE" />,
    ROOM_DETAIL: <FormattedMessage id="ROOM_DETAIL" />,
    ROOM_INFO: <FormattedMessage id="ROOM_INFO" />,
    ROOM_NAME: <FormattedMessage id="ROOM_NAME" />,
    NO_ID_PASSPORT: <FormattedMessage id="NO_ID_PASSPORT" />,
    PAID: <FormattedMessage id="PAID" />,
    CHECK_IN: <FormattedMessage id="CHECK_IN" />,
    CHECK_OUT: <FormattedMessage id="CHECK_OUT" />,
    BIRTH_DAY: <FormattedMessage id="BIRTH_DAY" />,
    PAYMENT_METHOD: <FormattedMessage id="PAYMENT_METHOD" />,
    CHANNEL: <FormattedMessage id="CHANNEL" />,
    PERSON_NUMBER: <FormattedMessage id="PERSON_NUMBER" />,
    NOTES: <FormattedMessage id="NOTES" />,
    FINISH: <FormattedMessage id="FINISH" />,
    EDIT: <FormattedMessage id="EDIT" />,
    EMAIL: <FormattedMessage id="EMAIL" />,
    PHONE: <FormattedMessage id="PHONE" />,
    BOOK_ROOM: <FormattedMessage id="BOOK_ROOM" />,
    EXPAND: <FormattedMessage id="EXPAND" />,
    BACK: <FormattedMessage id="BACK" />,
    CHECK_IN_ROOM: <FormattedMessage id="CHECK_IN_ROOM" />,
    CHECK_OUT_ROOM: <FormattedMessage id="CHECK_OUT_ROOM" />,
    YES: <FormattedMessage id="YES" />,
    NO: <FormattedMessage id="NO" />,
}
class RoomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            isShowModal: false,
            isShowModalEditRoom: false
        }
    }

    componentWillMount = () => {
        this.getRoomByid();
    }

    getRoomByid = () => {
        const { roomId } = this.props.match.params;
        Service.getRoomById(roomId, res => {
            if (res.data.data)
                this.setState({ selected: res.data.data });
        }, er => {
        })
    }
    handleAciton = (key) => {
        const data = this.state.selected;
        const props = this.props;
        props.showModal(`Are you sure you want to ${key} the room?`, confirm => {
            switch (key) {
                case 'finish':
                    Service.unLookRoom(data.room.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'edit':
                    Service.lookRoom(data.room.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'check in':
                    Service.checkInRoom(data.reservation.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'check out':
                    Service.checkOutRoom(data.reservation.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'cancel':
                    Service.cancelRoom(data.reservation.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'update room':
                    Service.upDateRoom(data.reservation.id, res => {
                        this.getRoomByid();
                        props.success("Success");
                    }, er => {
                    })
                    break;
                default:
                    break;
            }
        })
    }

    handleShowPopUp = () => {
        this.setState({ isShowModal: true });
    }
    handleClosePopUp = () => {
        this.getRoomByid();
        this.setState({ isShowModal: false });
    }
    handleShowPopUpEditRoom = () => {
        this.setState({ isShowModalEditRoom: true });
    }
    handleCloseEditRoom = () => {
        this.getRoomByid();
        this.setState({ isShowModalEditRoom: false });
    }

    render() {
        const { roomId } = this.props.match.params;
        const { selected, isShowModal, isShowModalEditRoom } = this.state;
        return (

            <div>
                {selected && selected.room && selected.room.homeId ?
                    <div className="room-detail">
                        <div className="title">
                            <Link to="/Room">
                                <button className="btn btn-primary" style={{ marginRight: '20px', width: '120px' }}>
                                    <span className="glyphicon glyphicon-arrow-left"></span>&nbsp; &nbsp;{STRINGS.BACK}
                                </button>
                            </Link>
                            <span>{selected.room.homes.homeName} : {selected.room.roomName}</span></div>
                        <div className="group-roomdetail">
                            <div className="header">{STRINGS.ROOM_DETAIL}</div>
                            <div className="room-info">
                                <div className="row">
                                    <div className="col-lg-4" style={styleHeader}>{STRINGS.ROOM_INFO}</div>
                                    <div className="col-lg-8"></div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.IMAGES}:</div>
                                    <div
                                        className="col-lg-8">{selected.room.roomMedia && selected.room.roomMedia.images && selected.room.roomMedia.images.map((item, key) => {
                                            return (
                                                <img key={key} style={{ height: '80px', width: '80px' }} src={item}></img>
                                            );
                                        })}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.ROOM_NAME}:</div>
                                    <div className="col-lg-8">{selected.room.roomName}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.TOWER}:</div>
                                    <div className="col-lg-8">{selected.room.homes.homeName}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.HIGHTLIGHT}:</div>
                                    <div className="col-lg-8">{selected.room.roomHighlight}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.DESCRIPTION}:</div>
                                    <div className="col-lg-8">{selected.room.roomDescription}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.PRICE_OF_ROOM}:</div>
                                    <div className="col-lg-8">{selected.room.roomPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VND</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.CAPACITY}:</div>
                                    <div className="col-lg-8">{selected.room.maxGuest}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.DISCOUNT}:</div>
                                    <div className="col-lg-8">{selected.room.discount} %</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.ROOM_PRIVATE}:</div>
                                    <div className="col-lg-8">{selected.room.isPrivate ? STRINGS.YES : STRINGS.NO}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.BATHROOM}:</div>
                                    <div className="col-lg-8">{selected.room.bathroomNumber}</div>
                                </div>
                            </div>

                            <div className="contact-info">
                                {(selected.room.roomStatus === 2 || selected.room.roomStatus === 3) ? <div>
                                    <div className="row">
                                        <div className="col-lg-4" style={styleHeader}>{STRINGS.CUSTOMER_INFO}</div>
                                        <div className="col-lg-8"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.CUSTOMER_NAME}:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerName}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.EMAIL}:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerEmail}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.PHONE}:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerPhone}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.NO_ID_PASSPORT}:</div>
                                        <div
                                            className="col-lg-8">{selected.reservation.customer.customerPassportId}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.BIRTH_DAY}:</div>
                                        <div className="col-lg-8">22/10/2019</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.CHECK_IN_ROOM}:</div>
                                        <div className="col-lg-8">
                                            {(new Date(selected.reservation.checkin)).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.CHECK_OUT_ROOM}:</div>
                                        <div className="col-lg-8">
                                            {(new Date(selected.reservation.checkout)).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.PAID}:</div>
                                        <div className="col-lg-8">
                                            {(selected.reservation.totalMoney -
                                                selected.reservation.remainMoney).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VND
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.PAYMENT_METHOD}</div>
                                        <div className="col-lg-8">{selected.reservation.payMethod}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.CHANNEL}:</div>
                                        <div className="col-lg-8">{selected.reservation.bookingSource}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.PERSON_NUMBER}:</div>
                                        <div className="col-lg-8">{selected.reservation.guestNumber}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">{STRINGS.NOTES}:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.extraInfo}</div>
                                    </div>
                                </div> : <div style={{ height: '525px' }}></div>}
                                {selected.room.roomStatus === 1 &&
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button className='btn btn-danger'
                                                onClick={() => this.handleAciton('edit')}>{STRINGS.EDIT}
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <button className='btn btn-success' onClick={this.handleShowPopUp}>{STRINGS.BOOK_ROOM}</button>
                                        </div>
                                    </div>}

                                {selected.room.roomStatus === 2 &&
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button className='btn btn-danger'
                                                onClick={() => this.handleAciton("cancel")}>{STRINGS.CLOSE}
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <button className='btn btn-success'
                                                onClick={() => this.handleAciton('check in')}>{STRINGS.CHECK_IN_ROOM}
                                            </button>
                                        </div>
                                    </div>}

                                {selected.room.roomStatus === 3 &&
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button className='btn btn-danger'
                                                onClick={() => this.handleAciton('check out')}>
                                                {STRINGS.CHECK_OUT_ROOM}
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <button className='btn btn-success' onClick={this.handleShowPopUp}>{STRINGS.EXPAND}
                                            </button>
                                        </div>
                                    </div>}

                                {selected.room.roomStatus === 4 &&
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button className='btn btn-primary'
                                                onClick={this.handleShowPopUpEditRoom}>{STRINGS.UPDATE_ROOM}
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <button className='btn btn-success'
                                                onClick={() => this.handleAciton('finish')}>{STRINGS.FINISH}
                                            </button>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        {/*<div className="group-history">*/}
                        {/*<div className="header">History</div>*/}
                        {/*<div className="demo"></div>*/}
                        {/*<div className="demo"></div>*/}
                        {/*<div className="demo"></div>*/}
                        {/*</div>*/}
                        <AddRoomModal isShowModal={isShowModalEditRoom} dataUpdate={selected.room}
                            handleClosePopUp={this.handleCloseEditRoom} />
                        <BookRoomModal isShowModal={isShowModal} roomId={roomId}
                            handleClosePopUp={this.handleClosePopUp} />

                    </div>
                    : <div>__is Loadding____</div>}
            </div>
        );
    }
}

const styleHeader = {
    fontWeight: 'bold',
    fontSize: '22px',
    marginBottom: '5px'
}
const mapStateToProps = (state) => ({
    router: state.router
});

const mapDispatchToProps = dispatch => {
    return {
        // error: (message) => {
        //     dispatch(error(message));
        // },
        success: (message) => {
            dispatch(success(message));
        },
        showModal: (message, confirm) => {
            dispatch(showModal(message, confirm))
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(RoomDetail);