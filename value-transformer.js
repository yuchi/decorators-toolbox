
export default function valueTransformer(fn) {
    return (...args) => {
        const transformer = fn(...args);

        return (target, name, { initializer, get, set, ...rest }) => {
            if ('value' in rest) {
                return {
                    ...rest,
                    value: target::transformer(rest.value)
                };
            }
            else if (initializer) {
                return {
                    ...rest,
                    initializer(...args) {
                        return this::transformer(this::initializer(...args));
                    }
                };
            }
            else if (set) {
                delete rest.writable; // Related to babel#1949

                return {
                    ...rest,
                    get,
                    set(...args) {
                        return this::set(this::transformer(...args));
                    }
                }
            }
            else if (get) {
                delete rest.writable; // Related to babel#1949

                return {
                    ...rest,
                    get(...args) {
                        return this::transformer(this::get(...args));
                    }
                };
            }
        };
    };
}
