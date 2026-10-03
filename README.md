# Extends Classes

[![CI](https://github.com/jarradseers/extends-classes/actions/workflows/ci.yml/badge.svg)](https://github.com/jarradseers/extends-classes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/extends-classes.svg)](https://www.npmjs.com/package/extends-classes)

Extend from multiple classes in JavaScript.

## Installation

```bash
$ npm install extends-classes
```

## Usage

```js
const classes = require('extends-classes');

class Swimmer {
  swim() {
    return `${this.name} swims`;
  }
}

class Flyer {
  constructor(name) {
    this.name = name;
  }
  fly() {
    return `${this.name} flies`;
  }
}

class Duck extends classes(Swimmer, Flyer) {
  quack() {
    return `${this.name} quacks`;
  }
}

const duck = new Duck('Donald');

duck.swim(); // Donald swims
duck.fly(); // Donald flies
duck.quack(); // Donald quacks
```

## How it works

`classes(A, B, C)` returns a new class to extend. That class takes on, from each class you pass:

- **Methods, getters and setters**, including those the class inherited from its own parent.
- **Static methods and properties.**
- **Instance properties.** When you create an instance, each class is constructed once with the arguments passed to `super(...)`, and the properties its constructor sets are copied onto your instance.

When two classes define the same name, the later class in the list wins. Anything defined on your own class overrides them all, and can reach the mixed in version with `super.method()`.

Things to know:

- `instance instanceof A` is `false`. The members of `A` are copied; `A` is not in the prototype chain.
- Each constructor runs against its own temporary object, not your instance, so a constructor that calls a method only another class provides will not find it.
- Private fields (`#field`) belong to the temporary object and are not copied.

## Missing methods

[method-missing](https://www.npmjs.com/package/method-missing) is included in the stack. Define `__call` to catch calls to methods that do not exist:

```js
class Test extends classes(A, B, C) {

  __call(method, args) {
    return `'${method}()' is missing!`;
  }

}

new Test().somethingThatIsNonExistent();
// 'somethingThatIsNonExistent()' is missing!
```

Without `__call`, a missing property is `undefined` as on any object.

## Upgrading from 1.x

- Instance properties now live on each instance. In 1.x they were written to the shared prototype, so one instance's state showed up on every other.
- Getters and setters are copied as accessors. In 1.x a getter was read once, against the prototype, and its result copied.
- Inherited methods and static members are now included.
- Instances can be passed to `JSON.stringify`, awaited and returned from `async` functions. In 1.x these threw unless the class defined `__call`.
- Reading a missing property on a class without `__call` returns `undefined` instead of throwing `MethodMissingError`.

## Tests

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)
