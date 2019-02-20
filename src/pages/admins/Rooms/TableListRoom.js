import React, { Component } from "react";
import user_ic from "../../../public/images/icons/user_ic.png";
import { error, showModal, success } from "../../../actions";
import { connect } from 'react-redux';
import * as CONSTANTS from '../../../constants/commonConstant';
import ModalConfirm from './ModalConfirm';
import { withRouter, Link } from 'react-router-dom';
import * as Service from './RoomServices';
import UltimatePagination from "react-ultimate-pagination-bootstrap-4";
import BookRoomModal from './BookRoomModal';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    CHECK_IN_OUT: <FormattedMessage id="CHECK_IN_OUT" />,
    NUMBER_OF_GUEST: <FormattedMessage id="NUMBER_OF_GUEST" />,
    PRICE_OF_ROOM: <FormattedMessage id="PRICE_OF_ROOM" />,
    TOTAL_COST: <FormattedMessage id="TOTAL_COST" />,
    CUSTOMER_INFO: <FormattedMessage id="CUSTOMER_INFO" />,
    TOTAL_COST: <FormattedMessage id="TOTAL_COST" />,
    PHONE: <FormattedMessage id="PHONE" />,
    CHECK_IN: <FormattedMessage id="CHECK_IN" />,
    CHECK_OUT: <FormattedMessage id="CHECK_OUT" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    STATUS: <FormattedMessage id="STATUS" />,
    EXPAND: <FormattedMessage id="EXPAND" />,
    EDIT: <FormattedMessage id="EDIT" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
    FINISH: <FormattedMessage id="FINISH" />,
    BOOK_ROOM: <FormattedMessage id="BOOK_ROOM" />,
    CANCELED: <FormattedMessage id="CANCELED" />,
    SELECT_ADD_NEW_TO_ADD_NEW_ROOM: <FormattedMessage id="SELECT_ADD_NEW_TO_ADD_NEW_ROOM" />,
    CHECK_IN_ROOM: <FormattedMessage id="CHECK_IN_ROOM" />,
    CHECK_OUT_ROOM: <FormattedMessage id="CHECK_OUT_ROOM" />,
    LOOKING_ROOM: <FormattedMessage id="LOOKING_ROOM" />,
    ROOM_INFOMATION: <FormattedMessage id="ROOM_INFOMATION" />,
    CURRENT_INFOMATION: <FormattedMessage id="CURRENT_INFOMATION" />,
}
const styleUpRow = {
    width: '250px'
}


const styleHanna = {
    width: '100%',
    borderRight: 'none',
    borderRadius: '10px'
}

