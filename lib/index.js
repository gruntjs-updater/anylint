var filterExperssions = require('./definitions'),
	filewalker = require('filewalker'),
	validateUniqueness = require('./validators/unique');

function validate(path, fileTypeFilter, expressionType, desiredExpressions, validations){
	processAllFiles(path, fileTypeFilter, expressionType, desiredExpressions, function(results){
		if(results.length){
			validations.forEach(function(validate){
				validate(results);
			});
		}
	});
}

function processAllFiles(path, fileTypeFilter, expressionType, desiredExpressions, callback){
	var fileList = [];
	filewalker(path)
		.on('file', function(relative, state, fullpath) {
			fileList.push(fullpath);
		})
		.on('error', function(err) {
			throw err;
		})
		.on('done', function() {
			filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, desiredExpressions, callback);
		})
		.walk();
}

function filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, desiredExpressions, callback){
	var data = [];
	fileList.forEach(function(fileName){
		if((fileTypeFilter).test(fileName)){
			var expressions = filterExperssions(fileName, expressionType, desiredExpressions);
			data = data.concat(expressions);
		}
	});
	callback(data);
	console.log('all',JSON.stringify(data));
}

var validations = [validateUniqueness];
validate('./mocks', /.js$/, 'function',['childDefine','define'], validations);
