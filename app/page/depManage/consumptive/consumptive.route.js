module.exports = angular.module('consumptive', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('consumptive', {
        parent: 'tabs',
        template: require('./consumptive.html'),
        less: require('./consumptive.less'),
        controller: require('./consumptive.controller')
    })
    .state('outStock', {
        parent: 'consumptive',
        url: '/outStock',
        template: require('./outStock/outStock.html'),
        less: require('./outStock/outStock.less'),
        controller: require('./outStock/outStock.controller')
    })
    .state('inStock', {
        parent: 'consumptive',
        url: '/inStock',
        template: require('./inStock/inStock.html'),
        less: require('./inStock/inStock.less'),
        controller: require('./inStock/inStock.controller')
    })
    .state('stock', {
        parent: 'consumptive',
        url: '/stock',
        template: require('./stock/stock.html'),
        less: require('./stock/stock.less'),
        controller: require('./stock/stock.controller')
    })
}