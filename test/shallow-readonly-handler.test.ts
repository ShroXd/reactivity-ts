// @ts-ignore
import { ReactiveMembrane } from "../src";

describe("ShallowReadonlyHandler", () => {
    it ("only root level properties are readonly reactive", () => {
        const raw = {
            a: 1,
            b: {
                c: 2
            }
        }
        const membrane = new ReactiveMembrane()
        const wet = membrane.shallowReadonly(raw);

        expect(() => {
            wet.b.c = 3;
        }).not.toThrow();
        expect(wet.b.c).toStrictEqual(3);

        expect(() => {
            wet.a = 3;
        }).toThrow();
        expect(wet.a).toStrictEqual(1);
    })
})
