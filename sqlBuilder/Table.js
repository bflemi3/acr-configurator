const _ = require('lodash'),
    FieldNotFoundError = require('./FieldNotFoundError'),
    InvalidArgumentError = require('./InvalidArgumentError'),
    assign = require('./util/assign'),
    builders = [require('./select'), require('./update')];

module.exports = class Table {
    constructor(name, options) {
        if(!_.isString(name))
            throw new InvalidArgumentError('name', 'string');

        if(!options)
            throw new InvalidArgumentError('options', 'object');

        if(!options.fields)
            throw new InvalidArgumentError('options.fields', 'Array<field configurations>');

        this.name = name;

        const _fields = options.fields.map(f => ({ field: f.field || f, name: f.name || f }));
        this.getFields = function(fields, constants) {
            if(_.isPlainObject(fields)) fields = Object.keys(fields);

            if (!Array.isArray(fields)) fields = [fields];

            if(constants) {
                if(!Array.isArray(constants)) constants = [constants];
                if(fields.some(f => constants.includes(f))) return _fields;
            }

            return fields.map(f => {
                const field = _fields.find(_f => _f.name === f || _f === f);
                if (!field) throw new FieldNotFoundError(this.name, fields);
                return field;
            });
        };

        assign(this, builders, this);
    }
};