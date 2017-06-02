const builder = require('../builder'),
    { getClauses } = require('../where'),
    or = require('./or');

module.exports = function and(table, sql) {

    return {
        and(expression) {
            const clauses = getClauses(table, expression);
            return builder([and, or], table, `${sql} and ${clauses}`);
        }
    };
};