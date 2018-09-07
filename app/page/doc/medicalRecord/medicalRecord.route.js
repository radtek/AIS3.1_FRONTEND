module.exports = angular.module('medicalRecord', []).config(route).name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./medicalRecord.html'),
    less: require('./medicalRecord.less'),
    controller: require('./medicalRecord.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('medicalRecord', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/medicalRecord/:regOptId'
    })).state('medicalRecord3', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/medicalRecord3/:regOptId'
    }))
}
