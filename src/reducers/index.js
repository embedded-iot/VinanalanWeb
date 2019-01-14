import { combineReducers } from 'redux';

import { authentication } from './authenticationReducer';
import { registration } from './registrationReducer';
import { users } from './usersReducer';
import { alert } from './alertReducer';
import { confirmModal } from "./confirmReducer";
import { translation } from "./translateReducer";

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  confirmModal,
  translation
});

export default rootReducer;