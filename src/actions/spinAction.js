import { spinConstants } from '../constants';

export const spinActions = {
  showSpin,
  hideSpin
};

export function showSpin() {
  return {
    type: spinConstants.SHOW_SPIN
  };
}

export function hideSpin() {
  return {
    type: spinConstants.HIDE_SPIN
  };
}
