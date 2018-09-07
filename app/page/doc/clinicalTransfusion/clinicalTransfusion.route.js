module.exports = angular.module('clinicalTransfusion', []).config(route).name;

route.$inject = ['$stateProvider'];

var opt_qnz = {
    parent: 'doc',
    template: require('./clinicalTransfusion.html'),
    less: require('./clinicalTransfusion.less'),
    controller: require('./clinicalTransfusion.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('clinicalTransfusion', angular.merge({}, opt_qnz, {  // 黔南州 》术前
        url: '/clinicalTransfusion/:regOptId'
    })).state('clinicalTransfusion3', angular.merge({}, opt_qnz, {  // 黔南州 》术后
        url: '/clinicalTransfusion3/:regOptId'
    })).state('midClinicalTransfusion_hbgzb', angular.merge({}, opt_qnz, {  // 黔南州 》信息查询
        url: '/midClinicalTransfusion_hbgzb/:regOptId'
    }))
}
