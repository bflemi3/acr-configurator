const builder = require('./builder'),
    _ = require('lodash'),
    equals = require('./operators/equals'),
    curry = require('./util/curry'),
    comparisonOperators = require('./config/comparisonOperators'),
    builders = [require('./operators/and'), require('./operators/or')];

function resolveValue(table, value) {
    if(!_.isPlainObject(value)) return equals(table, value);

    const [key, v] = Object.entries(value)[0];
    if(!comparisonOperators[key])
        throw new Error(`Invalid operator '${key}'. Valid operators are ${Object.keys(comparisonOperators)}.`);

    return comparisonOperators[key](table, v);
}

function where(table, sql) {
    return {
        where(expression) {
            const clauses = where.getClauses(table, expression);
            sql = `${sql} where ${clauses}`;
            return builder(builders, table, sql);
        }
    };
}

where.getClauses = function(table, expression) {
    if(!table)
        throw new TypeError(`Invalid argument. 'table' must be an instance of Table.`);

    const resolve = curry(resolveValue, table),
        clauses = [];

    for(let [key, value] of Object.entries(expression)) {
        const field = table.getFields(key)[0];
        clauses.push(`${field.field}${resolve(value)}`);
    }

    return `${clauses.join(' and ')}`;
};

module.exports = where;