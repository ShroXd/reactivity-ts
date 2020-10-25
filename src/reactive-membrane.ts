import { isArray, isFunction, isUndefined, ObjectDefineProperty, unwrapProxy } from './utils';
import { ReactiveHandler } from './reactive-handler';
import { isRef, RefHandler } from './ref-handler';
import { ReadonlyHandler } from './readonly-handler';

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

  private getReactiveState(unwrappedValue: any, distortedValue: any) {
    const { objectGraph } = this;
    const reactiveState = objectGraph.get(distortedValue);
    if (reactiveState) return reactiveState;

    const reactiveHandler = new ReactiveHandler(this, distortedValue);
    return new Proxy(distortedValue, reactiveHandler);
  }

  private getReadonlyState(unwrappedValue: any, distortedValue: any) {
    const { objectGraph } = this;
    const readonlyState = objectGraph.get(distortedValue);
    if (readonlyState) return readonlyState;

    const readonlyHandler = new ReadonlyHandler(this, distortedValue);
    return new Proxy(distortedValue, readonlyHandler);
  }
}
