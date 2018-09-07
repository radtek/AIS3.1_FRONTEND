module.exports = angular.module('doc', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('doc', {
            parent: 'tabs',
            template: require('./doc.html'),
            controller: require('./doc.controller.js')
        })
        // 一键打印
        .state('docPrint', {
            url: '/docPrint/:regOptId&:docStr',
            template: require('../oper/print/print.html'),
            controller: require('../oper/print/print.controller')
        }).state('docPrintSyzxyy', {
            url: '/docPrintSyzxyy/:regOptId&:docStr',
            template: require('../oper/print/print_syzxyy.html'),
            controller: require('../oper/print/print.controller')
        }).state('docPrintYxrm', {
            url: '/docPrintYxrm/:regOptId&:docStr',
            template: require('../oper/print/print_yxrm.html'),
            controller: require('../oper/print/print.controller')
        }).state('docPrintSybx', {
            url: '/docPrintSybx/:regOptId&:docStr',
            template: require('../oper/print/print_sybx.html'),
            controller: require('../oper/print/print.controller')
        }).state('docPrintLlzyyy', {
            url: '/docPrintLlzyyy/:regOptId&:docStr',
            template: require('../oper/print/print_llzyyy.html'),
            controller: require('../oper/print/print.controller')
        })
}