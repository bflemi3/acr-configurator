module.exports = function apply(fns, ...args) {
    fns.map(f => f(...args));
};