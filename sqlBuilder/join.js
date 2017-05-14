const builder = require('./builder'),
    FieldNotFoundError = require('./FieldNotFoundError'),
    comparisonOperators = require('./config/comparisonOperators'),
    [where, orderBy] = [require('./where'), require('./orderBy')];

module.exports = function join(table, sql) {

    function joinImpl(type) {
        return tableName => {
            return builder(on, table, `${sql} ${type}`);
        }
    }
    
    return {
        join: joinImpl('join'),
        leftJoin: joinImpl('left join'),
        rightJoin: joinImpl('right join')
    };
};

module.exports = function on(table, sql) {

    return {
        on(field) {
            return builder([comparisonOperators], table, `${sql} on ${field}`)
        }
    }
};