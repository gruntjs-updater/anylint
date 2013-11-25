/**
 * return only top level tokens from the AST
 * @param token - AST object from Esprima
 * @returns {Array} - array of tokens defined as non-anonymous function call
 */

module.exports = function(token){
	if(!token.expression || token.expression.type !== 'CallExpression'){
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

	return name !== undefined;
};