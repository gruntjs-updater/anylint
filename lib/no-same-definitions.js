var extractor = require('function-extractor');
function filter(ast, pattern){
    var matches = [];
    extractor.interpret(ast);
    console.log(ast);
    if(!matches.length){
        return null;
    }

}