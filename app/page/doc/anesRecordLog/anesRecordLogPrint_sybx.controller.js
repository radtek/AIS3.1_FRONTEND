anesRecordLogPrint.$inject = ['$rootScope', '$scope', 'IHttp', 'anesRecordServe_sybx','anesRecordInter', 'eCharts', 'anesRecordServe', 'auth', '$filter', '$timeout', 'toastr', '$window'];

module.exports = anesRecordLogPrint;

function anesRecordLogPrint($rootScope, $scope, IHttp, anesRecordServe_sybx,anesRecordInter, eCharts, anesRecordServe, auth, $filter, $timeout, toastr, $window) {
    $('html').width(0).height('initial').css('min-width', '0px');
    $('body').width(0).height('initial').css('min-width', '0px');
    // 获取文书的标题
    $scope.docInfo = auth.loginUser();

    var docId, inTime,
        vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        pageSize = 49,
        ev_list = [],
        PAGES = [],
        eChartRow1 = 20, // eChart1 的 行数
        eChartRow2 = 31, // eChart2 的 行数
        eChartCol = 8,
        summary; // 麻醉总结
    vm.view = { // 同步界面的数据
        pageCur: 1, // 当前页数
        pageCount: 1, // 总页数
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false, // 控制数据视图是否显示
        pageSize: 49 // 默认一页大小 49
    };
    $scope.regOptId = regOptId;
    $scope.asaLevelName = '';
    vm.tempTime = [];

    anesRecordServe_sybx.asaLevel.then(function(result) { // asa下拉选项值
        $scope.asaLevel = result.data.resultList;
    });
    anesRecordServe_sybx.optBody.then(function(result) { // 手术体位下拉选项值
        $scope.optBody = result.data.resultList;
    });
    anesRecordServe_sybx.leaveTo.then(function(result) { // 出室去向下拉选项值
        $scope.leaveTo = result.data.resultList;
    });

    $scope.eConfig1 = anesRecordServe_sybx.eChart1.config();
    $scope.eOption1 = anesRecordServe_sybx.eChart1.option(eChartRow1, eChartCol);
    $scope.eConfig2 = anesRecordServe_sybx.eChart2.config();
    $scope.eOption2 = anesRecordServe_sybx.eChart2.option(0, [{ min: -10, max: 300, interval: 10 },{ min: 11, max: 42, interval: 1 }], {
        top: -1,
        left: -1,
        right: 0,
        bottom: 0,
        containLabel: false
    });

    $scope.eOption1.grid = {
        top: -20,
        left: -23,
        right: 0,
        bottom: -20,
        containLabel: true
    }
    // filter 精确匹配
    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }

    anesRecordServe_sybx.startOper(regOptId).then(function(rs) {
        if (rs.data.resultCode != '1') return;
        $scope.eConfig1.dataLoaded = false;
        $scope.eConfig2.dataLoaded = false;
        docId = rs.data.anaesRecord.anaRecordId;
        $scope.startOper = anesRecordServe_sybx.initData(rs.data);
        vm.startOper =angular.copy(anesRecordServe.initData(rs.data));
        if ($scope.startOper.anaesRecord.asaLevel == '1') {
            $scope.asaLevelName = 'Ⅰ';
        } else if ($scope.startOper.anaesRecord.asaLevel == '2') {
            $scope.asaLevelName = 'Ⅱ';
        } else if ($scope.startOper.anaesRecord.asaLevel == '3') {
            $scope.asaLevelName = 'Ⅲ';
        } else if ($scope.startOper.anaesRecord.asaLevel == '4') {
            $scope.asaLevelName = 'Ⅳ';
        } else if ($scope.startOper.anaesRecord.asaLevel == '5') {
            $scope.asaLevelName = 'Ⅴ';
        }
        if ($scope.startOper.anaesMedEvtList && $scope.startOper.anaesMedEvtList.length > 0) {
            $scope.startOper.anaesRecord.anaesBeforeMed = 1;
        }else {
            $scope.startOper.anaesRecord.anaesBeforeMed = 0;
        }
        setOption('mz', $scope.startOper.treatMedEvtList);
        setOption('sy', $scope.startOper.transfusioninIoeventList);
        setOption('sx', $scope.startOper.bloodinIoeventList);
        setOption('cl', $scope.startOper.outIoeventList);
        getobsData();
        mergeData();
    });

    function getobsData() {
        // anesRecordServe.getobsData(vm, regOptId, docId, ev_list);
        inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
            return item.code == 1;
        })[0].occurTime;
        anesRecordServe_sybx.getObsData(regOptId, vm.view.pageCur, pageSize, inTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            anesRecordServe.createOrUpdateTimeArr49(vm, result); ///////////更新时间轴
            vm.view.pageCount = result.data.total <= pageSize ? 1 : Math.ceil((result.data.total - 1) / (pageSize - 1));
            $scope.eOption2.xAxis[0].data = getXAxis(result.data);
            $scope.eOption2.series = getSeries(result.data);
            initEvConfig();
            initSign();
            getPupilData();
        });
    }

    function getXAxis(rs) {
        var res = [],
            xLen = rs.xAxis[0].data.length,
            temp;
        vm.tempTime = [];
        $scope.xTits = [];
        for (var a = 0; a < xLen; a++) {
            temp = rs.xAxis[0].data[a];
            // if ((rs.changeFreqTime != '' && temp.value <= rs.changeFreqTime) || rs.changeFreqTime == '') {
            //     temp.value = temp.value - rs.offset * 1000;
            //     temp.offset = true;
            // }
            vm.tempTime.push(temp);
            res.push($filter('date')(temp.value, 'yyyy-MM-dd HH:mm:ss'));
            if (rs.xAxis[0].data[a + 1]) {
                var timeEach = parseInt((rs.xAxis[0].data[a + 1].value - (rs.changeFreqTime != '' && temp.value >= rs.changeFreqTime ? 0 : rs.offset * 1000) - temp.value) / 10);
                for (var h = 0; h < 9; h++) {
                    res.push($filter('date')(temp.value + timeEach * (h + 1), 'yyyy-MM-dd HH:mm:ss'));
                }
            }
            if (a % 6 == 0)
                $scope.xTits.push($filter('date')(temp.value, 'HH:mm'));
        }
        var tempValue = (vm.tempTime[xLen - 1].offset ? (vm.tempTime[xLen - 1].value + rs.offset * 1000) : vm.tempTime[xLen - 1].value) + vm.tempTime[xLen - 1].freq * 1000;
        // if (rs.changeFreqTime == '') tempValue = tempValue - rs.offset * 1000;//补空点不再需要偏移
        var first = true;
        while (xLen < pageSize) {
            var timeEach = first ? parseInt((tempValue - vm.tempTime[xLen - 1].value) / 10) : rs.freq * 100;
            vm.tempTime.push({ freq: rs.freq, value: tempValue });
            for (var h = 0; h < 9; h++) {
                res.push($filter('date')(vm.tempTime[vm.tempTime.length - 2].value + timeEach * (h + 1), 'yyyy-MM-dd HH:mm:ss'));
            }
            res.push($filter('date')(tempValue, 'yyyy-MM-dd HH:mm:ss'));
            if (xLen % 6 == 0)
                $scope.xTits.push($filter('date')(tempValue, 'HH:mm'));
            tempValue = tempValue + rs.freq * 1000;
            xLen++;
            first = false;
        }
        if (vm.view.pageCur == 1 || (vm.view.pageCount == 1 && vm.view.pageCur == 0)) { //第一页第一个点特殊处理
            var old = angular.copy(vm.timeArr49[vm.view.pageCur][0]);
            var x = vm.startOper.anaeseventList[0].occurTime / 1000;
            vm.timeArr49[vm.view.pageCur][0] = [x, '', old[0] - x + old[2], { formatTime: $filter('date')(x * 1000, 'HH:mm') }];
            $scope.xTits.shift();
            $scope.xTits.unshift($filter('date')(x * 1000, 'HH:mm'));
        }
        return res;
    }

    function getSeries(rs) {
        var res = [],
            len = rs.series.length,
            xLen = rs.xAxis[0].data.length;
        for (var a = 0; a < len; a++) {
            var t_data = rs.series[a].data;
            for (var i = 0; i < t_data.length; i++) {
                rs.series[a].data[i].units = rs.series[a].units;
                if (t_data[i].symbol == '') {
                    if (t_data[i].amendFlag == 2) {
                        var temp = rs.series[a].symbol.split('.');
                        rs.series[a].data[i].symbol = 'image://' + temp[0] + '-2.' + temp[1];
                        rs.series[a].data[i].itemStyle = {
                            normal: {
                                color: '#FF0000'
                            }
                        }
                    } else {
                        delete rs.series[a].data[i].symbol;
                    }
                } else {
                    if (t_data[i].amendFlag == 2) {
                        var temp = rs.series[a].data[i].symbol.split('.');
                        rs.series[a].data[i].symbol = temp[0] + '-2.' + temp[1];
                        rs.series[a].data[i].itemStyle = {
                            normal: {
                                color: '#FF0000'
                            }
                        }
                    }
                }
            }
            var seriesData = new Array();
            var j_index = 0;
            for (var i = 0, xTime; xTime = new Date($scope.eOption2.xAxis[0].data[i++]).getTime();) {
                seriesData[i - 1] = '';
                var isOk = false;
                for (var j = j_index, data; data = rs.series[a].data[j++];) {
                    if (isOk) break;
                    if (data.time >= xTime && data.time < new Date($scope.eOption2.xAxis[0].data[i]).getTime()) {
                        var temp_i = i - 1;
                        while (true) {
                            if (!seriesData[temp_i]) {
                                seriesData[temp_i] = data;
                                isOk = true;
                                j_index = j;
                                break;
                            } else {
                                temp_i++;
                            }
                        }
                    }
                    if (data.time == new Date($scope.eOption2.xAxis[0].data[i - 1]).getTime() && i == $scope.eOption2.xAxis[0].data.length) {
                        seriesData[i - 1] = data;
                    }
                }
            }
            res.push({
                type: rs.series[a].type,
                name: rs.series[a].name,
                units: rs.series[a].units,
                symbol: 'image://' + rs.series[a].symbol,
                symbolSize: rs.series[a].name == 'PR' ? rs.series[a].symbolSize - 5 : rs.series[a].symbolSize - 2,
                yAxisIndex: rs.series[a].yAxisIndex,
                itemStyle: { normal: { color: rs.series[a].color } },
                lineStyle: { normal: { width: 1 } },
                data: seriesData,
                smooth: true,
                max: rs.series[a].max,
                min: rs.series[a].min,
                connectNulls: true
            });
        }
        res.push({
            type: 'line',
            name: '',
            silent: true,
            lineStyle: { normal: { width: 1, color: '#fff' } },
            data: (function() {
                var temp = [],
                    i = $scope.eOption2.xAxis[0].data.length;
                while (i > 0) {
                    temp.push('');
                    i--;
                }
                return temp;
            })()
        });
        return res;
    }

    function anaesOperTime(docId) { // totleIoEvent(docId);
        anesRecordServe_sybx.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.anaesTime) vm.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) vm.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
            totleIoEvent(docId);
        });
    }

    function totleIoEvent(id) { // showRemark(docId);
        anesRecordServe_sybx.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.blood) vm.view.blood = result.data.blood + 'ml';
            if (result.data.egress) vm.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) vm.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) vm.view.ioevent = result.data.ioevent + 'ml';
            showRemark(docId);
        });
    }

    function showRemark(docId) { // 备注栏 getNewMon();
        // anesRecordServe.showRemark(vm, docId, false);
        var lastPage = vm.view.pageCur == vm.view.pageCount ? true : false;
        anesRecordInter.searchAllEventListPlus("", { docId: docId, anaesMedNum: 0, medEventNum: 0, infusionNum: 0, egressNum: 0, bloodNum: 0 }).then(function(rs) {
            rs.data.treatMedEvtList = rs.data.medicalevent;
            rs.data.inIoeventList = rs.data.infusionList;
            rs.data.egressList = rs.data.egress;
            vm.rescueevent = rs.data.rescueevent;
            eCharts.refChart(vm, rs.data)
        })
        var startTime = vm.timeArr49 ? vm.timeArr49[vm.view.pageCur][0][0] * 1000 : '';
        var endTime = vm.timeArr49 ? vm.timeArr49[vm.view.pageCur][48][0] * 1000 : '';
        anesRecordServe_sybx.searchAllEventList(function(list) {
            $scope.backList = list;
            getNewMon();
        }, docId, 3, 3, 11, 3, 0, 9, startTime, endTime, lastPage);
    }

    function getPupilData() { // anaesOperTime(docId);
        anesRecordServe_sybx.getPupilData(regOptId, inTime, pageSize, vm.view.pageCur, function(list) {
            $scope.pupilDataList = list;
            anaesOperTime(docId);
        });
    }

    function setOption(type, array) {
        var num = 0,
            site = 0,
            startTime, endTime;
        for (var a = ev_list.length - 1; a >= 0; a--) {
            if (ev_list[a].type == type) {
                ev_list.splice(a, 1);
            }
        }
        if (array && array.length) {
            for (var a = 0; a < array.length; a++) {
                if (type == 'mz' && a < 11) {
                    site = 58 - a * 3;
                    for (var b = 0; b < array[a].medicalEventList.length; b++) {
                        num = Number(array[a].medicalEventList[b].dosage);
                        startTime = new Date(array[a].medicalEventList[b].startTime).getTime();
                        endTime = new Date(array[a].medicalEventList[b].endTime).getTime();
                        ev_list.push({
                            site: site, // 位置
                            type: type, // 状态
                            name: array[a].name, // 名称
                            dosage: num, // 剂量
                            dosageUnit: array[a].medicalEventList[b].dosageUnit, // 剂量单位
                            thickness: array[a].medicalEventList[b].thickness, // 浓度
                            thicknessUnit: array[a].medicalEventList[b].thicknessUnit, // 浓度单位
                            flow: array[a].medicalEventList[b].flow, // 流速
                            flowUnit: array[a].medicalEventList[b].flowUnit, // 流速单位
                            durable: Number(array[a].medicalEventList[b].durable), // 持续                        
                            startTime: startTime, // 开始时间
                            endTime: endTime, //结束时间
                            showOption: array[a].medicalEventList[b].showOption, // 1 显示流速；2 显示浓度
                            medicalEvent: array[a].medicalEventList[b]
                        })
                    }
                } else if ((type == 'sy' || type == 'sx') && a < 3) { // 输液 输血
                    site = type == 'sy' ? (25 - a * 3) : (16 - a * 3);
                    for (var b = 0; b < array[a].ioeventList.length; b++) {
                        num = Number(array[a].ioeventList[b].dosageAmount);
                        startTime = new Date(array[a].ioeventList[b].startTime).getTime();
                        endTime = new Date(array[a].ioeventList[b].endTime).getTime();
                        ev_list.push({
                            site: site, // 位置
                            type: type, // 状态
                            name: array[a].name, // 名称
                            dosageAmount: num, // 入量
                            dosageUnit: array[a].ioeventList[b].dosageUnit, // 单位
                            durable: 1,
                            startTime: startTime, // 开始时间
                            endTime: endTime // 结束时间
                        })
                    }
                } else if (type == 'cl' && a < 3) { // 出量
                    site = 7 - a * 3;
                    for (var b = 0; b < array[a].egressList.length; b++) {
                        num = Number(array[a].egressList[b].value);
                        startTime = new Date(array[a].egressList[b].startTime).getTime();
                        endTime = new Date(array[a].egressList[b].endTime).getTime();
                        ev_list.push({
                            site: site, // 位置
                            type: type, // 状态
                            name: array[a].name, // 名称
                            value: num, // 入量
                            dosageUnit: array[a].egressList[b].dosageUnit, // 单位
                            durable: 1,
                            startTime: startTime, // 开始时间
                            endTime: endTime // 结束时间
                        })
                    }
                }
            }
        }
    }

    function initEvConfig() {
        var evIndex = 0,
            evOpt = (function() {
                var len = 0;
                var size = 5;
                var curTime, nextTime, timeSpan;
                var res = { x: [], y: [] };
                while (len < pageSize) {
                    curTime = vm.tempTime[len].value;
                    if (len == pageSize - 1) {
                        res.x.push({ freq: timeSpan, value: curTime });
                        res.y.push('');
                    } else {
                        nextTime = vm.tempTime[len + 1].value;
                        timeSpan = (nextTime - curTime) / size;
                        var num = 0;
                        while (num < size) {
                            res.x.push({ freq: timeSpan, value: curTime + num * timeSpan });
                            res.y.push('');
                            num++;
                        }
                    }
                    len++;
                }
                return res;
            })();
        $scope.eOption1.xAxis[0].data = angular.copy(evOpt.x);
        for (var a = 0; a < eChartRow1; a++) {
            $scope.eOption1.series[a].data = angular.copy(evOpt.y);
        }
        var len = 0,
            count = evOpt.x.length,
            curTime;
        while (len < count) {
            curTime = evOpt.x[len];
            for (var a = 0; a < ev_list.length; a++) {
                var evStartTime = ev_list[a].startTime,
                    evEndTime = ev_list[a].endTime,
                    sIndex = (ev_list[a].site - 1) / 3;
                if (evStartTime >= curTime.value && evStartTime - curTime.value < curTime.freq) {
                    var str = '';
                    if (ev_list[a].type == 'zl' || ev_list[a].type == 'mz') {
                        if (ev_list[a].showOption == 1)
                            str = ev_list[a].flow;
                        else if (ev_list[a].showOption == 2)
                            str = ev_list[a].thickness;
                        else
                            str = ev_list[a].dosage + ev_list[a].dosageUnit;
                    } else if (ev_list[a].type == 'sy' || ev_list[a].type == 'sx') {
                        str = ev_list[a].dosageAmount;
                    } else {
                        str = ev_list[a].value;
                    }
                    $scope.eOption1.series[sIndex].data[len] = {
                        value: ev_list[a].site,
                        evObj: ev_list[a],
                        symbol: 'triangle',
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: str + '',
                                    position: [len <= 10 ? 5 : -5, -12]
                                }
                            }
                        }
                    }
                }
                if (ev_list[a].durable == 1 && evStartTime < curTime.value && evEndTime >= curTime.value) {
                    if (evEndTime - curTime.value < curTime.freq) {
                        $scope.eOption1.series[sIndex].data[len] = {
                            value: ev_list[a].site,
                            evObj: ev_list[a],
                            symbol: 'triangle',
                            symbolSize: 7
                        }

                    } else {
                        $scope.eOption1.series[sIndex].data[len] = {
                            value: ev_list[a].site,
                            symbol: 'triangle',
                            symbolSize: 0
                        }
                    }
                }
            }
            len++;
        }
    }

    function initSign() {
        $timeout(function() {
            var eachWidth = $('.echart2').width() / (pageSize - 1);
            var seriesList = $scope.eOption2.series[$scope.eOption2.series.length - 1].data;
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = '';
            }
            for (var a = 0; a < $scope.startOper.anaeseventList.length; a++) {
                if ($scope.startOper.anaeseventList[a].code >= 2 && $scope.startOper.anaeseventList[a].code != 9) {
                    var evStartTime = new Date($filter('date')(new Date($scope.startOper.anaeseventList[a].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                    var isOk = false;
                    for (var i = 0, xTime; xTime = new Date($scope.eOption2.xAxis[0].data[i++]).getTime();) {
                        if (isOk) break;
                        if (evStartTime >= xTime && evStartTime < new Date($scope.eOption2.xAxis[0].data[i]).getTime()) {
                            var temp = i - 1;
                            while (true) {
                                if (seriesList[temp]) {
                                    temp++;
                                    continue;
                                } else {
                                    var evObj = anesRecordServe_sybx.getEvIcon($scope.startOper.anaeseventList[a].code);
                                    seriesList[temp] = {
                                        value: -5,
                                        name: evObj.name,
                                        symbol: 'image://' + evObj.src.replace('.png', '-3.png'),
                                        symbolSize: 11
                                    }
                                    isOk = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    vm.medECfg = eCharts.config(vm.pageState, 'x', {});
    vm.medEOpt1 = eCharts.medOpt1(eChartCol, vm);

    vm.monECfg = eCharts.config1(vm.pageState, 'y', {});
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32, interval: 1 }]);
    // 事件标记
    vm.markECfg = eCharts.config1(1);

    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete
    function getNewMon() {

        anesRecordServe_sybx.getNewMon(regOptId, inTime, pageSize, vm.view.pageCur).then(function(result) {
            $scope.monDataList = result.data.monDataList;
            PAGES.push({
                // view: angular.copy(vm.view),
                // timeArr49: angular.copy(vm.timeArr49),
                eOption1: angular.copy($scope.eOption1),
                medEOpt1: angular.copy(vm.medEOpt1),
                eOption2: angular.copy($scope.eOption2),
                pupilDataList: angular.copy($scope.pupilDataList),
                pageCur: vm.view.pageCur,
                monDataList: angular.copy($scope.monDataList),
                xTits: angular.copy($scope.xTits),
                backList: angular.copy($scope.backList)
            });

            if (vm.view.pageCur != vm.view.pageCount) {
                vm.view.pageCur++;
                getobsData()
            } else {
                $scope.PAGES = PAGES;
            }
        });
    }

    vm.pageFinish = function() {
        $timeout(function() {
            $window.print();
            $window.close();
        }, 3000);
    }

    function mergeData() {
        $scope.ioList = $scope.startOper.transfusioninIoeventList.concat($scope.startOper.bloodinIoeventList);
    }

    loadSummary();
    var summaryData;

    function loadSummary() {
        IHttp.post('document/searchAnaesSummaryDetail', { regOptId: regOptId }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.summary = [];
            summary = rs.data.anaesSummaryFormbean;
            summaryData = rs.data;
            // 全身麻醉
            if (summary.anaesSummaryAppendixGen.genAnesthesia)
                makeGroup('anaesSummaryAppendixGen', 'genAnesthesia');
            //基础或强化麻醉
            if (summary.anaesSummaryAppendixGen.baseAnes)
                makeGroup('anaesSummaryAppendixGen', 'baseAnes');
            //椎管内麻醉
            if (summary.anaesSummaryAppendixCanal.spinalAnes)
                makeGroup('anaesSummaryAppendixCanal', 'spinalAnes');
            //麻醉监护
            if (summary.anaesSummaryAppendixGen.anesCare)
                makeGroup('anaesSummaryAppendixGen', 'anesCare');
            //监测项目
            makeGroup('anaesSummaryAppendixGen', 'watchItem');
            //特殊管理
            makeGroup('anaesSummaryAppendixGen', 'controlerHyp');
            //神经阻滞/超声定位/神经刺激器
            if (summary.anaesSummaryAppendixCanal.nerveBlock || summary.anaesSummaryAppendixCanal.ultrasound || summary.anaesSummaryAppendixCanal.nerveStimulator)
                makeGroup('anaesSummaryAppendixCanal', 'nerveBlock');
            //有创操作
            if (summary.anaesSummaryAppendixCanal.invasiveProcedure == 1)
                makeGroup('anaesSummaryAppendixCanal', 'invasiveProcedure');
            //其他
            if (summary.anaesSummaryAppendixCanal.sgCatheter == 1)
                makeGroup('anaesSummaryAppendixCanal', 'sgCatheter');
            //麻醉效果
            makeGroup('anaesSummaryAppendixGen', 'anesEffect');
            //更改麻醉方法
            makeGroup('anaesSummaryAppendixGen', 'changeAnesMethod');
            //特殊情况
            makeGroup('anaesSummary', 'expCase');
            //离室
            makeGroup('anaesSummary', 'leave');
        });
    }

    function makeGroup(objKey, itemKey) {
        var group = {
            title: '',
            content: []
        };
        switch (itemKey) {
            case 'genAnesthesia':
                group.title = '全身麻醉';
                if (summary[objKey].fastInduction == 2) {
                    group.content.push('诱导方法：快诱导　');
                } else if (summary[objKey].slowInduction == 1) {
                    group.content.push('诱导方法：慢诱导　');
                }

                if (summary[objKey].intubation == 1) {
                    var contentStr = '气管插管：';

                    if (summary[objKey].endotracheal == 1) {
                        contentStr += '气管内　';
                    }

                    if (summary[objKey].bronchial == 1) {
                        contentStr += '支气管内　';
                    }

                    if (summary[objKey].leftChamber == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].leftChamber == 2) {
                        contentStr += '右　';
                    }

                    if (summary[objKey].doubleCavity == 1) {
                        contentStr += '双腔管　';
                    }

                    if (summary[objKey].blockDevice == 1) {
                        contentStr += '阻塞器　';
                    }

                    if (summary[objKey].fiberLocal == 1) {
                        contentStr += '纤支镜定位　';
                    }

                    if (summary[objKey].pyrosulfite == 1) {
                        contentStr += '经口　';
                    }

                    if (summary[objKey].transnasal == 1) {
                        contentStr += '经鼻　';
                    }

                    if (summary[objKey].transtracheal == 1) {
                        contentStr += '经气管造口　';
                    }

                    if (summary[objKey].model1) {
                        contentStr += '型号：' + getValue(summary[objKey].model1, summaryData.anesthesiaModelList) + '　';
                    }

                    if (summary[objKey].depth) {
                        contentStr += '深度：' + summary[objKey].depth + 'cm　';
                    }

                    if (summary[objKey].succCount) {
                        contentStr += '第 ' + summary[objKey].succCount + ' 次插管成功　';
                    }

                    if (contentStr != '气管插管：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].cuff == 1) {
                    group.content.push('套囊：有');
                } else if (summary[objKey].cuff == 2) {
                    group.content.push('套囊：无');
                }

                contentStr = '';

                if (summary[objKey].look == 1) {
                    contentStr += '直视　';
                }

                if (summary[objKey].blind == 1) {
                    contentStr += '盲探　';
                }

                if (summary[objKey].retrograde == 1) {
                    contentStr += '逆行　';
                }

                if (summary[objKey].fiberGuide == 1) {
                    contentStr += '纤支镜引导　';
                }

                if (summary[objKey].glidescope == 1) {
                    contentStr += '可视喉镜　';
                }

                if (summary[objKey].opticalCable == 1) {
                    contentStr += '光索　';
                }

                if (contentStr) {
                    group.content.push(contentStr);
                }

                contentStr = '';

                if (summary[objKey].intubationSuite == 1) {
                    contentStr += '气管插管套件　';
                }

                if (summary[objKey].reinPipe == 1) {
                    contentStr += '加强管　';
                }

                if (summary[objKey].shapedTube == 1) {
                    contentStr += '异型管　';
                }

                if (summary[objKey].oropharynxChannel == 1) {
                    contentStr += '口咽通道';
                }

                if (contentStr) {
                    group.content.push(contentStr);
                }

                if (summary[objKey].other == 1) {
                    group.content.push('其它：' + summary[objKey].otherContent + '　');
                }

                if (summary[objKey].laryMask == 1) {
                    var contentStr = '喉罩　';

                    if (summary[objKey].model2) {
                        contentStr += '型号：' + getValue(summary[objKey].laryMask, summaryData.anesthesiaModelList) + '　';
                    }

                    if (summary[objKey].diffIntub == 1) {
                        contentStr += '插管困难　';
                    }

                    if (contentStr != '喉罩　') {
                        group.content.push(contentStr);
                    }
                }

                contentStr = '声门暴露分级Grade：';
                if (summary[objKey].glottisExpClass == 1) {
                    contentStr += 'I　';
                } else if (summary[objKey].glottisExpClass == 2) {
                    contentStr += 'II　';
                } else if (summary[objKey].glottisExpClass == 3) {
                    contentStr += 'III　';
                } else if (summary[objKey].glottisExpClass == 4) {
                    contentStr += 'IV　';
                }

                if (contentStr != '声门暴露分级Grade：') {
                    group.content.push(contentStr);
                }

                contentStr = '维持方法：';
                if (summary[objKey].keepMethod == '1') {
                    contentStr += '全凭静脉　';
                } else if (summary[objKey].keepMethod == '2') {
                    contentStr += '吸入　';
                } else if (summary[objKey].keepMethod == '3') {
                    contentStr += '静吸复合　';
                }

                if (contentStr != '维持方法：') {
                    group.content.push(contentStr);
                }

                break;
            case 'baseAnes':
                group.title = '基础或强化麻醉';
                break;
            case 'anesCare':
                group.title = '麻醉监护';
                break;
            case 'watchItem':
                group.title = '监测项目';
                var contentStr = '';
                if (summary[objKey].monitProject7 == 1) {
                    contentStr += '7项以内　';
                } else if (summary[objKey].monitProject7 == 2) {
                    contentStr += '8-13项　';
                } else if (summary[objKey].monitProject7 == 3) {
                    contentStr += '14项以上　';
                }

                if (summary[objKey].ecgSt == 1) {
                    contentStr += 'ECG ST段分析 SpO2 NBP RP　';
                }

                if (summary[objKey].vtMv == 1) {
                    contentStr += 'VT MV Paw　';
                }

                if (summary[objKey].petCo2 == 1) {
                    contentStr += 'PETCO2　';
                }

                if (summary[objKey].aGas == 1) {
                    contentStr += 'A-gas　';
                }

                if (summary[objKey].fio2 == 1) {
                    contentStr += 'FI02　';
                }

                if (summary[objKey].ibp == 1) {
                    contentStr += 'IBP　';
                }

                if (summary[objKey].cvp == 1) {
                    contentStr += 'CVP　';
                }

                if (summary[objKey].tas == 1) {
                    contentStr += 'T　';
                }

                if (summary[objKey].tof == 1) {
                    contentStr += '肌松(TOF)　';
                }

                if (summary[objKey].anesDeep == 1) {
                    contentStr += '麻醉深度　';
                }

                if (summary[objKey].cardOutput == 1) {
                    contentStr += '心排量　';
                }

                if (summary[objKey].tee == 1) {
                    contentStr += 'TEE　';
                }

                if (summary[objKey].bloodSugar == 1) {
                    contentStr += '血糖　';
                }

                if (summary[objKey].blood == 1) {
                    contentStr += '血气　';
                }

                if (summary[objKey].bloodElect == 1) {
                    contentStr += '血电解质　';
                }

                if (summary[objKey].hemoglobin == 1) {
                    contentStr += '血红蛋白　';
                }
                if (contentStr) {
                    group.content.push(contentStr);
                }
                break;
            case 'controlerHyp':
                group.title = '特殊管理';
                if (summary[objKey].controlerHyp == 1) {
                    group.content.push('控制性降压　');
                }
                break;
            case 'anesEffect':
                group.title = '麻醉效果';
                var contentStr = '';
                if (summary[objKey].anesEffect == 1) {
                    contentStr += 'I　';
                } else if (summary[objKey].anesEffect == 2) {
                    contentStr += 'II　';
                } else if (summary[objKey].anesEffect == 3) {
                    contentStr += 'III　';
                } else if (summary[objKey].anesEffect == 4) {
                    contentStr += 'IV　';
                }
                if (contentStr) {
                    group.content.push(contentStr);
                }
                break;
            case 'spinalAnes':
                group.title = '椎管内麻醉';
                var contentStr = '';
                if (summary[objKey].waistAnes == 1) {
                    contentStr += '腰麻　';
                }
                if (summary[objKey].epiduralAnes == 1) {
                    contentStr += '硬膜外麻醉　';
                }
                if (summary[objKey].cseUnionAnes == 1) {
                    contentStr += '腰硬联合麻醉　';
                }
                if (summary[objKey].sacralAnes == 1) {
                    contentStr += '骶麻　';
                }
                if (contentStr) {
                    group.content.push(contentStr);
                }

                contentStr = '';
                if (summary[objKey].puncPoint1) {
                    contentStr += '穿刺点1：' + getValue(summary[objKey].puncPoint1, summaryData.puncturePointList) + '　';
                }

                if (summary[objKey].catheterPoint1) {
                    contentStr += '置管' + summary[objKey].catheterPoint1 + 'cm　';
                }

                if (summary[objKey].direction1) {
                    contentStr += '针斜面：' + getValue(summary[objKey].direction1, summaryData.needleBevelList) + '　';
                }

                if (summary[objKey].negativePressure1) {
                    contentStr += '负压试验：' + getValue(summary[objKey].negativePressure1, summaryData.negativePressList) + '　';
                }
                if (contentStr) {
                    group.content.push(contentStr);
                }

                contentStr = '';
                if (summary[objKey].puncPoint2) {
                    contentStr += '穿刺点1：' + getValue(summary[objKey].puncPoint2, summaryData.puncturePointList) + '　';
                }

                if (summary[objKey].catheterPoint2) {
                    contentStr += '置管' + summary[objKey].catheterPoint2 + 'cm　';
                }

                if (summary[objKey].direction2) {
                    contentStr += '针斜面：' + getValue(summary[objKey].direction2, summaryData.needleBevelList) + '　';
                }

                if (summary[objKey].negativePressure2) {
                    contentStr += '负压试验：' + getValue(summary[objKey].negativePressure2, summaryData.negativePressList) + '　';
                }
                if (contentStr) {
                    group.content.push(contentStr);
                }

                if (summary[objKey].anesFlat) {
                    group.content.push('麻醉平面：' + summary[objKey].anesFlat) + '　';
                }

                break;
            case 'nerveBlock':
                var titleStr = ''
                if (summary[objKey].nerveBlock == 1) {
                    titleStr += '神经阻滞 ';
                }

                if (summary[objKey].ultrasound == 1) {
                    titleStr += '超声定位 ';
                }

                if (summary[objKey].nerveStimulator == 1) {
                    titleStr += '神经刺激器 ';
                }

                group.title = titleStr;

                if (summary[objKey].cervicalPlexusBlock == 1) {
                    var contentStr = '颈丛神经阻滞：';
                    if (summary[objKey].shallowCong == 1) {
                        contentStr += '浅丛 左　';
                    } else if (summary[objKey].shallowCong == 2) {
                        contentStr += '浅丛 右　';
                    }

                    if (summary[objKey].deepPlexus == 1) {
                        contentStr += '深丛 左　';
                    } else if (summary[objKey].deepPlexus == 2) {
                        contentStr += '深丛 右　';
                    }

                    if (summary[objKey].c) {
                        contentStr += 'C ' + summary[objKey].c + '　';
                    }

                    if (contentStr != '颈丛神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                //弹出框的臂丛神经阻滞有问题
                if (summary[objKey].brachialPlexusBlock == 1) {
                    var contentStr = '臂丛神经阻滞：';
                    if (summary[objKey].brachialValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].brachialValue == 2) {
                        contentStr += '右　';
                    }

                    if (summary[objKey].interscaleneLaw == 1) {
                        contentStr += '肌间沟法　';
                    }
                    if (summary[objKey].interscaleneLaw == 2) {
                        contentStr += '腋路法　';
                    }
                    if (summary[objKey].interscaleneLaw == 3) {
                        contentStr += '锁骨上法　';
                    }

                    if (contentStr != '臂丛神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].waistPlexusBlock == 1) {
                    var contentStr = '腰丛神经阻滞：';
                    if (summary[objKey].waistPlexusValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].waistPlexusValue == 2) {
                        contentStr += '右　';
                    }

                    if (contentStr != '腰丛神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].sciaticNerveBlock == 1) {
                    var contentStr = '坐骨神经阻滞：';
                    if (summary[objKey].sciaticNerveValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].sciaticNerveValue == 2) {
                        contentStr += '右　';
                    }

                    if (contentStr != '坐骨神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].femoralNerveBlock == 1) {
                    var contentStr = '股神经阻滞：';
                    if (summary[objKey].femoralNerveValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].femoralNerveValue == 2) {
                        contentStr += '右　';
                    }

                    if (contentStr != '股神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].cutaneousNerveBlock == 1) {
                    var contentStr = '股外侧皮神经阻滞：';
                    if (summary[objKey].cutaneousNerveValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].cutaneousNerveValue == 2) {
                        contentStr += '右　';
                    }

                    if (contentStr != '股外侧皮神经阻滞：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].other1 == 1) {
                    var contentStr = '其它：';

                    if (summary[objKey].other1Value) {
                        contentStr += summary[objKey].other1Value + '　';
                    }

                    if (contentStr != '其它：') {
                        group.content.push(contentStr);
                    }
                }
                break;
            case 'invasiveProcedure':
                group.title = '有创操作';
                if (summary[objKey].arteryCathete == 1) {
                    var contentStr = '动脉穿刺置管：';

                    if (summary[objKey].radialArtery == 1) {
                        contentStr += '桡动脉　';
                    }
                    if (summary[objKey].femoralArtery == 1) {
                        contentStr += '股动脉　';
                    }
                    if (summary[objKey].footArtery == 1) {
                        contentStr += '足背动脉　';
                    }

                    if (summary[objKey].footArteryValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].footArteryValue == 2) {
                        contentStr += '右　';
                    }

                    if (contentStr != '动脉穿刺置管：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].deepVeinCathete == 1) {
                    var contentStr = '深静脉穿刺置管：';

                    if (summary[objKey].jugularVein == 1) {
                        contentStr += '颈内静脉　';
                    }
                    if (summary[objKey].subclavianVein == 1) {
                        contentStr += '锁骨下静脉　';
                    }
                    if (summary[objKey].femoralVein == 1) {
                        contentStr += '股静脉　';
                    }

                    if (summary[objKey].femoralVeinValue == 1) {
                        contentStr += '左　';
                    } else if (summary[objKey].femoralVeinValue == 2) {
                        contentStr += '右　';
                    }

                    if (summary[objKey].ultrasound1 == 1) {
                        contentStr += '超声定位　';
                    }
                    if (summary[objKey].singleChamber == 1) {
                        contentStr += '单腔　';
                    }
                    if (summary[objKey].dualChamber == 1) {
                        contentStr += '双腔　';
                    }

                    if (summary[objKey].threeChamber == 1) {
                        contentStr += '三腔　';
                    }

                    if (summary[objKey].bloodWarming == 1) {
                        contentStr += '输血输液加温　';
                    }

                    if (contentStr != '深静脉穿刺置管：') {
                        group.content.push(contentStr);
                    }
                }

                if (summary[objKey].sgCatheter == 1) {
                    var contentStr = '其它：';

                    if (summary[objKey].other2) {
                        contentStr += summary[objKey].other2 + '　';
                    }

                    if (contentStr != '其它：') {
                        group.content.push(contentStr);
                    }
                }
                break;
            case 'sgCatheter':
                group.title = '其它';
                if (summary[objKey].other2) {
                    group.content.push(summary[objKey].other2);
                }
                break;

            case 'changeAnesMethod':
                group.title = '更改麻醉方法';
                var contentStr = '';

                if (summary[objKey].changeAnesMethod == 1) {
                    contentStr += '是　更改原因：' + summary[objKey].changeReason + '　';
                } else if (summary[objKey].changeAnesMethod == 2) {
                    contentStr += '否　';
                }

                if (contentStr) {
                    group.content.push(contentStr);
                }
                break;
            case 'expCase':
                group.title = '特殊情况'
                var contentStr = '';

                if (summary[objKey].expCase == 1) {
                    contentStr += '是　说明：' + summary[objKey].specialNote + '　';
                } else if (summary[objKey].expCase == 2) {
                    contentStr += '否　';
                }

                if (contentStr) {
                    group.content.push(contentStr);
                }
                break;
            case 'leave':
                group.title = '离室';

                var contentStr = '肌力恢复：';
                //此处要改
                if (summary[objKey].muscleRecovery == 1) {
                    contentStr += '好　';
                }
                if (summary[objKey].muscleRecovery == 2) {
                    contentStr += '差　';
                }

                if (contentStr != '肌力恢复：') {
                    group.content.push(contentStr);
                }

                contentStr = '咳嗽吞咽反射：';
                if (summary[objKey].coughReflex == 1) {
                    contentStr += '有　';
                }
                if (summary[objKey].coughReflex == 2) {
                    contentStr += '无　';
                }

                if (contentStr != '咳嗽吞咽反射：') {
                    group.content.push(contentStr);
                }

                contentStr = '定向恢复：';
                if (summary[objKey].directlRec == 1) {
                    contentStr += '是　';
                }
                if (summary[objKey].directlRec == 2) {
                    contentStr += '否　';
                }

                if (contentStr != '定向恢复：') {
                    group.content.push(contentStr);
                }

                contentStr = '意识：';
                if (summary[objKey].consciou == 1) {
                    contentStr += '清醒　';
                }
                if (summary[objKey].consciou == 2) {
                    contentStr += '嗜睡　';
                }
                if (summary[objKey].consciou == 3) {
                    contentStr += '麻醉状态　';
                }
                if (summary[objKey].consciou == 4) {
                    contentStr += '谵妄　';
                }
                if (summary[objKey].consciou == 5) {
                    contentStr += '昏迷　';
                }

                if (contentStr != '意识：') {
                    group.content.push(contentStr);
                }

                contentStr = '麻醉平面：';
                if (summary[objKey].anesPlane) {
                    contentStr += summary[objKey].anesPlane + '　';
                }

                if (contentStr != '麻醉平面：') {
                    group.content.push(contentStr);
                }

                contentStr = '备注：';
                if (summary[objKey].remarks) {
                    contentStr += summary[objKey].remarks + '　';
                }

                if (contentStr != '备注：') {
                    group.content.push(contentStr);
                }

                contentStr = '人工气道/硬膜外导管拔除：';
                if (summary[objKey].artifiAirwayRemoval == 1) {
                    contentStr += '是　';
                } else if (summary[objKey].artifiAirwayRemoval == 2) {
                    contentStr += '否　';
                }

                if (contentStr != '人工气道/硬膜外导管拔除：') {
                    group.content.push(contentStr);
                }

                contentStr = '病人自控镇痛泵：';
                if (summary[objKey].controAnal == 1) {
                    contentStr += '有 ';
                    if (summary[objKey].controAnalPlace == '1') {
                        contentStr += '静脉　';
                    } else if (summary[objKey].controAnalPlace == '2') {
                        contentStr += '椎管内　';
                    } else if (summary[objKey].controAnalPlace == '3') {
                        contentStr += '局部　';
                    }
                } else if (summary[objKey].controAnal == 2) {
                    contentStr += '无 ';
                }

                if (contentStr != '病人自控镇痛泵：') {
                    group.content.push(contentStr);
                }
        }
        $scope.summary.push(group);
    }

    function getValue(code, obj) {
        var newObj = $filter('filter')(obj, function(item) {
            return item.codeValue == code;
        });
        if (newObj)
            return newObj[0].codeName;
        else
            return '';
    }
}