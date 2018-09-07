module.exports = digidragstart;

digidragstart.$inject = ['$parse'];

function digidragstart($parse) {
    return {
                restrict: 'A',
                compile: function (ele, attr) {
                    var fn = $parse(attr['digidragstart']);
                    return function rubyEventHandler(scope, ele) {
                        var eventName = 'dragstart';
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