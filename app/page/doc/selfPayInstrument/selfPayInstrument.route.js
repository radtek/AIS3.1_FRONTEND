module.exports = angular.module('selfPayInstrument', [])
    .config(route)
    .directive('selfPayInstrumentQnz', selfPayInstrumentQnz)
    .directive('selfPayInstrumentSyzxyy', selfPayInstrumentSyzxyy)
    .directive('selfPayInstrumentLlzyyy', selfPayInstrument_llzyyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./selfPayInstrument_qnz.html'),
    less: require('./selfPayInstrument.less'),
    controller: require('./selfPayInstrument_qnz.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./selfPayInstrument_syzxyy.html'),
    less: require('./selfPayInstrument.less'),
    controller: require('./selfPayInstrument_syzxyy.controller'),
    controllerAs: 'vm'
}
var opt_llzyyy = {
    parent: 'doc',
    template: require('./selfPayInstrument_llzyyy.html'),
    less: require('./selfPayInstrument.less'),
    controller: require('./selfPayInstrument_llzyyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //手术麻醉使用自费及高价耗材知情同意书
    $stateProvider.state('preSelfPayInstrument_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术前
        url: '/selfPayInstrument_qnz/:regOptId'
    })).state('postSelfPayInstrument_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术后
        url: '/postSelfPayInstrument_qnz/:regOptId'
    })).state('xxcxSelfPayInstrument_qnz', angular.merge({}, opt_qnz, { // 黔南州 》信息查询
        url: '/xxcxSelfPayInstrument_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglSelfPayInstrument_qnz', angular.merge({}, opt_qnz, { // 黔南州 》科研管理
        url: '/kyglSelfPayInstrument_qnz/:regOptId',
        data: { readonly: true }
    })).state('preSelfPayInstrument_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preSelfPayInstrument_syzxyy/:regOptId'
    })).state('postSelfPayInstrument_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postSelfPayInstrument_syzxyy/:regOptId'
    })).state('xxcxSelfPayInstrument_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxSelfPayInstrument_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglSelfPayInstrument_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglSelfPayInstrument_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('SelfPayInstrument_llzyyy', angular.merge({}, opt_llzyyy, {
        url: '/SelfPayInstrument_llzyyy/:regOptId'
    }))
}

function selfPayInstrument_llzyyy() {
    return {
        template: require('./selfPayInstrument_llzyyy.html'),
        less: require('./selfPayInstrument.less'),
        controller: require('./selfPayInstrument_llzyyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function selfPayInstrumentQnz() {
    return {
        template: require('./selfPayInstrument_qnz.html'),
        less: require('./selfPayInstrument.less'),
        controller: require('./selfPayInstrument_qnz.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function selfPayInstrumentSyzxyy() {
    return {
        template: require('./selfPayInstrument_syzxyy.html'),
        less: require('./selfPayInstrument.less'),
        controller: require('./selfPayInstrument_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}