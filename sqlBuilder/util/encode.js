const isString = require('./isString');

module.exports = function encode(value) {
    return isString(value) ? `"${value}"` : value;
};