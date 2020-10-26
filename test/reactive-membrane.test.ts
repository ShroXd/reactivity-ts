// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("constructor", () => {
    it ("no config", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane();
        const wet = membrane.reactive(raw);
        expect(wet.a).toBe(1);
    })

    it ("empty config", () => {
        const raw = { a: 1 };
        const membrane = new ReactiveMembrane({});
        const wet = membrane.reactive(raw);
        expect(wet.a).toBe(1);
    })
})
