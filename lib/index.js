var esprimaParse = require('esprima').parse;
var path = require('path');
var readFile = require('fs').readFileSync;
var readDirectory = require('fs').readdirSync;
var fileInfo = require('fs').statSync;
var definitionsFilter = require('./functions_filter').getListOfDefinitions;

function filterOutMultipleFiles(directoryPath){
	var fileNames = readDirectory(directoryPath);
	var allFunctions = [];
	fileNames.forEach(function(relativeFilename){
		var fileName = path.join(directoryPath, relativeFilename);
		var metaData = fileInfo(fileName);
		if(metaData.isFile() && isJSFileName(fileName)){
			var functions = filterOutFunctions(fileName, ['require']);
			allFunctions.concat(functions);
			return;
		}
		if(metaData.isDirectory()){
			filterOutMultipleFiles(fileName);
		}
	});
	console.log('all',allFunctions);
}

function isJSFileName(fileName){
	return (/.js$/).test(fileName);
}

function filterOutFunctions(filePath, names){
    var source = readFile(filePath, {encoding:'utf8'});
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




var functionsByFile = filterOutMultipleFiles('.',['callforit˚']);
