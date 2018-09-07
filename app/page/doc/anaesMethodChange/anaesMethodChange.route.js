module.exports = angular.module('anaesMethodChange', [])
    .config(route)
    .directive('anaesMethodChangeSyzxyy', anaesMethodChangeSyzxyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_syzxyy = {
    parent: 'doc',
    template: require('./anaesMethodChange_syzxyy.html'),
    less: require('./anaesMethodChange.less'),
    controller: require('./anaesMethodChange_syzxyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preAnaesMethodChange_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preAnaesMethodChange_syzxyy/:regOptId'
    })).state('postAnaesMethodChange_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postAnaesMethodChange_syzxyy/:regOptId'
    })).state('xxcxAnaesMethodChange_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxAnaesMethodChange_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglAnaesMethodChange_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglAnaesMethodChange_syzxyy/:regOptId',
        data: { readonly: true }
    }))
}

function anaesMethodChangeSyzxyy() {
    return {
        template: require('./anaesMethodChange_syzxyy.html'),
        less: require('./anaesMethodChange.less'),
        controller: require('./anaesMethodChange_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}