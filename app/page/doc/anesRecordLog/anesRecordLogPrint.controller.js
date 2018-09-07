anesRecordLogPrint.$inject = ['$rootScope','$scope', 'IHttp', 'anesRecordInter', 'eCharts', 'anesRecordServe', 'select', 'auth', '$timeout', '$window'];

module.exports = anesRecordLogPrint;

function anesRecordLogPrint($rootScope,$scope, IHttp, anesRecordInter, eCharts, anesRecordServe, select, auth, $timeout, $window) {
    $('html').width(0).height('initial').css('min-width', '0px');
    $('body').width(0).height('initial').css('min-width', '0px');

    var vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        docId,
        inTime,
        ev_list = [],
        PAGES = [],
        eChartCol = 8,
        historyData = [],
        analgesicMedEvtName = '';
console.log(select.getRouteConfigByRouteUrl($scope.routeUrl))
    // 获取文书的标题
    vm.docInfo = auth.loginUser();
    vm.docUrl = auth.loginUser().titlePath;
    vm.regOptId = regOptId;

    vm.monOpt = {
        mmhg: ['mmHg', '220', '', '200', '', '180', '', '160', '', '140', '', '120', '', '100', '', '80', '', '60', '', '40', '', '20', '', '0'],
        c: ['', '℃', '', '38', '', '36', '', '34', '', '32', '', '30', '', '28', '', '26', '', '24', '', '22', '', '20'],
        kpa: ['', 'KPa', '28', '', '', '24', '', '', '20', '', '', '16', '', '', '12', '', '', '8', '', '', '4']
    };

    vm.view = {
        pageCur: 1, // 当前页数
        pageCount: 1, // 总页数
        pageSize: 49, // 默认一页大小 49
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false // 控制数据视图是否显示
    };

    if (vm.pageState == 2)
        vm.view.pageCur = 1;

    vm.monDataList = [];

    if (vm.docInfo.beCode === 'syzxyy' || vm.docInfo.beCode == 'cshtyy'|| vm.docInfo.beCode == 'llzyyy') {
        vm.optLevelList = ['1', '2', '3', '4'];
    } else {
        vm.optLevelList = ['一级', '二级', '三级', '四级'];
    }

    anesRecordInter.asaLevel.then(function(result) { // asa下拉选项值
        vm.asaLevel = result.data.resultList;
    });
    anesRecordInter.optBody.then(function(result) { // 手术体位下拉选项值
        vm.optBody = result.data.resultList;
    });
    anesRecordInter.anesthesiaEffect.then(function(result) { // 麻醉效果下拉选项值
        vm.anesthesiaEffectList = result.data.resultList;
    });
    anesRecordInter.leaveTo.then(function(result) { // 出室去向下拉选项值
        vm.leaveTo = result.data.resultList;
    });
    anesRecordInter.getSysCode('anaes_level').then(function(result) { // 出室去向下拉选项值
        vm.anaesLevel = result.data.resultList;
    });
    select.getAnaesMethodList().then((rs) => {
        vm.anaesMethodList = rs.data.resultList;
    })

    vm.medECfg = eCharts.config(vm.pageState, 'x', {}, { BeSmall: true });
    vm.medEOpt1 = eCharts.medOpt1(eChartCol, vm);
    vm.monECfg = eCharts.config1(vm.pageState, 'y', {});
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32 }]);

    // 事件标记
    vm.markECfg = eCharts.config(1);
    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete

    anesRecordInter.startOper(regOptId, '').then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        vm.medECfg.dataLoaded = false;
        vm.monECfg.dataLoaded = false;
        vm.markECfg.dataLoaded = false;
        docId = rs.data.anaesRecord.anaRecordId;
        vm.startOper = anesRecordServe.initData(rs.data);

        if (!vm.startOper.regOpt.height) {
            vm.startOper.regOpt.height = '/';
        }
        if (!vm.startOper.regOpt.weight) {
            vm.startOper.regOpt.weight = '/';
        }

        var optBodyArr = [];
        for (var a of vm.startOper.anaesRecord.optBodys) {
            for (var b of vm.optBody) {
                if (b.codeValue == a)
                    optBodyArr.push(b.codeName)
            }
        }
        vm.startOper.anaesRecord.optBodyStr = optBodyArr.join('、');

        vm.startOper.regOpt.designedAnaesMethodName = anesRecordServe.ArrToStr(vm.startOper.realAnaesList);

        vm.startOper.optLatterDiagStr = anesRecordServe.ArrToStr(vm.startOper.optLatterDiagList)

        vm.startOper.optRealOperStr = anesRecordServe.ArrToStr(vm.startOper.optRealOperList)

        vm.startOper.anesDocStr = anesRecordServe.ArrToStr(vm.startOper.anesDocList)

        vm.startOper.operatDocStr = anesRecordServe.ArrToStr(vm.startOper.operatDocList)

        vm.startOper.instruNurseStr = anesRecordServe.ArrToStr(vm.startOper.instruNurseList)

        vm.startOper.nurseStr = anesRecordServe.ArrToStr(vm.startOper.nurseList)

        $timeout(function() {
            vm.hasSig = false;
            vm.eSignatureAnaestheitist = [];
            angular.forEach(vm.anesthetistList, function(item) {
                for (var sign of vm.startOper.anesDocList) {
                    if (item.userName == sign.id) {
                        if (!vm.hasSig)
                            vm.hasSig = item.picPath ? true : false;
                        vm.eSignatureAnaestheitist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                    }
                }
            })
        }, 1000);

        eCharts.option('zl', vm.startOper.treatMedEvtList, ev_list, vm);
        eCharts.option('sy', vm.startOper.inIoeventList, ev_list, vm);
        eCharts.option('cl', vm.startOper.outIoeventList, ev_list, vm);
        anesRecordServe.getobsDataPrint(vm, regOptId, docId, ev_list, 2);
    });

    vm.pageFinish = function() {
        $timeout(function() {
            $window.print();
            $window.close();
        }, 1000);
    }

    vm.eq = function(a, b) {
        return angular.equals(a, b);
    }
}