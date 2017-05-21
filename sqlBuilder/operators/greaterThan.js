module.exports = function greaterThan(table, value) {

    let field;
    try {
        field = table.getFields(value);
    } catch (error) {}

    return `>${field && field.field || expression}`;
};