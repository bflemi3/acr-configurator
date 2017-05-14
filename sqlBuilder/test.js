const sqlBuilder = require('../sqlBuilder'),
    tables = require('../config.json').database.tables;

const test = sqlBuilder.table('test', tables.acrconf);

console.log(test.select(sqlBuilder.STAR));