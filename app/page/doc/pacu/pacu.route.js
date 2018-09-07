module.exports = angular.module('pacuRecordLog', [])
    .config(route)
    .directive('pacuRecordLog', pacuRecordLog)
    .name;

route.$inject = ['$stateProvider'];

var pacu_base = {
    parent: 'doc',
    template: require('./base.pacuRecordLog.html'),
    less: require('./base.pacuRecordLog.less'),
    controller: require('./base.pacuRecordLog.controller'),
    controllerAs: 'vm'
}
var opt_syzxyy = {
    parent: 'doc',
    template: require('./rehealthRecord_nhfe.html'),
    less: require('./rehealthRecord_nhfe.less'),
    controller: require('./rehealthRecord_nhfe.controller'),
    controllerAs: 'vm'
}
/* 
 * data.pageState: 0(手术室) || 1(术中巡视) || 2(术后的麻醉记录单) || 3(复苏室) || 4(术后复苏室)
 * data.readonly: true(术中巡视、信息查询、科研查询)
 */
function route($stateProvider) {
    $stateProvider.state('pacuRecordLog_nhfe', angular.merge({}, opt_syzxyy, {
            url: '/pacuRecordLog_nhfe/:regOptId',
        })).state('pacuRecordLog_syzxyy', angular.merge({}, opt_syzxyy, { // 邵阳中心医院
            url: '/pacuRecordLog_syzxyy/:regOptId',
            template: require('./syzxyy.rehealthRecord.html'),
            controller: require('./rehealthRecord.controller')
        })).state('pacuRecordLog_qnz', angular.merge({}, opt_syzxyy, {
            url: '/pacuRecordLog_qnz/:regOptId'
        })).state('kyglPacuRecordLog_qnz', angular.merge({}, opt_syzxyy, {
            url: '/kyglPacuRecordLog_qnz/:regOptId',
            template: require('./syzxyy.rehealthRecord.html'),
            controller: require('./rehealthRecord.controller'),
            data: { readonly: true }
        })).state('xxcxPacuRecordLog_qnz', angular.merge({}, opt_syzxyy, {
            url: '/xxcxPacuRecordLog_qnz/:regOptId',
            data: { readonly: true }
        })).state('operPacuRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
            url: '/operPacuRecordLog_syzxyy/:regOptId',
            template: require('./syzxyy.rehealthRecord.html'),
            controller: require('./rehealthRecord.controller')
        }))
        // 基线版本 > 复苏室 > Pacu复苏单
        .state('pacuRecovery_base', angular.merge({}, pacu_base, {
            url: '/pacuRecovery_base/:regOptId',
            data: { pageState: 3 }
        }))
        // 基线版本 > 手术管理 > Pacu复苏单
        .state('operRecovery_base', angular.merge({}, pacu_base, {
            url: '/operRecovery_base/:regOptId',
            data: { pageState: 4 }
        }))
}

function pacuRecordLog() {
    return {
        template: require('./rehealthRecord.html'),
        less: require('./rehealthRecord.less'),
        controller: require('./rehealthRecord.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}