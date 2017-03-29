/*!
 * Extends Classes.
 *
 * Main application file.
 * @author Jarrad Seers <jarrad@seers.me>
 * @created 30/03/2017 NZDT
 */

'use strict';

/**
 * Main multi-class function.
 * 
 * @param {any} args 
 * @returns 
 */

function classes(...args) {
  const constructors = [];

  class Class {
    constructor() {
      for (const constructor of constructors) {
        Object.assign(Class.prototype, new constructor(arguments));
      }
    }
  }

  for (const arg of args) {
    const props = Object.getOwnPropertyNames(arg.prototype);
    for (const prop of props) {
      if (prop === 'constructor') {
        constructors.push(arg.prototype.constructor);
      } else {
        Class.prototype[prop] = arg.prototype[prop];
      }
    }
  }

  return Class;
}

/**
 * Module exports.
 */

module.exports = classes;