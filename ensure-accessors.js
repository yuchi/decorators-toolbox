
export default function ensureAccessors(fn) {
    return (...args) => {
        const decorator = fn(...args);

        return (target, name, { initializer, writable, get, set, ...rest }) => {
            let memo = {};
            const key = Symbol(name.toString());

            if ('value' in rest) {
                initializer = () => rest.value;
            }

            let descriptor;

            if (get || set) {
                descriptor = {
                    ...rest,
                    get,
                    set
                };
            }
            else {
                descriptor = {
                    ...rest,
                    get() {
                        if (key in this) {
                            return this[ key ];
                        }
                        else {
                            return this[ key ] = this::initializer();
                        }
                    },
                    set(value) {
                        if (writable) {
                            this[ key ] = value;
                        }
                        else {
                            throw new TypeError(`Cannot assign to read only property '${name}' of ${this}`)
                        }
                    }
                };
            }

            return decorator(target, name, descriptor) || descriptor;
        };
    };
}
