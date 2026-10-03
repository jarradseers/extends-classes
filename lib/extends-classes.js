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

const MethodMissing = require('method-missing');

/**
 * Static properties every function has, which are not copied.
 */

const builtin = ['length', 'name', 'prototype'];

/**
 * List an object and its ancestors, oldest first, stopping before the root.
 *
 * @param {object} obj object to start from
 * @param {object} root ancestor to stop at
 * @returns {array}
 */

function chain(obj, root) {
  const list = [];

  for (let cur = obj; cur && cur !== root; cur = Object.getPrototypeOf(cur)) {
    list.unshift(cur);
  }

  return list;
}

/**
 * Copy own properties, with their descriptors, from one object to another.
 *
 * @param {object} to object to copy onto
 * @param {object} from object to copy from
 * @param {array} skip property names to leave out
 */

function copy(to, from, skip) {
  for (const key of Reflect.ownKeys(from)) {
    if (!skip.includes(key)) {
      Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
    }
  }
}

/**
 * Main multi-class function.
 *
 * @param {...function} args classes to extend from
 * @returns {function} a class to extend
 */

function classes(...args) {

  /**
   * Skeleton Class.
   *
   * @class Class
   * @extends {MethodMissing}
   */

  class Class extends MethodMissing {

    /**
     * Creates an instance of Class, constructing each of the classes with
     * the same arguments and taking on their instance properties.
     *
     * @memberOf Class
     */

    constructor(...opts) {
      super();

      for (const arg of args) {
        copy(this, new arg(...opts), []);
      }
    }

  }

  /**
   * Take on the methods, accessors and statics of each class, including
   * those the class inherited. Later classes win.
   */

  for (const arg of args) {
    for (const proto of chain(arg.prototype, Object.prototype)) {
      copy(Class.prototype, proto, ['constructor']);
    }

    for (const parent of chain(arg, Function.prototype)) {
      copy(Class, parent, builtin);
    }
  }

  return Class;
}

/**
 * Module exports.
 */

module.exports = classes;
