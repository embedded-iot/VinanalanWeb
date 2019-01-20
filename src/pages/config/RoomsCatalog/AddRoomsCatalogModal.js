import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {Input, Textarea} from "../HomeCatalog/ComponentSetting";
import * as Services from './RoomsCatalogServices';
import {connect} from 'react-redux';
import {success} from "../../../actions";
import * as CONSTANTS from '../../../constants/commonConstant';

const defaultState = (props) => ({
    catalogName: '',
    catalogDescription: '',
    create_by: props.user,
    create_at: (new Date()).toISOString(),
    update_by: props.user,
    update_at: (new Date()).toISOString(),
})

class AddHomeCatalogModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: defaultState(this.props),

        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.setState({selected: nextProps.data});
        }else{
            this.setState({selected: defaultState(this.props)});
        }
    }

    onChangeData = (e) => {
        const {target} = e;
        const {name} = target;
        this.setState({selected: {...this.state.selected, [name]: target.value}})
    }
    handleClosePopUp = () => {
        const {handleClosePopUp} = this.props;
        this.setState({selected: defaultState(this.props)});
        handleClosePopUp();
    }
    handleSubmit = () => {
        const {selected} = this.state;
        const {showAlert, handleClosePopUp, data} = this.props;
        if (data) {
            let value = {...selected};
            value.update_by = this.props.user;
            value.update_at = (new Date()).toISOString();
            Services.upDateRoomsCatalog(value, res => {
                showAlert('Success');
                handleClosePopUp(true);
            }, er => {
                showAlert(er.message);
            })
        } else {
            Services.createRoomsCatalog(selected, res => {
                showAlert('Success');
                handleClosePopUp(true);
            }, er => {
                showAlert(er.message);
            })
        }
    }

    render() {
        const {isShowModal, data} = this.props;
        const {selected} = this.state;
        return (
            <Modal show={isShowModal}>
                <Modal.Header><span>{CONSTANTS.CREATE_NEW_ROOM_CATALOG}</span></Modal.Header>
                <Modal.Body>
                    <Input value={selected.catalogName} title={CONSTANTS.CATALOG_NAME}
                           name='catalogName' onChangeData={this.onChangeData}/>
                    <Textarea value={selected.catalogDescription} title={CONSTANTS.DESCRIPTION}
                              name='catalogDescription' style={{height: '80px'}} onChangeData={this.onChangeData}/>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-close" onClick={this.handleClosePopUp}>{CONSTANTS.CLOSE}</button>
                    <button className="btn btn-finish" onClick={this.handleSubmit}>
                        {!data ? CONSTANTS.CREATE : CONSTANTS.EDIT}</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

AddHomeCatalogModal.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddHomeCatalogModal);