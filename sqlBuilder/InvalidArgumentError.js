const AbstractError = require('./AbstractError');

module.exports = class InvalidArgumentError extends AbstractError {
    constructor(name, type) {
        super(`Invalid argument. '${name}' must be of type ${type}.`);
    }
};