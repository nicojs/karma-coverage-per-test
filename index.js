var karma = require('karma');
var fs = require('fs');

var fsExtra = require('fs-extra');
var istanbul = require('istanbul');
var util = require('util');
util.expand

var instrumenter = new istanbul.Instrumenter({ coverageVariable: '__coveragePerTest__' });
var prodCode = fs.readFileSync('src/production.js', { encoding: 'utf8' });

var instrumentedProdCode = instrumenter.instrumentSync(prodCode, 'src/production.js');

var exists = true;
cleanup();

var coverageObjRegex = /\{.*"path".*"fnMap".*"statementMap".*"branchMap".*\}/g
coverageObjRegex.lastIndex = 0
var coverageObjMatch = coverageObjRegex.exec(instrumentedProdCode);
var coverageObj = JSON.parse(coverageObjMatch);

delete coverageObj.s;
delete coverageObj.b;
delete coverageObj.f;

var coverageMapPerFile = {
    'src/production.js': coverageObj
}

fs.mkdirSync('.tmp');
fs.writeFileSync('.tmp/production.js', instrumentedProdCode);

var startTime, endTime, portNumber = 9877, currentSpecName, currentSpecNumber = -1, allResults = [];

var server = new karma.Server({
    browsers: ['Chrome'],
    files: ['./coveragePerTestReporter.js', 'test/**/*.spec.js', '.tmp/**/*.js'],
    frameworks: ['jasmine'],
    autoWatch: false,
    singleRun: false,
    plugins: ['karma-jasmine', 'karma-mocha', 'karma-chrome-launcher', 'karma-phantomjs-launcher', require('./KarmaCoveragePerTestReporter')],
    port: portNumber,
    reporters: ['coverage-per-test'],
    coverageReporter: {
        type: 'in-memory',
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


server.on('browser_error', function () {
    console.log('Browser error!');
});

server.on('coverage_complete', function (coverageResult) {
    console.log('cov result: ', JSON.stringify(coverageResult));
    Object.keys(coverageResult).forEach(function (specId) {
        console.log(`Reporting for spec: "${specId}"`);
        var htmlReport = istanbul.Report.create('html', { dir: `html-report/${specId}` });
        var mergedResult = assign(coverageResult[specId], coverageMapPerFile);
        var collector = new istanbul.Collector();
        collector.add(mergedResult);
        htmlReport.writeReport(collector, true);
    });
});

server.on('run_complete', function (browsers, results) {
    console.log('run_complete');
    if (results.success || results.failed) {
        allResults.push({
            result: results,
            specNumber: currentSpecNumber,
            specName: currentSpecName,
        });
        console.log('completed: ', currentSpecName);
    } else {
        console.log('Done! All results: ', JSON.stringify(allResults));
        // process.exit(1);
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

function assign(target, source){
    Object.keys(target).forEach(function(key){
        if(typeof source[key] === 'object' && typeof target[key] === 'object'){
            assign(source[key], target[key]);
        }else{
            source[key] = target[key];
        }
    });
    return target;
}

function cleanup() {
    try {
        fs.statSync('.tmp/production.js');
    } catch (s) {
        exists = false;
    }
    if (exists) {
        fs.unlinkSync('.tmp/production.js');
    }

    exists = true;
    try {
        fs.statSync('.tmp');
    } catch (s) {
        exists = false;
    }
    if (exists) {
        fs.rmdirSync('.tmp');
    }

}