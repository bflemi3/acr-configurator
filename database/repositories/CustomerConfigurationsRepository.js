const Promise = require('bluebird'),
    AbstractRepository = require('./AbstractRepository'),
    tables = require('../../config.json').database.tables,
    _ = require('lodash'),
    SqlBuilder = require('sqlBuilder'),
    sqlBuilder = new SqlBuilder(),
    configurations = sqlBuilder.table('acrconf', tables.acrconf);

module.exports = class CustomerConfigurationsRepository extends AbstractRepository {
    constructor(databaseClient) {
        super(databaseClient);

        /**
         * Get a collection of Configuration objects
         * @param query {Object}
         * @returns {Promise<Array<Object>>}
         */
        this.get = Promise.coroutine(function*(query) {
            const sql = configurations.select(SqlBuilder.STAR);

            if(_.isPlainObject(query))
                sql.where(query);

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
            let sql = configurations.update(configuration).set(config.get.from);

            if(_.isPlainObject(where))
                sql = sql.where(translateWhere(where));

            return this.databaseClient.insert(sql.toString());
        });
    }
};