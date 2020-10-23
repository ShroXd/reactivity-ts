const { isArray } = Array;
const { defineProperty: ObjectDefineProperty } = Object;

export { isArray, ObjectDefineProperty };

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

// tslint:disable-next-line
export function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}

const proxyMap: WeakMap<object, any> = new WeakMap();

export const unwrapProxy = (key: any): any => proxyMap.get(key) || key;
