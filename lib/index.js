var esprimaParse = require('esprima').parse;
var readFile = require('fs').readSync;
var definitionsFilter = require('./functions_filter').getListOfDefinitions;


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
    }
}




var functionsByFile = filterOutFunctions('filePAth',['define']);
console.log(functionsByFile);