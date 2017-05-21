const app = require('express')(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8081,
    url = require('url'),
    cors = require('cors'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    config = require('./config.json'),
    databaseClientProvider = require('./database/databaseClientProvider'),
    translate = require('object-translation'),
    translations = config.translations.serverToClient;

/**
 * Set database host and port from environment variables and create configurations table
 * Environment Variables:
 *   AQL_HOST
 *   AQL_PORT
 */
if(!process.env[config.database.host])
    throw new Error(`Unable to start configuration node service. Please set the AQL_HOST environment variable.`);
if(!process.env[config.database.port])
    throw new Error(`Unable to start configuration node service. Please set the AQL_PORT environment variable.`);

config.database.host = process.env[config.database.host];
config.database.port = process.env[config.database.port];
const configurations = new (require('./database/repositories/CustomerConfigurationsRepository'))(databaseClientProvider(config.database));

/**
 * Handles logging errors and responding to the client with error messages
 * @param error
 * @param response
 * @param status
 */
function errorHandler(error, response, status = 500) {
    const message = error instanceof Error ? error.message : error;

    status = _.isNumber(response) ? response : status;
    response = _.isFunction(response.send) ? response : undefined;

    console.error(error.stack || message);

    if(response)
        response.status(status).send(message);
}

// setup middleware
app.use(cors());
app.use(bodyParser.json());

// setup error handlers for uncaught rejections and errors
process.on('uncaughtException', error => console.error(`Uncaught exception... ${error.stack}`));
process.on('unhandledRejection', error => {
    console.error(`Uncaught rejection... ${error.stack}`);
    process.exit(1);
});

/**
 * GET /configuration
 * Get all configuration objects from the database
 */
app.get('/configuration', Promise.coroutine(function*(request, response) {
    console.log(`GET /configuration`);
    try {
        const result = yield configurations.get();
        if(!result || !result.length) return errorHandler(`There was an issue retrieving results.`, response);

        response.json(translate(result, translations.serverToClient));
    } catch(error) {
        errorHandler(error, response);
    }
}));

/**
 * GET /configuration/:serialNumber
 * Get one configuration object given the serial number
 * @params serialNumber
 */
app.get('/configuration/:serialNumber', Promise.coroutine(function*(request, response) {
    console.log(`GET /configuration/${request.params.serialNumber}`);
    try {
        const result = yield configurations.get({ serialNumber: request.params.serialNumber });
        if(!result) return errorHandler('Configuration object not found.', response, 404);

        response.json(translate(result, translations.serverToClient));
    } catch(error) {
        errorHandler(error, response);
    }
}));

/**
 * PUT /configuration/:serialNumber
 * Update one configuration object given the serial number
 * @param serialNumber
 */
app.put('/configuration/:serialNumber', Promise.coroutine(function*(request, response) {
    console.log(`PUT /configuration/${request.params.serialNumber}`);
    // @todo: This has not been implemented in the AqlClient
    try {
        const result = yield configurations.update({ serialNumber: request.params.serialNumber }, request.body);
        if(!result) return errorHandler(`There was an issue updating the configuration object for serial number '${request.params.serialNumber}'.`, response);

        response.json(result);
    } catch(error) {
        errorHandler(error, response);
    }
}));

/**
 * POST /configuration
 * Create a new configuration object
 */
app.post('/configuration', Promise.coroutine(function*(request, response) {
    try {
        const result = yield configurations.insert(request.body);
        if(!result) return errorHandler(`There was an issue creating the configuration object.`, response);
        response.json(result);
    } catch(error) {
        errorHandler(error, response);
    }
}));

// startup the server
app.listen(port, () => {
    console.log(`Listening on: ${port}`);
});
