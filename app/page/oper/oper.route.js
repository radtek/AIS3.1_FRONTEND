module.exports = angular.module('oper', [])
    .config(route)
    .filter('emergency', emergency)
    .filter('state', state)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('oper', {  // 手术申请
        parent: 'frame',
        url: '/oper',
        template: require('./oper.html'),
        less: require('./oper.less'),
        controller: require('./oper.controller'),
        controllerAs: 'vm'
    }).state('editOperDateil', { // 手术详情
        parent: 'doc',
        url: '/oper/detail/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('changeOper', { // 预约变更
        parent: 'doc',
        url: '/operQuery/changeOper/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('operEmergency', { // 术中急诊录入
        parent: 'doc',
        url: '/operEmergency',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('nursEmergency', { // 护理安排急诊录入
        parent: 'doc',
        url: '/schedule/nursEmergency',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('anaeEmergency', { // 麻醉安排急诊录入
        parent: 'doc',
        url: '/schedule/anaeEmergency',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('preOper', { /*************** 术前 ***************/
        parent: 'frame',
        url: '/preOper',
        template: require('./oper.html'),
        less: require('./oper.less'),
        controller: require('./oper.controller')
    }).state('preOperDateil', { // 查询手术人员详情
        parent: 'doc',
        url: '/preOper/detail/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('operQuery', { /*************** 手术查询 ***************/
        parent: 'frame',
        url: '/operQuery',
        template: require('./oper.html'),
        less: require('./oper.less'),
        controller: require('./oper.controller')
    }).state('postOper', { /*************** 术后 ***************/
        parent: 'frame',
        url: '/postOper',
        template: require('./oper.html'),
        less: require('./oper.less'),
        controller: require('./oper.controller')
    }).state('queryOperDateil', {   // 查询手术人员详情
        parent: 'doc',
        url: '/postOper/detail/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller')
    }).state('queryOperDateil_xxcx', {  // 信息查询 》 查看
        parent: 'doc',
        url: '/queryOperDateil_xxcx/detail/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller'),
        data: { readonly: true }
    }).state('queryOperDateil_kycx', {  // 科研管理 》 查看
        parent: 'doc',
        url: '/queryOperDateil_kycx/detail/:regOptId',
        template: require('./operDetail/operDetail.html'),
        less: require('./operDetail/operDetail.less'),
        controller: require('./operDetail/operDetail.controller'),
        data: { readonly: true }
    })
}

function state() {
    var state = { '01': '未审核', '02': '未排班', '03': '术前', '04': '术中', '05': '复苏中', '06': '术后', '07': '中止', '08': '取消' };
    return function(input) {
        if (input == undefined || input == null) {
            return '';
        } else {
            return state[input];
        }
    };
}

function emergency() {
    var emergency = { '0': '择期', '1': '急诊' };
    return function(input) {
        if (input == undefined || input == null) {
            return '';
        } else {
            return emergency[input];
        }
    };
}
