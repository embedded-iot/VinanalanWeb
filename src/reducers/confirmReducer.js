import { confirmConstants } from '../constants';
let confirmModal = {
  isShow: false,
  title: 'Notification',
  message: '',
  confirmText: 'OK',
  needConfirm: true,
  disableSubmitBtn: false,
  successCallBack: () => { },
  failCallBack: () => { }
}

export function confirmModal(state = { confirmModal }, action) {
  switch (action.type) {
    case confirmConstants.HIDE_MODAL:
      return {
        confirmModal: {
          isShow: false,
          title: state.confirmModal.title,
          message: state.confirmModal.message,
          confirmText: state.confirmModal.confirmText,
          needConfirm: state.confirmModal.needConfirm,
          disableSubmitBtn: state.confirmModal.disableSubmitBtn,
          successCallBack: state.confirmModal.successCallBack,
          failCallBack: state.confirmModal.failCallBack
        }
      };
    case confirmConstants.SHOW_ALERT:
      return {
        confirmModal: {
          isShow: true,
          title: state.confirmModal.title,
          message: action.message,
          confirmText: state.confirmModal.confirmText,
          needConfirm: false,
          disableSubmitBtn: state.confirmModal.disableSubmitBtn,
          successCallBack: action.successCallback,
          failCallBack: state.confirmModal.failCallBack
        }
      };
    case confirmConstants.SHOW_MODAL:
      return {
        confirmModal: {
          isShow: true,
          title: state.confirmModal.title,
          message: action.message,
          confirmText: state.confirmModal.confirmText,
          needConfirm: state.confirmModal.needConfirm,
          disableSubmitBtn: state.confirmModal.disableSubmitBtn,
          successCallBack: action.successCallback,
          failCallBack: state.confirmModal.failCallBack
        }
      };
    case confirmConstants.ACTION_MODAL:
      return {
        confirmModal: {
          isShow: true,
          title: action.title,
          message: action.message,
          confirmText: action.confirmText,
          needConfirm: state.confirmModal.needConfirm,
          disableSubmitBtn: action.disableSubmitBtn,
          successCallBack: action.successCallBack,
          failCallBack: action.failCallBack
        }
      }
    default:
      return state
  }
}