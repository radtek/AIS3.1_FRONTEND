module.exports = angular.module('dictionary', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {

    $stateProvider.state('dictionary', {
        parent: 'tabs',
        url: '/deptDictionary',
        template: require('./deptDictionary/deptDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./deptDictionary/deptDictionary.controller')
    });

    $stateProvider.state('anaesMethodDictionary', {
        parent: 'tabs',
        url: '/anaesMethodDictionary',
        template: require('./anaesMethodDictionary/anaesMethodDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./anaesMethodDictionary/anaesMethodDictionary.controller')
    });

    $stateProvider.state('announcementDictionary', {
        parent: 'tabs',
        url: '/announcementDictionary',
        template: require('./announcementDictionary/announcementDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./announcementDictionary/announcementDictionary.controller')
    });

    $stateProvider.state('bdrugsDictionary', {
        parent: 'tabs',
        url: '/bdrugsDictionary',
        template: require('./bdrugsDictionary/bdrugsDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./bdrugsDictionary/bdrugsDictionary.controller')
    });

    $stateProvider.state('chargeitemDictionary', {
        parent: 'tabs',
        url: '/chargeitemDictionary',
        template: require('./chargeitemDictionary/chargeitemDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./chargeitemDictionary/chargeitemDictionary.controller')
    });

    $stateProvider.state('deptDictionary', {
        parent: 'tabs',
        url: '/deptDictionary',
        template: require('./deptDictionary/deptDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./deptDictionary/deptDictionary.controller')
    });

    $stateProvider.state('diagnosisDictionary', {
        parent: 'tabs',
        url: '/diagnosisDictionary',
        template: require('./diagnosisDictionary/diagnosisDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./diagnosisDictionary/diagnosisDictionary.controller')
    });

    $stateProvider.state('drugstorageDictionary', {
        parent: 'tabs',
        url: '/drugstorageDictionary',
        template: require('./drugstorageDictionary/drugstorageDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./drugstorageDictionary/drugstorageDictionary.controller')
    });

    $stateProvider.state('inoutVolume', {
        parent: 'tabs',
        url: '/inoutVolume',
        template: require('./inoutVolume/inoutVolume.html'),
        less: require('./dictionary.less'),
        controller: require('./inoutVolume/inoutVolume.controller')
    });

    $stateProvider.state('instrsuitlistDictionary', {
        parent: 'tabs',
        url: '/instrsuitlistDictionary',
        template: require('./instrsuitlistDictionary/instrsuitlistDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./instrsuitlistDictionary/instrsuitlistDictionary.controller')
    });

    $stateProvider.state('instrsuitlistDictionaryNhfe', {
        parent: 'tabs',
        url: '/instrsuitlistDictionaryNhfe',
        template: require('./instrsuitlistDictionary/nhfe/instrsuitlistDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./instrsuitlistDictionary/nhfe/instrsuitlistDictionary.controller')
    });

    $stateProvider.state('feePackDictionary', {
        parent: 'tabs',
        url: '/feePackDictionary',
        template: require('./feePackDictionary/feePackDictionary.html'),
        less: require('./feePackDictionary/feePackDictionary.less'),
        controller: require('./feePackDictionary/feePackDictionary.controller'),
        controllerAs: 'vm'
    });
    // $stateProvider.state('instrsuitlistDialog', {
    //     parent: 'instrsuitlistDictionary',
    //     url: '/instrsuitlistDialog/:param',
    //     template: require('./instrsuitlistDictionary/instrsuitlistDialog.html'),
    //     less: require('./dictionary.less'),
    //     controller: require('./instrsuitlistDictionary/instrsuitlistDialog.controller')
    // });

    $stateProvider.state('instrumentDictionary', {
        parent: 'tabs',
        url: '/instrumentDictionary',
        template: require('./instrumentDictionary/instrumentDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./instrumentDictionary/instrumentDictionary.controller')
    });

    $stateProvider.state('medreasonsDictionary', {
        parent: 'tabs',
        url: '/medreasonsDictionary',
        template: require('./medreasonsDictionary/medreasonsDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./medreasonsDictionary/medreasonsDictionary.controller')
    });

    $stateProvider.state('medwayDictionary', {
        parent: 'tabs',
        url: '/medwayDictionary',
        template: require('./medwayDictionary/medwayDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./medwayDictionary/medwayDictionary.controller')
    });

    $stateProvider.state('operationPeopleDictionary', {
        parent: 'tabs',
        url: '/operationPeopleDictionary',
        template: require('./operationPeopleDictionary/operationPeopleDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./operationPeopleDictionary/operationPeopleDictionary.controller')
    });

    $stateProvider.state('predefDictionary', {
        parent: 'tabs',
        url: '/predefDictionary',
        template: require('./predefDictionary/predefDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./predefDictionary/predefDictionary.controller')
    });

    $stateProvider.state('promaterDictionary', {
        parent: 'tabs',
        url: '/promaterDictionary',
        template: require('./promaterDictionary/promaterDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./promaterDictionary/promaterDictionary.controller')
    });

    $stateProvider.state('regionDictionary', {
        parent: 'tabs',
        url: '/regionDictionary',
        template: require('./regionDictionary/regionDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./regionDictionary/regionDictionary.controller')
    });

    $stateProvider.state('selfPayDictionary', {
        parent: 'tabs',
        url: '/selfPayDictionary',
        template: require('./selfPayDictionary/selfPayDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./selfPayDictionary/selfPayDictionary.controller')
    });

    $stateProvider.state('anesEventDictionary', {
        parent: 'tabs',
        url: '/anesEventDictionary',
        template: require('./anesEventDictionary/anesEventDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./anesEventDictionary/anesEventDictionary.controller')
    });

    $stateProvider.state('editChargeitemDictionary', {
        parent: 'tabs',
        url: '/editChargeitemDictionary',
        templateUrl: require('./chargeitemDictionary/editChargeitemDictionary.html'),
        less: require('./dictionary.less'),
        controller: require('./chargeitemDictionary/editChargeitemDictionary.controller'),
    });
}