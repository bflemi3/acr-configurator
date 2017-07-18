const AbstractDatabaseClient = require('./AbstractDatabaseClient'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    net = require('net'),
    notImplemented = require('../../util/notImplemented');


/**
 * Make a request to the database
 * @param aql - The aql socket
 */
function request(aql) {
    return body => {
        return new Promise((resolve, reject) => {
            let buffer = '';

            aql.write(body);

            aql.on('error', error => {
                reject(error);
                aql.destroy();
            });

            aql.on('data', data => {
                buffer += data;
            });

            aql.on('end', () => {
                try {
                    resolve(JSON.parse(buffer));
                } catch(error) {
                    reject(error);
                }
                buffer = '';
                aql.destroy();
            });
        });
    };
}
/**
 * Connect to the database
 * @param host
 * @param port
 */
function connect(host, port) {
    return new Promise((resolve, reject) => {
        const aql = net.Socket();
        aql.setEncoding('utf8');

        aql.connect(port, host, () => {
            resolve(request(aql));
        });
        aql.on('error', reject);
    });
}

module.exports = class AqlClient extends AbstractDatabaseClient {
    constructor(config) {
        super(config);

        /**
         * Send a select statement to the aql database
         * @param query {Object}
         * @returns {Promise<*>}
         */
        this.get = Promise.coroutine(function*(sql) {
            if(!_.isString(sql)) throw new TypeError(`Invalid argument. 'sql' must be a string.`);
            return (yield connect(this.host, this.port))(sql);
        });

        /**
         * Update the given configuration object in the aql database
         * @param query {Object}
         * @returns {Promise<*>}
         */
        this.update = this.get;

        /**
         * Insert a new configuration object into the aql database
         * @param query {Object}
         * @returns {Promise<*>}
         */
        this.insert = this.get;
    }
};
