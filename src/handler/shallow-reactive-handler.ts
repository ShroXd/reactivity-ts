import { ReactiveHandler } from './reactive-handler';

export class ShallowReactiveHandler extends ReactiveHandler {
  wrapValue(value: any): any {
    return value;
  }
}
