const EventEmitter = require('events'),
    notImplemented = require('../../util/notImplemented');

module.exports = class AbstractDatabaseClient extends EventEmitter {
    constructor(config) {
        super();

        if(new.target === AbstractDatabaseClient)
            throw new TypeError(`Cannot construct instance of an abstract class. '${this.constructor.name}' is an abstract class`);

        this.host = config.host;
    }

    get() { notImplemented(); }
    update() { notImplemented(); }
    insert() { notImplemented(); }
};