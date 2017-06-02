const AbstractError = require('./AbstractError');

module.exports = class FieldNotFoundError extends AbstractError {
    constructor(table, field) {
        super(`Field '${field}' not found in table '${table}'. Please add the field configuration to the correct table.`);
    }
};