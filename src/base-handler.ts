import { ReactiveMembrane } from './reactive-membrane';

export type ReactiveMembraneShadowTarget = object;

export abstract class BaseHandler {
  membrane: ReactiveMembrane;
  originalTarget: any;

  constructor(membrane: ReactiveMembrane, originalTarget: any) {
    this.membrane = membrane;
    this.originalTarget = originalTarget;
  }

  // Abstract Traps
  abstract set(target: ReactiveMembraneShadowTarget, property: PropertyKey, receiver): boolean;
  abstract deleteProperty(target: ReactiveMembraneShadowTarget, property: PropertyKey): boolean;

  // Abstract utility methods
  abstract wrapValue(value: any): any;

  // Shared Traps
  apply(target: ReactiveMembraneShadowTarget, thisArg: any, argumentsList: any[]) {
    // oops
  }

  get(target: ReactiveMembraneShadowTarget, property: PropertyKey): any {
    const {
      originalTarget,
      membrane: { accessObserver },
    } = this;
    const value = originalTarget[property];
    accessObserver(originalTarget, property);
    // make value reactive when access
    return this.wrapValue(value);
  }

  has(target: ReactiveMembraneShadowTarget, property: PropertyKey): boolean {
    const {
      originalTarget,
      membrane: { accessObserver },
    } = this;
    accessObserver(originalTarget, property);
    return property in originalTarget;
  }
}
