const Promise = require('bluebird'),
    AbstractRepository = require('./AbstractRepository'),
    tables = require('../../config.json').database.tables,
    _ = require('lodash'),
    sqlBuilder = require('../../sqlBuilder'),
    configurations = sqlBuilder.table('acrconf', tables.acrconf);

module.exports = class CustomerConfigurationsRepository extends AbstractRepository {
    constructor(databaseClient) {
        super(databaseClient);

        /**
         * Get a collection of Configuration objects
         * @param where {Object}
         * @returns {Promise<Array<Object>>}
         */
        this.get = Promise.coroutine(function*(where) {
            const sql = configurations.select(sqlBuilder.STAR);

            if(_.isPlainObject(where))
                sql.where(where);

            return databaseClient.get(sql.toString());
        });

        /**
         * Insert a new Configuration object
         * @param configuration {Object}
         * @returns {Promise<Object>}
         */
        this.insert = Promise.coroutine(function*(configuration) {
            const sql = configurations.insert(configuration);
            return this.databaseClient.insert(sql.toString());
        });

        /**
         * Update a Configuration object
         * @param configuration {Object}
         * @param where {Object}
         * @returns {Promise<Object>}
         */
        this.update = Promise.coroutine(function*(configuration, where) {
            let sql = configurations.update(configuration);

            if(_.isPlainObject(where))
                sql = sql.where(where);

            return this.databaseClient.update(sql.toString());
        });
    }
};