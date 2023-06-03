"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";
import debug from "gulp-debug";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import yargs from "yargs";

const webpackConfig = require("../webpack.config.js"),
    argv = yargs.argv,
    production = !!argv.production;

webpackConfig.mode = production ? "production" : "development";
webpackConfig.devtool = production ? false : "source-map";

gulp.task("libs", () => {
    return gulp.src(paths.libs.src)
        .pipe(gulpif(production, rename({
            suffix: ".min"
        })))
        .pipe(gulp.dest(paths.libs.dist))
        .pipe(debug({
            "title": "Libs"
        }));
});
