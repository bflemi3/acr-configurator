const isPlainObject = require('./util/isPlainObject'),
    isString = require('./util/isString'),
    builder = require('./builder'),
    InvalidArgumentError = require('./InvalidArgumentError'),
    where = require('./where');

module.exports = function update(table) {

    return {
        update(obj) {
            if(!isPlainObject(obj))
                throw new InvalidArgumentError('obj', 'object');

            const sets = Object.entries(obj)
                .map(([key, value]) => `${table.getFields(key)[0].field}=${isString(value) ? `"${value}"` : value}`)
                .join(',');

            const sql = `update ${table.name} set ${sets}`;
            return builder(where, table, sql);
        }
    }
};