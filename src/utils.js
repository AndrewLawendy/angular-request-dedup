export function getObjectWithoutProperties(obj, props) {
  const target = {};
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (!props.includes(prop)) {
        target[prop] = obj[prop];
      }
    }
  }

  return target;
}
