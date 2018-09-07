module.exports = angular.module('collectionConfig', [])
    .config(route)
    .filter('amendFlag', amendFlag)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('collectionConfig', {
    	parent: 'tabs',
        url: '/collectionConfig',
        template: require('../doctorType/doctorType.html'),
        controller: require('./collectionConfig.controller')
    });
}

function amendFlag() {
	var genderHash = { 1: '修正', 0: '缺失' };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
