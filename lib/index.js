var esprimaParse = require('esprima').parse,
	readFile = require('fs').readFileSync;

// helper for validations
var anylint = {
	filters: {class_definition: require('./filters/class_definition')},
	extractors: {class_definition: require('./extractors/class_definition')},
	datagrabbers: {top_level_ast: require('./datagrabbers/top_level_ast')}
};

function validate(fileList, validations, reportCallback){
	var data = getASTByFile(fileList);
	var errors = [];
	if(data){
		validations.forEach(function (validate) {
			errors = errors.concat(validate(data, anylint));
		});
	}
	reportCallback(errors);
}

function getASTByFile(fileList){
	return fileList.map(function(filePath){
		var ast = esprimaParse(readFile(filePath));
		return {
			filePath: filePath,
			ast: ast
		};
	});
}

module.exports = validate;
