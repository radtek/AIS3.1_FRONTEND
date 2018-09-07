module.exports = angular.module('anesRecordLog', [])
    .config(route)
    .directive('baseAnesRecordLog', baseAnesRecordLog)
    .directive('anesRecordLogPrint', anesRecordLogPrint)
    .directive('anesRecordLogPrintYxrm', anesRecordLogPrintYxrm)
    .directive('anesRecordLogPrintSybx', anesRecordLogPrintSybx)
    .name;

route.$inject = ['$stateProvider'];
anesRecordLogPrint.$inject = ['auth'];

var opt_base = {
    parent: 'doc',
    template: require('./base.anesRecordLog.html'),
    less: require('./anesRecordLog.less'),
    controller: require('./base.anesRecordLog.controller'),
    controllerAs: 'vm'
}

var opt_qnz = {
    parent: 'doc',
    template: require('./anesRecordLog_qnz.html'),
    less: require('./anesRecordLog.less'),
    controller: require('./anesRecordLog_qnz.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./anesRecordLog_syzxyy.html'),
    less: require('./anesRecordLog.less'),
    controller: require('./anesRecordLog.controller'),
    controllerAs: 'vm'
}

var opt_yxrmyy = {
    parent: 'doc',
    template: require('./anesRecordLog_nhfe.html'),
    less: require('./anesRecordLog_nhfe.less'),
    controller: require('./anesRecordLog_nhfe.controller'),
    controllerAs: 'vm',
}
/* 
 * data.pageState: 0(手术室) || 1(术中巡视) || 2(术后的麻醉记录单) || 3(复苏室) || 4(术后复苏室)
 * data.readonly: true(术中巡视、信息查询、科研查询)
 */
