module.exports = function apply(fns, ...args) {
    return fns.map(f => f(...args));
};