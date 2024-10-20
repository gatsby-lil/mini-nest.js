const isString = (value: any): boolean =>
  Object.prototype.toString.call(value) === "[object String]";

const isObject = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";

export { isString, isObject };
