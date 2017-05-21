const builder = require('./builder'),
    _ = require('lodash'),
    equals = require('./operators/equals'),
    comparisonOperators = require('./config/comparisonOperators');

function resolve(table) {
    return value => {
        if(!_.isPlainObject(value)) return equals(table, value);

        const [key, value] = Object.entries(value)[0];
        if(!comparisonOperators[key])
            throw new Error(`Invalid operator '${key}'. Valid operators are ${Object.keys(comparisonOperators)}.`);

        return comparisonOperators[key](table, value);
    }
}

module.exports = function where(table, sql) {
    const resolve = resolve(table);
    return {
        where(expression) {
            const clauses = [];
            for(let [key, value] of Object.entries(expression)) {
                const field = table.getFields(key)[0];
                clauses.push(`${field.field}${resolve(value)}`);
            }

            sql = `${sql} where ${clauses.join(' and ')}`;
            return builder(comparisonOperators, table, sql);
        }
    };
};