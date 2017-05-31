const EventEmitter = require('events'),
    notImplemented = require('../../util/notImplemented');

module.exports = class AbstractDatabaseClient extends EventEmitter {
    constructor(config) {
        super();

        if(new.target === AbstractDatabaseClient)
            throw new TypeError(`Cannot construct instance of an abstract class. '${this.constructor.name}' is an abstract class`);

        if(!process.env[config.host])
            throw new Error(`${config.host} environment variable not defined.`);
        this.host = process.env[config.host];

        if(!config.port)
            throw new Error(`Unable to construct instance of ${this.constructor.name}, missing 'port' configuration value.`);
        if(!process.env[config.port])
            throw new Error(`${config.port} environment variable not defined.`);
        this.port = process.env[config.port];
    }

    get() { notImplemented(); }
    update() { notImplemented(); }
    insert() { notImplemented(); }
};