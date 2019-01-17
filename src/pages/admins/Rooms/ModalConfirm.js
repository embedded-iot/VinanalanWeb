import {Modal} from 'react-bootstrap';
import React, {Component} from "react";
import * as CONSTANTS from '../../../constants/commonConstant';
import iconDanger from '../../../public/images/icons/danger.png'
import * as Service from './RoomServices'
import {error, success} from "../../../actions";
import {connect} from "react-redux";
class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleSubmit = () =>{
        const {success, error} = this.props;
        const {id , title} = this.props.modal;
        if(title === CONSTANTS.LOCK_ROOM){
            Service.lockRoom(this.props.modal.id, res=>{
                success("Success");
            },er =>{
                error(er.response.data.error.message);
            });
        }else{
            Service.constructingRoom(this.props.modal.id, res=>{
                success("Success");
            },er =>{
                error(er.response.data.error.message);
            });
        }
    }
    render() {
        const {isShowModal, modal, handleClosePopUp, } = this.props;
        return (
            <Modal show={isShowModal} onHide={handleClosePopUp} >
                <Modal.Header><span style={{fontSize: '28px', fontFamily: 'AvenirNext-Bold'}}>
                    <img style={{height:'32px', margin: '0 10px 10px 0'}} src={iconDanger}/>{modal.title}</span></Modal.Header>
                <Modal.Body style={{height: '150px'}}>
                    <span>{modal.message}</span>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={handleClosePopUp}>{CONSTANTS.CLOSE}</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>{CONSTANTS.CREATE}</button>
                </Modal.Footer>
            </Modal>
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
    }
};

export default connect(null, mapDispatchToProps)(ModalConfirm);