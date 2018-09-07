module.exports = angular.module('oprmdevicesconfig', [])
    .config(route)
    .filter('enabledSelect', enabledSelect)
    .filter('mustShowFilter', mustShowFilter)
    .filter('positionFilter',positionFilter)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('oprmdevicesconfig', {
        parent: 'tabs',
        url: '/oprmdevicesconfig',
        template: require('./oprmdevicesconfig.html'),
        less: require('./oprmdevicesconfig.less'),
        controller: require('./oprmdevicesconfig.controller')
    });
}

function enabledSelect() {
    var genderHash = {
        1: '启用',
        0: '禁用'
    };

    return function(input) {
        if (!input && input !== 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}

function mustShowFilter() {
    var genderHash = {
        1: '必须',
    };

    return function(input) {
        if (!input && input !== 0) {
            return '非必须';
        } else {
            return genderHash[input];
        }
    };
}

function positionFilter() {
    var genderHash = {
        0: '描点',
        1: '数字',
        '-1': '实时'
    };
    return function(input) {
        if (!input && input !== 0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
