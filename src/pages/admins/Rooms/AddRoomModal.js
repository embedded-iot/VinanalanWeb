import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {Input} from "../../config/HomeCatalog/ComponentSetting";
// import * as Services from './HomeCatalogServices';
import {connect} from 'react-redux';
import {success} from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';
import HomeDropDown from '../../../components/commons/dropdown/HomeDropDown';
import DropDownRoomCatalog from '../../../components/commons/dropdown/DropDownRoomCatalog';
import RoomMedia from '../../../components/commons/dropdown/RoomMedia';
import ic_add_images from "../../../public/images/icons/ic_add-images.png";
import * as Service from "./RoomServices";


const defaultState = (props) => ({
    roomName: '',
    roomDescription: 'demo',
    roomHighlight: ['roomHighlight_demo'],
    homeId: '',
    maxGuest: '',
    isPrivate: false,
    roomTypeId: 'Strings',
    roomTypeName: '',
    roomMedia: {},
    roomStatus: '',
    roomPrice: '',
    create_at: (new Date()).toISOString(),
    update_at: (new Date()).toISOString(),
})

class AddRoomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: defaultState(this.props)
        }
    }

    onChangeData = (e) => {
        const {target} = e;
        const {name} = target;
        this.setState({selected: {...this.state.selected, [name]: target.value}})
    }
    onChangeDataCheckBox = e => {
        const {target} = e;
        const {name} = target;
        this.setState({selected: {...this.state.selected, [name]: target.checked}})
    }
    handleClosePopUp = () => {
        const {handleClosePopUp} = this.props;
        this.setState({selected: defaultState(this.props)});
        handleClosePopUp();
    }
    handleSubmit = () => {
        const {selected} = this.state;
        const {showAlert, handleClosePopUp} = this.props;
        Service.createRoom(selected, res => {
            showAlert('Success');
            handleClosePopUp(true);
        }, er => {
            showAlert(er.message);
        })
    }
    handleUpload = () => {
        alert("Success!");
    }

    render() {
        const {isShowModal} = this.props;
        const {selected} = this.state;
        return (
            <Modal show={isShowModal}>
                <Modal.Header><span>{CONSTANTS.CREATE_NEW_ROOM}</span></Modal.Header>
                <Modal.Body>
                    <Input value={selected.roomName} title={CONSTANTS.TiTLE} flex={{title: 2, input: 10}}
                           name='roomName' onChangeData={this.onChangeData}/>

                    <div className="row" style={{marginBottom: '16px'}}>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className='col-lg-4'>
                                    <span>{CONSTANTS.PRIVATE}</span>
                                </div>
                                <div className='col-lg-8'>
                                    <input checked={selected.isPrivate} type='checkbox' style={{zoom: 1.4}}
                                           name='isPrivate' onChange={this.onChangeDataCheckBox}/>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className='col-lg-4'><span>{CONSTANTS.HOME}</span></div>
                                <div className='col-lg-8'><HomeDropDown onChangeData={this.onChangeData} name='homeId'/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.maxGuest} title={CONSTANTS.CAPACITY}
                                   name='maxGuest' onChangeData={this.onChangeData}/>
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className='col-lg-4'>
                                    <span>{CONSTANTS.BATHROOM}</span>
                                </div>
                                <div className='col-lg-8'>
                                    <RoomMedia name='roomMedia' onChangeData={this.onChangeData}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.roomPrice} title={CONSTANTS.PRICE}
                                   name='roomPrice' onChangeData={this.onChangeData}/>
                        </div>
                        <div className='col-lg-6'>

                            <Input value={selected.roomStatus} title={CONSTANTS.DISCOUNT}
                                   name='roomStatus' onChangeData={this.onChangeData}/>
                        </div>
                    </div>
                    <div className="row" style={{marginBottom: '16px'}}>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className="col-lg-4"><span>{CONSTANTS.ROOMS_CATALOG}</span></div>
                                <div className="col-lg-8"><DropDownRoomCatalog name='roomTypeName'
                                                                               onChangeData={this.onChangeData}
                                                                               value={selected.roomTypeName}
                                /></div>
                            </div>
                        </div>
                        <div className='col-lg-6'>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-2'>
                            <span>{CONSTANTS.IMAGES}</span>
                        </div>
                        <div className='col-lg-10'>
                            <img style={{height: '35px', cursor: 'pointer'}}
                                 onClick={this.handleUpload} src={ic_add_images}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-close" onClick={this.handleClosePopUp}>{CONSTANTS.CLOSE}</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>{CONSTANTS.CREATE}</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

AddRoomModal.propTypes = {
    isShowModal: PropTypes.bool.isRequired,
    handleClosePopUp: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        user: state.authentication.user.userName
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (message) => {
            dispatch(success(message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRoomModal);