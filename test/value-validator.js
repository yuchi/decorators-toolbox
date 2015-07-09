
import valueValidator from "../value-validator";
import { strictEqual } from "assert";

describe("Value Validator", () => {
    const multipleOf = valueValidator(m => n => (n % m === 0));

    it("should work with property initializers in objects", () => {
        const obj = {
            @multipleOf(2)
            value: 0,

            @multipleOf(3)
            wrongValue: 2
        };

        strictEqual(obj.value, 0);
        obj.value = 3;
        strictEqual(obj.value, 0);
        obj.value = 8;
        strictEqual(obj.value, 8);

        strictEqual(obj.wrongValue, undefined);
        obj.wrongValue = 9;
        strictEqual(obj.wrongValue, 9);
    });

    xit("should work with property initializers in classes", () => {});
    xit("should work with static property initializers in classes", () => {});
    xit("should work with property accessors in objects", () => {});
    xit("should work with property accessors in classes", () => {});
    xit("should work with static property accessors in classes", () => {});

});
