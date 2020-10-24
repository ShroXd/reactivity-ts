// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("constructor", () => {
    it ("no config", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet = membrane.getProxy(raw);
        expect(wet.a).toBe(1);
    })

    it ("empty config", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({});
        const wet = membrane.getProxy(raw);
        expect(wet.a).toBe(1);
    })
})

describe("API", () => {
    it ("access observer", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                fn();
            }
        })
        const wet = membrane.getProxy(raw);
        wet.a;
        expect(fn).toHaveBeenCalledTimes(1);
    })

    it ("mutation observer", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        })
        const wet = membrane.getProxy(raw);
        wet.a = 2;
        expect(fn).toHaveBeenCalledTimes(1);
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
        const wet = membrane.getProxy(raw);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(wet.a).toBe(10);
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
        const wet = membrane.getProxy(raw);
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
        const wet = membrane.getProxy(raw);
        wet.a;
        expect(fn).not.toBeCalled();
    })
})
