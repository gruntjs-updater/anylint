var _ = require('lodash');

/**
 * return only top level tokens from the AST
 * @param ast - ast object from Esprima
 * @param filter - callback to filter out acceptable tokens
 * @returns {Array} - array of results
 */

module.exports = function(tokens, definitions){
	return _.filter(tokens, function(token){
		if(token.expression.type !== 'CallExpression'){
			return false;
		}

		var callee = token.expression.callee,
			type = callee.type,
			name;

		switch (type){
			case 'Identifier':
				name = callee.name;
				break;
			case 'MemberExpression':
				name = callee.property.name;
				break;
			default :
				name = undefined;
				break;
		}

		return definitions.indexOf(name) !== -1;

	});
};