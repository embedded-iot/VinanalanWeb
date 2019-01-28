import React, {Component} from "react";
import {connect} from 'react-redux';
import './RoomDetail.scss'
import * as Service from './RoomServices'
import {Link} from 'react-router-dom';
import {showModal, success} from "../../../actions";
import BookRoomModal from './BookRoomModal';

class RoomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            isShowModal: false
        }
    }

    componentWillMount = () => {
      this.getRoomByid();
    }

    getRoomByid = () =>{
        const {roomId} = this.props.match.params;
        Service.getRoomById(roomId, res => {
            if (res.data.data)
                this.setState({selected: res.data.data});
        }, er => {
        })
    }
    handleAciton = (key) => {
        const data = this.state.selected;
        const props = this.props;
        props.showModal(`Are you sure you want to ${key} the room?`, confirm => {
            switch (key) {
                case 'finish':
                    Service.unLookRoom(data.id, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'edit':
                    Service.lookRoom(data.id, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'check in':
                    Service.checkInRoom(data.currentReservation, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'check out':
                    Service.checkOutRoom(data.currentReservation, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'cancel':
                    Service.checkOutRoom(data.currentReservation, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                default :
                    break;
            }
        })
    }

    handleShowPopUp = () => {
        this.setState({isShowModal: true});
    }
    handleClosePopUp = () => {
        this.getRoomByid();
        this.setState({isShowModal: false});
    }

    render() {
        const {roomId} = this.props.match.params;
        const {selected, isShowModal} = this.state;
        return (

            <div>
                {selected && selected.room && selected.room.homeId ?
                    <div className="room-detail">
                        <div className="title">
                            <Link to="/Room">
                                <button className="btn btn-primary" style={{marginRight: '20px', width: '120px'}}>
                                    <span className="glyphicon glyphicon-arrow-left"></span>&nbsp; &nbsp;Back
                                </button>
                            </Link>
                            <span>{selected.room.homes.homeName} : {selected.room.roomName}</span></div>
                        <div className="group-roomdetail">
                            <div className="header">Room Detail</div>
                            <div className="room-info">
                                <div className="row">
                                    <div className="col-lg-4" style={styleHeader}>Room info</div>
                                    <div className="col-lg-8"></div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Image:</div>
                                    <div
                                        className="col-lg-8">{selected.roomMedia && selected.roomMedia.images && selected.roomMedia.images.map(item => {
                                        return (
                                            <img style={{height: '80px'}} src={item}></img>
                                        );
                                    })}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Room Name:</div>
                                    <div className="col-lg-8">{selected.room.roomName}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Tower:</div>
                                    <div className="col-lg-8">{selected.room.homes.homeName}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Highlight:</div>
                                    <div className="col-lg-8">{selected.room.roomHighlight}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Description:</div>
                                    <div className="col-lg-8">{selected.room.roomDescription}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Price:</div>
                                    <div className="col-lg-8">{selected.room.roomPrice} VND</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Capacity:</div>
                                    <div className="col-lg-8">{selected.room.maxGuest}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Discount:</div>
                                    <div className="col-lg-8">{selected.room.discount} %</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Room private:</div>
                                    <div className="col-lg-8">{selected.room.isPrivate ? 'Yes' : 'No'}</div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">Bathroom:</div>
                                    <div className="col-lg-8">{selected.room.bathroomNumber}</div>
                                </div>
                            </div>

                            <div className="contact-info">
                                {(selected.room.roomStatus === 2 || selected.room.roomStatus === 3) ? <div>
                                    <div className="row">
                                        <div className="col-lg-4" style={styleHeader}>Contact info</div>
                                        <div className="col-lg-8"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Name:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerName}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Customer:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerEmail}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Phone:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerPhone}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">No Passport:</div>
                                        <div
                                            className="col-lg-8">{selected.reservation.customer.customerPassportId}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Birthday:</div>
                                        <div className="col-lg-8">22/10/2019</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Check-in:</div>
                                        <div className="col-lg-8">{selected.reservation.checkin}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Check-out:</div>
                                        <div className="col-lg-8">{selected.reservation.checkout}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Paid:</div>
                                        <div className="col-lg-8">
                                            {selected.reservation.totalMoney - selected.reservation.remainMoney} VND</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Payment:</div>
                                        <div className="col-lg-8">{selected.reservation.periodPayment}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Channel:</div>
                                        <div className="col-lg-8">{selected.reservation.bookingSource}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Person:</div>
                                        <div className="col-lg-8">{selected.reservation.customer.customerName}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">Notes:</div>
                                        <div className="col-lg-8">N/A</div>
                                    </div>
                                </div> : <div style={{height: '525px'}}></div>}
                                {selected.room.roomStatus === 1 &&
                                <div className="row">
                                    <div className="col-lg-6">
                                        <button className='btn btn-danger'
                                                onClick={() => this.handleAciton('edit')}>Edit
                                        </button>
                                    </div>
                                    <div className="col-lg-6">
                                        <button className='btn btn-success' onClick={this.handleShowPopUp}>Book</button>
                                    </div>
                                </div>}

                                {selected.room.roomStatus === 2 &&
                                <div className="row">
                                    <div className="col-lg-6">
                                        <button className='btn btn-danger' onClick={()=> this.handleAciton("cancel")}>Cancel</button>
                                    </div>
                                    <div className="col-lg-6">
                                        <button className='btn btn-success'
                                                onClick={() => this.handleAciton('check in')}>Check In
                                        </button>
                                    </div>
                                </div>}

                                {selected.room.roomStatus === 3 &&
                                <div className="row">
                                    <div className="col-lg-6">
                                        <button className='btn btn-danger'
                                                onClick={() => this.handleAciton('check out')}>Check
                                            Out
                                        </button>
                                    </div>
                                    <div className="col-lg-6">
                                        <button className='btn btn-success' onClick={this.handleShowPopUp}>Expand</button>
                                    </div>
                                </div>}

                                {selected.room.roomStatus === 4 &&
                                <div className="row">
                                    <div className="col-lg-6"></div>
                                    <div className="col-lg-6">
                                        <button className='btn btn-success'
                                                onClick={() => this.handleAciton('finish')}>Finish
                                        </button>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="group-history">
                            <div className="header">History</div>
                            <div className="demo"></div>
                            <div className="demo"></div>
                            <div className="demo"></div>
                        </div>

                        <BookRoomModal isShowModal={isShowModal} roomId={roomId}
                                       handleClosePopUp={this.handleClosePopUp}/>

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