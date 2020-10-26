import { ReactiveMembrane } from '../reactive-membrane';

export interface Ref<T = any> {
  value: T;
}

export function isRef(value: any): value is Ref {
  return Boolean(value && value._isRef === true);
}

export class RefHandler<T> {
  private readonly membrane: ReactiveMembrane;
  private _value: T;
  public readonly _isRef = true;

  constructor(membrane: ReactiveMembrane, private _rawValue: T) {
    this.membrane = membrane;
    this._value = _rawValue;
  }

  get value() {
    const { accessObserver } = this.membrane;
    accessObserver(this._value);
    return this._value;
  }

  set value(newVal: T) {
    const {
      membrane: { mutationObserver },
    } = this;
    mutationObserver(this._value);
    this._value = newVal;
  }
}
