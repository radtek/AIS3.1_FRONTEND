module.exports = digidrop;

digidrop.$inject = ['$parse'];

function digidrop($parse) {
    return {
                restrict: 'A',
                compile: function (ele, attr) {
                    var fn = $parse(attr['digidrop']);
                    return function rubyEventHandler(scope, ele) {
                        var eventName = 'drop';
                        ele[0].addEventListener(eventName, function (event) {
                            if (eventName == 'dragover' || eventName == 'drop') {
                                event.preventDefault();
                            }
                            var callback = function () {
                                fn(scope, { event: event });
                            };
                            callback();
                        });
                    }
                }
            }
}