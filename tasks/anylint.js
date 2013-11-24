'use strict';

module.exports = function(grunt) {
	var anylint = require('../lib'),
		path = require('path');

	grunt.registerMultiTask('anylint', 'Validate files with Anylint.', function() {
		var done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			force: false,
			reporterOutput: null,
            validations: [
                'validators/**/*.js'
            ]
		});

		// log (verbose) options before hooking in the reporter
		grunt.verbose.writeflags(options, 'Anylint options');

		// Report errors but don't fail the task
		var force = options.force;
		delete options.force;

		// Whether to output the report to a file
		var reporterOutput = options.reporterOutput;
		delete options.reporterOutput;

		// Hook into stdout to capture report
		var output = '';
		if (reporterOutput) {
			grunt.util.hooker.hook(process.stdout, 'write', {
				pre: function(out) {
					output += out;
					return grunt.util.hooker.preempt();
				}
			});
		}

        var validations = [];

        grunt.file.expand(options.validations).map(function(validationDefenition){
            var modulePath = path.resolve(validationDefenition);
            var module = require(modulePath);
           validations.push(module);
        });

		anylint(this.filesSrc, validations, function(errors){
			var failed = 0;
			if (errors && errors.length > 0) {
				errors.forEach(function(error){
					grunt.log.error(error);
				});
				// Fail task if errors were logged except if force was set.
				failed = force;
			} else {
				grunt.log.ok('Anylint ok.');
			}

			// Write the output of the reporter if wanted
			if (reporterOutput) {
				grunt.util.hooker.unhook(process.stdout, 'write');
				reporterOutput = grunt.template.process(reporterOutput);
				var destDir = path.dirname(reporterOutput);
				if (!grunt.file.exists(destDir)) {
					grunt.file.mkdir(destDir);
				}
				grunt.file.write(reporterOutput, output);
				grunt.log.ok('Report "' + reporterOutput + '" created.');
			}

			done(failed);

		});

	});

};