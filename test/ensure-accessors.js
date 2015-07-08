
import ensureAccessors from "../ensure-accessors";
import { strictEqual, deepEqual } from "assert";

describe("Ensure Accessors", () => {
    const logger = ensureAccessors((log) => (target, name, { get, set, ...rest }) => {
        function newGet() {
            const value = get ? this::get() : undefined;
            log.push([ 'get', value ]);
            return value;
        }

        function newSet(value) {
            log.push([ 'set', value ]);
            if (set) this::set(value);
        }

        return {
            get: newGet,
            set: newSet,
            ...rest
        };
    });

    it("should work with property initializers in objects", () => {
        const log = [];

        const obj = {
            @logger(log)
            answer: 42
        };

        strictEqual(obj.answer, 42);
        strictEqual(log.length, 1);
        strictEqual(obj.answer, 42);
        strictEqual(log.length, 2);

        deepEqual(log[0], [ 'get', 42 ])
        deepEqual(log[1], [ 'get', 42 ]);

        obj.answer = 28;

        strictEqual(log.length, 3);
        deepEqual(log[2], [ 'set', 28 ]);

        strictEqual(obj.answer, 28);
        strictEqual(log.length, 4);
        deepEqual(log[3], [ 'get', 28 ]);
    });

    it("should work with property initializers in classes", () => {
        const log = [];

        class Obj {
            @logger(log)
            answer = 42
        };

        const obj = new Obj();

        strictEqual(obj.answer, 42);
        strictEqual(log.length, 1);
        strictEqual(obj.answer, 42);
        strictEqual(log.length, 2);

        deepEqual(log[0], [ 'get', 42 ])
        deepEqual(log[1], [ 'get', 42 ]);

        obj.answer = 28;

        strictEqual(log.length, 3);
        deepEqual(log[2], [ 'set', 28 ]);

        strictEqual(obj.answer, 28);
        strictEqual(log.length, 4);
        deepEqual(log[3], [ 'get', 28 ]);
    });

    it("should work with static property initializers in classes", () => {
        const log = [];

        class Obj {
            @logger(log)
            static answer = 42
        };

        strictEqual(Obj.answer, 42);
        strictEqual(log.length, 1);
        strictEqual(Obj.answer, 42);
        strictEqual(log.length, 2);

        deepEqual(log[0], [ 'get', 42 ])
        deepEqual(log[1], [ 'get', 42 ]);

        Obj.answer = 28;

        strictEqual(log.length, 3);
        deepEqual(log[2], [ 'set', 28 ]);

        strictEqual(Obj.answer, 28);
        strictEqual(log.length, 4);
        deepEqual(log[3], [ 'get', 28 ]);
    });

    it("should work with property accessors in objects", () => {
        const log = [];

        const obj = {
            @logger(log)
            get withGet() { return 42; },

            @logger(log)
            set withSet(value) { log.push([ 'trace', value ]); },

            @logger(log)
            get withBoth() { return this.tmp; },
            set withBoth(v) { this.tmp = v; }
        };

        strictEqual(obj.withGet, 42);
        strictEqual(log.length, 1);
        deepEqual(log[0], [ 'get', 42 ]);

        obj.withGet = 1;
        strictEqual(obj.withGet, 42);
        strictEqual(log.length, 3);
        deepEqual(log[1], [ 'set', 1 ]);
        deepEqual(log[2], [ 'get', 42 ]);

        obj.withSet = 1;
        strictEqual(obj.withSet, undefined);
        strictEqual(log.length, 6);
        deepEqual(log[3], [ 'set', 1 ]);
        deepEqual(log[4], [ 'trace', 1 ]);
        deepEqual(log[5], [ 'get', undefined ]);

        strictEqual(obj.withBoth, undefined);
        strictEqual(log.length, 7);
        deepEqual(log[6], [ 'get', undefined ]);

        obj.withBoth = 42;
        strictEqual(log.length, 8);
        strictEqual(obj.withBoth, 42);
        strictEqual(log.length, 9);
        deepEqual(log[7], [ 'set', 42 ]);
        deepEqual(log[8], [ 'get', 42 ]);
    });

    it("should work with property accessors in classes", () => {
        const log = [];

        class Obj {
            @logger(log)
            get withGet() { return 42; }

            @logger(log)
            set withSet(value) { log.push([ 'trace', value ]); }

            @logger(log)
            get withBoth() { return this.tmp; }
            set withBoth(v) { this.tmp = v; }
        };

        const obj = new Obj();

        strictEqual(obj.withGet, 42);
        strictEqual(log.length, 1);
        deepEqual(log[0], [ 'get', 42 ]);

        obj.withGet = 1;
        strictEqual(obj.withGet, 42);
        strictEqual(log.length, 3);
        deepEqual(log[1], [ 'set', 1 ]);
        deepEqual(log[2], [ 'get', 42 ]);

        obj.withSet = 1;
        strictEqual(obj.withSet, undefined);
        strictEqual(log.length, 6);
        deepEqual(log[3], [ 'set', 1 ]);
        deepEqual(log[4], [ 'trace', 1 ]);
        deepEqual(log[5], [ 'get', undefined ]);

        strictEqual(obj.withBoth, undefined);
        strictEqual(log.length, 7);
        deepEqual(log[6], [ 'get', undefined ]);

        obj.withBoth = 42;
        strictEqual(log.length, 8);
        strictEqual(obj.withBoth, 42);
        strictEqual(log.length, 9);
        deepEqual(log[7], [ 'set', 42 ]);
        deepEqual(log[8], [ 'get', 42 ]);
    });

    it("should work with static property accessors in classes", () => {
        const log = [];

        class Obj {
            @logger(log)
            static get withGet() { return 42; }

            @logger(log)
            static set withSet(value) { log.push([ 'trace', value ]); }

            @logger(log)
            static get withBoth() { return this.tmp; }
            static set withBoth(v) { this.tmp = v; }
        };

        strictEqual(Obj.withGet, 42);
        strictEqual(log.length, 1);
        deepEqual(log[0], [ 'get', 42 ]);

        Obj.withGet = 1;
        strictEqual(Obj.withGet, 42);
        strictEqual(log.length, 3);
        deepEqual(log[1], [ 'set', 1 ]);
        deepEqual(log[2], [ 'get', 42 ]);

        Obj.withSet = 1;
        strictEqual(Obj.withSet, undefined);
        strictEqual(log.length, 6);
        deepEqual(log[3], [ 'set', 1 ]);
        deepEqual(log[4], [ 'trace', 1 ]);
        deepEqual(log[5], [ 'get', undefined ]);

        strictEqual(Obj.withBoth, undefined);
        strictEqual(log.length, 7);
        deepEqual(log[6], [ 'get', undefined ]);

        Obj.withBoth = 42;
        strictEqual(log.length, 8);
        strictEqual(Obj.withBoth, 42);
        strictEqual(log.length, 9);
        deepEqual(log[7], [ 'set', 42 ]);
        deepEqual(log[8], [ 'get', 42 ]);
    });
});
