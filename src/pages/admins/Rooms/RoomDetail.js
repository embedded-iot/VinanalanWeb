import React, {Component} from "react";
import {connect} from 'react-redux';
import './RoomDetail.scss'
import * as Service from './RoomServices'
import {Link} from 'react-router-dom';

class RoomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {}
        }
    }

    componentWillMount = () => {
        const {roomId} = this.props.match.params;
        Service.getRoomById(roomId, res => {
            this.setState({selected: res.data.data});
        }, er => {

        })
    }

    render() {
        const {roomId} = this.props.match.params;
        const {selected} = this.state;
        return (
            <div className="room-detail">
                <div className="title">{selected.roomName}</div>
                {/*<div className="gounp">*/}
                <div className="group-roomdetail">
                    <div className="header">Room Detail</div>
                    <div className="room-info">
                        <div className="row">
                            <div className="col-lg-4" style={styleHeader}>Room info</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Image:</div>
                            <div className="col-lg-8">{selected.roomMedia && selected.roomMedia.images && selected.roomMedia.images.map(item =>{
                                return (
                                    <img style={{height: '80px'}} src={item}></img>
                                );
                            })}</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Room Number:</div>
                            <div className="col-lg-8">{selected.roomName}</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Tower:</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Highlight:</div>
                            <div className="col-lg-8">{selected.roomHighlight}</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Description:</div>
                            <div className="col-lg-8">{selected.roomDescription}</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Price:</div>
                            <div className="col-lg-8">{selected.roomPrice}</div>
                        </div>
                    </div>

                    <div className="contact-info">
                        <div className="row">
                            <div className="col-lg-4" style={styleHeader}>Contact info</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Booking:</div>
                            <div className="col-lg-8">#Abc</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Customer:</div>
                            <div className="col-lg-8">example@gmail.com</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Status:</div>
                            <div className="col-lg-8">{selected.roomStatus}</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Check-in:</div>
                            <div className="col-lg-8">22/10/2018</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Check out:</div>
                            <div className="col-lg-8">22/10/2019</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Note:</div>
                            <div className="col-lg-8" style={{fontFamily: 'AvenirNext-MediumItalic'}}>Customer Notes</div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <Link className='btn btn-success' to={`/BookRoom/${roomId}`}>Expand Book</Link>
                            </div>
                            <div className="col-lg-6">
                                <a className='btn btn-danger' href='/CheckOut'>Check out</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="group-history">
                    <div className="header">History</div>
                    <div className="demo"></div>
                    <div className="demo"></div>
                    <div className="demo"></div>
                </div>
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

export default connect(mapStateToProps, null)(RoomDetail);