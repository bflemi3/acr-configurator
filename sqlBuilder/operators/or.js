const builder = require('../builder');

module.exports = function or(table, sql) {
    const and = require('./and'),
        { getClauses } = require('../where');

    return {
        or(expression) {
            const clauses = getClauses(table, expression);
            return builder([and, or], table, `${sql} or ${clauses}`);
        }
    };
};