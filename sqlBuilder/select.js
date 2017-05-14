const builders = [require('./join'), require('./where'), require('./orderBy')],
    builder = require('./builder');

function select(table) {

    return {
        select(fields) {
            if(!Array.isArray(fields)) fields = [fields];
            if(fields.includes(select.STAR) && fields.length > 1)
                throw new Error(`Invalid number of select fields. '${select.STAR}' can be the only field in the select.`);

            const sql = `select ${table.getFields(fields).map(f => f.field).join(',')} from ${table.name}`;
            return builder(builders, table, sql);
        }
    };
}

select.STAR = '*';

module.exports = select;