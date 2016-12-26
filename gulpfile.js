const gulp          = require('gulp')
const pug           = require('gulp-pug')
const marked        = require('marked')
const browserSync   = require('browser-sync').create()

function reload (path) {
    delete require.cache[require.resolve(path)]
    return require(path)
}

function loadStories (path) {
    let data = reload('./data/stories')
    data.stories.forEach((story) => story.content = marked(story.content))
    return data
}

gulp.task('index', function() {
    return gulp.src('src/index.pug')
        .pipe(pug({
            data: loadStories(),
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream())
})


gulp.task('dev', ['index'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(['src/index.pug', 'data/*.json'], ['index'])
})
