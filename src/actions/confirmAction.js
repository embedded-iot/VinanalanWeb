import { confirmConstants } from '../constants';

export const confirmActions = {
  showModal,
  hideModal,
  actionModal
};

export function showModal(message, successCallback) {
  return {
    type: confirmConstants.SHOW_MODAL,
    message: message,
    successCallback: successCallback
  };
}

export function showAlert(message, successCallback) {
  return {
    type: confirmConstants.SHOW_ALERT,
    message: message,
    successCallback: successCallback
  };
}

export function hideModal(message) {
  return { type: confirmConstants.HIDE_MODAL };
}

export function actionModal(title, message, confirmText, successCallBack, failCallBack, disableSubmitBtn) {
  return {
    type: confirmConstants.ACTION_MODAL,
    title: title,
    message: message,
    confirmText: confirmText,
    successCallBack: successCallBack,
    failCallBack: failCallBack,
    disableSubmitBtn: disableSubmitBtn
  }
}