// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ReactiveHandler", () => {
    it ("should always return same proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.reactive(raw);
        const wet2 = membrane.reactive(raw);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.a).toStrictEqual(wet2.a);
    })

    it ("should never rewrap a previously produced proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.reactive(raw);
        const wet2 = membrane.reactive(wet1);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.a).toStrictEqual(wet2.a);
    })

    it ("default valueIsObservable can solve nested", () => {
        const fn = jest.fn();
        const raw = {
            a: 1,
            b: {
                c: 2
            }
        }
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                if (target[key] === 2) {
                    fn();
                }
            }
        })
        const wet = membrane.reactive(raw);
        wet.a;
        wet.b.c;
        expect(fn).toHaveBeenCalledTimes(1);
    })

    it ("make value reactive when access", () => {
        const fn = jest.fn();
        const raw = {
            a: 1,
            b: {
                c: 2
            }
        }
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                if (key === "b") {
                    fn();
                }
            }
        })
        const wet = membrane.reactive(raw);
        wet.a;
        expect(fn).not.toBeCalled();
    })

    it ("distortion", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            distortion(value) {
                fn()
                if (typeof value === "number") {
                    return value * 10
                }
                return value;
            }
        })
        const wet = membrane.reactive(raw);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(wet.a).toBe(10);
    })

    it ("has", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                fn();
            }
        });
        const wet = membrane.reactive(raw);
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
        const wet = membrane.reactive(raw);
        wet.b = 2;

        expect(wet.b).toStrictEqual(2);
        expect(fn).toHaveBeenCalledTimes(1);
    })

    it ("delete", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        });
        const wet = membrane.reactive(raw);
        delete wet.a;

        expect(fn).toHaveBeenCalledTimes(1);
        expect(wet.a).toStrictEqual(undefined);
    })
})
