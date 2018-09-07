module.exports = angular.module('consumable', [])
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
    $stateProvider.state('consumable', {
            parent: 'frame',
            template: require('./consumable.html'),
            less: require('./consumable.less'),
            controller: require('./consumable.controller')
        })
        .state('consumableInStock', { //耗材入库 
            parent: 'consumable',
            url: '/consumableInStock',
            template: require('./toxicInStock/toxicInStock.html'),
            less: require('./toxicInStock/toxicInStock.less'),
            controller: require('./toxicInStock/toxicInStock.controller')
        })
        .state('dictionaryListPlus', { //耗材列表 
            parent: 'talkDictionaryPlus',
            url: '/dictionaryListPlus',
            template: require('./talkDictionary/dictionaryList/dictionaryList.html'),
            less: require('./talkDictionary/dictionaryList/dictionaryList.less'),
            controller: require('./talkDictionary/dictionaryList/dictionaryList.controller')
        })
        .state('operDictionaryPlus', { //手术取耗材
            parent: 'consumable',
            url: '/operDictionaryPlus',
            template: require('./operDictionary/operDictionary.html'),
            less: require('./operDictionary/operDictionary.less'),
            controller: require('./operDictionary/operDictionary.controller')
        })
        .state('backDictionaryPlus', { //退耗材
            parent: 'consumable',
            url: '/backDictionaryPlus',
            template: require('./backDictionary/backDictionary.html'),
            less: require('./backDictionary/backDictionary.less'),
            controller: require('./backDictionary/backDictionary.controller')
        })
        .state('badDictionaryPlus', { //耗材报损
            parent: 'consumable',
            url: '/badDictionaryPlus',
            template: require('./badDictionary/badDictionary.html'),
            less: require('./badDictionary/badDictionary.less'),
            controller: require('./badDictionary/badDictionary.controller')
        })
        .state('myPatientPlus', {
            parent: 'consumable',
            url: '/myPatientPlus',
            template: require('./myPatient/myPatient.html'),
            less: require('./myPatient/myPatient.less'),
            controller: require('./myPatient/myPatient.controller')
        })

        .state('talkDictionaryPlus', { //耗材列表上级普通取耗材
            parent: 'consumable',
            url: '/talkDictionaryplus',
            template: require('./talkDictionary/talkDictionary.html'),
            less: require('./talkDictionary/talkDictionary.less'),
            controller: require('./talkDictionary/talkDictionary.controller')
        })
        .state('talkDictionaryListPlus', { //取耗材记录
            parent: 'talkDictionaryPlus',
            url: '/talkDictionaryListPlus',
            template: require('./talkDictionary/talkDictionaryList/talkDictionaryList.html'),
            less: require('./talkDictionary/talkDictionaryList/talkDictionaryList.less'),
            controller: require('./talkDictionary/talkDictionaryList/talkDictionaryList.controller')
        })

        .state('stockStateP', { //耗材库存状态
            parent: 'consumable',
            url: '/stockStateP',
            template: require('./stockState/stockState.html'),
            less: require('./stockState/stockState.less'),
            controller: require('./stockState/stockState.controller')
        })
        .state('stockSeachPlus', { //耗材库存查询
            parent: 'stockStateP',
            url: '/stockSeachPlus',
            template: require('./stockState/stockSeach/stockSeach.html'),
            less: require('./stockState/stockSeach/stockSeach.less'),
            controller: require('./stockState/stockSeach/stockSeach.controller')
        })
        .state('stockSeachMonPlus', { //耗材月报表
            parent: 'stockStateP',
            url: '/stockSeachMonPlus',
            template: require('./stockState/stockMon/stockMon.html'),
            less: require('./stockState/stockMon/stockMon.less'),
            controller: require('./stockState/stockMon/stockMon.controller')
        })
        .state('myStockSeachPlus', { //个人物质使用情况
            parent: 'stockStateP',
            url: '/myStockSeachPlus',
            template: require('./stockState/myStock/myStock.html'),
            less: require('./stockState/myStock/myStock.less'),
            controller: require('./stockState/myStock/myStock.controller')
        })
        .state('consumablesStat', { //记账耗材总数统计
            parent: 'stockStateP',
            url: '/consumablesStat',
            template: require('./stockState/myStock/consumableStat.html'),
            less: require('./stockState/myStock/myStock.less'),
            controller: require('./stockState/myStock/consumableStat.controller')
        })

}
