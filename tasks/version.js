'use strict';

var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

module.exports = function(grunt) {
  grunt.registerTask('version', 'Set the versions for enqueued CSS/JS', function() {
    var options = this.options({
      file: '',
      css: '',
      cssHandle: '',
      js: '',
      jsHandle: ''
    });

    var scriptsPhp = options.file;

    // Hash
    var hashCss = md5(options.css);
    var hashJs = md5(options.js);

    if (!grunt.file.exists(scriptsPhp)) {
      var content = "<?php\n";
      grunt.file.write(scriptsPhp, content);
    }

    // Update versions.php to reference the new versions
    var regexCss = new RegExp("define\\('" + options.cssHandle + "', '(\\w*)'\\);");
    var regexJs = new RegExp("define\\('" + options.jsHandle + "', '(\\w*)'\\);");

    var content = grunt.file.read(scriptsPhp);

    var cssMatches = content.match(regexCss);
    if (cssMatches === null) {
      content += "\tdefine('" + options.cssHandle + "', '" + hashCss + "');\n";
    } else {
      content = content.replace(regexCss, "define('" + options.cssHandle + "', '" + hashCss + "');");
      if (grunt.file.exists(options.css.replace('.css', '.' + cssMatches[1] + '.css'))) {
        grunt.file.delete(options.css.replace('.css', '.' + cssMatches[1] + '.css'));
      }
    }
    grunt.file.copy(options.css, options.css.replace('.css', '.' + hashCss + '.css'));

    var jsMatches = content.match(regexJs);
    if (jsMatches === null) {
      content += "\tdefine('" + options.jsHandle + "', '" + hashJs + "');\n";
    } else {
      content = content.replace(regexJs, "define('" + options.jsHandle + "', '" + hashJs + "');");
      if (grunt.file.exists(options.js.replace('.js', '.' + jsMatches[1] + '.js'))) {
        grunt.file.delete(options.js.replace('.js', '.' + jsMatches[1] + '.js'));
      }
    }
    grunt.file.copy(options.js, options.js.replace('.js', '.' + hashJs + '.js'));

    grunt.file.write(scriptsPhp, content);
    grunt.log.writeln('"' + scriptsPhp + '" updated with new CSS/JS versions.');
  });

  var md5 = function(filepath) {
    var hash = crypto.createHash('md5');
    hash.update(fs.readFileSync(filepath));
    grunt.log.write('Versioning ' + filepath + '...').ok();
    return hash.digest('hex');
  };
};
