var esprimaParse = require('esprima').parse;
var readFile = require('fs').readFileSync;
var definitionsFilter = require('./functions_filter').getListOfDefinitions;
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
	var allFunctions = [];
	fileList.forEach(function(fileName){
		if((fileTypeFilter).test(fileName)){
			var functions = filterOutFunctions(fileName, expressionType, desiredExpressions);
			allFunctions = allFunctions.concat(functions);
		}
	});
	console.log('all',JSON.stringify(allFunctions));
}

function filterOutFunctions(filePath, expressionType, names){
    var source = readFile(filePath, {encoding:'utf8'});
    var ast = esprimaParse(source);
    var filteredFunctions = definitionsFilter(ast,expressionType,names);
    if(!filteredFunctions.length){
        return null;
    }
    return {
        filePath: filePath,
        functions: filteredFunctions
    };
}

validate('./mocks', /.js$/, 'function',['childDefine','define']);
