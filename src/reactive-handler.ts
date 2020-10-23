import { BaseHandler, ReactiveMembraneShadowTarget } from './base-handler';

export class ReactiveHandler extends BaseHandler {
  wrapValue(value: any): any {
    return this.membrane.getProxy(value);
  }

  set(target: ReactiveMembraneShadowTarget, property: PropertyKey, value: any): boolean {
    const {
      originalTarget,
      membrane: { mutationObserver },
    } = this;

    originalTarget[property] = value;
    mutationObserver(originalTarget, property);

    return true;
  }
}
