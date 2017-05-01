const gulp          = require('gulp')
const pug           = require('gulp-pug')
const marked        = require('marked')
const browserSync   = require('browser-sync').create()
const Airtable      = require('./airtable.js')
const base          = Airtable.base('appp11u59wv6QMEUV')

function convertStory (story) {
    let _story = {
        date: story.get('date'),
        content: marked(story.get('content')),
        highlight: story.get('highlight'),
        images: story.get('images'),
        tags: story.get('tags')
    }
    return _story
}

function loadStories () {
    return new Promise((resolve, reject) => {
        base('stories').select({
            sort: [{
                field: 'date',
                direction: 'desc'
            }]
        }).firstPage((err, stories) => {
            console.log(stories.length)
            if (err) return reject(err)
            resolve({
                stories: stories.map(convertStory)
            })
        })
    }).catch(err => console.log)
}

gulp.task('index', function() {
    return loadStories()
        .then((data) => {
            return gulp.src('src/index.pug')
                .pipe(pug({
                    data: data,
                    pretty: true
                }))
                .pipe(gulp.dest('./'))
                .pipe(browserSync.stream())
        })
})


gulp.task('dev', ['index'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(['src/index.pug', 'style.css'], ['index'])
})
