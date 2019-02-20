import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from "react";
import { Input, Textarea } from "../../config/HomeCatalog/ComponentSetting";
import { connect } from 'react-redux';
import { success, error } from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';
import HomeDropDown from '../../../components/commons/dropdown/HomeDropDown';
import DropDownRoomCatalog from '../../../components/commons/dropdown/DropDownRoomCatalog';
import DropdownBathRoom from '../../../components/commons/dropdown/DropdownBathRoom';
import HighLight from '../../../components/commons/dropdown/HighLight';
import ic_add_images from "../../../public/images/icons/ic_add-images.png";
import * as Service from "./RoomServices";
import UploadImage from "../../../components/commons/uploadImage/UploadImage";
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    ROOM_NUMBER: <FormattedMessage id="ROOM_NUMBER" />,
    HIGHTLIGHT: <FormattedMessage id="HIGHTLIGHT" />,
    PRICE_OF_ROOM: <FormattedMessage id="PRICE_OF_ROOM" />,
    CAPACITY: <FormattedMessage id="CAPACITY" />,
    DISCOUNT: <FormattedMessage id="DISCOUNT" />,
    ROOM_PRIVATE: <FormattedMessage id="ROOM_PRIVATE" />,
    IMAGES: <FormattedMessage id="IMAGES" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    HOME_NAME: <FormattedMessage id="HOME_NAME" />,
    BATHROOM: <FormattedMessage id="BATHROOM" />,
    ROOM_CATALOG: <FormattedMessage id="ROOM_CATALOG" />,
    CLOSE: <FormattedMessage id="CLOSE" />,
    SAVE: <FormattedMessage id="SAVE" />,
    CREATE_NEW_ROOM: <FormattedMessage id="CREATE_NEW_ROOM" />,
    UPDATE_ROOM: <FormattedMessage id="UPDATE_ROOM" />,
    CREATE: <FormattedMessage id="CREATE" />,
    ACTION_UPDATE: <FormattedMessage id="ACTION_UPDATE" />,
    PRICE_OF_ROOM_VND: <FormattedMessage id="PRICE_OF_ROOM_VND" />,
}

const defaultState = (props) => ({
    roomName: '',
    roomDescription: '',
    roomHighlight: {},
    homeId: '',
    maxGuest: '',
    discount: '',
    isPrivate: false,
    roomTypeId: '',
    roomMedia: { images: [] },
    roomStatus: 1,
    roomPrice: '',
    create_at: (new Date()).toISOString(),
    update_at: (new Date()).toISOString(),
})

class AddRoomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: defaultState(this.props),
            defautlHome: ''
        }
    }

    componentWillMount() {
        if (JSON.parse(localStorage.getItem("home"))) {
            const home = JSON.parse(localStorage.getItem("home"));
            this.setState({
                defautlHome: { value: home.value, label: home.label },
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataUpdate && nextProps.isShowModal) {
            const data = this.props.dataUpdate;
            this.setState({
                selected: {
                    id: data.id,
                    roomName: data.roomName,
                    bathroomNumber: data.bathroomNumber,
                    roomDescription: data.roomDescription,
                    roomHighlight: data.roomHighlight,
                    homeId: data.homeId,
                    maxGuest: data.maxGuest,
                    discount: data.discount,
                    isPrivate: data.isPrivate,
                    roomTypeId: data.roomTypeId,
                    roomMedia: data.roomMedia,
                    roomStatus: data.roomStatus,
                    roomPrice: data.roomPrice,
                    create_at: data.create_at,
                    update_at: data.update_at,
                },
                defautlHome: { value: data.homeId, label: data.homes.homeName },
                defautlBathroom: { value: data.bathroomNumber, label: data.bathroomNumber },
                defautlHighlight: { value: data.roomHighlight, label: data.roomHighlight },

            });
        }
        if (JSON.parse(localStorage.getItem("home"))) {
            const home = JSON.parse(localStorage.getItem("home"));
            this.setState({
                defautlHome: { value: home.value, label: home.label },
            });
        }
    }


    onChangeData = (e) => {
        const { target } = e;
        const { name } = target;
        if (name === 'roomPrice') {
            let data = target.value.replace(/\./g, "");
            target.value = data;
        }
        this.setState({ selected: { ...this.state.selected, [name]: target.value } })
    }
    onChangeDataCheckBox = e => {
        const { target } = e;
        const { name } = target;
        this.setState({ selected: { ...this.state.selected, [name]: target.checked } })
    }
    handleClosePopUp = () => {
        const { handleClosePopUp } = this.props;
        this.setState({ selected: defaultState(this.props) });
        handleClosePopUp();
    }
    handleSubmit = () => {
        let { selected } = this.state;
        if (!selected.homeId) {
            const home = JSON.parse(localStorage.getItem("home"));
            selected.homeId = home.homeId;
        }
        let list = [];
        this.state.selected.roomHighlight.map((item, key) => {
            return list.push(item.value);
        })
        selected.roomHighlight = list;
        const { showAlert, handleClosePopUp, showError } = this.props;
        if (this.props.dataUpdate) {
            Service.upDateRoom(selected, res => {
                showAlert('Success');
                handleClosePopUp(true);
            }, er => {
                showError(er.message);
            })
        } else {
            Service.createRoom(selected, res => {
                this.props.onUpdate();
                showAlert('Success');
                handleClosePopUp(true);
            }, er => {
                showError(er.message);
            })
        }
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
        const { isShowModal, dataUpdate } = this.props;
        const { selected, defautlHome } = this.state;
        const price = selected.roomPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        return (
            <Modal show={isShowModal}>
                <Modal.Header><span><h2>{dataUpdate ? STRINGS.UPDATE_ROOM : STRINGS.CREATE_NEW_ROOM}</h2></span></Modal.Header>
                <Modal.Body>

                    <div className="row">
                        <div className="col-lg-6"><Input value={selected.roomName} title={STRINGS.ROOM_NUMBER}
                            name='roomName' onChangeData={this.onChangeData} /></div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-4"><span>{STRINGS.ROOMS_CATALOG}</span></div>
                                <div className="col-lg-8"><DropDownRoomCatalog name='roomTypeId'
                                    onChangeData={this.onChangeData}
                                /></div>
                            </div>
                        </div>
                    </div>

                    <Textarea value={selected.roomDescription} title={STRINGS.DESCRIPTION} name='roomDescription'
                        flex={{ title: 2, input: 10 }} onChangeData={this.onChangeData} style={{ height: '80px' }} />

                    <div className="row" style={{ marginBottom: '16px' }}>
                        <div className="col-lg-2">
                            <span>{STRINGS.HIGHT_LIGHT}</span>
                        </div>
                        <div className="col-lg-10">
                            <HighLight name='roomHighlight' onChangeData={this.onChangeData}
                                defaultValue={this.state.defautlHighlight} />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={price} title={STRINGS.PRICE_OF_ROOM_VND}
                                name='roomPrice' onChangeData={this.onChangeData} />
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className='col-lg-4'><span>{STRINGS.HOME_NAME}</span></div>
                                <div className='col-lg-8'><HomeDropDown onChangeData={this.onChangeData}
                                    defaultValue={defautlHome} name='homeId' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.maxGuest} title={STRINGS.CAPACITY}
                                name='maxGuest' onChangeData={this.onChangeData} />
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className='col-lg-4'>
                                    <span>{STRINGS.BATHROOM}</span>
                                </div>
                                <div className='col-lg-8'>
                                    <DropdownBathRoom name='bathroomNumber' defaultValue={this.state.defautlBathroom}
                                        onChangeData={this.onChangeData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                            <Input value={selected.discount} title={STRINGS.DISCOUNT}
                                name='discount' onChangeData={this.onChangeData} />
                        </div>
                        <div className='col-lg-6'>
                            <div className="row">
                                <div className="col-lg-4"><span>{STRINGS.ROOM_PRIVATE}</span></div>
                                <div className="col-lg-8"><input checked={selected.isPrivate} type='checkbox'
                                    style={{ zoom: 1.4 }}
                                    name='isPrivate' onChange={this.onChangeDataCheckBox} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className='col-lg-2'>
                            <span>{STRINGS.IMAGES}</span>
                        </div>
                        <div className='col-lg-10'>
                            {
                                selected.roomMedia.images && <div className="image-box">
                                    {
                                        selected.roomMedia.images.map((image, index) => {
                                            return <div className="image-item" key={index}>
                                                <i className="far fa-times-circle"
                                                    onClick={(e) => this.onDeleteImage(index)}></i>
                                                <img className="img_item" src={image} />
                                            </div>
                                        })
                                    }
                                    {
                                        selected.roomMedia.images.length > 0 ?
                                            <div className="add-image" onClick={this.onClickUploadImage}>
                                                <i className="fas fa-plus"></i>
                                            </div> : <img style={{ height: '35px', cursor: 'pointer' }}
                                                onClick={this.onClickUploadImage} src={ic_add_images} />
                                    }
                                    <UploadImage onUpload={this.uploadImage} />
                                </div>
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-close" onClick={this.handleClosePopUp}>{STRINGS.CLOSE}</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>{dataUpdate ? STRINGS.ACTION_UPDATE : STRINGS.CREATE}</button>
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