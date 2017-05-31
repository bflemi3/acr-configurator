const builder = require('./builder'),
    and = require('./operators/and');

module.exports = function orderBy(table, sql) {

    function orderByImpl(order) {
        return (fieldName) => {
            const field = table.getFields(fieldName)[0];
            return builder(and, table, `${sql} order by ${table.name}.${field.field} ${order}`);
        }
    }

    return {
        orderByDesc: orderByImpl('desc'),
        orderByAsc: orderByImpl('asc')
    };
};