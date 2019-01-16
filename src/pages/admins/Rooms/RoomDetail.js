import React, {Component} from "react";
import './RoomDetail.scss'
class RoomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <div className="room-detail">
                <div className="title">Title</div>
                {/*<div className="gounp">*/}
                <div className="group-roomdetail">
                    <div className="header">Room Detail</div>
                    <div className="room-info">
                        <div className="row">
                            <div className="col-lg-4">Room info</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Image</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Room Number</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Tower</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Highlight</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Description</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Prive</div>
                            <div className="col-lg-8"></div>
                        </div>
                    </div>

                    <div className="contact-info">
                        <div className="row">
                            <div className="col-lg-4">Contact info</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Booking</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Customer</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Status</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Check-in</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Check out</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">Note</div>
                            <div className="col-lg-8"></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6"><button>Expand Book</button></div>
                            <div className="col-lg-6"><button>Check out</button></div>
                        </div>
                    </div>

                    <div className="col-lg-"></div>
                </div>
                <div className="group-history">
                    <div className="header">History</div>
                </div>
            </div>
        );
    }
}

export default RoomDetail;