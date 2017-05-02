module.exports = function notImplemented() {
    throw new TypeError(`Can not call abstract method. Method '${arguments.callee.caller.name}' must be implemented.`);
} ;