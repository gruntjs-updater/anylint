var esprimaParse = require('esprima').parse;
var readFile = require('fs').readFileSync;
var definitionsFilter = require('./definitions').getListOfDefinitions;
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
			var expressions = filterOutExpressions(fileName, expressionType, desiredExpressions);
			data = data.concat(expressions);
		}
	});
	console.log('all',JSON.stringify(data));
}

function filterOutExpressions(filePath, expressionType, names){
    var source = readFile(filePath, {encoding:'utf8'});
    var ast = esprimaParse(source);
    var filteredExpressions = definitionsFilter(ast,expressionType,names);
    if(!filteredExpressions.length){
        return null;
    }
    return {
        filePath: filePath,
        expressions: filteredExpressions
    };
}

validate('./mocks', /.js$/, 'function',['childDefine','define']);
