module.exports = angular.module('consultation', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('consultation', {
        parent: 'frame',
        url: '/consultation',
        template: require('./consultation.html'),
        less: require('./consultation.less'),
        controller: require('./consultation.controller')
    })
    // 新增外部会诊
    .state('addConsultation', {
        parent: 'doc',
        url: '/addConsultation/:regOptId',
        template: require('./addConsultation/addConsultation.html'),
        less: require('./addConsultation/addConsultation.less'),
        controller: require('./addConsultation/addConsultation.controller')
    })
    // 编辑外部会诊
    .state('editConsultation', {
        parent: 'doc',
        url: '/editConsultation/:regOptId',
        template: require('./addConsultation/addConsultation.html'),
        less: require('./addConsultation/addConsultation.less'),
        controller: require('./addConsultation/addConsultation.controller')
    })
}