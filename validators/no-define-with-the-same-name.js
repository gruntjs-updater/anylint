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

	defineKeywords.forEach(validateByKeyWord);

	function validateByKeyWord (keyWord){
		var allDefinitionsByFile = {};
		listOfExpressions.forEach(
			function(token){
				var filePath = token.filePath,
					defineExpressions = token.expressions.filter(function(exp){
						return exp.name === keyWord;
					});

				defineExpressions.forEach(function(expression){
					if(expression.name !== keyWord){
						return;
					}
					var definition = expression.argument;
					if (allDefinitionsByFile[definition]) {
						errors.push(definition + ' - defined both in ' +
							allDefinitionsByFile[definition] + ' and ' + filePath);
					} else {
						allDefinitionsByFile[definition] = filePath;
					}
				});
			}
		);
	}

	return errors;
};