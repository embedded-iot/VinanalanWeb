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

export function  convertDatetimeToString(date, format) {
  const dateTime = new Date(date);
  const day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
  const month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
  const year = dateTime.getFullYear();
  return day + '/' + month + '/' + year;
}