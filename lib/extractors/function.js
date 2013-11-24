var _ = require('lodash');

module.exports = function generateDefinitionDescription(fun) {
	var data = fun.expression,
		argument = data.arguments[0] && data.arguments[0].value,
		type = data.callee.type,
		name;

	if (!argument) {
		console.log(fun.expression)
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
};