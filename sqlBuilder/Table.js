const isString = require('./util/isString'),
    FieldNotFoundError = require('./FieldNotFoundError'),
    assign = require('./util/assign'),
    builders = [require('./select')/*, require('./insert'), require('./udpate')*/];

module.exports = class Table {
    constructor(name, options) {
        if(!isString(name))
            throw new TypeError(`Invalid argument. 'name' must be a string.`);

        if(!options)
            throw new TypeError(`Invalid argument. 'options' must be an object.`);

        if(!options.fields)
            throw new TypeError(`Invalid argument. 'options.fields' must be an array of field configurations`);

        this.name = name;

        const _fields = options.fields.map(f => ({ field: f.field || f, name: f.name || f }));
        this.getFields = function(fields) {
            if (!Array.isArray(fields)) fields = [fields];

            const found = fields.map(f => {
                const field = _fields.find(_f => _f.name === f || _f === f);
                if (!field) throw new FieldNotFoundError(this.name, fields);
            });
            return found;
        };

        assign(this, builders, this);
    }
};