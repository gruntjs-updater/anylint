var _ = require('lodash');

/**
 * return only top level tokens from the AST
 * @param ast - ast object from Esprima
 * @param filter - callback to filter out acceptable tokens
 * @returns {Array} - array of results
 */
function getTopLevelTokens(ast, filter){
    var matches = _.filter();

    var statements = _.filter(ast.body, filter);

    return statements;
}

function getTopLevelFunctionCalls(ast){
    return getTopLevelTokens(ast, function(token){
        return token.expression && token.expression.type === 'CallExpression';
    });
}

/**
 * Filter AST for particular functions and their first arguments
 * @param ast AST from Esprima
 * @param definitions
 * @returns {name:String, argument:Array} {name:'functionName', argument:'firstArgument'}
 */
function getListOfDefinitions(ast, definitions){
    // we care only about 'big' definitions, that cannot be nested according to the framework's logic
    var functions = getTopLevelFunctionCalls(ast);


    var filteredFunctions = _.filter(functions, function(functionCall){
        var callee = functionCall.expression.callee;
        return callee.type === 'Identifier' && (definitions.indexOf(callee.name) !== -1);
    });

    var listOfDefinitions = _.map(filteredFunctions, function generateDefinitionDescription(fun){
        if(!(fun.expression.arguments[0] && fun.expression.arguments[0].value)){
            throw 'expect function to have at least one argument';
        }
        if(!_.isString(fun.expression.arguments[0].value)){
            throw 'expect function to have be a String';
        }
        return {
            name: fun.expression.callee.name,
            argument: fun.expression.arguments[0].value
        };
    });
    return listOfDefinitions;
}

exports.getListOfDefinitions = getListOfDefinitions;