// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ReadonlyHandler", () => {
    it ("should always return same proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.readonly(raw);
        const wet2 = membrane.readonly(raw);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.a).toStrictEqual(wet2.a);
    })

    it ("should never rewrap a previously produced proxy", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.readonly(raw);
        const wet2 = membrane.readonly(wet1);

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
        const wet = membrane.readonly(raw);
        const flag = "a" in wet;
        expect(flag).toBeTruthy();
        expect(fn).toHaveBeenCalledTimes(1);
    })

    it("set", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        })
        const wet = membrane.readonly(raw);

        expect(() => {
            wet.b = 2;
        }).toThrow();
        expect(fn).not.toBeCalled();
    })

    it("get", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            accessObserver(target, key) {
                fn();
            }
        })
        const wet = membrane.readonly(raw);
        wet.a;

        expect(fn).toHaveBeenCalledTimes(1);
    })

    it("delete", () => {
        const fn = jest.fn();
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({
            mutationObserver(target, key) {
                fn();
            }
        });
        const wet = membrane.readonly(raw);

        expect(() => {
            delete wet.a;
        }).toThrow();
        expect(fn).not.toBeCalled();
    })
})
