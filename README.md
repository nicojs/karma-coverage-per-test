# karma-coverage-per-test
A PoC which shows us how we can use karma to generate per-test coverage

Run
----
After `npm install`, run `node index.js`. It will run test by test

Basic working
----
We start the karma Server. It is configured to output json coverage for our production code. The server which in turn opens a browser. 
We than run the jasmine tests one by one, in the meantime always collecting the coverage result. 

How does it work
----
We use karma's programming api to start the `karma.Server`. See [index.js](index.js)

Karma starts a browser. Before the production code and test code is includes,
jasmine's `it()` is intercepted and wrapped in my own version of `it()` (See [itInterceptor.js](itInterceptor.js)).
After that, we can choose which test number to run by writing content to the 
`pick.js` file (for example `window.____testNumber = 0;`). The `window.____testNumber` variable is used in the 
`itInterceptor.js` to determine which test to run. After each run we collect the code coverage file.

First test #0 is run, than #1 and so on, untill we run test #4. This one does not exist. 
We detect that no tests have ran in the `index.js`. Thats when we stop testing.
