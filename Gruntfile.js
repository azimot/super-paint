module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-es6-module-transpiler");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({

        clean: ["dist", "tmp"],
        copy: {
            main: {
                cwd: 'src/',
                src: '*.html',
                dest: 'dist/',
                expand: true
            }
        },
        transpile: {
            amd: {
                type: 'amd',
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['**/*.js'],
                        dest: 'tmp/src/',
                        ext: '.amd.js'
                    }
                ]
            }
            //
            //      commonjs: {
            //        type: 'cjs',
            //        files: [{
            //          expand: true,
            //          cwd: 'lib/',
            //          src: ['my_library/*.js'],
            //          dest: 'dist/commonjs/',
            //          ext: '.js'
            //        },
            //        {
            //          src: ['lib/my_library.js'],
            //          dest: 'dist/commonjs/main.js'
            //        }]
            //      }
        },
        concat: {
            amd: {
                src: "tmp/src/**/*.amd.js",
                dest: "tmp/app.amd.js"
            }
        },
        browser: {
            dist: {
                src: ["vendor/loader.js", "tmp/app.amd.js"],
                dest: "dist/js/super_paint.js",
                options: {
                    barename: "super_paint",
                    namespace: "SuperPaint"
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.*'],
                tasks: ["build"]
            }
        }
    });

    grunt.registerMultiTask('browser', "Export a module to the window", function () {
        var opts = this.options();
        this.files.forEach(function (f) {
            var output = ["(function(globals) {"];

            output.push.apply(output, f.src.map(grunt.file.read));

            output.push(grunt.template.process(
                'window.<%= namespace %> = requireModule("<%= barename %>");', {
                    data: {
                        namespace: opts.namespace,
                        barename: opts.barename
                    }
                }));
            output.push('})(window);');

            grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
        });
    });

    grunt.registerTask("build", ["clean", "copy", "transpile", "concat:amd", "browser"]);
    grunt.registerTask("default", ["build", "watch"]);
};
