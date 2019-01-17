import React, {Component} from "react";
import './BookRoom.scss';
import DatePicker from "react-datepicker";
import * as Service from "./RoomServices";
import {Input} from '../../config/HomeCatalog/ComponentSetting';
import {connect} from "react-redux";
import {success} from "../../../actions";


class BookRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
        }
    }

    componentWillMount = () => {
        const {roomId} = this.props.match.params;
        this.onChangeData({target: {name: 'roomId', value: roomId}});
    }

    onChangeDataDateTime = (key, data) => {
        this.setState({selected: {...this.state.selected, [key]: data}});
    }
    onChangeData = (e) => {
        const {target} = e;
        const {name} = target;
        this.setState({selected: {...this.state.selected, [name]: target.value}})
    }

    handleSubmit = () => {
        let data = {...this.state.selected};
        const {id} = this.props;
        data.userId = id;
        data.checkin = this.state.selected.checkin.toISOString();
        data.checkout = this.state.selected.checkout.toISOString();
        data.customerPassportId = '32131231';
        data.create_at = "2019-01-16T16:07:51.834Z";


        data.update_at = "2019-01-16T16:07:51.834Z";
        data.reservationStatus = 1;
          data.totalMoney = 0,
        console.log(data);
        Service.BookRoom(data, res=>{

        },er =>{

        });
    }

    render() {
        const {selected} = this.state;
        const {roomId} = this.props.match.params;
        return (
            <div className="book_room">
                <div className="header"></div>
                <div className="contact-info">
                    <div className="header">Contact Info</div>
                    <div className="row">
                        <div className="col-lg-4">Check in</div>
                        <div className="col-lg-8">
                            <DatePicker className="form-control" isClearable={true} selected={selected.checkin}
                                        style={{width: '213px'}}
                                        onChange={(e) => this.onChangeDataDateTime('checkin', e)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">Check out</div>
                        <div className="col-lg-8">
                            <DatePicker className="form-control" isClearable={true} selected={selected.checkout}
                                        style={{width: '213px'}}
                                        onChange={(e) => this.onChangeDataDateTime('checkout', e)}/>
                        </div>
                    </div>

                    <Input value={selected.guestNumber} title="Guests" name='guestNumber'
                           onChangeData={this.onChangeData}/>

                    <Input value={selected.guestNumber} title="Source" name='guestNumber'
                           onChangeData={this.onChangeData}/>

                    <Input value={selected.totalMoney} title="Total" name='totalMoney'
                           onChangeData={this.onChangeData}/>

                    <Input value={selected.Prepay} title="Prepay" name='Prepay'
                           onChangeData={this.onChangeData}/>

                    <Input value={selected.Prepay_rate} title="Prepay rate" name='Prepay_rate'
                           onChangeData={this.onChangeData}/>

                    <Input value={selected.periodPayment} title="Pay Method" name='periodPayment'
                           onChangeData={this.onChangeData}/>

                </div>
                <div className="right-info">
                    <div className="customer-info">
                        <div className="header">Customer Info</div>
                        <Input value={selected.customerEmail} title="Email" name='customerEmail'
                               onChangeData={this.onChangeData}/>


                        <Input value={selected.customerPhone} title="Phone" name='customerPhone'
                               onChangeData={this.onChangeData}/>

                        <Input value={selected.customerId} title="ID" name='customerId'
                               onChangeData={this.onChangeData}/>

                        <div className="row">
                            <div className="col-lg-4">Birth Day</div>
                            <div className="col-lg-8">
                                <DatePicker className="form-control" isClearable={true} selected={selected.birthDay}
                                            style={{width: '213px'}}
                                            onChange={(e) => this.onChangeDataDateTime('birthDay', e)}/>
                            </div>
                        </div>

                        <Input value={selected.customerCountry} title="Country" name='customerCountry'
                               onChangeData={this.onChangeData}/>
                    </div>
                    <div className="extra-info">
                        <div className="header">Extra -Info</div>
                        <Input value={selected.description} title="Description" name='description'
                               onChangeData={this.onChangeData}/>

                        <Input value={selected.extraInfo} title="Customer Note" name='extraInfo'
                               onChangeData={this.onChangeData}/>
                    </div>
                </div>
                <button className='btn' onClick={this.handleSubmit}>Book</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user.id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (message) => {
            dispatch(success(message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookRoom);