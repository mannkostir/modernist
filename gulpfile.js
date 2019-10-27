const	gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		browserify = require('browserify'),
		uglify = require('gulp-babel-minify'),
		cleanCss = require('gulp-clean-css'),
		rename = require('gulp-rename'),
		cache = require('gulp-cache'),
		del = require('del'),
		babelify = require('babelify'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		autoprefixer = require('gulp-autoprefixer'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		sourcemaps = require('gulp-sourcemaps');

const path = {
	build: {
		html: 'dist/',
		js: 'dist/js/',
		style: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
	},
	src: {
		html: 'app/*.html',
		js: 'app/js/common.js',
		style: 'app/sass/main.sass',
		img: 'app/img/**/*',
		fonts: 'app/fonts/**/*'
	},
	watch: {
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		style: 'app/sass/**/*.sass',
		img: 'app/img/**/*',
		fonts: 'app/fonts/**/*'
	}
};

gulp.task('webserver', () => {
	browserSync({
		server: {
			baseDir: './dist'
		},
		ghostMode: false,
		open: false,
		notify: false
	});
});

gulp.task('clear-dist', async () => {
	del.sync('dist');
});

gulp.task('clear-cache', () => {
	return cache.clearAll();
});

gulp.task('html:build', () => {
	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('style:build', () => {
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 15 versions'],
			cascade: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleanCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.style))
		.pipe(browserSync.stream());
});

gulp.task('js:build', () => {
	return browserify({
		entries: [path.src.js]
	})
		.transform(babelify)
		.bundle()
		.pipe(source('common.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img:build', () => {
	return gulp.src(path.src.img)
		.pipe(imagemin({
			interplaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', () => {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', gulp.parallel('html:build', 'style:build', 'js:build', 'img:build', 'fonts:build'));

gulp.task('watch', () => {
	gulp.watch([path.watch.html], gulp.parallel('html:build'));
	gulp.watch([path.watch.style], gulp.parallel('style:build'));
	gulp.watch([path.watch.js], gulp.parallel('js:build'));
	gulp.watch([path.watch.img], gulp.parallel('img:build'));
	gulp.watch([path.watch.fonts], gulp.parallel('fonts:build'));
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));