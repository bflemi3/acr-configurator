const fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

/**
 * The mapDirectory module can be used to read the files a given directory and return an object based on the return statement
 * of the given callback. This module is mainly used to create dictionaries of all the modules in a given directory.
 *
 * See /disoovery/parameterProcessorProvider.js for an actual usage example.
 *
 * @param dir - the directory to read
 * @param iterator - the mapping function
 * @param initialValue - The initial value to add each result to. Defaults to Object. Can be Array or Object.
 * @returns {Object}
 */
module.exports = function mapDirectory(dir, iterator, initialValue) {
    initialValue = initialValue || {};

    dir = path.join(process.cwd(), dir);

    fs.readdirSync(dir).forEach(file => {
        const value = iterator(file, dir);
        if(_.isUndefined(value)) return;

        if(_.isPlainObject(initialValue) && _.isPlainObject(value)) return Object.assign(initialValue, value);
        if(Array.isArray(initialValue)) initialValue.push(value);
    });

    return initialValue;
};