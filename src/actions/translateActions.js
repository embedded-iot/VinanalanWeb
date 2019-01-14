import { SET_LANGUAGE } from "../constants/translateActionType";

export function setLanguage(locale) {
  return {
    type: SET_LANGUAGE,
    locale,
  };
}