function route($stateProvider) {
    $stateProvider
        // 基线版本 > 手术室 > 麻醉记录单
        .state('anesRecordLog_base', angular.merge({}, opt_base, {
            url: '/anesRecordLog_base/:regOptId',
            data: { pageState: 0 }
        }))
        // 基线版本 > 手术管理 > 麻醉记录单
        .state('operAnaesthesia_base', angular.merge({}, opt_base, {
            url: '/operAnaesthesia_base/:regOptId',
            data: { pageState: 2 }
        }))


        // 黔南州 》术中麻醉记录单
        .state('anesRecordPage_qnz', angular.merge({}, opt_qnz, {
            url: '/anesRecordPage_qnz/:regOptId',
            data: { pageState: 0, btnFixed: true }
        }))
        // 黔南州 》术中巡视
        .state('anesRecordTour_qnz', angular.merge({}, opt_qnz, {
            url: '/anesRecordTour_qnz/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 邵阳中心医院 》术中巡视
        .state('anesRecordTour_syzxyy', angular.merge({}, opt_syzxyy, {
            url: '/anesRecordTour_syzxyy/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 黔南州 》术后的麻醉记录单
        .state('postAnesRecordLog_qnz', angular.merge({}, opt_qnz, {
            url: '/postAnesRecordLog_qnz/:regOptId',
            data: { pageState: 2, btnFixed: true }
        }))
        // 黔南州 》科研管理麻醉记录单
        .state('kyglAnesRecordLog_qnz', angular.merge({}, opt_qnz, {
            url: '/kyglAnesRecordLog_qnz/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 邵阳中心医院 》科研管理麻醉记录单
        .state('kyglAnesRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
            url: '/kyglAnesRecordLog_syzxyy/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 黔南州 》信息查询麻醉记录单
        .state('xxcxAnesRecordLog_qnz', angular.merge({}, opt_qnz, {
            url: '/xxcxAnesRecordLog_qnz/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 邵阳中心医院 》信息查询麻醉记录单
        .state('xxcxAnesRecordLog_syzxyy', angular.merge({}, opt_syzxyy, {
            url: '/xxcxAnesRecordLog_syzxyy/:regOptId',
            data: { pageState: 1, readonly: true }
        }))
        // 黔南州 》打印
        .state('anesRecordPrint', angular.merge({}, opt_qnz, {
            parent: undefined,
            url: '/anesRecordLogPrint/:regOptId',
            template: require('./anesRecordLogPrint.html'),
            controller: require('./anesRecordLogPrintOld.controller')
            // controller: require('./anesRecordLogPrint.controller')
        }))
        // 邵阳中心医院 》打印  template: require('./anesRecordLogPrint_syzxyy.html'),
        .state('anesRecordPrint_syzxyy', angular.merge({}, opt_syzxyy, {
            parent: undefined,
            url: '/anesRecordPrint_syzxyy/:regOptId',
            template: require('./anesRecordLogPrint_syzxyy1.html'),
            controller: require('./anesRecordLogPrint.controller')
        }))
        .state('anesRecordPrint_llzyyy', angular.merge({}, opt_syzxyy, {//临澧 打印
            parent: undefined,
            url: '/anesRecordPrint_syzxyy/:regOptId',
            template: require('./anesRecordLogPrint_syzxyy1.html'),
            controller: require('./anesRecordLogPrint.controller')
        }))
        .state('anesRecordPrint_qnz', { //  黔南州 | 麻醉记录单打印
            url: '/anesRecordPrint_qnz/:regOptId',
            template: require('./anesRecordLogPrint_nhfe.html'),
            less: require('./anesRecordLog_nhfe.less'),
            controller: require('./anesRecordLogPrint_nhfe.controller'),
            controllerAs: 'vm'
        })
        .state('anesRecordPage_syzxyy', angular.merge({}, opt_syzxyy, { //邵阳中心医院 | 术中
            url: '/anesRecordPage_syzxyy/:regOptId',
            data: { pageState: 0 }
        }))
        .state('midAnesRecordPage_llzyyy', angular.merge({}, opt_syzxyy, { //临澧 | 术中
            url: '/midAnesRecordPage_llzyyy/:regOptId',
            data: { pageState: 0 }
        }))
        .state('anesRecordPage_llzyyy', angular.merge({}, opt_syzxyy, { //临澧 | 术中
            url: '/anesRecordPage_llzyyy/:regOptId',
            data: { pageState: 2 }
        }))
        .state('postAnesRecordLog_syzxyy', angular.merge({}, opt_syzxyy, { //邵阳中心医院 | 术后访视
            url: '/postAnesRecordLog_syzxyy/:regOptId',
            data: { pageState: 2 }
        }))
        .state('pacuAnesRecordLog_syzxyy', angular.merge({}, opt_syzxyy, { //邵阳中心医院 | 复苏室查看
            url: '/pacuAnesRecordLog_syzxyy/:regOptId',
            data: { pageState: 2, readonly: true }
        }))
        .state('anesRecordPage_yxrm', angular.merge({}, opt_yxrmyy, {
            url: '/anesRecordPage_yxrm/:regOptId',
            data: { pageState: 0 }
        })).state('postAnesRecordLog_yxrm', angular.merge({}, opt_yxrmyy, {
            url: '/postAnesRecordLog_yxrm/:regOptId',
            data: { pageState: 2 }
        })).state('anesRecordTour_yxrm', angular.merge({}, opt_yxrmyy, {
            url: '/anesRecordTour_yxrm/:regOptId',
            data: { readonly: true, pageState: 1 }
        })).state('wRecipe_qnzzyyy', { // 黔南州打印红处方
            url: '/wRecipe_qnzzyyy',
            template: require('./recipe/recipe_qnzzyyy.html'),
            less: require('./recipe/recipeModal.less'),
            controller: require('./recipe/recipe_qnzzyyy.controller'),
            data: { recipeType: 'whitePrescription' }
        }).state('rRecipe_qnzzyyy', { // 黔南州打印白处方
            url: '/rRecipe_qnzzyyy',
            template: require('./recipe/recipe_qnzzyyy.html'),
            less: require('./recipe/recipeModal.less'),
            controller: require('./recipe/recipe_qnzzyyy.controller'),
            data: { recipeType: 'redPrescription' }
        }).state('yRecipe_qnzzyyy', {
            url: '/yRecipe_qnzzyyy',
            template: require('./recipe/recipe_qnzzyyy.html'),
            less: require('./recipe/recipeModal.less'),
            controller: require('./recipe/recipe_qnzzyyy.controller'),
            data: { recipeType: 'jingyi' }
        }).state('anesRecordPage_sybx', { // 沈阳本溪 | 术中麻醉记录单
            parent: 'doc',
            url: '/anesRecordPage_sybx/:regOptId',
            template: require('./anesRecordLog_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLog_sybx.controller'),
            controllerAs: 'vm',
            data: { pageState: 0 }
        }).state('anesRecordLog_sybx', { //沈阳本溪 术后麻醉记录单
            parent: 'doc',
            url: '/anesRecordLog_sybx/:regOptId',
            template: require('./anesRecordLog_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLog_sybx.controller'),
            controllerAs: 'vm',
            data: { pageState: 2 }
        }).state('anesRecordTour_sybx', { // 术中巡视麻醉记录单 | 本溪
            parent: 'doc',
            url: '/anesRecordTour_sybx/:regOptId',
            template: require('./anesRecordLog_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLog_sybx.controller'),
            controllerAs: 'vm',
            data: { readonly: true, pageState: 1, excludereadonly: true }
        }).state('anesRecordLog_xxcx_sybx', { // 信息查询 》 查看 本溪
            parent: 'doc',
            url: '/anesRecordLog_xxcx_sybx/:regOptId',
            template: require('./anesRecordLog_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLog_sybx.controller'),
            controllerAs: 'vm',
            data: { readonly: true, pageState: 2 }
        }).state('anesRecordLog_kycx_sybx', { // 沈阳本溪 | 科研查询 》 查看
            parent: 'doc',
            url: '/anesRecordLog_kycx_sybx/:regOptId',
            template: require('./anesRecordLog_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLog_sybx.controller'),
            controllerAs: 'vm',
            data: { readonly: true, pageState: 2 }
        }).state('anesRecordPrint_sybx', { //  沈阳本溪 | 麻醉记录单打印
            url: '/anesRecordPrint_sybx/:regOptId',
            template: require('./anesRecordLogPrint_sybx.html'),
            less: require('./anesRecordLog_sybx.less'),
            controller: require('./anesRecordLogPrint_sybx.controller'),
            controllerAs: 'vm'
        })
}

// 基线版本
function baseAnesRecordLog() {
    return {
        template: require('./base.anesRecordLogPrint.html'),
        less: require('./anesRecordLog.less'),
        controller: require('./base.anesRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

// 邵阳中心医院版本
function anesRecordLogPrint(auth) {
    var beCode = auth.loginUser().beCode;
    if (beCode == 'qnzzyyy') {
        return {
            template: require('./anesRecordLogPrint.html'),
            less: require('./anesRecordLog.less'),
            controller: require('./anesRecordLogPrintOld.controller'),
            controllerAs: 'vm',
            restrict: 'E',
            replact: true,
            scope: {}
        }
    } else {
        return {
            template: require('./anesRecordLogPrint_syzxyy1.html'),
            less: require('./anesRecordLog.less'),
            controller: require('./anesRecordLogPrint.controller'),
            controllerAs: 'vm',
            restrict: 'E',
            replact: true,
            scope: {}
        }
    }
}

// 永兴人民医院版本
function anesRecordLogPrintYxrm() {
    return {
        template: require('./anesRecordLogPrint_nhfe.html'),
        less: require('./anesRecordLog_nhfe.less'),
        controller: require('./anesRecordLogPrint_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function anesRecordLogPrintSybx() {
    return {
        template: require('./anesRecordLogPrint_sybx.html'),
        less: require('./anesRecordLog_sybx.less'),
        controller: require('./anesRecordLogPrint_sybx.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}