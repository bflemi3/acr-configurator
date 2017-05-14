const builders = [require('./and'), require('./or'), require('../join'), require('../orderBy')],
    builder = require('../builder');

module.exports = function equals(table, sql) {

    return {
        equals(expression) {
            let field;
            try {
                field = table.getFields(expression);
            } catch (error) {}

            return builder(builders, table, `${sql} ' = ' ${field && field.field || expression}`);
        }
    }
};