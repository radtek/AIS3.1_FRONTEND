module.exports = angular.module('easePainAgree', [])
    .config(route)    
    .directive('easePainAgree', easePainAgree)
    .directive('easePainAgreeQnz', easePainAgreeQnz)
    .name;

route.$inject = ['$stateProvider'];

var opt= {
    parent: 'doc',    
    template: require('./easePainAgree.html'),
    controller: require('./easePainAgree.controller'),
    less: require('./easePainAgree.less'),
    controllerAs: 'vm'
}

var opt_qnz= {
    parent: 'doc',    
    template: require('./easePainAgree_qnz.html'),
    controller: require('./easePainAgree_qnz.controller'),
    less: require('./easePainAgree.less'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preEasePainAgree', angular.merge({}, opt, {  // 永兴人民 》术前
        url: '/preEasePainAgree/:regOptId'
    })).state('postEasePainAgree', angular.merge({}, opt, {  // 永兴人民 》术后
        url: '/postEasePainAgree/:regOptId'
    })).state('midEasePainAgree', angular.merge({}, opt, {  // 永兴人民 》术后
        url: '/midEasePainAgree/:regOptId'
    })).state('postEasePainAgree_qnz', angular.merge({}, opt_qnz, {  // 黔南州中医院 》术后
        url: '/postEasePainAgree_qnz/:regOptId'
    }))
}


function easePainAgree() {
    return {
        template: require('./easePainAgree.html'),
        controller: require('./easePainAgree.controller'),
        less: require('./easePainAgree.less'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function easePainAgreeQnz() {
    return {
        template: require('./easePainAgree_qnz.html'),
        controller: require('./easePainAgree_qnz.controller'),
        less: require('./easePainAgree.less'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}