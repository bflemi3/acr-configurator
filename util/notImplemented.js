module.exports = function notImplemented() {
    throw new TypeError(`Can not call abstract method. Method '${arguments.callee.name}' must be implemented.`);
} ;