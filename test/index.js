/*!
 * Extends Classes.
 *
 * Main application file.
 * @author Jarrad Seers <jarrad@seers.me>
 * @created 30/03/2017 NZDT
 */

// TODO: write some real unit tests at some point.

'use strict';

/**
 * Module dependencies.
 */

const classes = require('../');

class A {
  constructor(options) {
    console.log('A class constructed');
  }
  one(hi) {
    console.log('One method called on A class');
    this.hi = 'Hello world!';
  }
}

class B {
  constructor(options) {
    console.log('B class constructed');
  }
  two() {
    console.log('Two method called on B class');
  }
}

class C {
  constructor(options) {
    console.log(`C class constructed with hello option ${options.hello}`);
  }
  three() {
    console.log(this.hi);
    console.log('Three method called on C class');
  }
}

class Test extends classes (A, B, C) {

  constructor(options) {
    super(options);
    this.options = options;
    console.log(`Test class constructed with hello option '${options.hello}'`);
  }

  __call(method, args){
    console.log(`Method is missing '${method}()'`)
  }

}

const test = new Test({
  hello: 'passed into constructor'
});

test.one('p1m1', 'p2m1');
test.two('p1m2', 'p2m2');
test.three('p1m3', 'p2m3');
test.nothing('p1m4', 'p2m4');