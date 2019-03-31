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