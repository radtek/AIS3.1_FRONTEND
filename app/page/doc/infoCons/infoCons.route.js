module.exports = angular.module('infoCons', [])
    .config(route)
    .directive('infoConsQnz', infoConsQnz)
    .directive('infoConsSybx', infoConsSybx)
    .directive('infoConsSyzxyy', infoConsSyzxyy)
    .directive('infoConsYxrm', infoConsYxrm)
    .directive('infoConsLlzyyy', infoCons_llzyyy)
    .name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./infoCons_qnz.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons_qnz.controller'),
    controllerAs: 'vm'
}

var opt_syzxyy = {
    parent: 'doc',
    template: require('./infoCons_syzxyy.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons_syzxyy.controller'),
    controllerAs: 'vm'
}

var opt_yxrmyy = {
    parent: 'doc',
    template: require('./infoCons_nhfe.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons_nhfe.controller'),
    controllerAs: 'vm'
}
var opt_llzyyy = {
    parent: 'doc',
    template: require('./infoCons_llzyyy.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons_llzyyy.controller'),
    controllerAs: 'vm'
}
var opt_lyrm = {
    parent: 'doc',
    template: require('./postInfoCons.html'),
    controller: require('./postInfoCons.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //麻醉知情同意书
    $stateProvider.state('preInfoCons_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术前
        url: '/preInfoCons_qnz/:regOptId'
    })).state('postInfoCons_qnz', angular.merge({}, opt_qnz, { // 黔南州 》术后
        url: '/postInfoCons_qnz/:regOptId'
    })).state('xxcxInfoCons_qnz', angular.merge({}, opt_qnz, { // 黔南州 》信息查询
        url: '/xxcxInfoCons_qnz/:regOptId',
        data: { readonly: true }
    })).state('kyglInfoCons_qnz', angular.merge({}, opt_qnz, { // 黔南州 》科研管理
        url: '/kyglInfoCons_qnz/:regOptId',
        data: { readonly: true }
    })).state('preInfoCons_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/preInfoCons_syzxyy/:regOptId'
    })).state('postInfoCons_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/postInfoCons_syzxyy/:regOptId'
    })).state('xxcxInfoCons_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/xxcxInfoCons_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('kyglInfoCons_syzxyy', angular.merge({}, opt_syzxyy, {
        url: '/kyglInfoCons_syzxyy/:regOptId',
        data: { readonly: true }
    })).state('preInfoCons_yxrm', angular.merge({}, opt_yxrmyy, {
        url: '/preInfoCons_yxrm/:regOptId'
    })).state('postInfoCons_yxrm', angular.merge({}, opt_yxrmyy, {
        url: '/postInfoCons_yxrm/:regOptId'
    })).state('infoCons_sybx', angular.merge({}, opt_yxrmyy, { //沈阳本溪 术前访视 》查看
        url: '/infoCons_sybx/:regOptId',
        template: require('./infoCons_sybx.html'),
        controller: require('./infoCons_sybx.controller')
    })).state('infoCons_xxcx_sybx', angular.merge({}, opt_yxrmyy, { //沈阳本溪信息查询 》查看
        url: '/infoCons_xxcx_sybx/:regOptId',
        template: require('./infoCons_sybx.html'),
        controller: require('./infoCons_sybx.controller'),
        data: { readonly: true }
    })).state('infoCons_kycx_sybx', angular.merge({}, opt_yxrmyy, { //沈阳本溪 | 科研查询 》查看
        url: '/infoCons_kycx_sybx/:regOptId',
        template: require('./infoCons_sybx.html'),
        controller: require('./infoCons_sybx.controller'),
        data: { readonly: true }
    })).state('infoCons2_sybx', angular.merge({}, opt_yxrmyy, { //沈阳本溪
        url: '/infoCons2_sybx/:regOptId',
        template: require('./infoCons_sybx.html'),
        controller: require('./infoCons_sybx.controller')
    })).state('InfoCons_llzyyy', angular.merge({}, opt_llzyyy, { //临澧
        url: '/InfoCons_llzyyy/:regOptId'
    })).state('postInfoCons_lyrm', angular.merge({}, opt_lyrm, { //耒阳   术后镇痛知情同意书及访视记录
        url: '/postInfoCons_lyrm/:regOptId'
    })).state('infoCons_lyrm', angular.merge({}, opt_yxrmyy, {//耒阳 麻醉同意书
        template: require('./infoCons_lyrm.html'),
        url: '/infoCons_lyrm/:regOptId'
    }))
}

function infoCons_llzyyy() {
    return {
        template: require('./infoCons_llzyyy.html'),
        less: require('./infoCons.less'),
        controller: require('./infoCons_llzyyy.controller'),
        restrict: 'E',
        controllerAs: 'vm',
        replact: true,
        scope: {}
    }
}

function infoConsSybx() {
    return {
        template: require('./infoCons_sybx.html'),
        less: require('./infoCons.less'),
        controller: require('./infoCons_sybx.controller'),
        restrict: 'E',
        controllerAs: 'vm',
        replact: true,
        scope: {}
    }
}

function infoConsQnz() {
    return {
        template: require('./infoCons_qnz.html'),
        less: require('./infoCons.less'),
        controller: require('./infoCons_qnz.controller'),
        restrict: 'E',
        controllerAs: 'vm',
        replact: true,
        scope: {}
    }
}

function infoConsSyzxyy() {
    return {
        template: require('./infoCons_syzxyy.html'),
        less: require('./infoCons.less'),
        controller: require('./infoCons_syzxyy.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function infoConsYxrm() {
    return {
        template: require('./infoCons_nhfe.html'),
        less: require('./infoCons.less'),
        controller: require('./infoCons_nhfe.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}