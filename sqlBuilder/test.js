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
    .where({ serialNumber: { gt: 400 } }).or({ name: { eq: 'serialNumber' } });
console.log(`Complex SELECT WHERE with OR ...\n${sql.toString()}`);

sql = test.update({ name: 'brandon', CUSTOMER_NUMBER: 22 }).where({ serialNumber: '11111ll', name: 'bob' });
console.log(`UPDATE ...\n${sql.toString()}`);

sql = test.insert({ name: 'brandon', customerNumber: 22 });
console.log(`INSERT ...\n${sql.toString()}`);