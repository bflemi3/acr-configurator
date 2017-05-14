const builder = require('./builder'),
    comparisonOperators = require('./config/comparisonOperators');

module.exports = function where(table, sql) {

    return {
        where(field) {
            field = table.getFields(fields)[0];
            return builder(comparisonOperators, table, `${sql} where ${field.field}`);
        }
    };
};