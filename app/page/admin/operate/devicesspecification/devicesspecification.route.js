module.exports = angular.module('devicesspecification', [])
    .filter("interfaceTypeList", interfaceTypeList)
    .filter("deviceTypeList",deviceTypeList)
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('devicesspecification', {
        parent: 'tabs',
        url: '/devicesspecification',
        template: require('./devicesspecification.html'),
        less: require('./devicesspecification.less'),
        controller: require('./devicesspecification.controller'),
        controllerAs: 'vm'
    });
}

function interfaceTypeList() {
    var genderHash = [{
        value: 1,
        label: 'TCP'
    }, {
        value: 2,
        label: '串口'
    }, {
        value: 3,
        label: 'UDP'
    },{
        value: 4,
        label: '组播'
    },{
        value: 5,
        label: 'TCP Server'
    }, ];

    return function(input) {
        if (!input) {
            return '';
        } else {
            if(genderHash[input-1]){
                return genderHash[input-1].label;
            }else{
                return "找不到";
            }
            
        }
    };
}
function deviceTypeList() {
    var genderHash =  [{
                value: "1",
                label: '手术室终端'
            }, {
                value: "2",
                label: '复苏室终端'
            }, {
                value: "3",
                label: '心电监护仪'
            }, {
                value: "4",
                label: '呼吸机'
            }, {
                value: "5",
                label: '麻醉机'
            }, ];

    return function(input) {
        if (!input) {
            return '';
        } else {
            if(genderHash[input-1]){
                return genderHash[input-1].label;
            }else{
                return "找不到";
            }
        }
    };
}