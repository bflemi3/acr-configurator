const path = require('path'),
    clients = require('../util/mapDirectory')('database/clients', (file, dir) => {
        const key = path.basename(file, '.js').toLowerCase();
        return { [key]: require(path.resolve(dir, file)) };
    });

module.exports = function databaseClientProvider(config, ...args) {
    const BASE_ERROR_MSG = 'Unable to provide database client.';

    if(!config.type)
        throw new Error(`${BASE_ERROR_MSG} Invalid configuration object. 'type' is required.`);

    if(!config.host)
        throw new Error(`${BASE_ERROR_MSG} Invalid configuration object. 'type' is required.`);

    let ClientConstructor;
    if(!(ClientConstructor = clients[config.type.toLowerCase()]))
        throw new Error(`${BASE_ERROR_MSG} No database client found for '${config.type}'.`);

    return new ClientConstructor(config, ...args);
};