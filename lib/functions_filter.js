var _ = require('lodash');

/**
 * return only top level tokens from the AST
 * @param ast - ast object from Esprima
 * @param filter - callback to filter out acceptable tokens
 * @returns {Array} - array of results
 */
function getTopLevelTokens(ast, filter){
    var matches = _.filter();

	return _.filter(ast.body, filter);
}

function getTopLevelFunctionCalls(ast){
    return getTopLevelTokens(ast, function(token){
        return token.expression && token.expression.type === 'CallExpression';
    });
}

/**
 * Filter AST for particular functions and their first arguments
 * @param ast AST from Esprima
 * @param definitions
 * @returns {name:String, argument:Array} {name:'functionName', argument:'firstArgument'}
 */
function getListOfDefinitions(ast, definitions){
    // we care only about 'big' definitions, that cannot be nested according to the framework's logic
    var functions = getTopLevelFunctionCalls(ast);


    return _.filter(functions, function(functionCall){
        var callee = functionCall.expression.callee,
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

    }).map(function generateDefinitionDescription(fun){
			var data = fun.expression,
				argument = data.arguments[0] && data.arguments[0].value,
				type = data.callee.type,
				name;

			if (!argument) {
				throw 'expect function to have at least one argument';
			}
			if (!_.isString(argument)) {
				throw 'expect function\'s first argument to be String';
			}

			if (type === 'Identifier') {
				name = data.callee.name;
			} else if (type === 'MemberExpression') {
				name = data.callee.property.name;
			}

			return {
				name: name,
				argument: argument
			};
		});
}

exports.getListOfDefinitions = getListOfDefinitions;