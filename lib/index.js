var filterExperssions = require('./definitions');
var filewalker = require('filewalker');

function validate(path, fileTypeFilter, expressionType, desiredExpressions){
	processAllFiles(path, fileTypeFilter, expressionType, desiredExpressions);
}

function processAllFiles(path, fileTypeFilter, expressionType, desiredExpressions){
	var fileList = [];
	filewalker(path)
		.on('file', function(relative, state, fullpath) {
			fileList.push(fullpath);
		})
		.on('error', function(err) {
			throw err;
		})
		.on('done', function() {
			filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, desiredExpressions);
		})
		.walk();
}

function filterOutMultipleFiles(fileList, fileTypeFilter, expressionType, desiredExpressions){
	var data = [];
	fileList.forEach(function(fileName){
		if((fileTypeFilter).test(fileName)){
			var expressions = filterExperssions(fileName, expressionType, desiredExpressions);
			data = data.concat(expressions);
		}
	});
	console.log('all',JSON.stringify(data));
}


validate('./mocks', /.js$/, 'function',['childDefine','define']);
