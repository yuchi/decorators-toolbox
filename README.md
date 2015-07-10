Decorators Toolbox
==================

A suite of helper for writing ES2016 (aka ES7) decorators.

## Tools in the box

- [**Value Transformer**](#value-transformer)
- [**Ensure Accessors**](#ensure-accessors)

- - -

Every helper has the same ‘shape’, you use them to build a decorator by
providing the required implementation details.

Every helper is tested against:
- object properties,
- object properties accessors,
- object function property shorthand,
- class initializers,
- class static initializers,
- class accessors,
- class static accessors.

**Very important disclaimer**: all built decorators must be used with parens,
that is in the form `@decorator(...args)`. You can anyway invoke it just after
creation to get a parens-free decorator. My personal advice: choose the parens.

### Value Transformer <a name="value-transformer"></a>

```js
import { valueTransformer } from 'decorators-toolbox';
import valueTransformer from 'decorators-toolbox/value-transformer';
```

Creates a decorator that modifies the value of the property you attach it to.

#### Examples

```js
const multiplier = valueTransformer(m => n => m * n);
//                                  ┬    ┬    ─┬───
//                                  │    │     └─ result
//                                  │    └─ value
//                                  └─ parameter

const target = {
  @multiplier(7) // the parameter
  value: 5       // the value
};

console.assert(target.value === 35); // the result, 3 × 5
```

```js
const trimmer = valueTransformer(() => s => s.trim());
const upperCase = valueTransformer(() => s => s.toUpperCase());
const replacer = valueTransformer((from, to) => s => s.split(from).join(to));

const target = {
  @trimmer()
  @upperCase()
  @replacer(',', '--')
  get value() {
    return this.storage;
  },
  set value(v) {
    this.storage = v;
  }
};

// If you use accessors it works with new values too.
target.value = '   so space, very blanks    ';

console.assert(target.value === 'SO SPACE-- VERY BLANKS');
```

## Ensure Accessors <a name="ensure-accessors"></a>

```js
import { ensureAccessors } from 'decorators-toolbox';
import ensureAccessors from 'decorators-toolbox/ensure-accessors';
```

Wraps a decorator in such a way that the descriptor is guaranteed to be of a
computed property.

When it has to convert a normal property to a computed one it uses a *Symbol* to
store the value in the object.

:warning: This helper creates decorators that make properties’ initialization
lazy! :warning:

### Examples

```js
const emitOnChange = ensureAccessors(() => (target, name, descriptor) => {
  const originalSet = descriptor.set;

  // You don’t have to worry about `value` or `initializer`

  return {
    ...descriptor,
    set(value) {
      this.emit(`change:${ name }`, { value });

      if (originalSet) {
        this::originalSet(value);
      }
    }
  };
});

class Person extends EventEmitter {
  @emitOnChange()
  firstName = "";
}

const author = new Person();

author.firstName = 'Pier Paolo'; // fires 'change:firstName'
```

## License

This library, *Decorators Toolbox*, is free software ("Licensed Software"); you
can redistribute it and/or modify it under the terms of the [GNU Lesser General
Public License](http://www.gnu.org/licenses/lgpl-2.1.html) as published by the
Free Software Foundation; either version 2.1 of the License, or (at your
option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; including but not limited to, the implied warranty of MERCHANTABILITY,
NONINFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General
Public License for more details.

You should have received a copy of the [GNU Lesser General Public
License](http://www.gnu.org/licenses/lgpl-2.1.html) along with this library; if
not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
Floor, Boston, MA 02110-1301 USA
