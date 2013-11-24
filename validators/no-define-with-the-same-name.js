var _ = require('lodash');
module.exports = function noDefineWithTheSameName(data, anylint){
	var defineKeywords = ['define','newClass'];
	var errors = [];
	var listOfExpressions = data.map(function(dataNode){
		return {
			filePath: dataNode.filePath,
			expressions: anylint.datagrabbers.definitions(
				dataNode.ast,
				anylint.filters.function,
				anylint.extractors.function
			)
		};
	});

	defineKeywords.forEach(function(keyWord){
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