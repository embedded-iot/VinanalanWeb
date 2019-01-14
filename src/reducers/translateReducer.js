import { SET_LANGUAGE } from "../constants/translateActionType";

// Initial state
export const initialState = {
  locale: 'en', // default locale
};

// Reducer
export function translation(state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}