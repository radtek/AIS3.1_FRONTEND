anesRecordLogPrint.$inject = ['$rootScope', '$scope', 'IHttp', 'anesRecordServe_yxrm', 'auth', '$filter', '$timeout', 'toastr', '$window'];

module.exports = anesRecordLogPrint;

function anesRecordLogPrint($rootScope, $scope, IHttp, anesRecordServe_yxrm, auth, $filter, $timeout, toastr, $window) {
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
        eChartCol = 8,
        eChartRow2 = 25, // eChart2 的 行数
        summary; // 麻醉总结
    $scope.view = {
        pageCur: 1,
        pageCount: 1
    };
    $scope.regOptId = regOptId;
    vm.tempTime = [];

    anesRecordServe_yxrm.asaLevel.then(function(result) { // asa下拉选项值
        $scope.asaLevel = result.data.resultList;
    });
    anesRecordServe_yxrm.optBody.then(function(result) { // 手术体位下拉选项值
        $scope.optBody = result.data.resultList;
    });
    anesRecordServe_yxrm.leaveTo.then(function(result) { // 出室去向下拉选项值
        $scope.leaveTo = result.data.resultList;
    });

    $scope.eConfig1 = anesRecordServe_yxrm.eChart1.config();
    $scope.eOption1 = anesRecordServe_yxrm.eChart1.option(eChartRow1, eChartCol);
    $scope.eConfig2 = anesRecordServe_yxrm.eChart2.config();
    $scope.eOption2 = anesRecordServe_yxrm.eChart2.option(eChartCol, [{ min: -10, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 1, max: 32 }]);

    $scope.bg = false;
    $scope.zg = false;
    anesRecordServe_yxrm.startOper(regOptId).then(function(rs) {
        if (rs.data.resultCode != '1') return;
        $scope.eConfig1.dataLoaded = false;
        $scope.eConfig2.dataLoaded = false;
        docId = rs.data.anaesRecord.anaRecordId;
        $scope.startOper = anesRecordServe_yxrm.initData(rs.data);
        let anaeseventList = $scope.startOper.anaeseventList;
        for (var event of anaeseventList) {
            if (event.code == 6) {
                $scope.bg = true;
            }
            if (event.code == 3) {
                $scope.zg = true;
            }
        }
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
        // setOption('mz', $scope.startOper.anaesMedEvtList); // 麻醉用药情况瞄点数据生成
        setOption('zl', $scope.startOper.treatMedEvtList); // 治疗用药情况瞄点数据生成
        setOption('sy', $scope.startOper.inIoeventList); // 输液输血情况瞄点数据生成
        setOption('cl', $scope.startOper.outIoeventList); // 出量情况瞄点数据生成
        getobsData();
    });

    function getobsData() {
        inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
            return item.code == 1;
        })[0].occurTime;
        anesRecordServe_yxrm.getObsData(regOptId, $scope.view.pageCur, pageSize, inTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            $scope.view.pageCount = result.data.total <= pageSize ? 1 : Math.ceil((result.data.total - 1) / (pageSize - 1));
            $scope.eOption2.xAxis[0].data = getXAxis(result.data);
            $scope.eOption2.series = getSeries(result.data);
            initEvConfig();
            initSign();
            getPupilData();
            getXdtData();
            if ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy')
                searchIOAmoutDetail();
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
            if ((rs.changeFreqTime != '' && temp.value <= rs.changeFreqTime) || rs.changeFreqTime == '') {
                temp.value = temp.value - rs.offset * 1000;
                temp.offset = true;
            }
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
        if (rs.changeFreqTime == '') tempValue = tempValue - rs.offset * 1000;
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
                        // 手动修改的点也显示成黑色
                        rs.series[a].data[i].symbol = 'image://' + rs.series[a].symbol;
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
                        rs.series[a].data[i].symbol = rs.series[a].data[i].symbol;
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
                symbolSize: rs.series[a].symbolSize - (rs.series[a].name == 'PR' ? 6 : 3), //打印时瞄点图标缩小
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
        // var markLine = {
        //     silent: true,
        //     symbolSize: 0,
        //     lineStyle: {
        //         type: 'solid',
        //         color: 'red'
        //     },
        //     tooltip: {
        //         trigger: 'none'
        //     },
        //     data: [{
        //         yAxis: 10,
        //         symbolSize: 0
        //     }, {
        //         yAxis: 60
        //     }, {
        //         yAxis: 90
        //     }, {
        //         yAxis: 140
        //     }]
        // }
        // res[0].markLine = markLine;
        return res;
    }

    function anaesOperTime(docId) { // totleIoEvent(docId);
        anesRecordServe_yxrm.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.anaesTime) $scope.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) $scope.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
            totleIoEvent(docId);
        });
    }

    function totleIoEvent(id) { // showRemark(docId);
        anesRecordServe_yxrm.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.blood) $scope.view.blood = result.data.blood + 'ml';
            if (result.data.egress) $scope.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) $scope.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) $scope.view.ioevent = result.data.ioevent + 'ml';
            showRemark(docId);
        });
    }

    function showRemark(docId) { // 备注栏
        var len = vm.tempTime.length;
        var endTime = vm.tempTime[len - 1].value + vm.tempTime[len - 1].freq * 1000;
        var medEventNum = 5,
            anaesMedNum = 6;
        if ($scope.docInfo.beCode == "qnzrmyy" || $scope.docInfo.beCode == 'yxyy') {
            medEventNum = 11;
            anaesMedNum = 0;
        }
        var lastPage = $scope.view.pageCur == $scope.view.pageCount ? true : false;
        anesRecordServe_yxrm.searchAllEventList(function(list) {
            $scope.backList = list;
            var index = 0;
            for (var item of list) {
                if (item.name == '呼吸事件') {
                    list.splice(index, 1);
                }
                index += 1;
            }
            getNewMon();
        }, docId, 0, 6, medEventNum, 3, anaesMedNum, 9, vm.tempTime[0].value, endTime, lastPage);
    }

    function getPupilData() { // anaesOperTime(docId);
        anesRecordServe_yxrm.getPupilData(regOptId, inTime, pageSize, $scope.view.pageCur, function(list) {
            $scope.pupilDataList = list;
            anaesOperTime(docId);
        });
    }

    let xdtData = [];

    function getXdtData() { // 获取心电图数据
        IHttp.post('operCtl/getPupilData', { regOptId: regOptId, inTime: inTime, size: pageSize, no: $scope.view.pageCur }).then(function(rs) {
            $scope.xdtDataList = rs.data.pupilDataList;
            for (var obj of $scope.xdtDataList) {
                xdtData.push(obj.electDiogData);
            }
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
                if (type == 'zl' && a < 11) {
                    site = 58 - a * 3;
                    for (var b = 0; b < array[a].medicalEventList.length; b++) { // 同一种药肯能在不同的时间段用，所以需要循环处理
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
                            medicalEvent: array[a].medicalEventList[b],
                            detailList: array[a].medicalEventList[b].medDetailList
                        })
                    }
                } else if (type == 'sy' && a < 6) { // 输液 输血
                    site = 25 - a * 3;
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
                    var dosageStr = '',
                        thickStr = '',
                        flowStr = '',
                        detailList = $filter('filter')(ev_list[a].detailList, function(e, k) {
                            return e.startTime == curTime.value;
                        });
                    if (ev_list[a].type == 'mz' || ev_list[a].type == 'zl') {
                        if (ev_list[a].showOption)
                            dosageStr = ev_list[a].dosage + ev_list[a].dosageUnit;
                        if (ev_list[a].detailList.length) {
                            if (ev_list[a].detailList[0].showFlow)
                                flowStr = ev_list[a].detailList[0].flow + ev_list[a].detailList[0].flowUnit;
                            if (ev_list[a].detailList[0].showThick)
                                thickStr = ev_list[a].detailList[0].thickness + ev_list[a].detailList[0].thicknessUnit;
                        }
                    } else if (ev_list[a].type == 'sy') {
                        dosageStr = ev_list[a].dosageAmount;
                    } else {
                        dosageStr = ev_list[a].value;
                    }
                    $scope.eOption1.series[sIndex].data[len] = {
                        value: ev_list[a].site,
                        evObj: ev_list[a],
                        symbol: 'rect',
                        symbolSize: [3, 8],
                        // itemStyle: {},
                        // label: {
                        //     show: true,
                        //     formatter: dosageStr + ' ' + thickStr + ' ' + flowStr,
                        //     position: [len <= 10 ? 10 : -10, -8]
                        // }
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: dosageStr + ' ' + thickStr + ' ' + flowStr,
                                    position: [len <= 10 ? 10 : -10, -8]
                                }
                            }
                        }
                    }
                }
                if (ev_list[a].durable && evStartTime < curTime.value && evEndTime >= curTime.value) {
                    if (evEndTime - curTime.value < curTime.freq) {
                        $scope.eOption1.series[sIndex].data[len] = {
                            value: ev_list[a].site,
                            evObj: ev_list[a],
                            symbol: 'rect',
                            symbolSize: [3, 8]
                        }
                    } else {
                        var symSize = 0,
                            color = '#8e8e8e',
                            thickStr = '',
                            flowStr = '',
                            detailList = $filter('filter')(ev_list[a].detailList, function(e, k) {
                                return e.startTime == curTime.value && k > 0;
                            });
                        if (detailList && detailList.length > 0) {
                            symSize = 6;
                            color = '#000';
                            if (detailList[0].showFlow)
                                flowStr = detailList[0].flow + detailList[0].flowUnit;
                            if (detailList[0].showThick)
                                thickStr = detailList[0].thickness + detailList[0].thicknessUnit;
                        }
                        $scope.eOption1.series[sIndex].data[len] = {
                            value: ev_list[a].site,
                            evObj: ev_list[a],
                            symbol: 'rect',
                            symbolSize: symSize,
                            itemStyle: {
                                normal: {
                                    color: color,
                                    label: {
                                        show: true,
                                        formatter: thickStr + ' ' + flowStr,
                                        position: [5, -8]
                                    }
                                }
                            }

                        }
                    }
                }
            }
            len++;
        }
    }

    function initSign() {
        $timeout(function() {
            var eachWidth = $('.echart2').width() / (pageSize - 1),
                seriesList = $scope.eOption2.series[$scope.eOption2.series.length - 1].data,
                signCount = 0, index = 1;
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = '';
            }
            var value = -5, position_ = -2;
            for (var a = 0; a < $scope.startOper.anaeseventList.length; a++) {
                if ($scope.startOper.anaeseventList[a].code >= 2 && $scope.startOper.anaeseventList[a].code != 9) {
                    var evStartTime = new Date($filter('date')(new Date($scope.startOper.anaeseventList[a].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                    var isOk = false,
                        diffTime = 0;
                    if (a > 0) {
                        var upTime = new Date($filter('date')(new Date($scope.startOper.anaeseventList[a - 1].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                        diffTime = evStartTime - upTime;
                        if (diffTime <= 10000) {
                            value += 10;
                            position_ -= 5;
                        }else {
                            value = -5;
                            position_ = -2;
                        }
                    }
                    for (var i = 0, xTime; xTime = new Date($scope.eOption2.xAxis[0].data[i++]).getTime();) {
                        if (isOk) break;
                        if (evStartTime >= xTime && evStartTime < new Date($scope.eOption2.xAxis[0].data[i]).getTime()) {
                            var temp = i - 1;
                            while (true) {
                                if (seriesList[temp]) {
                                    temp++;
                                    continue;
                                } else {
                                    var evObj = anesRecordServe_yxrm.getEvIcon($scope.startOper.anaeseventList[a].code);
                                    if(evObj.src)
                                        signCount += 1;
                                    seriesList[temp] = {
                                        value: value,
                                        name: evObj.name,
                                        symbol: 'image://' + evObj.src,
                                        symbolSize: 14,
                                        itemStyle: {
                                            normal: {
                                                color: '#000',
                                                label: {
                                                    show: true,
                                                    formatter: '',
                                                    position: [3, -13]
                                                }
                                            }
                                        }
                                    }
                                    if (!evObj.src) {
                                        seriesList[temp].name = $scope.startOper.anaeseventList[a].codeName;
                                        seriesList[temp].symbol = 'image://app/img/white.png';
                                        seriesList[temp].symbolSize = 10;
                                        seriesList[temp].itemStyle.normal.label.formatter = index + '';
                                        seriesList[temp].itemStyle.normal.label.position = [3, position_];
                                        seriesList[temp].itemStyle.normal.label.fontSize = 15;
                                        seriesList[temp].itemStyle.normal.label.show = true;
                                    }
                                    isOk = true;
                                    break;
                                }
                            }
                            if ($scope.startOper.anaeseventList[a].code > 9)
                                index += 1;
                        }
                    }
                }
            }
        });
    }

    function getNewMon() {
        anesRecordServe_yxrm.getNewMon(regOptId, inTime, pageSize, $scope.view.pageCur).then(function(rs) {
            $scope.monDataList = rs.data.monDataList;
            PAGES.push({
                eOption1: angular.copy($scope.eOption1),
                eOption2: angular.copy($scope.eOption2),
                pupilDataList: angular.copy($scope.pupilDataList),
                xdtDataList: xdtData,
                pageCur: $scope.view.pageCur,
                monDataList: angular.copy($scope.monDataList),
                xTits: angular.copy($scope.xTits),
                backList: angular.copy($scope.backList)
            });
            if ($scope.view.pageCur != $scope.view.pageCount) {
                $scope.view.pageCur++;
                getobsData()
            } else {
                $scope.PAGES = PAGES;
            }
        });
    }

    function searchIOAmoutDetail() {
        anesRecordServe_yxrm.searchIOAmoutDetail(docId).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            vm.IOAmout = {
                bleeding: rs.data.bleeding ? rs.data.bleeding : ' / ',
                blood: rs.data.blood ? rs.data.blood : ' / ',
                bloodDetail: rs.data.bloodDetail ? rs.data.bloodDetail : '',
                infusion: rs.data.infusion ? rs.data.infusion : ' / ',
                urine: rs.data.urine ? rs.data.urine : ' / '
            }
        });
    }

    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }

    vm.pageFinish = function() {
        $timeout(function() {
            $window.print();
            $window.close();
        }, 3000);
    }
    $scope.getListStrLen = function(list) {
        var str = '';
        if (!list || list.length < 1) return str;
        list.forEach(function(item) {
            if (str == '')
                str = item.name;
            else
                str += '，' + item.name;
        });
        return str.length;
    }

}
