
import ensureAccessors from "./ensure-accessors";

valueValidator.strict = strictValueValidator;
valueValidator.loose = looseValueValidator;

export function strictValueValidator(fn) {
    return looseValueValidator((...args) => {
        const validator = fn(...args);
        return function (value, name) {
            if (!this::validator(value)){
                throw new Error(`Invalid value '${ value }' for '${ name }' on ${ this }`);
            }
            else {
                return true;
            }
        };
    });
}

export function looseValueValidator(fn) {
    return ensureAccessors((...args) => {
        const validator = fn(...args);

        return (target, name, { set, ...rest }) => {
            if (set) {
                return {
                    ...rest,
                    set(value) {
                        if (this::validator(value, name)) {
                            this::set(value);
                        }
                    }
                };
            }
            else {
                return {
                    ...rest,
                    set
                };
            }
        };
    });
}

export default function valueValidator(fn) {
    const decorator = looseValueValidator(fn);

    decorator.loose = decorator;
    decorator.strict = strictValueValidator(fn);

    return decorator;
}
