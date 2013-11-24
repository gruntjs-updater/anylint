var esprimaParse = require('esprima').parse,
	readFile = require('fs').readFileSync,
	_ = require('lodash'),
	filterByType = {
		'function':require('./filters/function')
	},
	extractorByType = {
		'function':require('./extractors/function')
	};

function getTopLevelTokens(ast){
	return _.toArray(ast.body);
}

/**
 * Filter AST for particular expressions and their first arguments
 * @param ast AST from Esprima
 * @param type - type of expressions to extract, influences return data as well
 * @param definitions
 * returns "data wrapped in a way defined by type"
 */
function getListOfDefinitions(ast, type){
    // we care only about 'big' definitions, that cannot be nested according to the framework's logic
	var tokens = getTopLevelTokens(ast);

    var filter = filterByType[type];
	var extractor = extractorByType[type];

	var filteredTokens = filter(tokens);
	return _.map(filteredTokens, extractor).filter(function(token){
        // accepts only truthy tokens
        return token;
    });
}

function filterOutExpressions(filePath, expressionType){
	var source = readFile(filePath, {encoding:'utf8'});
	var ast = esprimaParse(source);
	var filteredExpressions = getListOfDefinitions(ast,expressionType);
	if(!filteredExpressions.length){
		return null;
	}
	return {
		filePath: filePath,
		expressions: filteredExpressions
	};
}

module.exports = filterOutExpressions;