module.exports = digidragover;

digidragover.$inject = ['$parse'];

function digidragover($parse) {
    return {
                restrict: 'A',
                compile: function (ele, attr) {
                    var fn = $parse(attr['digidragover']);
                    return function rubyEventHandler(scope, ele) {
                        var eventName = 'dragover';
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