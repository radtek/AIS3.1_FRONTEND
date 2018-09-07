module.exports = angular.module('visitEstLog', [])
    .config(route)
    .directive('visitEstLogYxrm', visitEstLogYxrm)
    .directive('visitEstLogLlzyyy', visitEstLog_llzyyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_yxrmyy = {
    parent: 'doc',
    template: require('./visitEstLog_yxrm.html'),
    controller: require('./visitEstLog_yxrm.controller'),
    less: require('./visitEstLog_nhfe.less'),
    controllerAs: 'vm'
}
var opt_llzyyy = {
    parent: 'doc',
    template: require('./visitEstLog_llzyyy.html'),
    controller: require('./visitEstLog_llzyyy.controller'),
    less: require('./visitEstLog_nhfe.less'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preVisitEst_yxrm', angular.merge({}, opt_yxrmyy, { // 永兴人民 》术前
        url: '/preVisitEst_yxrm/:regOptId'
    })).state('postVisitEst_yxrm', angular.merge({}, opt_yxrmyy, { // 永兴人民 》术前
        url: '/postVisitEst_yxrm/:regOptId'
    })).state('midVisitEst_yxrm', angular.merge({}, opt_yxrmyy, { // 永兴人民 》术前
        url: '/midVisitEst_yxrm/:regOptId'
    })).state('preVisitEst_llzyyy', angular.merge({}, opt_llzyyy, { // 临澧 》术前
        url: '/preVisitEst_llzyyy/:regOptId'
    }))
}


function visitEstLogYxrm() {
    return {
        template: require('./visitEstLog_yxrm.html'),
        controller: require('./visitEstLog_yxrm.controller'),
        less: require('./visitEstLog_nhfe.less'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function visitEstLog_llzyyy() {
    return {
        template: require('./visitEstLog_llzyyy.html'),
        controller: require('./visitEstLog_llzyyy.controller'),
        less: require('./visitEstLog_nhfe.less'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}