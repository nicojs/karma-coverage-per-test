var karma = require('karma');
var fs = require('fs');

var fsExtra = require('fs-extra');


var startTime, endTime, portNumber = 9877, currentSpecName, currentSpecNumber = -1, allResults = [];

function nextSpec() {
    currentSpecNumber++
    fs.writeFileSync('pick.js', 'window.____testNumber = ' + currentSpecNumber + ';', 'utf8');
    console.log('written test num: ', currentSpecNumber);
}

nextSpec();

var server = new karma.Server({
    browsers: ['PhantomJS'],
    files: ['./pick.js', './itInterceptor.js', 'test/**/*.spec.js', 'src/**/*.js'],
    frameworks: ['jasmine'],
    autoWatch: false,
    singleRun: false,
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-coverage'],
    preprocessors: { 'src/**/*.js': ['coverage'] },
    port: portNumber,
    reporters: ['coverage'],
    coverageReporter: {
        type: 'json',
        dir: 'coverage',
        subdir: 'json'
    }
}, function (exitCode) {
    console.log(exitCode);
});

function runCurrent() {
    karma.runner.run({ port: portNumber }, function (err, errorCode) {
        if (errorCode) {
            console.log('Error: ', errorCode);
        }
    });
}

function collectCoverage() {
    return JSON.parse(fs.readFileSync('coverage/json/coverage-final.json', 'utf8'));
}

server.on('browser_error', function () {
    console.log('Browser error!');
});

server.on('run_complete', function (browsers, results) {
    console.log('run_complete');
    if (results.success || results.failed) {
        allResults.push({
            result: results,
            specNumber: currentSpecNumber,
            specName: currentSpecName,
            coverage: collectCoverage()
        });
        console.log('completed: ', currentSpecName);
        nextSpec();
        runCurrent();
    } else {
        console.log('Done! All results: ', JSON.stringify(allResults));
        process.exit(1);
    }
});

server.on('spec_complete', function (browser, spec) {
    currentSpecName = spec.suite.join(' ') + ' ' + spec.description;
});

server.on('browsers_ready', function () {
    console.log('browsers_ready');
    runCurrent();
});

server.start();
