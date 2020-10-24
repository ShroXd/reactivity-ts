// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ref", () => {
    it ("ref accessObserver", () => {
        const fn = jest.fn();
        const raw = 1;
        const membrane = new ReactiveMembrane({
            accessObserver(target) {
                fn();
            }
        })
        let wet = membrane.ref(raw);
        wet.value;

        expect(fn).toHaveBeenCalledTimes(1);
    })

    it ("ref mutationObserver", () => {
        const fn = jest.fn();
        const raw = 1;
        const membrane = new ReactiveMembrane({
            mutationObserver(target) {
                fn();
            }
        })
        let wet = membrane.ref(raw);
        wet.value = 2;

        expect(fn).toHaveBeenCalledTimes(1);
        expect(wet.value).toStrictEqual(2);
    })

    it ("should never rewrap a previously produced ref", () => {
        const raw = 1;
        const membrane = new ReactiveMembrane();
        const wet1 = membrane.ref(raw);
        const wet2 = membrane.ref(wet1);

        expect(wet1).toStrictEqual(wet2);
        expect(wet1.value).toStrictEqual(wet2.value);
    })

    // it ("test", () => {
    //     const raw = { a: 1 };
    //     let name = (() => {
    //         return raw.a
    //     })()
    //
    //     raw.a = 2;
    //     console.log(name);
    // })
})
