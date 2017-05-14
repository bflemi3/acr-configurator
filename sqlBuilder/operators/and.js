const builder = require('../builder'),
    comparisonOperators = require('../config/comparisonOperators');

module.exports = function and(table, sql) {

    return {
        and(fieldName) {
            const field = table.getFields(fieldName);
            return builder(comparisonOperators, table, `${sql} and ${table.name}.${field.field}`);
        }
    };
};