import React from 'react'
import {FormattedMessage} from "react-intl";

const STRINGS = {
  USERS: <FormattedMessage id="USERS" />,
  USER_FULL_NAME: <FormattedMessage id="USER_FULL_NAME" />,
  EMAIL: <FormattedMessage id="EMAIL" />,
  PHONE: <FormattedMessage id="PHONE" />,
  USER_PERMISSION: <FormattedMessage id="USER_PERMISSION" />,
  ADMIN: <FormattedMessage id="ADMIN" />,
  MANAGER: <FormattedMessage id="MANAGER" />,
  STAFF: <FormattedMessage id="STAFF" />,
  HOME_MANAGER: <FormattedMessage id="HOME_MANAGER" />,
  WORKING_TIME: <FormattedMessage id="WORKING_TIME" />,
  FULL_TIME: <FormattedMessage id="FULL_TIME" />,
  PART_TIME: <FormattedMessage id="PART_TIME" />,
  USER_TITLE: <FormattedMessage id="USER_TITLE" />,
  ACTION_ACTIVE: <FormattedMessage id="ACTION_ACTIVE" />,
  ACTION_DEACTIVE: <FormattedMessage id="ACTION_DEACTIVE" />,
  ACTION: <FormattedMessage id="ACTION" />,
  STATUS: <FormattedMessage id="STATUS" />,
  YES: <FormattedMessage id="YES" />,
  NO: <FormattedMessage id="NO" />,
  VIEW: <FormattedMessage id="VIEW" />,
  EDIT: <FormattedMessage id="EDIT" />,
  ALL: <FormattedMessage id="ALL" />,
  ACTION_DELETE: <FormattedMessage id="ACTION_DELETE" />,
  DELETE_USER_QUESTION: <FormattedMessage id="DELETE_USER_QUESTION" />,
}

export const STATUS = [
  // { text: STRINGS.ALL, value: " " },
  { text: STRINGS.ACTION_ACTIVE, value: true },
  { text: STRINGS.ACTION_DEACTIVE, value: false },
]

export const STATUS_NOT_ALL = [
  { text: STRINGS.ACTION_ACTIVE, value: true },
  { text: STRINGS.ACTION_DEACTIVE, value: false },
]

export const USER_PERMISSION = [
  // { text: STRINGS.ALL, value: ' ' },
  { text: STRINGS.ADMIN, value: 'admin' },
  { text: STRINGS.MANAGER, value: "manager" },
  { text: STRINGS.STAFF, value: "Staff" },
  { text: STRINGS.HOME_MANAGER, value: "home_manager" }
]

export const WORKING_TIME = [
  // { text: STRINGS.ALL, value: ' ' },
  { text: STRINGS.FULL_TIME, value: 'full_time' },
  { text: STRINGS.PART_TIME, value: "part_time" },
]

export const USER_TITLE = [
  // { text: STRINGS.ALL, value: ' ' },
  { text: "Giám đốc", value: 'director' },
  { text: "Trưởng phòng", value: "manager" },
  { text: "Nhân viên", value: "Staff" },
  { text: "Lễ tân", value: "receptionist" }
]