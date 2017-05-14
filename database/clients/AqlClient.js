const AbstractDatabaseClient = require('./AbstractDatabaseClient'),
    Promise = require('bluebird'),
    config = require('../../config.json').queries,
    _ = require('lodash'),
    aql = require('net').Socket(),
    notImplemented = require('../../util/notImplemented');

const queryParts = {
    select(values) { return `SELECT ${values}`; },
    from(value) { return `FROM ${value}`; },
    where(clientItems, config) {
        if(!_.isPlainObject(clientItems))
            throw new TypeError(`Unable to build SQL statement. Invalid where object given.`);

        if(!Array.isArray(config.where))
            throw new TypeError(`Unable to build SQL statement. Invalid configuration where object. The where property of the configuration must be an Array.`);

        function clause(field, operator = '=', value) {
            return `${field} ${operator} ${value}`;
        }

        function resolve(clientItems, operator = whereOperators.and) {
            let clauses = [],
                sql = '';

            for(let [key, value] of Object.entries(clientItems)) {
                if(whereOperators[key]) {
                    clauses.push(sql += `${resolve(value, whereOperators[key])} `);
                    continue;
                }

                const item = config.where.find(w => w.name === key);
                if(!item) continue;
                clauses.push(clause(item.field, value.operator, value.value));
            }

            sql += operator(clauses);
            return sql;
        }

        return `where ${resolve(clientItems)}`;
    }
};

const whereOperators = {
    and(clauses) {
        return !clauses.length ? '' : `(${clauses.join(' AND ')})`;
    },
    or(clauses) {
        return !clauses.length ? '' : `(${clauses.join(' OR ')})`;
    }
};

function buildSql(query, config) {
    return Object.entries(query)
        .map(([key, value]) => {
            key = key.toLowerCase();
            if(!_.isFunction(queryParts[key])) return;
            return queryParts[key](value, config);
        })
        .filter(p => p)
        .join(' ') + ';';
}

module.exports = class AqlClient extends AbstractDatabaseClient {
    constructor(config) {
        super(config);

        if(!config.port)
            throw new Error(`Unable to construct instance of ${this.constructor.name}, missing 'port' configuration value.`);

        this.port = config.port;
    }

    /**
     * Connect to the aql database
     */
    connect() {
        return new Promise((resolve, reject) => {
            aql.connect(this.port, this.host, () => {
                resolve();
            });
            aql.on('error', error => reject(error));
        });
    }

    /**
     * Send a select statement to the aql database
     * @param query {Object}
     * @returns {Promise<*>}
     */
    select(query) {
        return new Promise((resolve, reject) => {
            if(!_.isPlainObject(query)) query = { select: query };

            if(!query.select)
                return reject(new TypeError(`Invalid query object. 'select' must be specified in the query argument`));

            if(!query.from) query.from = config.get.from;

            this.connect()
                .then(() => {
                    aql.write(buildSql(query, config.get), (error, data) => {
                        aql.destroy();
                        if(error) return reject(error);
                        resolve(JSON.stringify(data));
                    });
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Update the given configuration object in the aql database
     * @param query
     */
    update(query) {
        return notImplemented();
    }
};
