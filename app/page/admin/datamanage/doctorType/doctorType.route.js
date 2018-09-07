module.exports = angular.module('doctorType', [])
    .filter('filterDocSubType', filterDocSubType)
    .filter('filterState', filterState)
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('doctorType', {
        parent: 'tabs',
        url: '/doctorType',
        template: require('./doctorType.html'),
        controller: require('./doctorType.controller')
    });
}

function filterDocSubType() {
    var genderHash = { 1: '用药医嘱', 2: '护理医嘱', 3: '检验检查医嘱', 4: '治疗医嘱', 5: '材料医嘱', 6: '其他医嘱' };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}

function filterState() {
	var genderHash = { 1: '启用', 0: '禁用' };

    return function(input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
}
