var filterExperssions = require('./definitions'),
	filewalker = require('filewalker'),
	validateUniqueness = require('./validators/unique'),
	validateDefine = require('./validators/no-define-with-the-same-name');

function validate(path, fileTypeFilter, expressionType, validations){
	processAllFiles(path, fileTypeFilter, expressionType, function(results){
		if(results.length){
			validations.forEach(function(validate){
				validate(results);
			});
		}
	});
}

function processAllFiles(path, fileTypeFilter, expressionType, callback){
	var fileList = [];
	filewalker(path)
		.on('file', function(relative, state, fullpath) {
			fileList.push(fullpath);
		})
		.on('error', function(err) {
			throw err;
		})
		.on('done', function() {
			filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, callback);
		})
		.walk();
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

var validations = [validateUniqueness, validateDefine];
validate('./mocks', /.js$/, 'function', validations);
