module.exports = angular.module('enumeratemanage', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('enumeratemanage', {
        parent: 'tabs',
        url: '/enumeratemanage',
        template: require('./enumeratemanage.html'),
        less: require('./enumeratemanage.less'),
        controller: require('./enumeratemanage.controller')
    });
}
route.$inject = ['$stateProvider'];
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
