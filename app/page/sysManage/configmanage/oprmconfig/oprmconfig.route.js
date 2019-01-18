module.exports = angular.module('oprmconfig', [])
    .config(route)
    .filter('enabledSelect', enabledSelect)
    .filter('bedStatusList', bedStatusList)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('oprmconfig', {
        parent: 'tabs',
        url: '/oprmconfig',
        template: require('./oprmconfig.html'),
        less: require('./oprmconfig.less'),
        controller: require('./oprmconfig.controller')
    }).state('baseconfig', {
        parent: 'tabs',
        url: '/baseconfig',
        template: require('../baseconfig/baseconfig.html'),
        less: require('../baseconfig/baseconfig.less'),
        controller: require('../baseconfig/baseconfig.controller')
    }).state('pacubedconfig', {
        parent: 'tabs',
        url: '/pacubedconfig',
        template: require('../pacubedconfig/pacubedconfig.html'),
        less: require('../pacubedconfig/pacubedconfig.less'),
        controller: require('../pacubedconfig/pacubedconfig.controller')
    }).state('timingtask', {
    	parent: 'tabs',
        url: '/timingtask',
        template: require('../timingtask/timingtask.html'),
        less: require('../timingtask/timingtask.less'),
        controller: require('../timingtask/timingtask.controller')
    }).state('enumeratemanage', {
    	parent: 'tabs',
        url: '/enumeratemanage',
        template: require('../enumeratemanage/enumeratemanage.html'),
        less: require('../enumeratemanage/enumeratemanage.less'),
        controller: require('../enumeratemanage/enumeratemanage.controller')
    }).state('userDefinedDoc', {
        parent: 'tabs',
        url: '/userDefinedDoc',
        template: require('../userDefinedDoc/userDefinedDoc.html'),
        less: require('../userDefinedDoc/userDefinedDoc.less'),
        controller: require('../userDefinedDoc/userDefinedDoc.controller')
    }).state('selectlistconfig', {
        parent: 'tabs',
        url: '/selectlistconfig',
        template: require('../selectlistconfig/selectlistconfig.html'),
        less: require('../selectlistconfig/selectlistconfig.less'),
        controller: require('../selectlistconfig/selectlistconfig.controller')
    }).state('editDoc', {
        parent: 'tabs',
        url: '/editDoc/:docThemeId',
        template: require('../userDefinedDoc/editDoc.html'),
        less: require('../userDefinedDoc/editDoc.less'),
        controller: require('../userDefinedDoc/editDoc.controller')
    }).state('userDefinedNecessary', {
        parent: 'tabs',
        url: '/userDefinedNecessary',
        template: require('../userDefinedNecessary/userDefinedNecessary.html'),
        less: require('../userDefinedNecessary/userDefinedNecessary.less'),
        controller: require('../userDefinedNecessary/userDefinedNecessary.controller'),
        controllerAs:"vm"
    }).state('routingAccess', {
        parent: 'tabs',
        url: '/routingAccess',
        template: require('../routingAccess/routingAccess.html'),
        less: require('../routingAccess/routingAccess.less'),
        controller: require('../routingAccess/routingAccess.controller'),
        controllerAs:"vm"
    }).state('devicesmonitorconfig', {
        parent: 'tabs',
        url: '/devicesmonitorconfig',
        template: require('../devicesmonitorconfig/devicesmonitorconfig.html'),
        less: require('../devicesmonitorconfig/devicesmonitorconfig.less'),
        controller: require('../devicesmonitorconfig/devicesmonitorconfig.controller')
    }).state('devicesstandardconfig', {
        parent: 'tabs',
        url: '/devicesstandardconfig',
        template: require('../devicesstandardconfig/devicesstandardconfig.html'),
        less: require('../devicesstandardconfig/devicesstandardconfig.less'),
        controller: require('../devicesstandardconfig/devicesstandardconfig.controller')
    }).state('monitorconfig', {
        parent: 'tabs',
        url: '/monitorconfig',
        template: require('../monitorconfig/monitorconfig.html'),
        less: require('../monitorconfig/monitorconfig.less'),
        controller: require('../monitorconfig/monitorconfig.controller')
    });
}
function enabledSelect() {
    var genderHash = {
        1: '启用',
        0: '禁用'
    };

    return function(input) {
        if (!input&&input!==0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
function bedStatusList() {
    var genderHash = {
        1: '已分配',
        0: '空床',
        '-1':'不可用'
    };

    return function(input) {
        if (!input&&input!==0) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
