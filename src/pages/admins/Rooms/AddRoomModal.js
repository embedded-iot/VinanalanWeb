import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {Input, Textarea} from "../../config/HomeCatalog/ComponentSetting";
// import * as Services from './HomeCatalogServices';
import {connect} from 'react-redux';
import {success, error} from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';
import HomeDropDown from '../../../components/commons/dropdown/HomeDropDown';
import DropDownRoomCatalog from '../../../components/commons/dropdown/DropDownRoomCatalog';
import DropdownBathRoom from '../../../components/commons/dropdown/DropdownBathRoom';
import HighLight from '../../../components/commons/dropdown/HighLight';
import ic_add_images from "../../../public/images/icons/ic_add-images.png";
import * as Service from "./RoomServices";
import UploadImage from "../../../components/commons/uploadImage/UploadImage";


const defaultState = (props) => ({
    roomName: '',
    roomDescription: '',
    roomHighlight: {},
    homeId: '',
    maxGuest: '',
    discount: '',
    isPrivate: false,
    roomTypeId: '',
    roomTypeName: 'Strings',
    roomMedia: {images: []},
    roomStatus: 1,
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
        const {showAlert, handleClosePopUp, showError} = this.props;
        Service.createRoom(selected, res => {
            showAlert('Success');
            handleClosePopUp(true);
        }, er => {
            showError(er.message);
        })
    }
    handleUpload = () => {
        alert("Success!");
    }
    onClickUploadImage = () => {
        if ($("#inputFile")) {
            $("#inputFile").click();
        }
    }
    onDeleteImage = (index) => {
        let state = this.state;
        state.selected.roomMedia.images.splice(index, 1);
        this.setState(state);
    }
    uploadImage = (uploadedImages) => {
        let state = this.state;
        state.selected.roomMedia.images.push(...uploadedImages);
        this.setState(state);
    };

    render() {
        const {isShowModal} = this.props;
        const {selected} = this.state;
        return (
            <Modal show={isShowModal}>
                <Modal.Header><span><h2>{CONSTANTS.CREATE_NEW_ROOM}</h2></span></Modal.Header>
                <Modal.Body>

                    <div className="row">
                        <div className="col-lg-6"><Input value={selected.roomName} title={CONSTANTS.ROOM_NUMBER}
                                                         name='roomName' onChangeData={this.onChangeData}/></div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-4"><span>{CONSTANTS.ROOMS_CATALOG}</span></div>
                                <div className="col-lg-8"><DropDownRoomCatalog name='roomTypeId'
                                                                               onChangeData={this.onChangeData}
                                /></div>
                            </div>
                        </div>
                    </div>

                    <Textarea value={selected.roomDescription} title={CONSTANTS.DESCRIPTION} name='roomDescription'
                              flex={{title: 2, input: 10}} onChangeData={this.onChangeData} style={{height: '80px'}}/>

                    <div className="row" style={{marginBottom: '16px'}}>
                        <div className="col-lg-2">
                            <span>{CONSTANTS.HIGHT_LIGHT}</span>
                        </div>
                        <div className="col-lg-10">
                            <HighLight name='roomHighlight' onChangeData={this.onChangeData}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.roomPrice} title={CONSTANTS.PRICE}
                                   name='roomPrice' onChangeData={this.onChangeData}/>
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
                                    <DropdownBathRoom name='bathroomNumber'
                                                      onChangeData={this.onChangeData}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.discount} title={CONSTANTS.DISCOUNT}
                                   name='discount' onChangeData={this.onChangeData}/>
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className="col-lg-4"><span>{CONSTANTS.PRIVATE}</span></div>
                                <div className="col-lg-8"><input checked={selected.isPrivate} type='checkbox'
                                                                 style={{zoom: 1.4}}
                                                                 name='isPrivate' onChange={this.onChangeDataCheckBox}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className='col-lg-2'>
                            <span>{CONSTANTS.IMAGES}</span>
                        </div>
                        <div className='col-lg-10'>
                            {
                                selected.roomMedia.images && <div className="image-box">
                                    {
                                        selected.roomMedia.images.map((image, index) => {
                                            return <div className="image-item" key={index}>
                                                <i className="far fa-times-circle"
                                                   onClick={(e) => this.onDeleteImage(index)}></i>
                                                <img className="img_item" src={image}/>
                                            </div>
                                        })
                                    }
                                    {
                                        selected.roomMedia.images.length > 0 ?
                                            <div className="add-image" onClick={this.onClickUploadImage}>
                                                <i className="fas fa-plus"></i>
                                            </div> : <img style={{height: '35px', cursor: 'pointer'}}
                                                          onClick={this.onClickUploadImage} src={ic_add_images}/>
                                    }
                                    <UploadImage onUpload={this.uploadImage}/>
                                </div>
                            }
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
        },
        showError: (message) => {
            dispatch(error(message))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRoomModal);