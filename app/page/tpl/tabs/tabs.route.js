module.exports = angular.module('tabs', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('tabs', {
        parent: 'frame',
        url: '/tabs',
        template: require('./tabs.html'),
        less: require('./tabs.less'),
        controller: require('./tabs.controller'),
        resolve: {
            resultRegOpt: resultRegOpt
        }
    })
    resultRegOpt.$inject = ['$rootScope', '$q', 'IHttp'];

    function resultRegOpt($rootScope, $q, IHttp) {
        var def = $q.defer();
        var regOptId = $rootScope.$stateParams.regOptId ? $rootScope.$stateParams.regOptId : sessionStorage.getItem('regOptId');
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            def.resolve(rs);

        });
        return def.promise;
    }
}