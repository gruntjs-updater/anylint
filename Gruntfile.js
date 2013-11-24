/*
 * grunt-contrib-jshint
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		anylint: {
            src: [
                'mocks/**/*.js'
            ],
            options:{
                validations: [
                    'lib/validators/no-define-with-the-same-name.js'
                ]
            },
			withReporterShouldFail: {
				options: {
					reporter: 'checkstyle',
					reporterOutput: 'tmp/report.xml',
					force: true
				},
				src: ['test/fixtures/missingsemicolon.js'],
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-internal');

	// By default, lint and run all tests.
	grunt.registerTask('default', ['anylint']);

};