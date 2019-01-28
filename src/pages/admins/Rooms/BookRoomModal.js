import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {Input, Textarea} from "../../config/HomeCatalog/ComponentSetting";
import {connect} from 'react-redux';
import {success, error} from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';
import * as Service from "./RoomServices";
import UploadImage from "../../../components/commons/uploadImage/UploadImage";
import DatePicker from "react-datepicker";
import moment from 'moment';
import DropdownPayMethod from '../../../components/commons/dropdown/DropdownPayMethod';
import BookingSoure from '../../../components/commons/dropdown/BookingSoure';
import Country from '../../../components/Maps/Country';
import './BookRoom.scss';


const defaultState = props => ({
    roomId: props.roomId,
    customerId: "",
    bookingSource: "",
    booking_code: "",
    checkin: moment((new Date()).toISOString()),
    checkout: moment((new Date()).toISOString()),
    guestNumber: 0,
    totalMoney: 0,
    prePay: 0,
    remainMoney: 0,
    description: "",
    customerPassportId: '',
    payMethod: "",
    periodPayment: 0,
    create_at: (new Date()).toISOString(),
    update_at: (new Date()).toISOString(),
    //create_by: "",
    id: "",
    customerEmail: "",
    customerName: "",
    customerPhone: "",
    customerCountry: "",
    extraInfo: "",
})

class BookRoomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: defaultState(this.props),
            roomName: '',
            disable: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.roomId) {
            Service.getRoomById(nextProps.roomId, res => {
                const {data} = res.data;
                if (res.data.data.reservation.roomId && nextProps.isShowModal) {
                    this.setState({
                        selected: {
                            roomId: nextProps.roomId,
                            customerId: data.reservation.customerId,
                            bookingSource: data.reservation.bookingSource,
                            booking_code: data.reservation.booking_code,
                            checkin: moment(data.reservation.checkin),
                            checkout: moment(data.reservation.checkout),
                            guestNumber: data.reservation.guestNumber,
                            totalMoney: data.reservation.totalMoney,
                            prePay: data.reservation.prePay,
                            remainMoney: data.reservation.remainMoney,
                            description: data.description,
                            customerPassportId: data.reservation.customer.customerPassportId,
                            payMethod: data.reservation.payMethod,
                            periodPayment: data.reservation.periodPayment,
                            create_at: (new Date()).toISOString(),
                            update_at: (new Date()).toISOString(),
                            create_by: data.reservation.create_by,
                            id: data.reservation.id,
                            customerEmail: data.reservation.customer.customerEmail,
                            customerName: data.reservation.customer.customerName,
                            customerPhone: data.reservation.customer.customerEmail,
                            customerCountry: data.reservation.customer.customerCountry,
                            extraInfo: data.reservation.customer.extraInfo,
                        },
                        roomName: data.room.roomName,
                        disable: true
                    });
                }else{
                    if(nextProps.isShowModal)
                    this.setState({
                        selected: defaultState(this.props),
                        disable: false,
                        roomName: data.room.roomName,
                    });

                }
            })
        }
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
        const {userId, showAlert, showError, handleClosePopUp} = this.props;
        const {disable} = this.state;
        data.userId = userId;
        if (disable) {

            data.update_at = (new Date()).toISOString();
            Service.UpDateReversation(data, res => {
                showAlert("Update Success");
                handleClosePopUp();
            }, er => {
                showError(er)
            })
        } else {
            Service.BookRoom(data, res => {
                showAlert("Creacte Success");
                handleClosePopUp();
            }, er => {
                showError(er.description);
            });
        }
    }

    onChangeCountry = (e) => {
        this.onChangeData({target: {name: 'customerCountry', value: e.value}});
    }
    handleClosePopUp = () => {
        const {handleClosePopUp} = this.props;
        this.setState({selected: defaultState(this.props)});
        handleClosePopUp();
    }

    render() {
        const {isShowModal} = this.props;
        const {selected, disable, roomName} = this.state;
        return (
            <Modal show={isShowModal} onHide={this.handleClosePopUp}>
                <Modal.Header><span><h2>{CONSTANTS.BOOKING_ROOM}: {roomName} </h2></span></Modal.Header>
                <Modal.Body>
                    <div className="book_room">
                        <div className="header"><h1>{selected.roomName}</h1></div>
                        <div className="contact-info">
                            <div className="header"><span>Contact Info</span></div>

                            <div className="row" style={{marginBottom: '16px'}}>
                                <div className="col-lg-4"><span>Check in</span></div>
                                <div className="col-lg-8">
                                    <DatePicker className="form-control" isClearable={true} selected={selected.checkin}
                                                style={{width: '213px'}}
                                                onChange={(e) => this.onChangeDataDateTime('checkin', e)}
                                                disabled={disable}/>
                                </div>
                            </div>

                            <div className="row" style={{marginBottom: '16px'}}>
                                <div className="col-lg-4"><span>Check out</span></div>
                                <div className="col-lg-8">
                                    <DatePicker className="form-control" isClearable={true} selected={selected.checkout}
                                                style={{width: '213px'}}
                                                onChange={(e) => this.onChangeDataDateTime('checkout', e)}/>
                                </div>
                            </div>

                            <Input value={selected.guestNumber} title="Guests" name='guestNumber'
                                   disabled={disable} onChangeData={this.onChangeData}/>


                            <div className="row">
                                <div className="col-lg-4"><span>Source</span></div>
                                <div className="col-lg-8">
                                    <BookingSoure onChangeData={this.onChangeData} disabled={disable}
                                                  defaultValue={selected.bookingSource} name="bookingSource"/>
                                </div>
                            </div>

                            <Input value={selected.totalMoney} title="Total (Vnd)" name='totalMoney'
                                   onChangeData={this.onChangeData}/>

                            <Input value={selected.prePay} title="Prepay (Vnd)" name='prePay'
                                   onChangeData={this.onChangeData}/>

                            <Input value={Math.round(selected.prePay/selected.totalMoney*100) || ''} title="Prepay rate(%)" name='prepay_rate'
                                   disabled={disable} onChangeData={this.onChangeData}/>

                            <div className="row">
                                <div className="col-lg-4"><span>Pay Method</span></div>
                                <div className="col-lg-8">
                                    <DropdownPayMethod name='payMethod' defaultValue={selected.payMethod}
                                                       disabled={disable} onChangeData={this.onChangeData}/>
                                </div>
                            </div>

                        </div>
                        <div className="right-info">
                            <div className="customer-info">
                                <div className="header"><span>Customer Info</span></div>
                                <Input value={selected.customerEmail} title="Email" name='customerEmail'
                                       disabled={disable} onChangeData={this.onChangeData}/>


                                <Input value={selected.customerPhone} title="Phone" name='customerPhone'
                                       disabled={disable} onChangeData={this.onChangeData}/>

                                <Input value={selected.customerPassportId} title="ID" name='customerPassportId'
                                       disabled={disable} onChangeData={this.onChangeData}/>

                                <div className="row">
                                    <div className="col-lg-4"><span>Birth Day</span></div>
                                    <div className="col-lg-8">
                                        <DatePicker className="form-control" isClearable={true}
                                                    selected={selected.birthDay}
                                                    style={{width: '213px'}} disabled={disable}
                                                    onChange={(e) => this.onChangeDataDateTime('birthDay', e)}/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-4"><span>Country</span></div>
                                    <div className="col-lg-8">
                                        <Country onChangeCountry={this.onChangeCountry}
                                                 defaultValue={selected.country}/>
                                    </div>
                                </div>

                            </div>
                            <div className="extra-info">
                                <div className="header"><span>Extra -Info</span></div>
                                <Textarea value={selected.description} title="Description" name='description'
                                          onChangeData={this.onChangeData}/>

                                <Input value={selected.extraInfo} title="Customer Note" name='extraInfo'
                                       onChangeData={this.onChangeData}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-close" onClick={this.handleClosePopUp}>Cancel</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>Book</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

BookRoomModal.propTypes = {
    isShowModal: PropTypes.bool.isRequired,
    handleClosePopUp: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        userId: state.authentication.user.id
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (message) => {
            dispatch(success(message))
        },
        showError: (message) => {
            dispatch(error(message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookRoomModal);