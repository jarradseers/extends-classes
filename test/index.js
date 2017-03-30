/*!
 * Extends Classes.
 *
 * Main application file.
 * @author Jarrad Seers <jarrad@seers.me>
 * @created 30/03/2017 NZDT
 */

/**
 * Module dependencies.
 */

const classes = require('../');

class One {
  constructor(options) {
    this.options = options;
    console.log('One class constructed');
    this.fromInsideAConstructor = true;
  }
  one(info) {
    console.log('One method called on One class', info);
    this.hi = 'Hello world!';
    return this;
  }
}

class Two {
  constructor(options) {
    this.options = options;
    console.log('Two class constructed');
  }
  two(info) {
    console.log('Two method called on Two class', info);
    return this;
  }
  static hello() {
    console.log('Hello from the static method on Two');
  }
}

class Three {
  constructor(options) {
    console.log(`Three class constructed with hello option ${options.hello}`);
  }
  three(info) {
    console.log(this.hi);
    console.log('Three method called on Three class', info);
  }
}

class Test extends classes(One, Two, Three) {

  constructor(options) {
    super(options);
    this.options = options;
    console.log(`Test class constructed with hello option '${options.hello}'`);
  }

  __call(method) {
    console.log(`Method is missing '${method}()'`);
  }

}

const test = new Test({
  hello: 'passed into constructor'
});

test.one('p1m1', 'p2m1');
test.two('p1m2', 'p2m2');
test.three('p1m3', 'p2m3');
test.nothing('p1m4', 'p2m4');

Two.hello();

console.log(test.fromInsideAConstructor);
