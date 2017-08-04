const _ = require('lodash'),
    FieldNotFoundError = require('./FieldNotFoundError'),
    InvalidArgumentError = require('./InvalidArgumentError'),
    assign = require('./util/assign'),
    isFunction = require('./util/isFunction'),
    builders = [require('./select'), require('./update'), require('./insert')];

module.exports = class Table {
    constructor(name, options) {
        if(!_.isString(name))
            throw new InvalidArgumentError('name', 'string');

        if(!options)
            throw new InvalidArgumentError('options', 'object');

        if(!options.fields)
            throw new InvalidArgumentError('options.fields', 'Array<field configurations>');

        this.name = name;

        const _fields = options.fields.map(f => ({ field: f.field || f, name: f.name || f, identifier: f.identifier || false }));
        this.getFields = function(fields, constants) {
            if(!arguments.length) return _fields;

            if(isFunction(fields))
                return _fields.filter(fields);

            if(_.isPlainObject(fields)) fields = Object.keys(fields);

            if (!Array.isArray(fields)) fields = [fields];

            if(constants) {
                if(!Array.isArray(constants)) constants = [constants];
                if(fields.some(f => constants.includes(f))) return _fields;
            }

            return fields.map(f => {
                f = f.toLowerCase();
                const field = _fields.find(_f => _f.name.toLowerCase() === f || _f.field.toLowerCase() === f);
                if (!field) throw new FieldNotFoundError(this.name, fields);
                return field;
            });
        };

        assign(this, builders, this);
    }
};