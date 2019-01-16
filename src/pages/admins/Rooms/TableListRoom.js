import React, {Component} from "react";
import user_ic from "../../../public/images/icons/user_ic.png";
import iconLookUp from '../../../public/images/icons/group-5@2x.png';
import iconLook from '../../../public/images/icons/group-6@2x.png';
import iconSetup from '../../../public/images/icons/group-5-copy@2x.png';
import iconMouse from '../../../public/images/icons/16-px-shape-arrow@2x.png';
import {Button} from "../../config/HomeCatalog/ComponentSetting";
import {error, showModal, success} from "../../../actions";
import {connect} from 'react-redux';

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
                            <div className='col-lg-6'><a className='btn btn-finish' href="/RoomDetail">Detail</a></div>
                            <div className='col-lg-6'><a className='btn btn-finish' href="/RoomCheckin">Check-In</a></div>
                        </div>
                    </div>
                </div>
            </div>


            <Tooltip handlelookUp={handlelookUp} handleConstructingRoom={handleConstructingRoom}/>
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
            listRoom: []
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.listRooms) {
            this.setState({listRoom: nextProps.listRooms});
        }
    }

    handlelookUp = () => {
        this.props.showModal("LookUp", confirm => {
            alert("0k");

        }, er => {

        });
    }
    handleConstructingRoom = () => {
        this.props.showModal("Constructing Room", confirm => {
            alert("0k");
        }, er => {

        });
    }

    render() {
        const {listRoom} = this.state;
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
