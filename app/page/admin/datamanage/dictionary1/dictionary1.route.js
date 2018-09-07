module.exports = angular.module('dictionary1', [])
    .filter('fieldEnable', fieldEnable)
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('dictionary1', {
    	parent: 'tabs',
        url: '/dictionary1',
        template: require('./dictionary1.html'),
        less: require('./dictionary1.less'),
        controller: require('./dictionary1.controller')
    });
}

function fieldEnable() {
    var genderHash = {
        true: '启用',
        false: '禁用'
    };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
