import {notification} from "antd";

export function convertDate(time) {
  return new Date(time).toLocaleDateString();
}

export function removeEmptyFields(obj) {
  let objCopy = { ...obj };
  for (var propName in obj) {
    if (objCopy[propName] === null || objCopy[propName] === undefined || objCopy[propName] === '') {
      delete objCopy[propName];
    }
  }
  return objCopy;
}

export function openNotification(type, message, description) {
  notification[type]({
    message: message,
    description: description,
  });
};

export function numberDaysBetweenTwoDates(fromDate, toDate) {
  const date1 = new Date(fromDate);
  const date2 = new Date(toDate);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};