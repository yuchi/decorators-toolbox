
import valueTransformer from "../value-transformer";
import { strictEqual, deepEqual } from "assert";

describe("Value Transformer", () => {
    const multiplier = valueTransformer(m => n => n * m);
    const logger = valueTransformer(log => fn => function (...args) {
        log.push([ 'call', args ]);
        return this::fn(...args);
    });

    it("should work with property initializers in objects", () => {
        const log = [];

        const obj = {
            @multiplier(2)
            value: 21,

            @multiplier(3)
            anotherValue: 14,

            @logger(log)
            method() { return 42; }
        };

        strictEqual(obj.value, 42);
        strictEqual(obj.anotherValue, 42);
        strictEqual(obj.method(), 42);

        deepEqual(log[0], [ 'call', [] ]);
    });

    it("should work with property initializers in classes", () => {
        const log = [];

        class Obj {
            @multiplier(2)
            value = 21;

            @multiplier(3)
            anotherValue = 14;

            @multiplier(2)
            computedValue = this.value;

            @logger(log)
            method() { return 42; }
        }

        const obj = new Obj();

        strictEqual(obj.value, 42);
        strictEqual(obj.anotherValue, 42);
        strictEqual(obj.computedValue, 84);
        strictEqual(obj.method(), 42);

        deepEqual(log[0], [ 'call', [] ]);
    });

    it("should work with static property initializers in classes", () => {
        const log = [];

        class Obj {
            @multiplier(2)
            static value = 21;

            @multiplier(3)
            static anotherValue = 14;

            @multiplier(2)
            static computedValue = this.value;

            @logger(log)
            static method() { return 42; }
        }

        strictEqual(Obj.value, 42);
        strictEqual(Obj.anotherValue, 42);
        strictEqual(Obj.computedValue, 84);
        strictEqual(Obj.method(), 42);

        deepEqual(log[0], [ 'call', [] ]);
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
        strictEqual(valueFromSet2, 8);
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
        strictEqual(valueFromSet2, 8);
    });

    it("should work with static property accessors in classes", () => {
        let valueFromSet1;
        let valueFromSet2;

        class Obj {
            @multiplier(2)
            static get value() {
                return 21;
            }

            @multiplier(3)
            static set anotherValue(n) {
                valueFromSet1 = n;
            }

            @multiplier(4)
            static set computedValue(n) {
                valueFromSet2 = n;
            }
            static get computedValue() {
                return valueFromSet2;
            }
        };

        Obj.anotherValue = 14;
        Obj.computedValue = 2;

        strictEqual(Obj.value, 42);

        strictEqual(valueFromSet1, 42);

        strictEqual(Obj.computedValue, 8);
        strictEqual(valueFromSet2, 8);
    });

    it("should work with the examples in the README", () => {
        const trimmer = valueTransformer(() => s => s.trim());
        const upperCase = valueTransformer(() => s => s.toUpperCase());
        const replacer = valueTransformer((from, to) => s => s.split(from).join(to));

        const target = {
          @trimmer()
          @upperCase()
          @replacer(',', '--')
          get value() { return this.storage; },
          set value(v) { this.storage = v; }
        };

        target.value = '   so space, very blanks    ';

        strictEqual(target.value, 'SO SPACE-- VERY BLANKS');
    });
});
