var filterExperssions = require('./definitions');

function validate(fileList, fileTypeFilter, expressionType, validations, reportCallback){
    filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, function(results) {
        if (results.length) {
            var errors = [];
            validations.forEach(function (validate) {
                errors = errors.concat(validate(results));
            });
            reportCallback(errors);
        }
    });
}

function filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, callback){
	var data = [];
	fileList.forEach(function(fileName) {
		if (!(fileTypeFilter).test(fileName)) {
			return;
		}
		var expressions = filterExperssions(fileName, expressionType);
		if (expressions) {
			data = data.concat(expressions);
		}
	});
	callback(data);
}

module.exports = validate;
