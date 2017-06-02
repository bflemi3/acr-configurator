module.exports = function isPlainObject(value) {
    return typeof value === 'object' && value !== null;
};