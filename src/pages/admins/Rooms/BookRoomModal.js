import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from "react";
import { Input, Textarea } from "../../config/HomeCatalog/ComponentSetting";
import { connect } from 'react-redux';
import { success, error } from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';
import * as Service from "./RoomServices";
import UploadImage from "../../../components/commons/uploadImage/UploadImage";
import DatePicker from "react-datepicker";
import moment from 'moment';
import DropdownPayMethod from '../../../components/commons/dropdown/DropdownPayMethod';
import BookingSoure from '../../../components/commons/dropdown/BookingSoure';
import Country from '../../../components/Maps/Country';
import './BookRoom.scss';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    CHECK_IN: <FormattedMessage id="CHECK_IN" />,
    CHECK_OUT: <FormattedMessage id="CHECK_OUT" />,
    BOOK_ROOM: <FormattedMessage id="BOOK_ROOM" />,
    EXTRA_INFO: <FormattedMessage id="EXTRA_INFO" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    NOTES: <FormattedMessage id="NOTES" />,
    EMAIL: <FormattedMessage id="EMAIL" />,
    CUSTOMER_NAME: <FormattedMessage id="CUSTOMER_NAME" />,
    NO_ID_PASSPORT: <FormattedMessage id="NO_ID_PASSPORT" />,
    PHONE: <FormattedMessage id="PHONE" />,
    BIRTH_DAY: <FormattedMessage id="BIRTH_DAY" />,
    TOTAL_COST: <FormattedMessage id="TOTAL_COST" />,
    DISCOUNT: <FormattedMessage id="DISCOUNT" />,
    PAYMENT_METHOD: <FormattedMessage id="PAYMENT_METHOD" />,
    ROOM_INFO: <FormattedMessage id="ROOM_INFO" />,
    GUESTS: <FormattedMessage id="ROOM_INFO" />,
    SOURCE: <FormattedMessage id="SOURCE" />,
    SELECT_COUNTRY: <FormattedMessage id="SELECT_COUNTRY" />,
    PREPAY: <FormattedMessage id="PREPAY" />,
    CUSTOMER_INFO: <FormattedMessage id="CUSTOMER_INFO" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
    ROOM: <FormattedMessage id="ROOM" />,

}


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
            disable: false,
            disCount: 0,
            totalMoney: 0
        }
        this.roomPrice = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.roomId) {
            Service.getRoomById(nextProps.roomId, res => {
                const { data } = res.data;
                this.setState({ disCount: data.room.discount });
                this.roomPrice = data.room.roomPrice;
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
                            // totalMoney: data.reservation.totalMoney,
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
                } else {
                    if (nextProps.isShowModal)
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
        this.setState({
            totalMoney: key === 'checkout' ? this.roomPrice * (data.diff(this.state.selected.checkin, 'days')) * (100 - this.state.disCount) / 100 : this.state.totalMoney,
            selected: { ...this.state.selected, [key]: data }
        });
        console.log(data.diff(this.state.selected.checkin, 'days'));
    }
    onChangeData = (e) => {
        const { target } = e;
        const { name } = target;
        this.setState({ selected: { ...this.state.selected, [name]: target.value } })
    }
    onChangetotalMoney = (e) => {
        const { target } = e;
        const { name } = target;
        this.setState({ [name]: target.value });
    }
    handleSubmit = () => {
        let data = { ...this.state.selected };
        const { userId, showAlert, showError, handleClosePopUp } = this.props;
        const { disable } = this.state;
        data.userId = userId;
        data.totalMoney = this.state.totalMoney;
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
        this.onChangeData({ target: { name: 'customerCountry', value: e.value } });
    }
    handleClosePopUp = () => {
        const { handleClosePopUp } = this.props;
        this.setState({ selected: defaultState(this.props) });
        handleClosePopUp();
    }

    render() {
        const totalMoney_text = <span>{STRINGS.TOTAL_COST} (Vnd)</span>
        const prePay = <span>{STRINGS.PREPAY} (Vnd)</span>
        const disCount_text = <span>{STRINGS.DISCOUNT} </span>
        const { isShowModal } = this.props;
        const { selected, disable, roomName, disCount, totalMoney } = this.state;
        return (
            <Modal show={isShowModal} onHide={this.handleClosePopUp}>
                <Modal.Header><span><h2>{STRINGS.ROOM}: {roomName} </h2></span></Modal.Header>
                <Modal.Body>
                    <div className="book_room">
                        <div className="header"><h1>{selected.roomName}</h1></div>
                        <div className="contact-info">
                            <div className="header">{STRINGS.ROOM_INFO}</div>

                            <div className="row" style={{ marginBottom: '16px' }}>
                                <div className="col-lg-4">{STRINGS.CHECK_IN}</div>
                                <div className="col-lg-8">
                                    <DatePicker className="form-control" isClearable={true} selected={selected.checkin}
                                        style={{ width: '213px' }}
                                        onChange={(e) => this.onChangeDataDateTime('checkin', e)}
                                        disabled={disable} />
                                </div>
                            </div>

                            <div className="row" style={{ marginBottom: '16px' }}>
                                <div className="col-lg-4">{STRINGS.CHECK_OUT}</div>
                                <div className="col-lg-8">
                                    <DatePicker className="form-control" isClearable={true} selected={selected.checkout}
                                        style={{ width: '213px' }}
                                        onChange={(e) => this.onChangeDataDateTime('checkout', e)} />
                                </div>
                            </div>

                            <Input value={selected.guestNumber} title={STRINGS.GUESTS} name='guestNumber'
                                disabled={disable} onChangeData={this.onChangeData} />


                            <div className="row">
                                <div className="col-lg-4">{STRINGS.SOURCE}</div>
                                <div className="col-lg-8">
                                    <BookingSoure onChangeData={this.onChangeData} disabled={disable}
                                        defaultValue={selected.bookingSource} name="bookingSource" />
                                </div>
                            </div>

                            <Input value={totalMoney} title={totalMoney_text} name='totalMoney'
                                onChangeData={this.onChangetotalMoney} />

                            <Input value={selected.prePay} title={prePay} name='prePay'
                                onChangeData={this.onChangeData} />

                            <Input value={disCount} title={disCount_text} disabled={true} />

                            <div className="row">
                                <div className="col-lg-4">{STRINGS.PAYMENT_METHOD}</div>
                                <div className="col-lg-8">
                                    <DropdownPayMethod name='payMethod' defaultValue={selected.payMethod}
                                        disabled={disable} onChangeData={this.onChangeData} />
                                </div>
                            </div>

                        </div>
                        <div className="right-info">
                            <div className="customer-info">
                                <div className="header">{STRINGS.CUSTOMER_INFO}</div>
                                <Input value={selected.customerName} title={STRINGS.CUSTOMER_NAME} name='customerName'
                                    disabled={disable} onChangeData={this.onChangeData} />

                                <Input value={selected.customerEmail} title={STRINGS.EMAIL} name='customerEmail'
                                    disabled={disable} onChangeData={this.onChangeData} />


                                <Input value={selected.customerPhone} title={STRINGS.PHONE} name='customerPhone'
                                    disabled={disable} onChangeData={this.onChangeData} />

                                <Input value={selected.customerPassportId} title={STRINGS.NO_ID_PASSPORT} name='customerPassportId'
                                    disabled={disable} onChangeData={this.onChangeData} />

                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.BIRTH_DAY}</div>
                                    <div className="col-lg-8">
                                        <DatePicker className="form-control" isClearable={true}
                                            selected={selected.birthDay}
                                            style={{ width: '213px' }} disabled={disable}
                                            onChange={(e) => this.onChangeDataDateTime('birthDay', e)} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-4">{STRINGS.SELECT_COUNTRY}</div>
                                    <div className="col-lg-8">
                                        <Country onChangeCountry={this.onChangeCountry}
                                            defaultValue={selected.country} />
                                    </div>
                                </div>

                            </div>
                            <div className="extra-info">
                                <div className="header">{STRINGS.EXTRA_INFO}</div>
                                <Textarea value={selected.description} title={STRINGS.DESCRIPTION} name='description'
                                    onChangeData={this.onChangeData} />

                                <Input value={selected.extraInfo} title={STRINGS.NOTES} name='extraInfo'
                                    onChangeData={this.onChangeData} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-close" onClick={this.handleClosePopUp}>{STRINGS.CLOSE}</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>{STRINGS.BOOK_ROOM}</button>
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