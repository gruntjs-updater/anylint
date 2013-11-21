var esprimaParse = require('esprima').parse;
var readFile = require('fs').readFileSync;
var definitionsFilter = require('./functions_filter').getListOfDefinitions;
var filewalker = require('filewalker');

function validate(path, fileTypeFilter, desiredExpressions){
	processAllFiles(path, fileTypeFilter, desiredExpressions);
}

function processAllFiles(path, fileTypeFilter, desiredExpressions){
	var fileList = [];
	filewalker(path)
		.on('file', function(relative, state, fullpath) {
			fileList.push(fullpath);
		})
		.on('error', function(err) {
			throw err;
		})
		.on('done', function() {
			filterOutMultipleFiles(fileList, fileTypeFilter, desiredExpressions);
		})
		.walk();
}

function filterOutMultipleFiles(fileList, fileTypeFilter, desiredExpressions){
	var allFunctions = [];
	fileList.forEach(function(fileName){
		if((fileTypeFilter).test(fileName)){
			var functions = filterOutFunctions(fileName, desiredExpressions);
			allFunctions = allFunctions.concat(functions);
		}
	});
	console.log('all',JSON.stringify(allFunctions));
}

function filterOutFunctions(filePath, names){
    var source = readFile(filePath, {encoding:'utf8'});
	console.log(filePath);
    var ast = esprimaParse(source);
    var filteredFunctions = definitionsFilter(ast,names);
    if(!filteredFunctions.length){
        return null;
    }
    return {
        filePath: filePath,
        functions: filteredFunctions
    };
}

var functionsByFile = validate('mocks', /.js$/,['childDefine']);
