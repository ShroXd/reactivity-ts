import { BaseHandler, ReactiveMembraneShadowTarget } from './base-handler';

export class ReadonlyHandler extends BaseHandler {
  wrapValue(value: any): any {
    return value;
  }

  set(target: ReactiveMembraneShadowTarget, property: PropertyKey, receiver): boolean {
    if (process.env.NODE_ENV !== 'production') {
      const { originalTarget } = this;
      throw new Error(`You can't set a new value for read only constant: ${originalTarget}`);
    }
    return false;
  }

  deleteProperty(target: ReactiveMembraneShadowTarget, property: PropertyKey): boolean {
    if (process.env.NODE_ENV !== 'production') {
      const { originalTarget } = this;
      throw new Error(`You can't delete property ${property.toString()} of read only constant: ${originalTarget}`);
    }
    return false;
  }
}