const RoomItem = props => {
    const { data, revervation, fixHover } = props;
    const isUserInfo = data.roomStatus === 2 || data.roomStatus === 3;
    const styleClass = data.roomStatus;
    const handleAciton = (key) => {
        props.showModal(`Are you sure you want to ${key} the room?`, confirm => {
            switch (key) {
                case 'finish':
                    Service.unLookRoom(data.id, res => {
                        props.onUpdate();
                        props.success("Success");
                    }, er => {
                        error("Error")
                    })
                    break;
                case 'edit':
                    Service.lookRoom(data.id, res => {
                        props.onUpdate();
                        props.success("Success");
                    }, er => {
                        error("Error")
                    })
                    break;
                case 'checkin':
                    Service.checkInRoom(revervation.id, res => {
                        props.onUpdate();
                        props.success("Success");
                    }, er => {
                        error("Error")
                    })
                    break;
                case 'checkout':
                    Service.checkOutRoom(revervation.id, res => {
                        props.onUpdate();
                        props.success("Success");
                    }, er => {
                        error("Error")
                    })
                    break;
                case 'cancel':
                    Service.cancelRoom(revervation.id, res => {
                        props.onUpdate();
                        props.success("Success");
                    }, er => {
                        error("Error")
                    })
                    break;
                default:
                    break;
            }
        })
    }
    const str = "room-item backgroud_color" + styleClass;
    return (
        <div
            className={str}
            style={props.style ? { marginLeft: '0px' } : {}}>
            <div className="content"
                onClick={() => props.onClick(data.id)}
                onMouseOver={() => props.getRevervationByID(data.currentReservation)}>
                <img src={user_ic} />
                <div>{data.roomName}</div>
            </div>

            <div
                className={(fixHover === 1 && isUserInfo) ? "up-arrow rowright" : fixHover === 2 ? "up-arrow rowleft" : "up-arrow"}
                style={!isUserInfo ? styleUpRow : {}}>
                <div className='hanna-confirmed' style={!isUserInfo ? styleHanna : {}}>
                    <div className='header' style={!isUserInfo ? { borderTopRightRadius: '10px' } : {}}>
                        <div className='row'>
                            <div className='col-lg-12'>{STRINGS.ROOM_INFOMATION}</div>
                        </div>
                    </div>
                    <div className='content'>
                        {isUserInfo && <div className='row'>
                            <div className='col-lg-12' style={styleCustomEmail}><span>{STRINGS.CHECK_IN_OUT}: &nbsp;
                                {(new Date(revervation.checkin)).toLocaleDateString()}- {(new Date(revervation.checkout)).toLocaleDateString()}
                            </span></div>
                        </div>}

                        {!isUserInfo && <div className='row'>
                            <div className='col-lg-12'><span>{STRINGS.DESCRIPTION}: {data.roomDescription}</span></div>
                        </div>}

                        <div className='row'>
                            <div className='col-lg-12'><span>{STRINGS.NUMBER_OF_GUEST}: {data.maxGuest}</span></div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-12'><span>{STRINGS.PRICE_OF_ROOM}: {data.roomPrice && data.roomPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} &nbsp;Vnd</span></div>
                        </div>

                        {isUserInfo && <div className='row'>
                            <div className='col-lg-12'><span>{STRINGS.TOTAL_COST}: {revervation.totalMoney && revervation.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} &nbsp;Vnd</span></div>
                        </div>}

                        {!isUserInfo &&
                            <div className="row">
                                {data.roomStatus === 4 ?
                                    <div className='col-lg-12'>
                                        <button className='btn btn-finish finish'
                                            onClick={() => handleAciton("finish")}>{STRINGS.FINISH}
                                        </button>
                                    </div> :
                                    (<div className='col-lg-12'>
                                        <button className='btn btn-finish edit'
                                            onClick={() => handleAciton("edit")}>{STRINGS.LOOKING_ROOM}
                                        </button>
                                        <button className='btn btn-finish  book'
                                            onClick={() => props.handleOpenPopUpBookRoom(data.id)}>{STRINGS.BOOK_ROOM}
                                        </button>
                                    </div>)
                                }
                            </div>
                        }
                    </div>

                </div>

                {isUserInfo && <div className='contract-info' style={{ float: 'left' }}>
                    <div className='header'>
                        <div className='row'>
                            <div className='col-lg-12'>{STRINGS.CURRENT_INFOMATION}</div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='row'>
                            <div className='col-lg-12' style={styleCustomEmail}>
                                <span>{STRINGS.CUSTOMER_INFO}: {revervation.customer && revervation.customer.customerEmail}</span>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <span>{STRINGS.PHONE}: {revervation.customer && revervation.customer.customerPhone}</span></div>
                        </div>

                        <div className='row'>
                            &nbsp; {/* <div className='col-lg-12'><span>{STRINGS.STATUS}: {revervation.reservationStatus}</span></div> */}
                        </div>

                        {data.roomStatus === 2 ? <div className='row'>
                            <div className='col-lg-6'>
                                <button className='btn btn-finish edit'
                                    onClick={() => handleAciton("cancel")}>{STRINGS.CANCELED}
                                </button>
                            </div>
                            <div className='col-lg-6'>
                                <button className='btn btn-finish book'
                                    onClick={() => handleAciton("checkin")}>{STRINGS.CHECK_IN_ROOM}
                                </button>
                            </div>
                        </div>
                            :
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <button className='btn btn-finish edit'
                                        onClick={() => handleAciton("checkout")}>{STRINGS.CHECK_OUT_ROOM}
                                    </button>
                                </div>
                                <div className='col-lg-6'>
                                    <button className='btn btn-finish book'
                                        onClick={() => props.handleOpenPopUpBookRoom(data.id)}>{STRINGS.EXPAND}
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>}
            </div>
        </div>
    );
}


class TableListRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listRoom: [],
            revervation: {},
            isShowModal: false,
            isShowModalBookRoom: false,
            roomId: '',
            modal: {
                title: '',
                message: ''
            },
        }
    }

    listRevervation = [];

    componentDidMount() {
        Service.getAllRevervation(res => {
            this.listRevervation = res.data.data;
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.listRooms) {
            this.setState({ listRoom: nextProps.listRooms });
        }
    }

    handlelookUp = (id) => {
        this.setState({
            modal: {
                title: CONSTANTS.LOCK_ROOM,
                message: 'Do you want to lock this room?',
                id: id
            },
            isShowModal: true
        });
    }

    handleConstructingRoom = (id) => {
        this.setState({
            modal: {
                title: CONSTANTS.CONSTRUCTING_ROOM,
                message: 'Do you want to change this room to contructing state ?',
                id: id
            },
            isShowModal: true
        });
    }
    handleClosePopUp = () => {
        this.setState({ isShowModal: false });
    }
    handleClosePopUpBookRoom = () => {
        Service.getAllRevervation(res => {
            this.listRevervation = res.data.data;
        })
        this.props.onUpdate();
        this.setState({ isShowModalBookRoom: false });
    }
    handleOpenPopUpBookRoom = (roomId) => {
        this.setState({ isShowModalBookRoom: true, roomId: roomId });
    }

    onClick = (value) => {
        this.props.history.push(`/RoomDetail/${value}`);
    }

    getRevervationByID = (value) => {
        if (value) {
            for (let i = 0; i < this.listRevervation.length; i++) {
                if (this.listRevervation[i].id === value) {
                    this.setState({ revervation: this.listRevervation[i] });
                    break;
                }
            }
        } else {
            if (this.state.revervation) this.setState({ revervation: {} })
        }
    }

    fixHover = (k) => {
        let fix = 0;
        if (k % 7 === 0) {
            const yyy = k / 7;
            if (yyy % 2 === 0) {
                fix = 2;
            } else {
                fix = 1
            }
        }
        if (k % 8 === 0 && k > 7) {
            fix = 2;
        }
        if ((k + 1) % 8 === 0 && k > 7) {
            fix = 1;
        }
        return fix;
    }

    render() {
        const { listRoom, isShowModal, modal, revervation, isShowModalBookRoom, roomId } = this.state;
        const { showModal, success, onUpdate, handleChangePage, currentPage, totalPage } = this.props;
        return (
            <div>
                {listRoom.length ?
                    <div className="content">
                        <div className='table-room-list'>
                            {listRoom.map((item, k) => {
                                let fix = this.fixHover(k);
                                return (
                                    <RoomItem key={k} style={k % 8 === 0 ? true : false} data={item}
                                        handlelookUp={this.handlelookUp}
                                        handleConstructingRoom={this.handleConstructingRoom}
                                        onClick={this.onClick}
                                        showModal={showModal}
                                        success={success}
                                        onUpdate={onUpdate}
                                        getRevervationByID={this.getRevervationByID}
                                        revervation={revervation}
                                        fixHover={fix}
                                        handleOpenPopUpBookRoom={this.handleOpenPopUpBookRoom}

                                    />
                                );
                            })}
                        </div>
                        <div className="pagination-room">
                            <UltimatePagination
                                currentPage={currentPage}
                                totalPages={totalPage ? totalPage : 16}
                                onChange={handleChangePage}
                            />
                        </div>
                    </div> : <div className="box-nocontent">
                        {STRINGS.SELECT_ADD_NEW_TO_ADD_NEW_ROOM}
                    </div>}
                <ModalConfirm isShowModal={isShowModal}
                    handleClosePopUp={this.handleClosePopUp} modal={modal} />
                <BookRoomModal isShowModal={isShowModalBookRoom} roomId={roomId}
                    handleClosePopUp={this.handleClosePopUpBookRoom} />
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        error: (message) => {
            dispatch(error(message));
        },
        success: (message) => {
            dispatch(success(message));
        },
        showModal: (message, confirm) => {
            dispatch(showModal(message, confirm))
        }
    }
}

const styleCustomEmail = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
}

export default withRouter(connect(null, mapDispatchToProps)(TableListRoom));
