import { isArray, isFunction, isUndefined, ObjectDefineProperty, unwrapProxy } from './utils';
import { ReactiveHandler } from './handler/reactive-handler';
import { isRef, RefHandler } from './handler/ref-handler';
import { ReadonlyHandler } from './handler/readonly-handler';
import { ShallowReactiveHandler } from './handler/shallow-reactive-handler';
import { ShallowReadonlyHandler } from './handler/shallow-readonly-handler';

export type ReactiveMembraneAccessObserver = (target: any, key?: any) => void;
export type ReactiveMembraneMutationObserver = (target: any, key?: any) => void;
export type ReactiveMembraneDistortion = (value: any) => any;
export type ReactiveMembraneValueIsObservable = (value: any) => boolean;

export interface ReactiveMembraneInit {
  accessObserver?: ReactiveMembraneAccessObserver;
  mutationObserver?: ReactiveMembraneMutationObserver;
  distortion?: ReactiveMembraneDistortion;
  valueIsObservable?: ReactiveMembraneValueIsObservable;
}

interface ReactiveState {
  reactive: any;
}

function defaultValueIsObservable(value: any): boolean {
  return !(value === null || typeof value !== 'object');
}

const defaultAccessObserver: ReactiveMembraneAccessObserver = (target: any, key: any) => {
  // do nothing
};

const defaultMutationObserver: ReactiveMembraneMutationObserver = (target: any, key: any) => {
  // do nothing
};

const defaultDistortion: ReactiveMembraneDistortion = (value: any) => value;

export class ReactiveMembrane {
  accessObserver: ReactiveMembraneAccessObserver = defaultAccessObserver;
  mutationObserver: ReactiveMembraneMutationObserver = defaultMutationObserver;
  distortion: ReactiveMembraneDistortion = defaultDistortion;
  valueIsObservable: ReactiveMembraneValueIsObservable = defaultValueIsObservable;

  private objectGraph: WeakMap<any, ReactiveState> = new WeakMap();

  constructor(options?: ReactiveMembraneInit) {
    if (!isUndefined(options)) {
      const { accessObserver, mutationObserver, distortion, valueIsObservable } = options;
      this.accessObserver = isFunction(accessObserver) ? accessObserver : defaultAccessObserver;
      this.mutationObserver = isFunction(mutationObserver) ? mutationObserver : defaultMutationObserver;
      this.distortion = isFunction(distortion) ? distortion : defaultDistortion;
      this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
    }
  }

  reactive(value: any) {
    const unwrappedValue = unwrapProxy(value);
    const distortedValue = this.distortion(value);
    if (this.valueIsObservable(distortedValue)) {
      return this.getReactiveState(unwrappedValue, distortedValue);
    }
    return distortedValue;
  }

  readonly(value: any) {
    const unwrappedValue = unwrapProxy(value);
    const distortedValue = this.distortion(value);
    if (this.valueIsObservable(distortedValue)) {
      return this.getReadonlyState(unwrappedValue, distortedValue);
    }
    return distortedValue;
  }

  ref(value: any) {
    if (isRef(value)) {
      return value;
    }
    return new RefHandler(this, value);
  }

  shallowReactive(value: any) {
    const unwrappedValue = unwrapProxy(value);
    const distortedValue = this.distortion(value);
    if (this.valueIsObservable(distortedValue)) {
      return this.getReactiveState(unwrappedValue, distortedValue, true);
    }
    return distortedValue;
  }

  shallowReadonly(value: any) {
    const unwrappedValue = unwrapProxy(value);
    const distortedValue = this.distortion(value);
    if (this.valueIsObservable(distortedValue)) {
      return this.getReadonlyState(unwrappedValue, distortedValue, true);
    }
    return distortedValue;
  }

  private getReactiveState(unwrappedValue: any, distortedValue: any, isShallow: boolean = false) {
    const { objectGraph } = this;
    const reactiveState = objectGraph.get(distortedValue);
    if (reactiveState) return reactiveState;

    const reactiveHandler = isShallow
      ? new ShallowReactiveHandler(this, distortedValue)
      : new ReactiveHandler(this, distortedValue);
    return new Proxy(distortedValue, reactiveHandler);
  }

  private getReadonlyState(unwrappedValue: any, distortedValue: any, isShallow: boolean = false) {
    const { objectGraph } = this;
    const readonlyState = objectGraph.get(distortedValue);
    if (readonlyState) return readonlyState;

    const readonlyHandler = isShallow
      ? new ShallowReadonlyHandler(this, distortedValue)
      : new ReadonlyHandler(this, distortedValue);
    return new Proxy(distortedValue, readonlyHandler);
  }
}
