
export default function ensureAccessors(fn) {
    return (...args) => {
        const decorator = fn(...args);

        return (target, name, { initializer, get, set, ...rest }) => {
            const key = Symbol(name.toString());

            delete rest.writable; // Related to babel#1949

            if (get || set) {
                return decorator(target, name, { ...rest, get, set });
            }
            else {
                return decorator(target, name, {
                    ...rest,
                    get() {
                        if (!(key in this) && initializer) {
                            this[ key ] = this::initializer();
                        }

                        return this[ key ];
                    },
                    set(value) {
                        this[ key ] = value;
                    }
                });
            }
        };
    };
}
