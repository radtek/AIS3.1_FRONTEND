module.exports = angular.module('operName', [])
	.filter('filterEnable', filterEnable)
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('operName', {
    	parent: 'tabs',
        url: '/operName',
        template: require('../doctorType/doctorType.html'),
        controller: require('./operName.controller')
    });
}

function filterEnable (){
	var genderHash = { 1: '启用', 0: '禁用' };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
