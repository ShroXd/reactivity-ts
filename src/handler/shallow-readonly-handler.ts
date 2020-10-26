import { ReadonlyHandler } from './readonly-handler';

export class ShallowReadonlyHandler extends ReadonlyHandler {
  wrapValue(value: any): any {
    return value;
  }
}
