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

  const Class = args.pop();

  while (args.length) {
    const arg = args.pop();

    if (typeof arg !== 'function') break;

    const props = Object.getOwnPropertyNames(arg.prototype);

    for (const prop of props) {
      if (prop === 'constructor') {
        constructors.push(arg.prototype[prop]);
      } else {
        Class.prototype[prop] = arg.prototype[prop];
      }
    }
  }

  Class.prototype.constructor = function() {
    const output = Class.prototype.constructor.call(this, arguments);
    return output;
  }
  return Class;
}

/**
 * Module exports.
 */

module.exports = classes;