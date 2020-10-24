// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ReactiveHandler", () => {
    it ("should always return same proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.getProxy(raw);
        const wet2 = membrane.getProxy(raw);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.a).toStrictEqual(wet2.a);
    })

    it ("should never rewrap a previously produced proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.getProxy(raw);
        const wet2 = membrane.getProxy(wet1);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.a).toStrictEqual(wet2.a);
    })

    it ("has", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                fn();
            }
        });
        const wet = membrane.getProxy(raw);
        const flag = "a" in wet;

        expect(flag).toBeTruthy();
        expect(fn).toHaveBeenCalledTimes(1);
    })

    it ("set", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        });
        const wet = membrane.getProxy(raw);
        wet.b = 2;

        expect(wet.b).toStrictEqual(2);
        expect(fn).toHaveBeenCalledTimes(1);
    })
})
