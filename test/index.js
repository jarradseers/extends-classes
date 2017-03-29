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
  constructor() {
    console.log('A class constructed');
  }
  one(hi) {
    console.log('One method called on A class');
    this.hi = 'Hello world!';
  }
}

class B {
  constructor() {
    console.log('B class constructed');
  }
  two() {
    console.log('Two method called on B class');
  }
}

class C {
  constructor() {
    console.log('C class constructed');
  }
  three() {
    console.log(this.hi);
    console.log('Three method called on C class');
  }
}

class Test extends classes (A, B, C) {

  constructor() {
    super();
    console.log('Test class constructed');
  }

}

const test = new Test();

test.one('hi');
test.two();
test.three();
