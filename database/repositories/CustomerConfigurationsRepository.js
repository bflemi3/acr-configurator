const Promise = require('bluebird'),
    AbstractRepository = require('./AbstractRepository'),
    tables = require('../../config.json').database.tables,
    _ = require('lodash'),
    sqlBuilder = require('../../sqlBuilder'),
    moment = require('moment'),
    configurations = sqlBuilder.table('acrconf', tables.acrconf),
    dateFormat = 'MM-DD-YY kk:mm';

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
            // if(!configuration) return;
            //
            // if(!(configuration.createdDate || configuration.ORIGINAL_CONFIG_DATE))
            //     configuration.createdDate = moment().format(dateFormat);
            //
            // let sql = configurations.insert(configuration);
            // const serialNumber = yield this.databaseClient.insert(sql.toString());
            // if(!serialNumber)
            //     throw new Error(`There was an error performing the INSERT and no result was returned from the database.`);
            //
            // sql = configurations.select(sqlBuilder.STAR).where({ serialNumber });
            // return this.databaseClient.get(sql.toString());
        });

        /**
         * Update a Configuration object
         * @param configuration {Object}
         * @param where {Object}
         * @returns {Promise<Object>}
         */
        this.update = Promise.coroutine(function*(configuration, where) {
            if(!configuration) return;

            if(!(configuration.lastUpdated || configuration.ORIGINAL_UPDATE_DATE))
                configuration.lastUpdated = moment().format(dateFormat);

            let sql = configurations.update(configuration),
                hasWhere = _.isPlainObject(where);

            if(hasWhere)
                sql = sql.where(where);

            let result = yield this.databaseClient.update(sql.toString());
            if(!result)
                throw new Error(`There was an error performing the UPDATE and no result was returned from the database.`);

            sql = configurations.select(sqlBuilder.STAR);
            if(hasWhere) sql = sql.where(where);
            return this.databaseClient.get(sql.toString());
        });
    }
};