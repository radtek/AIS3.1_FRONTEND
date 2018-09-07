module.exports = angular.module('anesthesiaSummary', [])
    .config(route)
    .directive('anesthesiaSummary', anesthesiaSummary)
    .directive('anesthesiaSummarySyzxyy', anesthesiaSummarySyzxyy)
    .directive('anesthesiaSummaryYxrm',anesthesiaSummaryYxrm)
    .directive('anesthesiaSummaryLlzyyy',anesthesiaSummaryLlzyyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./anesthesiaSummary_nhfe.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./anesthesiaSummary_nhfe.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //麻醉总结
    $stateProvider.state('postAnesthesiaSummary_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术后
        url: '/postAnesthesiaSummary_qnz/:regOptId'
    })).state('midAnesthesiaSummary_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术中巡视
        url: '/midAnesthesiaSummary_qnz/:regOptId',
    })).state('xxcxAnesthesiaSummary_qnz', angular.merge({}, opt_qnz, { // 黔南州 》信息查询
        url: '/xxcxAnesthesiaSummary_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglAnesthesiaSummary_qnz', angular.merge({}, opt_qnz, { // 黔南州 》科研管理
        url: '/kyglAnesthesiaSummary_qnz/:regOptId',
        data: { readonly: true }
    })).state('postAnesthesiaSummary_syzx', angular.merge({}, opt_qnz, { // 邵阳中心医院 》术后
        url: '/postAnesthesiaSummary_syzx/:regOptId',
        template: require('./anesthesiaSummary_syzx.html')
    })).state('midAnesthesiaSummary_syzx', angular.merge({}, opt_qnz, { // 邵阳中心医院 》术中巡视
        url: '/midAnesthesiaSummary_syzx/:regOptId',
        template: require('./anesthesiaSummary_syzx.html')
    })).state('xxcxAnesthesiaSummary_syzx', angular.merge({}, opt_qnz, { // 邵阳中心医院 》信息查询
        url: '/xxcxAnesthesiaSummary_syzx/:regOptId',
        template: require('./anesthesiaSummary_syzx.html'),
        data: { readonly: true }
    })).state('kyglAnesthesiaSummary_syzx', angular.merge({}, opt_qnz, { // 邵阳中心医院 》科研管理
        url: '/kyglAnesthesiaSummary_syzx/:regOptId',
        template: require('./anesthesiaSummary_syzx.html'),
        data: { readonly: true }
    })).state('postAnesthesiaSummary_yxrm', angular.merge({}, opt_qnz, { // 永兴人民 》术后
        template: require('./anesthesiaSummary_yxrm.html'),
        url: '/postAnesthesiaSummary_yxrm/:regOptId'
    })).state('midAnesthesiaSummary_yxrm', angular.merge({}, opt_qnz, { // 永兴人民 》术中巡视
        template: require('./anesthesiaSummary_yxrm.html'),
        url: '/midAnesthesiaSummary_yxrm/:regOptId'
    })).state('postAnesthesiaSummary_llzyyy', angular.merge({}, opt_qnz, { // 临澧 》术后
        template: require('./anesthesiaSummary_llzyyy.html'),
        url: '/postAnesthesiaSummary_llzyyy/:regOptId'
    }))

}

var dev = {
    template: require('./anesthesiaSummary_nhfe.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./anesthesiaSummary_nhfe.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function anesthesiaSummary() {
    return dev
}

function anesthesiaSummarySyzxyy() {
    return angular.merge({}, dev, {
        template: require('./anesthesiaSummary_syzx.html')
    })
}

function anesthesiaSummaryYxrm() {
    return angular.merge({}, dev, {
        template: require('./anesthesiaSummary_yxrm.html')
    })
}
function anesthesiaSummaryLlzyyy() {
    return angular.merge({}, dev, {
        template: require('./anesthesiaSummary_llzyyy.html')
    })
}