import React, {Component} from "react";
import user_ic from "../../../public/images/icons/user_ic.png";
import iconLookUp from '../../../public/images/icons/group-5@2x.png';
import iconLook from '../../../public/images/icons/group-6@2x.png';
import iconSetup from '../../../public/images/icons/group-5-copy@2x.png';
import {error, showModal, success} from "../../../actions";
import {connect} from 'react-redux';
import * as CONSTANTS from '../../../constants/commonConstant';
import ModalConfirm from './ModalConfirm';
import {withRouter, Link} from 'react-router-dom';
import * as Service from './RoomServices';
import UltimatePagination from "react-ultimate-pagination-bootstrap-4";

const styleUpRow = {
    width: '250px'
}


const styleHanna = {
    width: '100%',
    borderRight: 'none',
    borderRadius: '10px'
}

const RoomItem = props => {
    const {data, revervation} = props;
    const isUserInfo = data.roomStatus === 2 || data.roomStatus === 3;
    const styleClass = data.roomStatus;
    const handleAciton = (key) => {
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
                case 'checkin':
                    Service.checkInRoom(revervation.id, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                case 'checkout':
                    Service.checkOutRoom(revervation.id, res => {
                        props.success("Success");
                    }, er => {
                    })
                    break;
                default :
                    break;
            }
            props.onUpdate();
        })
    }
    const romStatus2vs3 = {
        marginLeft: '0',
        left: '-40%'
    }

    const romStatus1vs4 = {
        marginLeft: '0',
        left: '-30%'
    }

    return (
        <div className={`room-item backgroud_color${styleClass}`}
             style={props.style ? {marginLeft: '0px'} : {}}>
            <div className="content"
                 onClick={() => props.onClick(data.id)}
                 onMouseOver={() => props.getRevervationByID(data.currentReservation)}>
                <img src={user_ic}/>
                <div>{data.roomName}</div>
            </div>

            <div className="up-arrow"  class={isUserInfo} style={!isUserInfo ? styleUpRow : {}}>
                <div className='hanna-confirmed' style={!isUserInfo ? styleHanna : {}}>
                    <div className='header' style={!isUserInfo ? {borderTopRightRadius: '10px'} : {}}>
                        <div className='row'>
                            <div className='col-lg-12'><span>Hanna-Confirmed</span></div>
                        </div>
                    </div>
                    <div className='content'>
                        {isUserInfo && <div className='row'>
                            <div className='col-lg-12'><span>Checkin/out:  </span></div>
                        </div>}

                        {!isUserInfo && <div className='row'>
                            <div className='col-lg-12'><span>Description: {data.roomDescription}</span></div>
                        </div>}

                        <div className='row'>
                            <div className='col-lg-12'><span>Guest: {data.maxGuest}</span></div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-12'><span>Price: {data.roomPrice}</span></div>
                        </div>

                        {isUserInfo && <div className='row'>
                            <div className='col-lg-12'><span>Total: </span></div>
                        </div>}

                        {!isUserInfo &&
                        <div className="row">
                            {data.roomStatus === 4 ?
                                <div className='col-lg-12'>
                                    <button className='btn btn-finish finish'
                                            onClick={() => handleAciton("finish")}>Finish
                                    </button>
                                </div> :
                                (<div className='col-lg-12'>
                                    <button className='btn btn-finish edit'
                                            onClick={() => handleAciton("edit")}>Edit
                                    </button>
                                    <Link className='btn btn-finish  book'
                                          to={`BookRoom/${data.id}`}>Book</Link>
                                </div>)
                            }
                        </div>
                        }
                    </div>

                </div>

                {isUserInfo && <div className='contract-info' style={{float: 'left'}}>
                    <div className='header'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Contract Info</span></div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Customer: {revervation.customerName}</span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Status: {revervation.reservationStatus}</span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Phone: {revervation.customerPhone}</span></div>
                        </div>
                        {data.roomStatus === 2 ? <div className='row'>
                                <div className='col-lg-6'><Link className='btn btn-finish edit'
                                                                to={`RoomDetail/${data.id}`}>Cancel</Link>
                                </div>
                                <div className='col-lg-6'>
                                    <button className='btn btn-finish book'
                                            onClick={() => handleAciton("checkin")}>Check-In
                                    </button>
                                </div>
                            </div>
                            :
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <button className='btn btn-finish edit'
                                            onClick={() => handleAciton("checkout")}>Check Out
                                    </button>
                                </div>
                                <div className='col-lg-6'><Link className='btn btn-finish book'
                                                                to={`BookRoom/${data.id}`}>Expand</Link>
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
            this.setState({listRoom: nextProps.listRooms});
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
        this.setState({isShowModal: false});
    }
    onClick = (value) => {
        this.props.history.push(`/RoomDetail/${value}`);
    }

    getRevervationByID = (value) => {
        if (value) {
            for (let i = 0; i < this.listRevervation.length; i++) {
                if (this.listRevervation[i].id === value) {
                    this.setState({revervation: this.listRevervation[i]});
                    break;
                }
            }
        } else {
            if (this.state.revervation) this.setState({revervation: {}})
        }
    }

    render() {
        const {listRoom, isShowModal, modal, revervation} = this.state;
        const {showModal, success, onUpdate, handleChangePage, currentPage, totalPage} = this.props;
        return (
            <div>
                {listRoom.length ?
                    <div className="content">
                        <div className='table-room-list'>
                            {listRoom.map((item, k) => {
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
                        Select <span>Add New</span> to add new
                    </div>}
                <ModalConfirm isShowModal={isShowModal}
                              handleClosePopUp={this.handleClosePopUp} modal={modal}/>
            </div>
        );
    }
}


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

export default withRouter(connect(null, mapDispatchToProps)(TableListRoom));
