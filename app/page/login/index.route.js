module.exports = angular.module('login', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('login', {
        url: '/',
        template: require('./login.html'),
        less: require('./login.less'),
        controller: require('./login.controller'),
        data: 'ctrlcent'
    }).state('pacu', {
        url: '/pacu',
        template: require('./login.html'),
        less: require('./login.less'),
        controller: require('./login.controller'),
        data: 'pacu'
    }).state('inScreen', {
        url: '/inScreen',
        template: require('../../big/OperateInfoByInsideScreen.html')
    }).state('outScreen', {
        url: '/outScreen',
        template: require('../../big/OperateInfoByOutsideScreen.html')
    }).state('centerScreen', {
        url: '/centerScreen',
        template: require('../../big/centralMonitoring.html')
    })
}
