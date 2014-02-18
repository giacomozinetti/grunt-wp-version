'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    version: {
      options: {
        file: 'lib/versions.php',
        css: 'assets/css/main.min.css',
        cssHandle: 'MAIN_CSS_VERSION',
        js: 'assets/js/scripts.min.js',
        jsHandle: 'MAIN_JS_VERSION'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'version']);
};
