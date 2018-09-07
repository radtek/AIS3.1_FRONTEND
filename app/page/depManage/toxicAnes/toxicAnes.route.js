module.exports = angular.module('toxicAnes', [])
    .config(route)
    .filter("dateformatter", dateformatter)
    .name;
dateformatter.$inject = ['$filter'];
function dateformatter($filter) {//时间戳格式化
    return function(e) {
       return $filter('date')(e, 'yyyy-MM-dd');
    }
}
route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('toxicAnes', {
        parent: 'frame',
        template: require('./toxicAnes.html'),
        less: require('./toxicAnes.less'),
        controller: require('./toxicAnes.controller')
    })
    .state('toxicInStock', {
        parent: 'toxicAnes',
        url: '/toxicInStock',
        template: require('./toxicInStock/toxicInStock.html'),
        less: require('./toxicInStock/toxicInStock.less'),
        controller: require('./toxicInStock/toxicInStock.controller')
    })
    .state('dictionaryList', {
        parent: 'talkDictionary',
        url: '/dictionaryList',
        template: require('./talkDictionary/dictionaryList/dictionaryList.html'),
        less: require('./talkDictionary/dictionaryList/dictionaryList.less'),
        controller: require('./talkDictionary/dictionaryList/dictionaryList.controller')
    })
    .state('operDictionary', {
        parent: 'toxicAnes',
        url: '/operDictionary',
        template: require('./operDictionary/operDictionary.html'),
        less: require('./operDictionary/operDictionary.less'),
        controller: require('./operDictionary/operDictionary.controller')
    })
    .state('backDictionary', {
        parent: 'toxicAnes',
        url: '/backDictionary',
        template: require('./backDictionary/backDictionary.html'),
        less: require('./backDictionary/backDictionary.less'),
        controller: require('./backDictionary/backDictionary.controller')
    })
    .state('badDictionary', {
        parent: 'toxicAnes',
        url: '/badDictionary',
        template: require('./badDictionary/badDictionary.html'),
        less: require('./badDictionary/badDictionary.less'),
        controller: require('./badDictionary/badDictionary.controller')
    })
    .state('myPatient', {
        parent: 'toxicAnes',
        url: '/myPatient',
        template: require('./myPatient/myPatient.html'),
        less: require('./myPatient/myPatient.less'),
        controller: require('./myPatient/myPatient.controller')
    })

    .state('talkDictionary', {
        parent: 'toxicAnes',
        url: '/talkDictionary',
        template: require('./talkDictionary/talkDictionary.html'),
        less: require('./talkDictionary/talkDictionary.less'),
        controller: require('./talkDictionary/talkDictionary.controller')
    })
    .state('talkDictionaryList', {
        parent: 'talkDictionary',
        url: '/talkDictionaryList',
        template: require('./talkDictionary/talkDictionaryList/talkDictionaryList.html'),
        less: require('./talkDictionary/talkDictionaryList/talkDictionaryList.less'),
        controller: require('./talkDictionary/talkDictionaryList/talkDictionaryList.controller')
    })

    .state('stockState', {
        parent: 'toxicAnes',
        url: '/stockState',
        template: require('./stockState/stockState.html'),
        less: require('./stockState/stockState.less'),
        controller: require('./stockState/stockState.controller')
    })
    .state('stockSeach', {
        parent: 'stockState',
        url: '/stockSeach',
        template: require('./stockState/stockSeach/stockSeach.html'),
        less: require('./stockState/stockSeach/stockSeach.less'),
        controller: require('./stockState/stockSeach/stockSeach.controller')
    })
    .state('stockSeachMon', {
        parent: 'stockState',
        url: '/stockSeachMon',
        template: require('./stockState/stockMon/stockMon.html'),
        less: require('./stockState/stockMon/stockMon.less'),
        controller: require('./stockState/stockMon/stockMon.controller')
    })
    .state('myStockSeach', {
        parent: 'stockState',
        url: '/myStockSeach',
        template: require('./stockState/myStock/myStock.html'),
        less: require('./stockState/myStock/myStock.less'),
        controller: require('./stockState/myStock/myStock.controller')
    })
    .state('anestheticStat', {
        parent: 'stockState',
        url: '/anestheticStat',
        template: require('./stockState/myStock/anestheticStat.html'),
        less: require('./stockState/myStock/myStock.less'),
        controller: require('./stockState/myStock/anestheticStat.controller')
    })
}