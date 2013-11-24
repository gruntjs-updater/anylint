var esprimaParse = require('esprima').parse,
	readFile = require('fs').readFileSync;

// helper for validations
var anylint = {
	filters: {function: require('./filters/function')},
	extractors: {function: require('./extractors/function')},
	datagrabbers: {definitions: require('./datagrabbers/definitions')}
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
