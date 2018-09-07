module.exports = angular.module('operStat', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('operStat', {
        parent: 'tabs',
        template: require('./operStat.html'),
        less: require('./operStat.less'),
        controller: require('./operStat.controller')
    })
    .state('statOutpatient', {
        parent: 'operStat',
        url: '/statOutpatient',
        template: require('./operStatView.html'),
        controller: require('./statOutpatient/statOutpatient.controller')
    })
    .state('statHospitalPatient', {
        parent: 'operStat',
        url: '/statHospitalPatient',
        template: require('./operStatView.html'),
        controller: require('./statHospitalPatient/statHospitalPatient.controller')
    })
    .state('statDeptPatient', {
        parent: 'operStat',
        url: '/statDeptPatient',
        template: require('./operStatView.html'),
        controller: require('./statDeptPatient/statDeptPatient.controller')
    })
    .state('statDisease', {
        parent: 'operStat',
        url: '/statDisease',
        template: require('./operStatView.html'),
        controller: require('./statDisease/statDisease.controller')
    })
    .state('statAnaesReg', {
        parent: 'operStat',
        url: '/statAnaesReg',
        template: require('./operStatView.html'),
        controller: require('./statAnaesReg/statAnaesReg.controller')
    })
    .state('statByDept', {
        parent: 'operStat',
        url: '/statByDept',
        template: require('./operStatView.html'),
        controller: require('./statByDept/statByDept.controller')
    })
    .state('statOperatorPatient', {
        parent: 'operStat',
        url: '/statOperatorPatient',
        template: require('./operStatView.html'),
        controller: require('./statOperatorPatient/statOperatorPatient.controller')
    })
    .state('statComplication', {
        parent: 'operStat',
        url: '/statComplication',
        template: require('./operStatView.html'),
        controller: require('./statComplication/statComplication.controller')
    })
    .state('statLungInfection', {
        parent: 'operStat',
        url: '/statLungInfection',
        template: require('./operStatView.html'),
        controller: require('./statLungInfection/statLungInfection.controller')
    })
    .state('statImportanCases', {
        parent: 'operStat',
        url: '/statImportanCases',
        template: require('./operStatView.html'),
        controller: require('./statImportanCases/statImportanCases.controller')
    })
    .state('statUlcers', {
        parent: 'operStat',
        url: '/statUlcers',
        template: require('./operStatView.html'),
        controller: require('./statUlcers/statUlcers.controller')
    })
    .state('statSpecial', {
        parent: 'operStat',
        url: '/statSpecial',
        template: require('./operStatView.html'),
        controller: require('./statSpecial/statSpecial.controller')
    })
    .state('statPostComplication', {
        parent: 'operStat',
        url: '/statPostComplication',
        template: require('./operStatView.html'),
        controller: require('./statPostComplication/statPostComplication.controller')
    })
    .state('statPostInfection', {
        parent: 'operStat',
        url: '/statPostInfection',
        template: require('./operStatView.html'),
        controller: require('./statPostInfection/statPostInfection.controller')
    })
    .state('statAntibacterial', {
        parent: 'operStat',
        url: '/statAntibacterial',
        template: require('./operStatView.html'),
        controller: require('./statAntibacterial/statAntibacterial.controller')
    })
    .state('statByIClassIncision', {
        parent: 'operStat',
        url: '/statByIClassIncision',
        template: require('./operStatView.html'),
        controller: require('./statByIClassIncision/statByIClassIncision.controller')
    })
}