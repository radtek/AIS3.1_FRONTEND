let angular = require('angular');
let printCtrl = require('./print.controller');
let tkDocPrint = require('./tkDocPrint.directive');
let tkPrintRegion = require('./tkPrintRegion.directive');

module.exports = angular.module("print", [])
    .config(route)
    .controller('printCtrl', printCtrl)
    .directive('tkDocPrint', tkDocPrint)
    .directive('tkPrintRegion', tkPrintRegion)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('print', {
        url: '/print',
        params: { htmlStr: null },
        template: require('./print.html'),
        controller: 'printCtrl',
        controllerAs: 'vm'
    });
}
