// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ShallowReactiveHandler", () => {
    it ("only root level properties are reactive", () => {
        const fn = jest.fn();
        const raw = {
            a: 1,
            b: {
                c: 2
            }
        }
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        })
        const wet = membrane.shallowReactive(raw);

        wet.b.c = 3;

        expect(fn).toHaveBeenCalledTimes(0);
        expect(wet.b.c).toStrictEqual(3);

        wet.a = 3
        expect(fn).toHaveBeenCalledTimes(1);
        expect(wet.a).toStrictEqual(3);

    })
})
