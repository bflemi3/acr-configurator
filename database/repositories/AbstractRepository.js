const AbstractDatabaseClient = require('../clients/AbstractDatabaseClient');

module.exports = class AbstractRepository {
    constructor(databaseClient) {
        if(!(databaseClient instanceof AbstractDatabaseClient))
            throw new TypeError(`Invalid argument. 'databaseClient' must be an instance of AbstractDatabaseClient`);

        this.databaseClient = databaseClient;
    }
};