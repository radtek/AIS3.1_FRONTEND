module.exports = angular.module('qualControl', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('qualControl', {
        parent: 'tabs',
        template: require('./qualControl.html'),
        less: require('./qualControl.less'),
        controller: require('./qualControl.controller')
    })
    .state('docPatientRate', {
    	parent: 'qualControl',
    	url: '/docPatientRate',
    	template: require('./docPatientRate/docPatientRate.html'),
    	less: require('./docPatientRate/docPatientRate.less'),
    	controller: require('./docPatientRate/docPatientRate.controller')
    })
    .state('asaPatientRate', {
    	parent: 'qualControl',
    	url: '/asaPatientRate',
    	template: require('./asaPatientRate/asaPatientRate.html'),
    	less: require('./asaPatientRate/asaPatientRate.less'),
    	controller: require('./asaPatientRate/asaPatientRate.controller')
    })
    .state('emergencyRate', {
    	parent: 'qualControl',
    	url: '/emergencyRate',
    	template: require('./emergencyRate/emergencyRate.html'),
    	less: require('./emergencyRate/emergencyRate.less'),
    	controller: require('./emergencyRate/emergencyRate.controller')
    })
    .state('anaesthesiaMethodsRate', {
        parent: 'qualControl',
        url: '/anaesthesiaMethodsRate',
        template: require('./anaesthesiaMethodsRate/anaesthesiaMethodsRate.html'),
        less: require('./anaesthesiaMethodsRate/anaesthesiaMethodsRate.less'),
        controller: require('./anaesthesiaMethodsRate/anaesthesiaMethodsRate.controller')
    })
    .state('operCancelRate', {
        parent: 'qualControl',
        url: '/operCancelRate',
        template: require('./operCancelRate/operCancelRate.html'),
        less: require('./operCancelRate/operCancelRate.less'),
        controller: require('./operCancelRate/operCancelRate.controller')
    })
    .state('pacuDelayRate', {
        parent: 'qualControl',
        url: '/pacuDelayRate',
        template: require('./pacuDelayRate/pacuDelayRate.html'),
        less: require('./pacuDelayRate/pacuDelayRate.less'),
        controller: require('./pacuDelayRate/pacuDelayRate.controller')
    })
    .state('pacuLowTempRate', {
        parent: 'qualControl',
        url: '/pacuLowTempRate',
        template: require('./pacuLowTempRate/pacuLowTempRate.html'),
        less: require('./pacuLowTempRate/pacuLowTempRate.less'),
        controller: require('./pacuLowTempRate/pacuLowTempRate.controller')
    })
    .state('unexpectedToIcuRate', {
        parent: 'qualControl',
        url: '/unexpectedToIcuRate',
        template: require('./unexpectedToIcuRate/unexpectedToIcuRate.html'),
        less: require('./unexpectedToIcuRate/unexpectedToIcuRate.less'),
        controller: require('./unexpectedToIcuRate/unexpectedToIcuRate.controller')
    })
    .state('unexpectedSpileAgainRate', {
        parent: 'qualControl',
        url: '/unexpectedSpileAgainRate',
        template: require('./unexpectedSpileAgainRate/unexpectedSpileAgainRate.html'),
        less: require('./unexpectedSpileAgainRate/unexpectedSpileAgainRate.less'),
        controller: require('./unexpectedSpileAgainRate/unexpectedSpileAgainRate.controller')
    })
    .state('selfBloodRate', {
        parent: 'qualControl',
        url: '/selfBloodRate',
        template: require('./selfBloodRate/selfBloodRate.html'),
        less: require('./selfBloodRate/selfBloodRate.less'),
        controller: require('./selfBloodRate/selfBloodRate.controller')
    })
    .state('deathIn24HoursRate', {
        parent: 'qualControl',
        url: '/deathIn24HoursRate',
        template: require('./deathIn24HoursRate/deathIn24HoursRate.html'),
        less: require('./deathIn24HoursRate/deathIn24HoursRate.less'),
        controller: require('./deathIn24HoursRate/deathIn24HoursRate.controller')
    })
    .state('heartStoppedIn24HourRate', {
        parent: 'qualControl',
        url: '/heartStoppedIn24HourRate',
        template: require('./heartStoppedIn24HourRate/heartStoppedIn24HourRate.html'),
        less: require('./heartStoppedIn24HourRate/heartStoppedIn24HourRate.less'),
        controller: require('./heartStoppedIn24HourRate/heartStoppedIn24HourRate.controller')
    })
    .state('badlyComplicationRate', {
        parent: 'qualControl',
        url: '/badlyComplicationRate',
        template: require('./badlyComplicationRate/badlyComplicationRate.html'),
        less: require('./badlyComplicationRate/badlyComplicationRate.less'),
        controller: require('./badlyComplicationRate/badlyComplicationRate.controller')
    })
    .state('cvpComplicationRate', {
        parent: 'qualControl',
        url: '/cvpComplicationRate',
        template: require('./cvpComplicationRate/cvpComplicationRate.html'),
        less: require('./cvpComplicationRate/cvpComplicationRate.less'),
        controller: require('./cvpComplicationRate/cvpComplicationRate.controller')
    })
    .state('cseaComplicationRate', {
        parent: 'qualControl',
        url: '/cseaComplicationRate',
        template: require('./cseaComplicationRate/cseaComplicationRate.html'),
        less: require('./cseaComplicationRate/cseaComplicationRate.less'),
        controller: require('./cseaComplicationRate/cseaComplicationRate.controller')
    })
    .state('hoarsenessRate', {
        parent: 'qualControl',
        url: '/hoarsenessRate',
        template: require('./hoarsenessRate/hoarsenessRate.html'),
        less: require('./hoarsenessRate/hoarsenessRate.less'),
        controller: require('./hoarsenessRate/hoarsenessRate.controller')
    })
    .state('comaRate', {
        parent: 'qualControl',
        url: '/comaRate',
        template: require('./comaRate/comaRate.html'),
        less: require('./comaRate/comaRate.less'),
        controller: require('./comaRate/comaRate.controller')
    })
}