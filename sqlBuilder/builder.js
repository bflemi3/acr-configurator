const assign = require( './util/assign' );

module.exports = function builder( builders, table, sql ) {

	if ( !Array.isArray( builders ) ) builders = [ builders ];

	console.log( `${sql};` );

	return assign( {
		toString() {
			return `${sql};`;
		}
	}, builders, table, sql );
};