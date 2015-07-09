
import ensureAccessors from "./ensure-accessors";

export default function valueValidator(fn) {
    return ensureAccessors((...args) => {
        const validator = fn(...args);

        return (target, name, { set, ...rest }) => {
            if (set) {
                return {
                    ...rest,
                    set(value) {
                        if (this::validator(value)) {
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
