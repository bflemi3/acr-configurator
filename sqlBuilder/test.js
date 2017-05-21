const sqlBuilder = require('../sqlBuilder'),
    tables = require('../config.json').database.tables;

const test = sqlBuilder.table('test', tables.acrconf);

console.log(`SELECT ...\n${test.select(sqlBuilder.STAR).toString()}`);

let sql = test.select(sqlBuilder.STAR).where({ serialNumber: '444' });
console.log(`SELECT WHERE ...\n${sql.toString()}`);

sql = test.select(sqlBuilder.STAR)
    .where({ serialNumber: '444' }).or({ name: 'testName' });
console.log(`SELECT WHERE with OR ...\n${sql.toString()}`);

sql = test.select(sqlBuilder.STAR)
    .where({ serialNumber: { gt: '400'} }).or({ name: { equals: 'serialNumber' } });
console.log(`SELECT WHERE with OR ...\n${sql.toString()}`);