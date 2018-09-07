module.exports = angular.module('scieRese', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider
    .state('contrast', {
        parent: 'tabs',
        url: '/contrast/:id',
        template: require('./modal/contrast.html'),
        controller: require('./modal/contrast.controller')
    })
    .state('diysearch', {
        parent: 'tabs',
        url: '/diysearch',
        less:require('./diysearch/diysearch.less'),
        template: require('./diysearch/diysearch.html'),
        controller: require('./diysearch/diysearch.controller'),
        controllerAs:"vm"
    })
    .state('patientdatacompare', {
        parent: 'tabs',
        url: '/patientdatacompare',
        less:require('./patientdatacompare/patientdatacompare.less'),
        template: require('./patientdatacompare/patientdatacompare.html'),
        controller: require('./patientdatacompare/patientdatacompare.controller')
    })
    .state('scieRese', {
        parent: 'frame',
        url: '/scieRese',
        template: require('./scieRese.html'),
        less: require('./scieRese.less'),
        controller: require('./scieRese.controller')
    })

}