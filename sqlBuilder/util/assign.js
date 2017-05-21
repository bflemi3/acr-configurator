const apply = require('./apply');

module.exports = function assign(target, properties, ...args) {
    if(Array.isArray(target)) {
        args = [properties].concat(args);
        properties = target;
        target = {};
    }

    return Object.assign(target, ...apply(properties, ...args));
};