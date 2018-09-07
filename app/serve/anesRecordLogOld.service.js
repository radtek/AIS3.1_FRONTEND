module.exports = anesRecordServe;

anesRecordServe.$inject = ['$rootScope', 'IHttp', 'auth', '$filter', 'dateFilter', 'anesRecordInter', 'eChartsOld', 'confirm', 'toastr'];

function anesRecordServe($rootScope, IHttp, auth, $filter, dateFilter, anesRecordInter, eCharts, confirm, toastr) {
    let _this = this,
        user = auth.loginUser(),
        o = {
            regOptId: undefined,
            docId: undefined,
            inTime: undefined,
            index: 0,
            ev_list: [],
            freq: 0,
            medChartRow: 0,
            PAGES: [],
            timer_rt: undefined,
            toas: undefined // 控制只显示一个toast
        }

    _this.initData = function(data) {
        data.regOpt.emergency = data.regOpt.emergency + '';
        data.regOpt.frontOperForbidTake = data.regOpt.frontOperForbidTake + '';
        data.anaeseventList = _this.dateFormat(data.anaeseventList)
        try {
            if (data.anaesRecord.patAnalgesia)
                data.anaesRecord.patAnalgesia_ = JSON.parse(data.anaesRecord.patAnalgesia);
            else
                data.anaesRecord.patAnalgesia_ = {};
            if (data.anaesRecord.optBody) {
                // data.anaesRecord.optBody_ = JSON.parse(data.anaesRecord.optBody);
            } else
                data.anaesRecord.optBody_ = [];
        } catch (e) {
            data.anaesRecord.patAnalgesia_ = {};
            data.anaesRecord.optBody_ = [];
        }
        return data;
    }

    _this.getobsData = function(vm, regOptId, docId, medChartRow, ev_list) { // 获取历史点
        o.regOptId = regOptId;
        o.docId = docId;
        o.medChartRow = medChartRow;
        o.ev_list = ev_list;
        o.inTime = $filter('filter')(vm.startOper.anaeseventList, function(item) {
            return item.code === 1;
        })[0].occurTime; // 实时更新入室时间
        vm.view.pageDone = false; // 控制上一页下一页按钮不可以
        _this.stopTimerPt();
        anesRecordInter.getObsData(regOptId, vm.view.pageCur, vm.view.pageSize, o.inTime).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.monECfg.dataLoaded = false;
            vm.markECfg.dataLoaded = false;
            if (result.data.xAxis[0].data.length == 0) { // 修改入室时间时有用，修改入室时间可能会一个点都没有，则需要补一下
                if (result.data.freq == result.data.md.intervalTime) { // 如果相等，说明没有修改频率
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.freq * 1000 });
                } else {
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.md.intervalTime * 1000 });
                }
            }
            o.freq = result.data.freq;
            vm.view.pageCount = result.data.total <= vm.view.pageSize ? 1 : Math.ceil((result.data.total - 1) / (vm.view.pageSize - 1)); // 计算总页数
            if (vm.view.pageCur === 0) { // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
                vm.view.pageCur = vm.view.pageCount;
            }
            if (vm.pageState !== 0 || vm.operState !== '04') { // 如果不是在术中或者手术已经结束就不要瞄点啦，只需要获取历史点数据
                getIntervalObsData(vm, -1, result.data);
                return;
            }
            // 代码能到这里说明它在术中且手术正在执行
            if (vm.view.pageCur !== vm.view.pageCount) { // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
                getIntervalObsData(vm, 'paging', result.data, true);
                return;
            }
            var t, hisTimes = [],
                times_ = new Date($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).getTime();
            if (o.freq == result.data.md.intervalTime) { // 这个判断是算出下一个点的时间（还没有瞄出来，将要瞄的下一个点）
                t = result.data.md.time + o.freq * 1000;
            } else {
                t = result.data.md.time + result.data.md.intervalTime * 1000;
            }
            while (t < times_) { // 计算要补点的时间点，累加频率后再和当前时间对比
                hisTimes.push(t);
                t += o.freq * 1000;
            }
            if (hisTimes.length > 0) {
                anesRecordInter.getIntervalObsData(o.regOptId, hisTimes, o.freq, vm.view.pageCur, vm.view.pageSize, o.inTime).then(function(res) {
                    res.data.offset = result.data.offset; // getIntervalObsData这个接口没有offset与changeFreqTime;
                    res.data.changeFreqTime = result.data.changeFreqTime;
                    getIntervalObsData(vm, t - times_, res.data);
                });
            } else {
                getIntervalObsData(vm, t - times_, result.data);
            }
        });
    }

    _this.getobsDataPrint = function(vm, regOptId, docId, medChartRow, ev_list) {
        o.regOptId = regOptId;
        o.docId = docId;
        o.medChartRow = medChartRow;
        o.ev_list = ev_list;
        o.inTime = $filter('filter')(vm.startOper.anaeseventList, function(item) {
            return item.code === 1;
        })[0].occurTime;
        anesRecordInter.getObsData(regOptId, vm.view.pageCur, vm.view.pageSize, o.inTime).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.view.pageCount = result.data.total <= vm.view.pageSize ? 1 : Math.ceil((result.data.total - 1) / (vm.view.pageSize - 1));
            var callData = eCharts.getXAxis(result.data, vm);
            var monEOptSeries = eCharts.getMarkSeries(vm.monEOpt);
            vm.xTits = angular.copy(callData.xTits);
            vm.monEOpt.xAxis[0].data = angular.copy(callData.resultList);
            vm.monEOpt.series = eCharts.getSeries(result.data, vm.monEOpt);
            //初始化一个空series用于显示血气分析数值在eCharts上
            vm.monEOpt.series.push(monEOptSeries[0]);
            vm.markEOpt.xAxis[0].data = angular.copy(callData.resultList);
            vm.markEOpt.series = eCharts.getMarkSeries(vm.markEOpt);

            eCharts.initEvConfig(o.medChartRow, o.ev_list, vm, true);
            eCharts.initSign(vm.markEOpt, vm.startOper, vm.view.pageSize, true);
            getPupilData(vm, regOptId, o.inTime);
            anaesOperTimePrint(vm, o.docId);
        });
    }

    function getIntervalObsData(vm, sideTime, result, onlySave) { // 补点
        var callData = eCharts.getXAxis(result, vm);
        var monEOptSeries = eCharts.getMarkSeries(vm.monEOpt);
        vm.xTits = angular.copy(callData.xTits);

        console.log('xTits', vm.xTits);
        vm.monEOpt.xAxis[0].data = angular.copy(callData.resultList);
        vm.monEOpt.series = eCharts.getSeries(result, vm.monEOpt);
        //初始化一个空series用于显示血气分析数值在eCharts上
        vm.monEOpt.series.push(monEOptSeries[0]);
        vm.monEOpt.yAxis = eCharts.getYAxis(angular.copy(result.yAxis), angular.copy(vm.monEOpt.yAxis));

        vm.markEOpt.xAxis[0].data = angular.copy(callData.resultList);
        vm.markEOpt.series = eCharts.getMarkSeries(vm.markEOpt);

        if (result.total < vm.view.pageSize) { // 计算瞄点的索引
            o.index = (result.total - 1) % vm.view.pageSize;
        } else {
            o.index = (result.total - 1) % (vm.view.pageSize - 1) === 0 ? (vm.view.pageSize - 1) : (result.total - 1) % (vm.view.pageSize - 1);
        }
        vm.view.pageCount = result.total <= vm.view.pageSize ? 1 : Math.ceil((result.total - 1) / (vm.view.pageSize - 1));
        if (vm.view.pageCur === 0) {
            vm.view.pageCur = vm.view.pageCount;
        }
        _this.showRemark(vm, o.docId);
        eCharts.initEvConfig(o.medChartRow, o.ev_list, vm, false);
        getPupilData(vm, o.regOptId, o.inTime);
        eCharts.initSign(vm.markEOpt, vm.startOper, vm.view.pageSize, false);
        _this.getNewMon(vm, o.regOptId, o.inTime);

        vm.view.pageDone = true;
        if (sideTime < 0) return;
        _this.start_rt(vm); // 实时监测数据
        var startTime = result.md.time + result.md.intervalTime * 1000; // 计算下一个瞄点时间
        var onLoad = function() { // 瞄新点方法
            anesRecordInter.getObsDataNew(o.regOptId, o.inTime, startTime).then(function(data) {
                data = data.data;
                if (data.resultCode != '1' || data.xAxis[0].data.length <= 0)
                    return;
                o.freq = data.freq;
                for (observe of data.series) {
                    if (observe.name == 'RESP') {
                        // if (observe.data.length > 0)
                        //     historyData.push(observe.data[0]);
                        for (item of observe.data) {
                            if (item.symbolSvg)
                                item.symbol = 'path://' + item.symbolSvg;
                        }
                    }
                }
                if (data.total < vm.view.pageSize)
                    o.index = (data.total - 1) % vm.view.pageSize;
                else
                    o.index = (data.total - 1) % (vm.view.pageSize - 1) === 0 ? (vm.view.pageSize - 1) : (data.total - 1) % (vm.view.pageSize - 1);
                if (onlySave) return;
                if (o.index === 1 && data.total > vm.view.pageSize) { // 新页
                    vm.view.pageCur++;
                    _this.getobsData(vm, o.regOptId, o.docId, o.medChartRow, o.ev_list);
                } else {
                    var len = data.series.length;
                    for (var a = 0; a < len; a++) { // 循环series
                        data.series[a].data[0].units = data.series[a].units; // 把series的units赋值到采集的数据data里面
                        var isOk = false; // 标识是否当前轴是否瞄点
                        for (var i = 0, xTime; xTime = new Date(vm.monEOpt.xAxis[0].data[i++]).getTime();) { // 循环x轴
                            if (isOk) break; // 当前xTime瞄了点就不执行了
                            if (data.series[a].data[0].time >= xTime && data.series[a].data[0].time < new Date(vm.monEOpt.xAxis[0].data[i]).getTime()) { // 判断点的时间是否在这个区间轴上
                                var temp_ = i - 1;
                                while (true) { // 如果发现monChart上面的这个位置存在点了，就要往后面移动一位
                                    if (!vm.monEOpt.series[a].data[temp_]) {
                                        isOk = true;
                                        vm.monEOpt.series[a].data[temp_] = data.series[a].data[0]; // 找到合适的位置了就给series赋值
                                        break;
                                    } else {
                                        temp_++;
                                    }
                                }
                            }
                            if (data.series[a].data[0].time == new Date(vm.monEOpt.xAxis[0].data[i - 1]).getTime() && i == vm.monEOpt.xAxis[0].data.length) { // 保证最后一个轴可以瞄出点来
                                vm.monEOpt.series[a].data[i - 1] = data.series[a].data[0];
                            }
                        }
                        vm.monEOpt.series[a].symbol = 'path://' + data.series[a].symbolSvg; // 设置图片、图片颜色
                        vm.monEOpt.series[a].itemStyle = { normal: { color: data.series[a].color } };
                        if (data.series[a].data[0].symbol === '') { // 要清除data里面为空的symbol，要不让这个点的图片显示不出来
                            delete data.series[a].data[0].symbol;
                        }
                    }
                }
                getPupilData(vm, o.regOptId, o.inTime);
                _this.getNewMon(vm, o.regOptId, o.inTime);
            });
            startTime += result.freq * 1000; // 下一点的开始时间
            start_point(o.freq * 1000);
        }
        if (sideTime === 'paging') { // 翻页了，不是最后一页，下一个瞄点的时间-当前时间算出下一瞄点的时间
            var now_date = new Date().getTime();
            start_point(startTime - now_date);
            return;
        }
        if (vm.pageState === 0) { // 术中瞄点一般走这里
            start_point(sideTime);
        }

        function start_point(time) {
            if ($rootScope.timer_point) {
                _this.stopTimerPt();
            }
            $rootScope.timer_point = setTimeout(onLoad, time);
        }
    }

    _this.startTimerRt = function(regOptId) {
        start_rt();

        function rtData() {
            _this.rtData(o.regOptId, function(msg, list) {
                start_rt();
            });
        }

        function start_rt() {
            if (o.timer_rt)
                _this.stopTimerRt(o.timer_rt);
            o.timer_rt = setTimeout(rtData, 1000);
        }
    }

    _this.rtData = function(vm, regOptId) {
        anesRecordInter.rtData(regOptId, function(msg, list) {
            if (msg) {
                if (!o.toas)
                    o.toas = toastr.error('设备 [' + msg + '] 连接出错！');
                else
                    toastr.refreshTimer(o.toas);
            }
            vm.realTimeData = list;
            _this.start_rt(vm);
        });
    }

    _this.start_rt = function(vm) {
        if (o.timer_rt)
            _this.stopTimerRt(o.timer_rt);
        o.timer_rt = setTimeout(function() {
            _this.rtData(vm, o.regOptId);
        }, 1000);
    }

    _this.stopTimerRt = function() {
        clearTimeout(o.timer_rt);
    }

    _this.stopTimerPt = function() {
        clearTimeout($rootScope.timer_point);
    }

    _this.addPoint = function(vm, a, b) {
        if (!b.xAxisIndex) return;
        var curPoint = a.targetScope.option.series[b.seriesIndex].data[b.xAxisIndex];
        if (b.xAxisIndex == -1) {
            toastr.error(b.msg);
            return;
        } else if (curPoint && curPoint.value) {
            toastr.error('当前位置已经有数据存在，您可以手动拖点修改该值。');
            return;
        } else if (curPoint == '')
            return;
        curPoint.value = b.value + '';
        curPoint.symbol = b.symbol.replace('.png', '-2.png');
        anesRecordInter.updobsdat(curPoint, o.regOptId).then((rs) => {
            if (rs.data.resultCode != 1) return;
            _this.getobsData(vm, o.regOptId, o.docId, o.medChartRow, o.ev_list);
        })
    }

    _this.upEOption = function(vm, a, b, regOptId, docId, medChartRow, ev_list, pageSize) {
        var updFlow = false;
        var dir = a.targetScope.config.dir,
            series = a.targetScope.option.series[b[0]],
            data = series.data[b[1]],
            iconUrl = '';
        if (dir == 'x') {
            data = series.data[b[2]];
            if (data.symbol == 'rect' && data.symbolSize > 5)
                updFlow = true; //拖动的是流速、浓度的点
            var xAxis = a.targetScope.option.xAxis[0].data;
            var evId,
                type = data.evObj.type,
                subType = data.evObj.subType,
                originalTime = xAxis[b[1]].value,
                newTime = xAxis[b[2]].value,
                otherTime,
                params = {
                    canve: type,
                    key: type == 'zl' ? 'treatMedEvtList' : 'anaesMedEvtList',
                    param: {
                        docId: docId,
                        type: type == 'zl' ? '1' : '2'
                    },
                    url: 'searchMedicaleventGroupByCodeList'
                }
            if (type == 'zl' || type == 'mz')
                evId = data.evObj.medicalEvent.medEventId;
            else if (type == 'sy') {
                evId = data.evObj.evId;
                params.key = 'transfusioninIoeventList';
            } else if (type == 'sx') {
                evId = data.evObj.evId;
                params.key = 'bloodinIoeventList';
            } else if (type == 'cl') {
                evId = data.evObj.evId;
                params.key = 'outIoeventList';
            }
            if (data.evObj.durable) {
                if (Math.abs(xAxis[b[1]].value - data.evObj.startTime) < xAxis[b[1]].freq)
                    otherTime = data.evObj.endTime;
                else
                    otherTime = data.evObj.startTime;
            }
            if (!updFlow) {
                anesRecordInter.updateEventTime(docId, evId, type, subType, newTime, otherTime).then(function(rs) {
                    if (type == 'zl' || type == 'mz') {
                        eCharts.refMedicalChart(vm, params, type, medChartRow, ev_list, pageSize);
                    } else if (type == 'sy' || type == 'sx') {
                        var ioParams = {
                            docId: docId,
                            // subType: subType,
                            type: 'I'
                        }
                        eCharts.refIoEventChart(vm, ioParams, type, params.key, medChartRow, ev_list, pageSize);
                    } else if (type == 'cl') {
                        var ioParams = {
                            docId: docId,
                            type: 'O'
                        }
                        eCharts.refEgressEventChart(vm, ioParams, type, params.key, medChartRow, ev_list, pageSize);
                    }
                    _this.showRemark(vm, docId);
                });
            } else {
                var detailList = data.evObj.detailList,
                    medEventId,
                    id;
                if (newTime >= data.evObj.endTime || newTime <= data.evObj.startTime) {
                    toastr.error("修改的时间必须在" + dateFilter(new Date(data.evObj.startTime), 'yyyy-MM-dd HH:mm:ss') + " 至 " + dateFilter(new Date(data.evObj.endTime), 'yyyy-MM-dd HH:mm:ss') + "之间");
                    eCharts.refMedicalChart(vm, params, type, medChartRow, ev_list, pageSize);
                    return;
                }
                for (child of detailList) {
                    if (child.startTime == originalTime) {
                        id = child.id;
                        medEventId = child.medEventId;
                        flow = child.flow;
                        flowUnit = child.flowUnit;
                        showFlow = child.showFlow;
                        thickness = child.thickness;
                        thicknessUnit = child.thicknessUnit;
                        showThick = child.showThick;
                    }
                }
                anesRecordInter.saveMedicalEventDetail(id, docId, medEventId, flow, flowUnit, thickness, thicknessUnit, newTime, showFlow, showThick).then(function(rs) {
                    eCharts.refMedicalChart(vm, params, type, medChartRow, ev_list, pageSize);
                });
            }
        } else {
            if (series.name == 'mark')
                return;
            if (data.symbol)
                iconUrl = data.symbol;
            else
                iconUrl = series.symbol;
            if (iconUrl.indexOf('-2.png') < 0)
                data.symbol = iconUrl.replace('.png', '-2.png');
            data.observeName = series.name;
            // data.itemStyle = {
            //     normal: { color: '#ff0000' }
            // }
            anesRecordInter.updobsdat(data, regOptId);
        }
    }

    _this.deletePoint = function(vm, data) {
        confirm.show('名称：' + data.seriesName + ' ，值：' + data.value, '是否确定删除？').then((rs) => {
            data.data.value = '';
            anesRecordInter.updobsdat(data.data, o.regOptId).then((rs) => {
                if (rs.data.resultCode != 1) return;
                _this.getobsData(vm, o.regOptId, o.docId, o.medChartRow, o.ev_list);
            });
        });
    }

    function getPupilData(vm, regOptId, inTime) { // 瞳孔数据
        anesRecordInter.getPupilData(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, function(list) {
            vm.pupilDataList = list;
        });
    }

    _this.getNewMon = function(vm, regOptId, inTime) {
        anesRecordInter.getNewMon(regOptId, inTime, vm.view.pageSize, vm.view.pageCur).then(function(result) {
            vm.monDataList = result.data.monDataList;
        });
    }

    _this.getNewMonPrint = function(vm, regOptId, docId, inTime) {
        anesRecordInter.getNewMon(regOptId, inTime, vm.view.pageSize, vm.view.pageCur).then(function(result) {
            vm.monDataList = result.data.monDataList;
            o.PAGES.push({
                medEOpt: angular.copy(vm.medEOpt),
                monEOpt: angular.copy(vm.monEOpt),
                markEOpt: angular.copy(vm.markEOpt),
                pupilDataList: angular.copy(vm.pupilDataList),
                pageCur: vm.view.pageCur,
                monDataList: angular.copy(vm.monDataList),
                xTits: angular.copy(vm.xTits),
                backList: angular.copy(vm.backList)
            });
            if (vm.view.pageCur !== vm.view.pageCount) {
                vm.view.pageCur++;
                _this.getobsDataPrint(vm, regOptId, docId, o.medChartRow, o.ev_list);
            } else {
                vm.PAGES = o.PAGES;
            }
        });
    }

    _this.checkInput = function(event, startOper) {
        if (event && !event.mzks) {
            return '麻醉开始时间不能为空';
        } else if (event && !event.ssks) {
            return '手术开始时间不能为空';
        } else if (event && !event.ssjs) {
            return '手术结束时间不能为空';
        } else if (!startOper.anaesRecord.leaveTo) {
            return '出室去向不能为空';
        } else if (!startOper.anaesRecord.asaLevel) {
            return '请选择ASA分级';
        } else if (!startOper.anaesRecord.anaesLevel && user.beCode == 'qnzrmyy') {
            return '请选择麻醉分类';
        } else if ((user.beCode == 'hbgzb' || user.beCode == 'sybx') && !startOper.regOpt.frontOperForbidTake) {
            return '请选择术前禁食';
        } else if (!startOper.anaesRecord.optBodys || startOper.anaesRecord.optBodys.length == 0) {
            return '请选择手术体位';
        } else if (!startOper.realAnaesList || startOper.realAnaesList.length == 0) {
            return '麻醉方法不能为空';
        } else if (!startOper.optRealOperList || startOper.optRealOperList.length == 0) {
            return '实施手术不能为空';
        } else if ((user.beCode == 'syzxyy' || user.beCode == 'llzyyy' || user.beCode == 'cshtyy' || user.beCode == 'qnzzyyy') && (!startOper.optLatterDiagList || startOper.optLatterDiagList.length == 0)) {
            return '术后诊断不能为空';
        } else if (!startOper.anesDocList || startOper.anesDocList.length == 0) {
            return '麻醉医生不能为空';
        } else if (!startOper.operatDocList || startOper.operatDocList.length == 0) {
            return;
            '手术医生不能为空'
        } else if (!startOper.nurseList || startOper.nurseList.length == 0) {
            return '巡回护士不能为空';
        } else {
            return false;
        }
    }

    _this.getArray = function(index) {
        var array = [];
        for (var i = 0; i < index; i++) {
            array[i] = i;
        }
        return array;
    }

    _this.dateFormat = function(list) {
        list.forEach(function(item) {
            if (typeof item.occurTime == 'number')
                item.strTime = $filter('date')(item.occurTime, 'HH:mm');
        })
        return list
    }

    _this.showRemark = function(vm, docId, print) {
        var tempTime = vm.tempTime;
        var lastPage = vm.view.pageCur == vm.view.pageCount ? true : false;
        anesRecordInter.searchAllEventList(function(list) {
            vm.backList = list;
            var checkEventList = [],
                index = 0;
            for (var item of list) {
                if (item.name == '呼吸事件') {
                    list.splice(index, 1);
                } else if (item.eventName == 'checkeventList') {
                    checkEventList.push(item);
                }
                index += 1;
            }
            eCharts.initCheckEvent(vm.monEOpt, checkEventList, print);
            if (print) {
                _this.getNewMonPrint(vm, o.regOptId, o.docId, o.inTime);
            }
        }, {
            docId: o.docId,
            bloodNum: 0,
            infusionNum: 6,
            medEventNum: 11,
            egressNum: 3,
            anaesMedNum: 0,
            anaesEvtNum: 9,
            startTime: tempTime[0].value,
            endTime: tempTime[tempTime.length - 1].value,
            lastPage: lastPage
        });

        anesRecordInter.searchIOAmoutDetail(docId).then(function(rs) {
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

    function anaesOperTimePrint(vm, docId) {
        anesRecordInter.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.anaesTime) vm.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) vm.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
            totleIoEventPrint(vm, docId);
        });
    }

    function totleIoEventPrint(vm, docId) {
        anesRecordInter.totleIoEvent(docId).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.blood) vm.view.blood = result.data.blood + 'ml';
            if (result.data.egress) vm.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) vm.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) vm.view.ioevent = result.data.ioevent + 'ml';
            _this.showRemark(vm, docId, true);
        });
    }

    _this.ArrToStr = function(list, filed) {
        var res = [];
        for (var a = 0; a < list.length; a++) {
            res.push(list[a].name);
        }
        return res.join('、');
    }
}
