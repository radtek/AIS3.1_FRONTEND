module.exports = angular.module('recycleAutoBlood', [])
    .config(route)
    .directive('recycleAutoBloodSyzxyy', recycleAutoBloodSyzxyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_syzxyy = {
    parent: 'doc',
    template: require('./recycleAutoBlood_syzxyy.html'),
    less: require('./recycleAutoBlood.less'),
    controller: require('./recycleAutoBlood_syzxyy.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('preRecycleAutoBlood_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preRecycleAutoBlood_syzxyy/:regOptId'
    })).state('postRecycleAutoBlood_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postRecycleAutoBlood_syzxyy/:regOptId'
    })).state('xxcxRecycleAutoBlood_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxRecycleAutoBlood_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglRecycleAutoBlood_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglRecycleAutoBlood_syzxyy/:regOptId',
        data: { readonly: true }
    }))
}

function recycleAutoBloodSyzxyy() {
    return {
        template: require('./recycleAutoBlood_syzxyy.html'),
        less: require('./recycleAutoBlood.less'),
        controller: require('./recycleAutoBlood_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}