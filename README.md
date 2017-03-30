# Extend Multiple Classes

  Ever wanted to extend from multiple classes in Javascript? well now you can.

## Usage

```js
const classes = require('extends-classes');

class Test extends classes (A, B, C) {
}
```

Method missing:

```js
const classes = require('extends-classes');

class Test extends classes (A, B, C) {
  constructor() {
    super();
  }

  __call(method, args) {
    console.log(`'${method}()' is missing!`);
  }
}

const test = new Test();

test.somethingThatIsNonExistent();
// 'somethingThatIsNonExistent()' is missing!
```

MethodMissing is included in the stack, see [method-missing](https://www.npmjs.com/package/method-missing).

Check out the [test folder](test) for more!

## Installation

```bash
$ npm install extends-classes
```

## Features

  * Extend multiple es6 classes.
  * Simple and light-weight.
  * Includes MethodMissing.
  * Written in ES6+ for node.js 6+.
  * Clean solution to extending from multiple classes.

## Options

  If you don't like the naming, just change it when requiring.

```js
const many = require('extends-classes');

class Test extends many (A, B, C) {
  // class stuff.
}
```

## Tests

  From the package 

  ```bash
  $ npm test
  ```

## License

  [MIT](LICENSE)