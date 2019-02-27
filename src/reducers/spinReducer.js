import { spinConstants } from '../constants';
let spinState = {
  isShow: false
}

export function spinState(state = { spinState }, action) {
  switch (action.type) {
    case spinConstants.SHOW_SPIN:
      return {
        spinState: {
          isShow: true
        }
      };
    case spinConstants.HIDE_SPIN:
      return {
        spinState: {
          isShow: false,
        }
      };

    default:
      return state
  }
}