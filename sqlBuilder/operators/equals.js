module.exports = function equals(table, value) {

    let field;
    try {
        field = table.getFields(value);
    } catch (error) {}

    return `=${field && field.field || expression}`;
};