module.exports = angular.module('transfusionAdverse', []).config(route).name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./transfusionAdverse.html'),
    less: require('./transfusionAdverse.less'),
    controller: require('./transfusionAdverse.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('transfusionAdverse', angular.merge({}, opt_qnz, {
        url: '/transfusionAdverse/:regOptId'
    })).state('transfusionAdverse3', angular.merge({}, opt_qnz, {
        url: '/transfusionAdverse3/:regOptId'
    }))
}
