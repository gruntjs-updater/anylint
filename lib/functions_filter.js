var _ = require('lodash'),
	filterByType = {
		'function':require('./filters/function')
	},
	extractorByType = {
		'function':require('./extractors/function')
	};


/**
 * Filter AST for particular functions and their first arguments
 * @param ast AST from Esprima
 * @param type - type of expressions to extract, influences return data as well
 * @param definitions
 * returns "data wrapped in a way defined by type"
 */
function getListOfDefinitions(ast, type, definitions){
    // we care only about 'big' definitions, that cannot be nested according to the framework's logic
    var functions = filterByType[type](ast);


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