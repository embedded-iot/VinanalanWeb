import React, {Component} from "react";
import {Link} from 'react-router-dom';
import user_ic from "../../../public/images/icons/user_ic.png";
import iconLookUp from '../../../public/images/icons/group-5@2x.png';
import iconLook from '../../../public/images/icons/group-6@2x.png';
import iconSetup from '../../../public/images/icons/group-5-copy@2x.png';
import iconMouse from '../../../public/images/icons/16-px-shape-arrow@2x.png';
import {error, showModal, success} from "../../../actions";
import {connect} from 'react-redux';
import * as CONSTANTS from '../../../constants/commonConstant';
import ModalConfirm from './ModalConfirm';

const RoomItem = props => {
    const {data, handlelookUp, handleConstructingRoom} = props;
    return (
        <div className='room-item' style={props.style ? {marginLeft: '0px'} : {}}>
            <img src={user_ic}/>
            <div><span>{data.roomName}</span></div>
            <div className="up-arrow">
                <div className='hanna-confirmed'>
                    <div className='header'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Hanna-Confirmed</span></div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Checkin/out: </span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Guest: {data.maxGuest}</span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Price: {data.roomPrice}</span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Total: </span></div>
                        </div>
                    </div>
                </div>
                <div className='contract-info' style={{float: 'left'}}>
                    <div className='header'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Contract Info</span></div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='row'>
                            <div className='col-lg-12'><span>Customer: </span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Status: {data.status}</span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-12'><span>Pay: </span></div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'><Link className='btn btn-finish' to={`RoomDetail/${data.id}`}>Detail</Link></div>
                            <div className='col-lg-6'><Link className='btn btn-finish' to={`BookRoom/${data.id}`}>Check-In</Link></div>
                        </div>
                    </div>
                </div>
            </div>

            <Tooltip handlelookUp={()=>handlelookUp(data.id)}
                     handleConstructingRoom={()=>handleConstructingRoom(data.id)}/>
        </div>
    );
}

const Tooltip = (props) => {
        return (
            <div className="my-tooltip">
                <img className='lookup' onClick={props.handlelookUp} src={iconLookUp}/>
                <img className='mouse' src={iconMouse}/>
                <img className='setup' onClick={props.handleConstructingRoom} src={iconSetup}/>
            </div>
        )
    }
;

class TableListRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoom: [],
            isShowModal: false,
            modal :{
                title : '',
                message: ''
            }
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.listRooms) {
            this.setState({listRoom: nextProps.listRooms});
        }
    }

    handlelookUp = (id) => {
        this.setState({
            modal : {
                title: CONSTANTS.LOCK_ROOM,
                message: 'Do you want to lock this room?',
                id: id
            },
            isShowModal : true
        });
    }

    handleConstructingRoom = (id) => {
        this.setState({
            modal : {
                title: CONSTANTS.CONSTRUCTING_ROOM,
                message: 'Do you want to change this room to contructing state ?',
                id: id
            },
            isShowModal : true
        });
    }
    handleClosePopUp = () =>{
      this.setState({isShowModal: false});
    }
    render() {
        const {listRoom, isShowModal, modal} = this.state;
        const {row} = this.props;
        return (
            <div>
                {listRoom.length ? <div className='table-room-list'>
                    {listRoom.map((item, k) => {
                        return (
                            <RoomItem key={k} style={k % row === 0 ? true : false} data={item}
                                      handlelookUp={this.handlelookUp}
                                      handleConstructingRoom={this.handleConstructingRoom}

                            />
                        );
                    })}
                </div> : <span>'is Load Data !</span>}
                <ModalConfirm isShowModal={isShowModal}
                              handleClosePopUp={this.handleClosePopUp}   modal={modal}/>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        // error: (message) => {
        //     dispatch(error(message));
        // },
        // success: (message) => {
        //     dispatch(success(message));
        // },
        showModal: (message, confirm) => {
            dispatch(showModal(message, confirm))
        }
    }
};

export default connect(null, mapDispatchToProps)(TableListRoom);
