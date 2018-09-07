module.exports = angular.module('customize', [])
    .config(route)   
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./customize.html'),
    less: require('./customize.less'),
    controller: require('./customize.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {  //自定义文书
    $stateProvider.state('customize', angular.merge({}, opt, {        
        url: '/customize/:regOptId',        
    }))

    for (var i = 0; i < 100; i++) {
        $stateProvider.state('customize_'+i, angular.merge({}, opt, {
            url: '/customize_'+i+'/:regOptId'
        }))
    }

}