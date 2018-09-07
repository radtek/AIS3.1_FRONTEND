module.exports = scoreCtrl;

scoreCtrl.$inject = ['$window', '$q', '$timeout'];

function scoreCtrl($window, $q, $timeout) {
    var vm = this;
    var promise = function() {
        var deferred = $q.defer();
        $timeout(function() {
            $window.print();
            deferred.resolve(1);
        }, 1000);
        return deferred.promise;
    }();

    promise.then(function(rs) {
        window.close();
    })
}
