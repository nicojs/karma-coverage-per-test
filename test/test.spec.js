
describe('printOneOrTwo', function () {

    describe('when true', function () {
        it('should print one', function () {
            printOneOrTwo(true);
        });
    });

    describe('when false', function () {
        it('should run test two', function () {
            printOneOrTwo(false);
        });
    });
    
    describe('when false', function () {
        it('should run do this', function () {
            printOneOrTwo(false);
        });
        
        it('should do that', function(){});
    });
});