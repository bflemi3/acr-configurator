const Table = require('./Table'),
    builders = [require('./select')/*, require('./insert'), require('./update')*/];

module.exports = (function sqlBuilder() {
    const tables = new Map();
    function table(name, options) {
        if(tables.has(name)) return tables.get(name);

        const table = new Table(name, options);
        tables.set(name, table);
        return table;
    }

    return {
        table,
        STAR: builders[0].STAR
    }
})();