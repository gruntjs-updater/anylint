var filterExperssions = require('./definitions');

function validate(fileList, expressionType, validations, reportCallback){
    filterOutMultipleFiles(fileList, expressionType, function(results) {
        if (results.length) {
            var errors = [];
            validations.forEach(function (validate) {
                errors = errors.concat(validate(results));
            });
            reportCallback(errors);
        }
    });
}

function filterOutMultipleFiles(fileList, expressionType, callback){
	var data = [];
	fileList.forEach(function(fileName) {
		var expressions = filterExperssions(fileName, expressionType);
		if (expressions) {
			data = data.concat(expressions);
		}
	});
	callback(data);
}

module.exports = validate;
