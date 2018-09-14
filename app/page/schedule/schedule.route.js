module.exports = angular.module('schedule', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('schedule', {
        parent: 'tabs',
        template: require('./schedule.html'),
        less: require('./schedule.less'),
        controller: require('./schedule.controller')
    }).state('operRoomSchedule', {
        parent: 'schedule',
        url: '/operRoomSchedule',
        template: require('./scheduleView.html'),
        controller: require('./operRoomSchedule/operRoomSchedule.controller.js')
    })
    .state('nursingSchedule', {
        parent: 'schedule',
        url: '/nursingSchedule',
        template: require('./scheduleView.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedule_sybx.controller.js'),
        data: { pageName: '护理安排' }
    })
    .state('anaesthesiaSchedule', {//麻醉安排
        parent: 'schedule',
        url: '/anaesthesiaSchedule',
        template: require('./scheduleView.html'),
        controller: require('./anaesthesiaSchedule/anaesthesiaSchedule.controller.js'),
        data: { pageName: '麻醉安排' }
    }).state('schedulePrint', {
        parent: 'schedule',
        url: '/schedulePrint',
        // template: require('./schedulePrint/schedulePrint.html'),
        template: require('./scheduleView.html'),
        controller: require('./schedulePrint/schedulePrint.controller.js')
    }).state('schedulePrint_syzxyy', {
        parent: 'schedule',
        url: '/schedulePrint_syzxyy',
        template: require('./scheduleView_syzxyy.html'),
        controller: require('./schedulePrint/schedulePrint.controller.js')
    }).state('schedulePrint_qnz', {
        parent: 'schedule',
        url: '/schedulePrint_qnz',
        template: require('./schedulePrint/schedulePrint_qnz.html'),
        controller: require('./schedulePrint/schedulePrint.controller.js')
    }).state('nursingSchedule_qnz', {
        parent: 'schedule',
        url: '/nursingSchedule_qnz',
        template: require('./nursingSchedule/nursingSchedule_qnzzyyy.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedule_qnzzyyy.controller.js')
    }).state('cardSchedule', {
        parent: 'schedule',
        url: '/cardSchedule',
        template: require('./cardSchedule/cardSchedule.html'),
        less: require('./schedule.less'),
        controller: require('./cardSchedule/cardSchedule.controller.js')
    }).state('nursingSchedule_yxrm', {
        parent: 'schedule',
        url: '/nursingSchedule_yxrm',
        template: require('./nursingSchedule/nursingSchedule_nhfe.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedule_nhfe.controller.js')
    }).state('operRoomSchedule_yxrm', {
        parent: 'schedule',
        url: '/operRoomSchedule_yxrm',        
        template: require('./scheduleView.html'),
        controller: require('./operRoomSchedule/operRoomSchedule_yxrm.controller.js')
    }).state('schedulePrint_yxrm', {
        parent: 'schedule',
        url: '/schedulePrint_yxrm',
        template: require('./scheduleView_yxrm.html'),        
        controller: require('./schedulePrint/schedulePrint.controller.js')
    }).state('operRoomSchedules', {
        parent: 'tabs',
        url: '/operRoomSchedules',
        template: require('./operRoomSchedule/operRoomSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./operRoomSchedule/operRoomSchedules.controller.js')
    }).state('nursingSchedules', {
        parent: 'tabs',
        url: '/nursingSchedules',
        template: require('./nursingSchedule/nursingSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedules.controller.js')
    }).state('anaesthesiaSchedules', {
        parent: 'tabs',
        url: '/anaesthesiaSchedules',
        template: require('./anaesthesiaSchedule/anaesthesiaSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./anaesthesiaSchedule/anaesthesiaSchedules.controller.js')
    }).state('schedulePrints', {
        parent: 'tabs',
        url: '/schedulePrints',
        template: require('./schedulePrint/schedulePrints.html'),
        less: require('./schedule.less'),
        controller: require('./schedulePrint/schedulePrints.controller.js')
    })
}