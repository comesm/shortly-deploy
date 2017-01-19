module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      lib: {
        src: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'],
        dest: 'public/built/libBuilt.js'
      },
      client: {
        src: ['public/client/**/*.js'],
        dest: 'public/built/clientBuilt.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      libTarget: {
        files: {
          'public/dist/lib.min.js': ['public/built/libBuilt.js']
        }
      },
      clientTarget: {
        files: {
          'public/dist/client.min.js': ['public/built/clientBuilt.js']
        }
      }
    },

    eslint: {
      target: ['public/client/**/*.js',
               'public/lib/**/*.js']
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': 'public/*.css'
        }
      }
    },
//
    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {

      add: {
        command: 'git add .'
      },

      commit: {
        command: 'git commit'
      },

      origin: {
        command: 'git push origin master'
      },


      prodServer: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['eslint', 'mochaTest']);

  grunt.registerTask('build', ['test', 'concat', 'uglify']);

  grunt.registerTask('upload', function(n) {

    grunt.task.run(['build', 'shell:add', 'shell:commit']);

    if (grunt.option('prod')) {
      grunt.task.run(['shell:prodServer']);

    } else if (grunt.option('develop')) {
      grunt.task.run(['shell:origin']);
    }

    // grunt.task.run([ 'server-dev' ]);
  });

  grunt.registerTask('deploy', ['upload'    // add your deploy tasks here
  ]);

  grunt.registerTask('dev', ['upload develop'    // add your deploy tasks here
  ]);
};
