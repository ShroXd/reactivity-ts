import { isArray, isFunction, isUndefined, ObjectDefineProperty, unwrapProxy } from './utils';
import { ReactiveHandler } from './reactive-handler';

export type ReactiveMembraneAccessObserver = (obj: any, key: any) => void;
export type ReactiveMembraneMutationObserver = (obj: any, key: any) => void;
export type ReactiveMembraneDistortion = (value: any) => any;
export type ReactiveMembraneValueIsObservable = (value: any) => boolean;

export interface ReactiveMembraneInit {
  accessObserver: ReactiveMembraneAccessObserver;
  mutationObserver: ReactiveMembraneMutationObserver;
  distortion: ReactiveMembraneDistortion;
  valueIsObservable: ReactiveMembraneValueIsObservable;
}

interface ReactiveState {
  reactive: any;
}

function defaultValueIsObservable(value: any): boolean {
  return !(value === null || typeof value !== 'object');
}

const defaultAccessObserver: ReactiveMembraneAccessObserver = (obj: any, key: any) => {
  // do nothing
};

const defaultMutationObserver: ReactiveMembraneMutationObserver = (obj: any, key: any) => {
  // do nothing
};

const defaultDistortion: ReactiveMembraneDistortion = (value: any) => value;

const createShadowTarget = (value: any): any => {
  return isArray(value) ? [] : {};
};

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

  getProxy(value: any) {
    const unwrappedValue = unwrapProxy(value);
    const distortedValue = this.distortion(value);
    if (this.valueIsObservable(distortedValue)) {
      const o = this.getReactiveState(unwrappedValue, distortedValue);
      return o.reactive;
    }
    return distortedValue;
  }

  private getReactiveState(unwrappedValue: any, distortedValue: any): ReactiveState {
    const { objectGraph } = this;
    let reactiveState = objectGraph.get(distortedValue);
    if (reactiveState) return reactiveState;

    const membrane = this;
    reactiveState = {
      get reactive() {
        const reactiveHandler = new ReactiveHandler(membrane, distortedValue);
        const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
        ObjectDefineProperty(this, 'reactive', { value: proxy });
        return proxy;
      },
    } as ReactiveState;

    objectGraph.set(distortedValue, reactiveState);
    return reactiveState;
  }
}
