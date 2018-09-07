module.exports = angular.module('scoreComp', [])
    .config(route)
    .filter('fieldOptType', fieldOptType)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('scoreComp', {
        parent: 'tabs',
        url: '/scoreComp',
        template: require('../doctorType/doctorType.html'),
        controller: require('./scoreComp.controller')
    });
}

function fieldOptType() {
    var genderHash = {
        1: '非术后患者',
        2: '手术患者'
    };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}

