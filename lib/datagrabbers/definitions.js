var _ = require('lodash');

/**
 * Filter AST for particular expressions and their first arguments
 * @param ast AST from Esprima
 * @param filter - filter for AST tokens
 * @param extractor - wrapper for extracting only relevant data
 * returns "data wrapped in a way defined by type"
 */
function getListOfDefinitions(ast, filter, extractor){
    // we care only about 'big' definitions, that cannot be nested according to the framework's logic
	var topDefinitions = _.toArray(ast.body);
	console.log('top def: ', ast)

	return topDefinitions
		.filter(filter)
		.map(extractor)
		// accepts only truthy tokens
		.filter(function(token){return token;});
}

module.exports = getListOfDefinitions;