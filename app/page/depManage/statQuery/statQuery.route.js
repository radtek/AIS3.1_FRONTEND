module.exports = angular.module('statQuery', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('statQuery', {
        parent: 'tabs',
        template: require('./statQuery.html'),
        less: require('./statQuery.less'),
        controller: require('./statQuery.controller')
    })
    .state('statWithMonth', {
        parent: 'statQuery',
        url: '/statWithMonth',
        template: require('./statWithMonth/statWithMonth.html'),
        less: require('./statWithMonth/statWithMonth.less'),
        controller: require('./statWithMonth/statWithMonth.controller')
    })
    .state('statAnaesthesiaCases', {
        parent: 'statQuery',
        url: '/statAnaesthesiaCases',
        template: require('./statAnaesthesiaCases/statAnaesthesiaCases.html'),
        less: require('./statAnaesthesiaCases/statAnaesthesiaCases.less'),
        controller: require('./statAnaesthesiaCases/statAnaesthesiaCases.controller')
    })
    .state('statAnaesEffectDoc', {
        parent: 'statQuery',
        url: '/statAnaesEffectDoc',
        template: require('./anaesEffect/anaesEffect.html'),
        less: require('./anaesEffect/anaesEffect.less'),
        controller: require('./anaesEffect/anaesEffect.controller')
    })
    .state('statWithDept', {
        parent: 'statQuery',
        url: '/statWithDept',
        template: require('./statWithDept/statWithDept.html'),
        less: require('./statWithDept/statWithDept.less'),
        controller: require('./statWithDept/statWithDept.controller')
    })
    .state('statWithAnaesDoc', {
        parent: 'statQuery',
        url: '/statWithAnaesDoc',
        template: require('./statWithAnaesDoc/statWithAnaesDoc.html'),
        less: require('./statWithAnaesDoc/statWithAnaesDoc.less'),
        controller: require('./statWithAnaesDoc/statWithAnaesDoc.controller')
    })
    .state('statAsa', {
        parent: 'statQuery',
        url: '/statAsa',
        template: require('./statAsa/statAsa.html'),
        less: require('./statAsa/statAsa.less'),
        controller: require('./statAsa/statAsa.controller')
    })
    .state('statOperLevel', {
        parent: 'statQuery',
        url: '/statOperLevel',
        template: require('./statOperLevel/statOperLevel.html'),
        less: require('./statOperLevel/statOperLevel.less'),
        controller: require('./statOperLevel/statOperLevel.controller')
    })
    .state('statModifyHistory', {
        parent: 'statQuery',
        url: '/statModifyHistory',
        template: require('./statModifyHistory/statModifyHistory.html'),
        less: require('./statModifyHistory/statModifyHistory.less'),
        controller: require('./statModifyHistory/statModifyHistory.controller')
    })
    .state('statWorkingTime', {
        parent: 'statQuery',
        url: '/statWorkingTime',
        template: require('./statWorkingTime/statWorkingTime.html'),
        less: require('./statWorkingTime/statWorkingTime.less'),
        controller: require('./statWorkingTime/statWorkingTime.controller')
    })
    .state('statBeforeAfterDiff', {
        parent: 'statQuery',
        url: '/statBeforeAfterDiff',
        template: require('./statBeforeAfterDiff/statBeforeAfterDiff.html'),
        less: require('./statBeforeAfterDiff/statBeforeAfterDiff.less'),
        controller: require('./statBeforeAfterDiff/statBeforeAfterDiff.controller')
    })
    .state('statEasyPain', {
        parent: 'statQuery',
        url: '/statEasyPain',
        template: require('./statEasyPain/statEasyPain.html'),
        less: require('./statEasyPain/statEasyPain.less'),
        controller: require('./statEasyPain/statEasyPain.controller')
    })
    .state('statToRecoverRoom', {
        parent: 'statQuery',
        url: '/statToRecoverRoom',
        template: require('./statToRecoverRoom/statToRecoverRoom.html'),
        less: require('./statToRecoverRoom/statToRecoverRoom.less'),
        controller: require('./statToRecoverRoom/statToRecoverRoom.controller')
    })
    .state('statAccidentDeath', {
        parent: 'statQuery',
        url: '/statAccidentDeath',
        template: require('./statAccidentDeath/statAccidentDeath.html'),
        less: require('./statAccidentDeath/statAccidentDeath.less'),
        controller: require('./statAccidentDeath/statAccidentDeath.controller')
    })
    .state('statStewardScore', {
        parent: 'statQuery',
        url: '/statStewardScore',
        template: require('./statStewardScore/statStewardScore.html'),
        less: require('./statStewardScore/statStewardScore.less'),
        controller: require('./statStewardScore/statStewardScore.controller')
    })
    .state('statEasyPainTreat', {
        parent: 'statQuery',
        url: '/statEasyPainTreat',
        template: require('./statEasyPainTreat/statEasyPainTreat.html'),
        less: require('./statEasyPainTreat/statEasyPainTreat.less'),
        controller: require('./statEasyPainTreat/statEasyPainTreat.controller')
    })
    .state('statAnaesthesiaLevelCases', {
        parent: 'statQuery',
        url: '/statAnaesthesiaLevelCases',
        template: require('./statAnaesthesiaLevelCases/statAnaesthesiaLevelCases.html'),
        less: require('./statAnaesthesiaLevelCases/statAnaesthesiaLevelCases.less'),
        controller: require('./statAnaesthesiaLevelCases/statAnaesthesiaLevelCases.controller')
    })
    .state('statOperCasesWithDept', {
        parent: 'statQuery',
        url: '/statOperCasesWithDept',
        template: require('./statOperCasesWithDept/statOperCasesWithDept.html'),
        less: require('./statOperCasesWithDept/statOperCasesWithDept.less'),
        controller: require('./statOperCasesWithDept/statOperCasesWithDept.controller')
    })
    .state('statOperCasesWithOperator', {
        parent: 'statQuery',
        url: '/statOperCasesWithOperator',
        template: require('./statOperCasesWithOperator/statOperCasesWithOperator.html'),
        less: require('./statOperCasesWithOperator/statOperCasesWithOperator.less'),
        controller: require('./statOperCasesWithOperator/statOperCasesWithOperator.controller')
    })
    .state('statCasesWithNurse', {
        parent: 'statQuery',
        url: '/statCasesWithNurse',
        template: require('./statCasesWithNurse/statCasesWithNurse.html'),
        less: require('./statCasesWithNurse/statCasesWithNurse.less'),
        controller: require('./statCasesWithNurse/statCasesWithNurse.controller')
    })
    .state('statCPRCases', {
        parent: 'statQuery',
        url: '/statCPRCases',
        template: require('./statCPRCases/statCPRCases.html'),
        less: require('./statCPRCases/statCPRCases.less'),
        controller: require('./statCPRCases/statCPRCases.controller')
    })
    .state('statOperLevelWithDept', {
        parent: 'statQuery',
        url: '/statOperLevelWithDept',
        template: require('./statOperLevelWithDept/statOperLevelWithDept.html'),
        less: require('./statOperLevelWithDept/statOperLevelWithDept.less'),
        controller: require('./statOperLevelWithDept/statOperLevelWithDept.controller')
    })
}