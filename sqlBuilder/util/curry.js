module.exports = function curry(fn, ...rest) {
    return function(...args) {
        return fn(...(rest.concat(args)));
    }
};