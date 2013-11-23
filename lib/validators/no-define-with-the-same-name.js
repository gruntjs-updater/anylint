var _ = require('lodash');
module.exports = function noDefineWithTheSameName(listOfExpressions){
	var defineKeywords = ['define','newClass'];
	var errors = [];

	_.forEach(defineKeywords, function(keyWord){

		var allDefinitionsByFile = {};

		_.forEach(listOfExpressions, function(token){
			var filePath = token.filePath,
				defineExperssions = _.filter(token.expressions, function(exp){
					return exp.name === keyWord;
				});

			_.forEach(defineExperssions, function(expression){
				if(expression.name === keyWord){
					var definition = expression.argument;
					if(allDefinitionsByFile[definition]){
						errors.push('double definition of '+definition+' - both in ' +
							allDefinitionsByFile[definition]+' and ' + filePath);
					}else{
						allDefinitionsByFile[definition] = filePath;
					}
				}
			});
		});
	});

	return errors;
};