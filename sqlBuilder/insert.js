const isPlainObject = require('./util/isPlainObject'),
    isString = require('./util/isString'),
    isUndefined = require('./util/isUndefined'),
    builder = require('./builder'),
    InvalidArgumentError = require('./InvalidArgumentError'),
    where = require('./where'),
    encode = require('./util/encode');

module.exports = function insert(table) {

    return {
        insert(obj) {
            if(!isPlainObject(obj))
                throw new InvalidArgumentError('obj', 'object');

            const { into, values } = Object.entries(obj).reduce((result, { field, name }) => {
                if(isUndefined(obj[name])) return result;
                result.into.push(field);
                result.values.push(encode(obj[name]));
                return result;
            }, { into: [], values: [] });

            const sql = `insert into ${table.name} (${into.join(',')}) values (${values.join(',')})`;
            return builder([], table, sql);
        }
    }
};