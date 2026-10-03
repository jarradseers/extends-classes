/*!
 * Extends Classes.
 *
 * Test entry.
 * @author Jarrad Seers <jarrad@seers.me>
 * @created 30/03/2017 NZDT
 */

/**
 * Module dependencies.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const classes = require('../');

let constructed = [];

class One {
  constructor(options) {
    constructed.push('One');
    this.options = options;
    this.fromOne = true;
    this.list = [];
  }
  one(info) {
    this.hi = `Hello ${info}`;
    return this;
  }
  shared() {
    return 'one';
  }
}

class Two {
  constructor(options) {
    constructed.push('Two');
    this.fromTwo = options && options.hello;
  }
  two() {
    return this.hi;
  }
  shared() {
    return 'two';
  }
  static hello() {
    return 'Hello from the static method on Two';
  }
}

class Three {
  three() {
    return 'three';
  }
}

test('takes on the methods of every class', () => {
  class Test extends classes(One, Two, Three) {}
  const obj = new Test();

  assert.equal(obj.one('world'), obj);
  assert.equal(obj.two(), 'Hello world');
  assert.equal(obj.three(), 'three');
});

test('when two classes define the same method, the later class wins', () => {
  assert.equal(new (classes(One, Two))().shared(), 'two');
  assert.equal(new (classes(Two, One))().shared(), 'one');
});

test('a method on the extending class overrides the mixed in ones', () => {
  class Test extends classes(One, Two) {
    shared() {
      return `test over ${super.shared()}`;
    }
  }

  assert.equal(new Test().shared(), 'test over two');
});

test('runs each constructor once per instance, with the same arguments', () => {
  class Test extends classes(One, Two, Three) {}

  constructed = [];
  const first = new Test({ hello: 'world' });
  new Test({ hello: 'again' });
  new Test({ hello: 'and again' });

  assert.deepEqual(constructed, ['One', 'Two', 'One', 'Two', 'One', 'Two']);
  assert.deepEqual(first.options, { hello: 'world' });
  assert.equal(first.fromOne, true);
  assert.equal(first.fromTwo, 'world');
});

test('each instance has its own state', () => {
  class Test extends classes(One, Two) {}
  const a = new Test();
  const b = new Test();

  a.list.push('only on a');
  a.one('a');

  assert.deepEqual(b.list, []);
  assert.equal(b.hi, undefined);
  assert.ok(Object.keys(a).includes('list'));
  assert.equal(Object.prototype.hasOwnProperty.call(Test.prototype, 'list'), false);
});

test('the extending class has its own constructor', () => {
  class Test extends classes(One, Two) {
    constructor(options) {
      super(options);
      this.mine = options.hello.toUpperCase();
    }
  }

  const obj = new Test({ hello: 'world' });

  assert.equal(obj.mine, 'WORLD');
  assert.equal(obj.fromTwo, 'world');
});

test('getters and setters work against the instance', () => {
  class Sized {
    constructor() {
      this.n = 5;
    }
    get double() {
      return this.n * 2;
    }
    set double(value) {
      this.n = value / 2;
    }
  }

  class Test extends classes(Sized, Three) {}
  const obj = new Test();

  assert.equal(obj.double, 10);
  obj.double = 30;
  assert.equal(obj.n, 15);
});

test('takes on methods a class inherited from its own parent', () => {
  class Base {
    constructor() {
      this.fromBase = true;
    }
    base() {
      return 'base';
    }
    shared() {
      return 'base';
    }
    static create() {
      return 'created';
    }
  }

  class Child extends Base {
    shared() {
      return 'child';
    }
  }

  class Test extends classes(Child, Three) {}
  const obj = new Test();

  assert.equal(obj.base(), 'base');
  assert.equal(obj.shared(), 'child');
  assert.equal(obj.fromBase, true);
  assert.equal(Test.create(), 'created');
});

test('takes on static methods and properties', () => {
  class Config {}
  Config.defaults = { a: 1 };

  class Test extends classes(Two, Config) {}

  assert.equal(Test.hello(), 'Hello from the static method on Two');
  assert.deepEqual(Test.defaults, { a: 1 });
  assert.equal(Test.name, 'Test');
});

test('works with symbol-named methods', () => {
  class Listable {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
    }
  }

  class Test extends classes(Listable) {}

  assert.deepEqual([...new Test()], [1, 2]);
});

test('works with constructor functions', () => {
  function Legacy() {
    this.legacy = true;
  }
  Legacy.prototype.old = function old() {
    return 'old';
  };

  class Test extends classes(Legacy, Three) {}
  const obj = new Test();

  assert.equal(obj.legacy, true);
  assert.equal(obj.old(), 'old');
});

test('hands missing methods to __call when it is defined', () => {
  class Test extends classes(One, Two) {
    __call(method, args) {
      return `'${method}()' is missing, called with ${args.length} arguments`;
    }
  }

  assert.equal(new Test().nothing(1, 2), "'nothing()' is missing, called with 2 arguments");
});

test('without __call, a missing property is undefined', () => {
  class Test extends classes(One) {}
  const obj = new Test();

  assert.equal(obj.nothing, undefined);
  assert.throws(() => obj.nothing(), TypeError);
});

test('instances can be serialised, awaited and returned from async functions', async () => {
  class Test extends classes(One, Three) {}
  const obj = new Test({ a: 1 });

  assert.equal(JSON.stringify(obj), '{"options":{"a":1},"fromOne":true,"list":[]}');
  assert.equal(await obj, obj);
  assert.equal(await (async () => obj)(), obj);
});

test('the same classes can be combined more than once', () => {
  class A extends classes(One, Three) {}
  class B extends classes(One, Two) {}

  assert.equal(new A().two, undefined);
  assert.equal(typeof new B().two, 'function');
  assert.equal(new B().three, undefined);
});
