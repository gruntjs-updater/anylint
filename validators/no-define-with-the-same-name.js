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
				var filePath = token.filePath;

				token.expressions
					.filter(function(exp){
						return exp.name === keyWord;
					})
					.forEach(function(expression) {
						var arg = expression.argument;
						if (allDefinitionsByFile[arg]) {
							errors.push(arg + ' - defined both in ' +
								allDefinitionsByFile[arg] + ' and ' + filePath);
						} else {
							allDefinitionsByFile[arg] = filePath;
						}
					});
			}
		);
	}

	return errors;
};