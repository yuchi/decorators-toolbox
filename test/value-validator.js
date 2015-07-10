
import valueValidator from "../value-validator";
import ensureAccessors from "../ensure-accessors";
import { strictEqual, throws } from "assert";

describe("Value Validator", () => {
    const multipleOf = valueValidator(m => n => (n % m === 0));

    it("should work with property initializers in objects", () => {
        const obj = {
            @multipleOf(2)
            value: 0,

            @multipleOf(3)
            wrongValue: 2,

            @multipleOf.strict(3)
            strictValue: 0
        };

        strictEqual(obj.value, 0);
        obj.value = 3;
        strictEqual(obj.value, 0);
        obj.value = 8;
        strictEqual(obj.value, 8);

        strictEqual(obj.wrongValue, undefined);
        obj.wrongValue = 9;
        strictEqual(obj.wrongValue, 9);

        throws(() => {
            obj.strictValue = 2;
        });
    });

    it("should work with property initializers in classes", () => {
        class Obj {
            @multipleOf(2)
            value = 0;

            @multipleOf(3)
            wrongValue = 2;

            @multipleOf.strict(3)
            strictValue = 0;
        }

        const obj = new Obj();

        strictEqual(obj.value, 0);
        obj.value = 3;
        strictEqual(obj.value, 0);
        obj.value = 8;
        strictEqual(obj.value, 8);

        strictEqual(obj.wrongValue, undefined);
        obj.wrongValue = 9;
        strictEqual(obj.wrongValue, 9);

        throws(() => {
            obj.strictValue = 2;
        });
    });

    it("should work with static property initializers in classes", () => {
        class Obj {
            @multipleOf(2)
            static value = 0;

            @multipleOf(3)
            static wrongValue = 2;

            @multipleOf.strict(3)
            static strictValue = 0;
        }

        strictEqual(Obj.value, 0);
        Obj.value = 3;
        strictEqual(Obj.value, 0);
        Obj.value = 8;
        strictEqual(Obj.value, 8);

        strictEqual(Obj.wrongValue, undefined);
        Obj.wrongValue = 9;
        strictEqual(Obj.wrongValue, 9);

        throws(() => {
            Obj.strictValue = 2;
        });
    });

    it("should work with property accessors in objects", () => {

    });

    it("should work with property accessors in classes", () => { throw null });
    it("should work with static property accessors in classes", () => { throw null });

});
