(function(window){
    var realIt = window.it, count = 0;
    window.it = function(){
        if(count === window.____testNumber){
            var spec = realIt.apply(window, arguments);
            console.log('spec: ', spec);
        }else{
            console.log('skipping: ' + arguments[0]);
        }
        count ++;
    }
})(window);
