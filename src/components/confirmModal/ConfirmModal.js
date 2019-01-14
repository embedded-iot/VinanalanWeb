import { Modal, Button } from 'react-bootstrap';
import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "./ConfirmModal.scss";
import { hideModal, successCallBack, failCallBack } from "../../actions";

export class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
  }

  close = () => {
    this.props.hideModal();
    this.props.failCallBack();
  };

  confirm = () => {
    this.props.hideModal();
    this.props.successCallBack();
  };

  render() {
    return (
      <div className="alert-popup-container">
        <Modal dialogClassName="alert-modal" show={this.props.isShow} onHide={this.close}>
          <Modal.Header>{this.props.title}</Modal.Header>
          <Modal.Body>
            {this.props.message}
          </Modal.Body>
          <Modal.Footer>
            {
              this.props.needConfirm && <button className="btn btn-default" onClick={this.close}>Close</button>
            }
            <button className="btn btn-primary" onClick={this.confirm} disabled={this.props.disableSubmitBtn}>{this.props.confirmText}</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ConfirmModal.defaultProps = {
  confirmText: 'OK',
  successCallBack: () => { },
  failCallBack: () => { }
};

const mapStateToProps = function (state) {
  return ({
    title: state.confirmModal.confirmModal.title,
    isShow: state.confirmModal.confirmModal.isShow,
    message: state.confirmModal.confirmModal.message,
    disableSubmitBtn: state.confirmModal.confirmModal.disableSubmitBtn,
    confirmText: state.confirmModal.confirmModal.confirmText,
    successCallBack: state.confirmModal.confirmModal.successCallBack,
    failCallBack: state.confirmModal.confirmModal.failCallBack,
    needConfirm: state.confirmModal.confirmModal.needConfirm
  });
};

const mapDispatchToProps = function (dispatch) {
  return ({
    hideModal: () => {
      dispatch(hideModal());
    }
  })
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);