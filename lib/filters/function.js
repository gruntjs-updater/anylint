var _ = require('lodash');

/**
 * return only top level tokens from the AST
 * @param ast - ast object from Esprima
 * @param filter - callback to filter out acceptable tokens
 * @returns {Array} - array of results
 */
function getTopLevelTokens(ast, filter){
	return _.filter(ast.body, filter);
}

function getTopLevelFunctionCalls(ast){
	return getTopLevelTokens(ast, function(token){
		return token.expression && token.expression.type === 'CallExpression';
	});
}

module.exports = getTopLevelFunctionCalls;