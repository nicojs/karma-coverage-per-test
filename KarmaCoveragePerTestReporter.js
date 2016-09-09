var KarmaCoveragePerTestReporter = function (emitter) {

    var coveragePerSpec = [];

    this.onBrowserComplete = function (browser, result) {
        emitter.emit('coverage_complete', result.coverage);
    }

    this.adapters = [];
}
KarmaCoveragePerTestReporter.$inject = ['emitter']
module.exports = {
    'reporter:coverage-per-test': ['type', KarmaCoveragePerTestReporter]
}