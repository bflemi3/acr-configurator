const encode = require('../util/encode');

module.exports = function greaterThan(table, value) {

    let field;
    try {
        field = table.getFields(value);
    } catch (error) {}

    return `>${field && field.field || encode(value)}`;
};