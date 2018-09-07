module.exports = angular.module('asseVisitForm', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

var opt_csht = {
    parent: 'doc',
    template: require('./asseVisitForm.html'),
    controller: require('./asseVisitForm.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('asseVisitForm', angular.merge({}, opt_csht, {
        url: '/asseVisitForm/:regOptId'
    })).state('surgicalVisitList', angular.merge({}, opt_csht, {
        url: '/surgicalVisitList/:regOptId',
        template: require('./surgicalVisitList.html')
    }))
}