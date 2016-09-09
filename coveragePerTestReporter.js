(function (window) {

    var id = 0, coverageStateAtStart;
    window.__coverage__ = globalCoverage = {};

    var coveragePerTestReporter = {
        specStarted: function (a, b, c) {
            if (!coverageStateAtStart) {
                coverageStateAtStart = clone(window.__coveragePerTest__);
            }
        },
        specDone: function (result) {
            globalCoverage[result.id] = coverageResult = {};
            var coveragePerTest = window.__coveragePerTest__;
            Object.keys(coveragePerTest).forEach(function (file) {
                var coverage = coveragePerTest[file];
                coverageResult[file] = {
                    s: coverage.s,
                    b: coverage.b,
                    f: coverage.f
                };
                coverage.s = clone(coverageStateAtStart[file].s);
                coverage.b = clone(coverageStateAtStart[file].b);
                coverage.f = clone(coverageStateAtStart[file].f);
            });

        }
    };

    jasmine.getEnv().addReporter(coveragePerTestReporter);
    // jasmine.getEnv().specFilter = function (spec){
    //     console.log('filtering spec', spec);
    //     return false;
    // }

    function clone(source) {
        var types = ['number', 'string', 'boolean'],
            result;

        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function (type) {
            if (typeof source === type) {
                result = source;
            }
        });

        if (typeof result == "undefined") {
            if (Array.isArray(source)) {
                result = [];
                source.forEach(function (child, index) {
                    result[index] = clone(child);
                });
            } else if (typeof source == "object") {
                // it is an object literal
                result = {};
                for (var i in source) {
                    result[i] = clone(source[i]);
                }
            }
        }
        return result;
    }

})(window);