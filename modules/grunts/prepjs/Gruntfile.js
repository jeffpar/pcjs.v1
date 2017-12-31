/*
 * grunt-prepjs
 * https://github.com/jeffpar/pcjs
 *
 * Copyright (c) 2014-2018 jeffpar
 * Licensed under the MIT license.
 *
 * Genesis:
 *
 *      sudo npm install -g grunt-init
 *      git clone git://github.com/gruntjs/grunt-init-gruntplugin.git ~/.grunt-init/gruntplugin
 *      cd ~/Sites/pcjs/modules
 *      mkdir -p grunts/prepjs
 *      cd grunts/prepjs
 *      grunt-init gruntplugin
 *      npm install
 *
 * This file was generated at the "grunt-init gruntplugin" stage.  Here's what that process looked like:
 *
 *      Running "init:gruntplugin" (init) task
 *      This task will create one or more files in the current directory, based on the
 *      environment and the answers to a few questions. Note that answering "?" to any
 *      question will show question-specific help and answering "none" to most questions
 *      will leave its value blank.
 *
 *      "gruntplugin" template notes:
 *      For more information about Grunt plugin best practices, please see the docs at
 *      http://gruntjs.com/creating-plugins
 *
 *      Please answer the following:
 *      [?] Project name (grunt-prep) grunt-prepjs
 *      [?] Description (The best Grunt plugin ever.) JS Preprocessor
 *      [?] Version (0.1.0)
 *      [?] Project git repository (git://github.com/jeffpar/jsmachines.git)
 *      [?] Project homepage (https://github.com/jeffpar/jsmachines)
 *      [?] Project issues tracker (https://github.com/jeffpar/jsmachines/issues)
 *      [?] Licenses (MIT)
 *      [?] Author name (jeffpar)
 *      [?] Author email (jeffpar@mac.com)
 *      [?] Author url (none)
 *      [?] What versions of grunt does it require? (~0.4.4)
 *      [?] What versions of node does it run on? (>= 0.8.0)
 *      [?] Do you need to make any changes to the above before continuing? (y/N)
 *
 *      Writing .gitignore...OK
 *      Writing .jshintrc...OK
 *      Writing Gruntfile.js...OK
 *      Writing README.md...OK
 *      Writing tasks/prepjs.js...OK
 *      Writing test/expected/custom_options...OK
 *      Writing test/expected/default_options...OK
 *      Writing test/fixtures/123...OK
 *      Writing test/fixtures/testing...OK
 *      Writing test/prepjs_test.js...OK
 *      Writing LICENSE-MIT...OK
 *      Writing package.json...OK
 *
 *      Initialized from template "gruntplugin".
 *      You should now install project dependencies with npm install. After that, you
 *      may execute project tasks with grunt. For more information about installing
 *      and configuring Grunt, please see the Getting Started guide:
 *
 *      http://gruntjs.com/getting-started
 *
 *      Done, without errors.
 *
 * The process was a bit sloppy about trailing commas, though.  I've cleaned those up, thanks to PhpStorm.
 *
 * Online tutorials further recommended the following in my project's root:
 *
 *      npm install modules/grunts/prepjs --save-dev
 *
 * However, all that does is make another copy of my "grunt-prepjs" module, inside the "node_modules" folders;
 * I can avoid that by simply including the following in my root Gruntfile.js:
 *
 *      grunt.loadTasks("modules/grunts/prepjs/tasks");
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        prepjs: {
            default_options: {
                options: {
                },
                files: {
                    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            },
            custom_options: {
                options: {
                    separator: ': ',
                    punctuation: ' !!!'
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'prepjs', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
