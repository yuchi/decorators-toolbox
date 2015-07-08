
import valueTransformer from "../value-transformer";
import { strictEqual } from "assert";

describe("Value Transformer", () => {
    const multiplier = valueTransformer(m => n => n * m);

    it("should work with property initializers in objects", () => {
        const obj = {
            @multiplier(2)
            value: 21,

            @multiplier(3)
            anotherValue: 14
        };

        strictEqual(obj.value, 42);
        strictEqual(obj.anotherValue, 42);
    });

    it("should work with property initializers in classes", () => {
        class Obj {
            @multiplier(2)
            value = 21;

            @multiplier(3)
            anotherValue = 14;

            @multiplier(2)
            computedValue = this.value;
        }

        const obj = new Obj();

        strictEqual(obj.value, 42);
        strictEqual(obj.anotherValue, 42);
        strictEqual(obj.computedValue, 84);
    });

    it("should work with property accessors in objects", () => {
        let valueFromSet1;
        let valueFromSet2;

        const obj = {
            @multiplier(2)
            get value() {
                return 21;
            },

            @multiplier(3)
            set anotherValue(n) {
                valueFromSet1 = n;
            },

            @multiplier(4)
            set computedValue(n) {
                valueFromSet2 = n;
            },
            get computedValue() {
                return valueFromSet2;
            }
        };

        obj.anotherValue = 14;
        obj.computedValue = 2;

        strictEqual(obj.value, 42);

        strictEqual(valueFromSet1, 42);

        strictEqual(obj.computedValue, 8);
        strictEqual(valueFromSet2, 2);
    });

    it("should work with property accessors in classes", () => {
        let valueFromSet1;
        let valueFromSet2;

        class Obj {
            @multiplier(2)
            get value() {
                return 21;
            }

            @multiplier(3)
            set anotherValue(n) {
                valueFromSet1 = n;
            }

            @multiplier(4)
            set computedValue(n) {
                valueFromSet2 = n;
            }
            get computedValue() {
                return valueFromSet2;
            }
        };

        const obj = new Obj();

        obj.anotherValue = 14;
        obj.computedValue = 2;

        strictEqual(obj.value, 42);

        strictEqual(valueFromSet1, 42);

        strictEqual(obj.computedValue, 8);
        strictEqual(valueFromSet2, 2);
    });
});
