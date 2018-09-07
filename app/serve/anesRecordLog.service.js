module.exports = anesRecordServe;

anesRecordServe.$inject = ['$rootScope', 'auth', '$filter', 'anesRecordInter', 'eCharts', 'confirm', 'toastr', 'select'];

function anesRecordServe($rootScope, auth, $filter, anesRecordInter, eCharts, confirm, toastr, select) {
    let _this = this,
        user = auth.loginUser(),
        o = {
            regOptId: undefined,
            docId: undefined,
            inTime: undefined,
            index: 0,
            ev_list: [],
            freq: 0,
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
    _this.initDataPacu = function(data) {
        data.regOpt.emergency = data.regOpt.emergency + '';
        data.regOpt.frontOperForbidTake = data.regOpt.frontOperForbidTake + '';
        data.pacueventList = _this.dateFormat(data.pacueventList)
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
    _this.createOrUpdateTimeArr49 = function(vm, result, data) { //创建或者更新timearr49 进入手术 修改间隔 修改模式的时候更新
        var dataArr = [];
        if (data) { //采集点的时候更新
            if (!data.freq) { //这里是数据异常状态
                return;
            }
            var resultarr = angular.copy(result.xAxis[0].data);
            var Freq = data.freq;
        } else {
            var resultarr = angular.copy(result.data.xAxis[0].data);
            var Freq = result.data.freq ? result.data.freq : resultarr[resultarr.length - 1].freq;
        }
        if (vm.rescueevent && vm.rescueevent.length > 0 && vm.rescueevent[vm.rescueevent.length - 1].model == "save") { //抢救模式
            Freq = 30;
        }

        for (var i = 0; i < 49; i++) {
            if (resultarr[i]) {
                var tmp = [resultarr[i].value / 1000, '', resultarr[i].freq, { formatTime: $filter('date')(resultarr[i].value, 'HH:mm') }];
                dataArr.push(tmp);
            } else {
                var tmp = [dataArr[i - 1][0] + dataArr[i - 1][2], '', Freq, { formatTime: $filter('date')((dataArr[i - 1][0] + dataArr[i - 1][2]) * 1000, 'HH:mm') }];
                dataArr.push(tmp);
            }
        }
        if (!vm.timeArr49) {
            vm.timeArr49 = [];
        }
        if (vm.view.pageCur === 0) { // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
            vm.view.pageCur = vm.view.pageCount;
            vm.timeArr49[vm.view.pageCount] = dataArr; //原始X轴节点   
        }
        vm.timeArr49[vm.view.pageCur] = dataArr; //原始X轴节点
        if (vm.view.pageCur == 1 || (vm.view.pageCount == 1 && vm.view.pageCur == 0)) { //第一页第一个点特殊处理
            var old = angular.copy(vm.timeArr49[vm.view.pageCur][0]);
            var x = vm.startOper.anaeseventList[0].occurTime / 1000;
            vm.timeArr49[vm.view.pageCur][0] = [x, '', old[0] - x + old[2], { formatTime: $filter('date')(x * 1000, 'HH:mm') }];
        }
    }
    _this.createOrUpdateTimeArr49Pacu = function(vm, result, data) { //创建或者更新timearr49 进入手术 修改间隔 修改模式的时候更新
        var dataArr = [];
        if (data) { //采集点的时候更新
            if (!data.freq) { //这里是数据异常状态
                return;
            }
            var resultarr = angular.copy(result.xAxis[0].data);
            var Freq = data.freq;
        } else {
            var resultarr = angular.copy(result.data.xAxis[0].data);
            var Freq = result.data.freq ? result.data.freq : resultarr[resultarr.length - 1].freq;
        }
        if (vm.rescueevent && vm.rescueevent.length > 0 && vm.rescueevent[vm.rescueevent.length - 1].model == "save") { //抢救模式
            Freq = 30;
        }

        for (var i = 0; i < 49; i++) {
            if (resultarr[i]) {
                var tmp = [resultarr[i].value / 1000, '', resultarr[i].freq, { formatTime: $filter('date')(resultarr[i].value, 'HH:mm') }];
                dataArr.push(tmp);
            } else {
                var tmp = [dataArr[i - 1][0] + dataArr[i - 1][2], '', Freq, { formatTime: $filter('date')((dataArr[i - 1][0] + dataArr[i - 1][2]) * 1000, 'HH:mm') }];
                dataArr.push(tmp);
            }
        }
        if (!vm.timeArr49) {
            vm.timeArr49 = [];
        }
        if (vm.view.pageCur === 0) { // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
            vm.view.pageCur = vm.view.pageCount;
            vm.timeArr49[vm.view.pageCount] = dataArr; //原始X轴节点   
        }
        vm.timeArr49[vm.view.pageCur] = dataArr; //原始X轴节点
        if (vm.view.pageCur == 1 || (vm.view.pageCount == 1 && vm.view.pageCur == 0)) { //第一页第一个点特殊处理
            var old = angular.copy(vm.timeArr49[vm.view.pageCur][0]);
            // var x = vm.startOper.anaeseventList[0].occurTime / 1000;
            var arry = $filter('filter')(vm.startOper.pacueventList, function(item) {
                return item.codeName === '入PACU时间';
            });
            if (arry.length > 0)
                var x = arry[0].occurTime;
            vm.timeArr49[vm.view.pageCur][0] = [x, '', old[0] - x + old[2], { formatTime: $filter('date')(x * 1000, 'HH:mm') }];
        }
    }
    _this.getobsData = function(vm, regOptId, docId, ev_list) { // 获取历史点
        o.regOptId = regOptId;
        o.docId = docId;
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
            // var x1 = new Date(parseInt(1522646259) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // var height = 58; //第一个 serious高度
            o.freq = result.data.freq;
            vm.view.pageCount = result.data.total <= vm.view.pageSize ? 1 : Math.ceil((result.data.total - 1) / (vm.view.pageSize - 1)); // 计算总页数
            _this.createOrUpdateTimeArr49(vm, result);
            if ((vm.pageState !== 0 || vm.operState !== '04') && (vm.pageState !== 3 || vm.operState !== '05')) { // 如果不是在术中或者手术已经结束就不要瞄点啦，只需要获取历史点数据
                getIntervalObsData(vm, -1, result.data);
                return;
            }
            // 代码能到这里说明它在术中且手术正在执行

            if (vm.view.pageCur !== vm.view.pageCount) { // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
                getIntervalObsData(vm, 'paging', result.data, true);
                return;
            }
            var t, hisTimes = [],
                times_ = new Date().getTime();
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
                select.log(o.regOptId, 'getIntervalObsData', { times_: times_, hisTimes: hisTimes, t: t, o: o, pageCur: vm.view.pageCur, pageSize: vm.view.pageSize, inTime: o.inTime })
                anesRecordInter.getIntervalObsData(o.regOptId, hisTimes, o.freq, vm.view.pageCur, vm.view.pageSize, o.inTime, 2).then(function(res) {
                    res.data.offset = result.data.offset; // getIntervalObsData这个接口没有offset与changeFreqTime;
                    res.data.changeFreqTime = result.data.changeFreqTime;
                    getIntervalObsData(vm, t - times_, res.data);
                });
            } else {
                getIntervalObsData(vm, t - times_, result.data);
            }
            _this.getNewMon(vm, o.regOptId, o.inTime);
        });
    }
    _this.getobsDataPacu = function(vm, regOptId, docId, ev_list, docType) { // 获取历史点
        o.regOptId = regOptId;
        o.docId = docId;
        o.ev_list = ev_list;
        o.inTime = $filter('filter')(vm.startOper.pacueventList, function(item) {
            return item.codeName === '入PACU时间';
        })[0].occurTime; // 实时更新入室时间
        vm.inTime = $filter('date')(o.inTime, 'yyyy-MM-dd HH:mm');
        vm.view.pageDone = false; // 控制上一页下一页按钮不可以
        _this.stopTimerPt();
        anesRecordInter.getObsData(regOptId, vm.view.pageCur, vm.view.pageSize, o.inTime, docType).then(function(result) {
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
            // var x1 = new Date(parseInt(1522646259) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // var height = 58; //第一个 serious高度
            o.freq = result.data.freq;
            vm.view.pageCount = result.data.total <= vm.view.pageSize ? 1 : Math.ceil((result.data.total - 1) / (vm.view.pageSize - 1)); // 计算总页数
            _this.createOrUpdateTimeArr49Pacu(vm, result);
            if ((vm.pageState !== 0 || vm.operState !== '04') && (vm.pageState !== 3 || vm.operState !== '05')) { // 如果不是在术中或者手术已经结束就不要瞄点啦，只需要获取历史点数据
                getIntervalObsDataPacu(vm, -1, result.data);
                return;
            }
            // 代码能到这里说明它在术中且手术正在执行

            if (vm.view.pageCur !== vm.view.pageCount) { // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
                getIntervalObsDataPacu(vm, 'paging', result.data, true);
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
                anesRecordInter.getIntervalObsData(o.regOptId, hisTimes, o.freq, vm.view.pageCur, vm.view.pageSize, o.inTime, 2).then(function(res) {
                    res.data.offset = result.data.offset; // getIntervalObsDataPacu这个接口没有offset与changeFreqTime;
                    res.data.changeFreqTime = result.data.changeFreqTime;
                    getIntervalObsDataPacu(vm, t - times_, res.data);
                });
            } else {
                getIntervalObsDataPacu(vm, t - times_, result.data);
            }
            _this.getNewMon(vm, o.regOptId, o.inTime);
        });
    }

    _this.getobsDataPrint = function(vm, regOptId, docId, ev_list, docType) {
        o.regOptId = regOptId;
        o.docId = docId;
        o.ev_list = ev_list;
        o.inTime = $filter('filter')(vm.startOper.anaeseventList, function(item) {
            return vm.pageState == 3 || vm.pageState == 4 ? item.code === '入PACU时间' : item.code === 1;
        })[0].occurTime;
        anesRecordInter.getObsData(regOptId, vm.view.pageCur, vm.view.pageSize, o.inTime, docType).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.view.pageCount = result.data.total <= vm.view.pageSize ? 1 : Math.ceil((result.data.total - 1) / (vm.view.pageSize - 1));
            // var callData = eCharts.getXAxis(result.data, vm);
            // vm.xTits = angular.copy(callData.xTits);
            _this.createOrUpdateTimeArr49(vm, result);

            vm.monEOpt1.series = eCharts.getSeries1(result.data, vm);
            // vm.markEOpt.xAxis[0].data = angular.copy(callData.resultList);
            // vm.markEOpt.series = eCharts.getMarkSeries(vm.markEOpt);

            eCharts.initEvConfig(o.ev_list, vm, true);
            // eCharts.initSign(vm.markEOpt, vm.startOper, vm.view.pageSize, true);
            eCharts.initSign1(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm);
            getPupilData(vm, regOptId, o.inTime);
            anaesOperTimePrint(vm, o.docId);
        });
    }

    function getIntervalObsData(vm, sideTime, result, onlySave) { // 补点
        vm.oldResult = result;
        vm.monEOpt1.series = eCharts.getSeries1(result, vm);
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
        eCharts.initEvConfig(o.ev_list, vm, false);
        getPupilData(vm, o.regOptId, o.inTime);
        eCharts.initSign1(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm);
        _this.getNewMon(vm, o.regOptId, o.inTime);

        vm.view.pageDone = true;
        if (sideTime < 0) return;
        if (vm.operState == '04')
            _this.start_rt(vm); // 实时监测数据
        var startTime = result.md.time + result.md.intervalTime * 1000; // 计算下一个瞄点时间
        var onLoad = function() { // 瞄新点方法
            anesRecordInter.getObsDataNew(o.regOptId, o.inTime, startTime).then(function(data) {
                data = data.data;
                _this.createOrUpdateTimeArr49(vm, result, data); //
                
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
                    vm.view.pageCount++;
                    _this.createOrUpdateTimeArr49(vm, result, data);
                    select.log(o.regOptId, 'getObsDataNew', { times_: new Date().getTime(), o: o, pageCur: vm.view.pageCur, pageSize: vm.view.pageSize, total: data.total })
                    _this.getobsData(vm, o.regOptId, o.docId, o.ev_list);
                } else {
                    var len = data.series.length;
                    for (var a = 0; a < len; a++) { // 循环series
                        vm.oldResult.series[a].data.push(data.series[a].data[0])
                    }
                    vm.monEOpt1.series = eCharts.getSeries1(vm.oldResult, vm);
                }
                _this.showRemark(vm, o.docId);
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
        if (vm.pageState === 0 || vm.pageState === 3) { // 术中瞄点一般走这里
            start_point(sideTime);
        }

        function start_point(time) {
            if ($rootScope.timer_point) {
                _this.stopTimerPt();
            }
            $rootScope.timer_point = setTimeout(onLoad, time);
        }
    }

    function getIntervalObsDataPacu(vm, sideTime, result, onlySave) { // 补点
        vm.oldResult = result;
        vm.monEOpt1.series = eCharts.getSeries1(result, vm);
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
        eCharts.initEvConfig(o.ev_list, vm, false);
        getPupilData(vm, o.regOptId, o.inTime);
        eCharts.initSignPacu(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm);
        _this.getNewMon(vm, o.regOptId, o.inTime);

        vm.view.pageDone = true;
        if (sideTime < 0) return;
        if (vm.operState == '04')
            _this.start_rt(vm); // 实时监测数据
        var startTime = result.md.time + result.md.intervalTime * 1000; // 计算下一个瞄点时间
        var onLoad = function() { // 瞄新点方法
            anesRecordInter.getObsDataNew(o.regOptId, o.inTime, startTime, 2).then(function(data) {
                data = data.data;
                _this.createOrUpdateTimeArr49Pacu(vm, result, data); //
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
                    _this.getobsData(vm, o.regOptId, o.docId, o.ev_list);
                } else {
                    var len = data.series.length;
                    for (var a = 0; a < len; a++) { // 循环series
                        vm.oldResult.series[a].data.push(data.series[a].data[0])
                    }
                    vm.monEOpt1.series = eCharts.getSeries1(vm.oldResult, vm);
                }
                _this.showRemarkPlus(vm, o.docId);
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
        if (vm.pageState === 0 || vm.pageState === 3) { // 术中瞄点一般走这里
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

    _this.rtData = function(vm, regOptId) { //
        if (!vm)
            return;
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

    _this.start_rt = function(vm) { //
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

    _this.addPoint = function(vm, b) {
        anesRecordInter.updobsdat(b, o.regOptId).then((rs) => {
            if (rs.data.resultCode != 1) return;
            _this.getobsData(vm, o.regOptId, o.docId, o.ev_list);
        })
    }
    _this.upEOption1 = function(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, pageSize) {
        var evId;
        var data = transdata[dataIndex];
        if (config.dir == 'x') {
            //x移动
            var ev_listPlus = transdata[dataIndex].ev_list;
            var otherTime;
            var newTime = eCharts.translateTimeValue(data.value[0], vm.timeArr49[vm.view.pageCur]) * 1000;
            if (ev_listPlus.endTime) { //一般的起点
                otherTime = ev_listPlus.endTime;
            }
            if (ev_listPlus.dosage != undefined && ev_listPlus.showFlow == undefined && ev_listPlus.showThick == undefined) { //修改终点 结束点
                var otherTime = eCharts.translateTimeValue(data.value[0], vm.timeArr49[vm.view.pageCur]) * 1000;
                newTime = ev_listPlus.startTime;
            }
            if ((ev_listPlus.subType == 1 && ev_listPlus.type == 'sy') || (ev_listPlus.subType == 2 && ev_listPlus.type == 'sx')) {
                if (ev_listPlus.endPoint) { //本溪输液输血的结束点
                    newTime = ev_listPlus.startTime;
                    var otherTime = eCharts.translateTimeValue(data.value[0], vm.timeArr49[vm.view.pageCur]) * 1000;
                } else { //本溪输液输血的起点
                    newTime = eCharts.translateTimeValue(data.value[0], vm.timeArr49[vm.view.pageCur]) * 1000;
                    var otherTime = ev_listPlus.endTime;
                }
            }
            var type = ev_listPlus.type;
            var subType = ev_listPlus.subType;
            // var params = {
            //     canve: type,
            //     key: type == 'zl' ? 'treatMedEvtList' : 'anaesMedEvtList',
            //     param: {
            //         docId: docId,
            //         type: type == 'zl' ? '1' : '2'
            //     },
            //     url: 'searchMedicaleventGroupByCodeList'
            // }
            if (ev_listPlus.type == 'zl' || ev_listPlus.type == 'mz') {
                evId = ev_listPlus.medEventId;
            } else if (ev_listPlus.type == 'sy') {
                evId = ev_listPlus.inEventId;
                // params.key = 'transfusioninIoeventList';
            } else if (ev_listPlus.type == 'sx') {
                evId = ev_listPlus.evId || ev_listPlus.inEventId;
                // params.key = 'bloodinIoeventList';
            } else if (ev_listPlus.type == 'cl') {
                evId = ev_listPlus.egressId;
                // params.key = 'outIoeventList';
            }
            if (!(ev_listPlus.showFlow != undefined && ev_listPlus.showThick != undefined && ev_listPlus.dosage == undefined)) { //所有非流速点
                anesRecordInter.updateEventTime(docId, evId, type, subType, newTime, otherTime).then(function(rs) {
                    // if (type == 'zl' || type == 'mz') {
                    //     eCharts.refMedicalChart(vm, params, type, ev_list, pageSize);
                    // } else if (type == 'sy' || type == 'sx') {

                    //     var ioParams = {
                    //         docId: docId,
                    //         subType: subType,
                    //         type: 'I'
                    //     }

                    //     eCharts.refIoEventChart(vm, ioParams, type, params.key, subType, pageSize);
                    // } else if (type == 'cl') {

                    //     var ioParams = {
                    //         docId: docId,
                    //         type: 'O'
                    //     }
                    //     eCharts.refEgressEventChart(vm, ioParams, type, params.key, subType, pageSize);
                    // }
                    _this.showRemark(vm, docId);
                });
            } else if (ev_listPlus.showFlow != undefined && ev_listPlus.showThick != undefined && ev_listPlus.dosage == undefined) { //持续浓度流速点
                var type = ev_listPlus.type;
                var params = {
                    canve: type,
                    key: type == 'zl' ? 'treatMedEvtList' : 'anaesMedEvtList',
                    param: {
                        docId: docId,
                        type: 1
                    },
                    url: 'searchMedicaleventGroupByCodeList'
                };
                var newTime = eCharts.translateTimeValue(data.value[0], vm.timeArr49[vm.view.pageCur]) * 1000;
                //拖浓度流速点
                anesRecordInter.saveMedicalEventDetail(ev_listPlus.id, docId, evId, ev_listPlus.flow, ev_listPlus.flowUnit, ev_listPlus.thickness, ev_listPlus.thicknessUnit, newTime, ev_listPlus.showFlow, ev_listPlus.showThick).then(function(rs) {
                    anesRecordInter.searchAllEventListPlus("", { docId: docId, anaesMedNum: 0, medEventNum: 0, infusionNum: 0, egressNum: 0, bloodNum: 0 }).then(function(rs) {
                        rs.data.treatMedEvtList = rs.data.medicalevent;
                        rs.data.inIoeventList = rs.data.infusionList;
                        rs.data.egressList = rs.data.egress;
                        vm.rescueevent = rs.data.rescueevent;
                        eCharts.refChart(vm, rs.data)
                    })
                });
            }
        } else {
            //标记不更新
            if (entitydata.series.name == 'mark')
                return;
            //监测项修改
            var data = angular.copy(angular.merge({}, entitydata.series, transdata[dataIndex]));
            data.value = data.value[1];
            if (data.name != 'TEMP')
                data.value = Math.round(data.value)
            anesRecordInter.updobsdat(data, regOptId).then((rs) => {
                if (rs.data.resultCode != 1) return;
                _this.getobsData(vm, regOptId, docId, ev_list);
            });
        }
    }

    _this.deletePoint1 = function(vm, data) {
        confirm.show('名称：' + data.seriesName + ' ，值：' + data.value[1].toFixed(2), '是否确定删除？').then((rs) => {
            data.value = '';
            anesRecordInter.updobsdat(data, o.regOptId).then((rs) => {
                if (rs.data.resultCode != 1) return;
                _this.getobsData(vm, o.regOptId, o.docId, o.ev_list);
            });
        });
    }

    function getPupilData(vm, regOptId, inTime) { // 瞳孔数据
        anesRecordInter.getPupilData(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, function(list) {
            vm.pupilDataList = list;
        });
    }

    _this.getNewMon = function(vm, regOptId, inTime, docType) { //监测数据赋值
        anesRecordInter.getNewMon(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, docType).then(function(result) {
            vm.monDataList = result.data.monDataList;
            // var flag = $filter('filter')(vm.monDataList[0].monitorDataList, function(v) {
            //     return v.observeName == "ECG";
            // });
            // if (flag) {
            //     for (var i = 0; i < vm.monDataList.length; i++) {
            //         debugger;
            //         var copy=vm.monDataList[i].monitorDataList.pop();
            //         var copyO2=vm.monDataList[i].monitorDataList.shift();
            //         vm.monDataList[i].monitorDataList.unshift(copy);
            //         vm.monDataList[i].monitorDataList.unshift(copyO2);
            //     }
            // }
        });
    }

    _this.getNewMonPrint = function(vm, regOptId, docId, inTime, docType) {
        anesRecordInter.getNewMon(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, docType).then(function(result) {
            vm.monDataList = result.data.monDataList;
            o.PAGES.push({
                view: angular.copy(vm.view),
                timeArr49: angular.copy(vm.timeArr49),
                // medEOpt: angular.copy(vm.medEOpt),
                monEOpt1: angular.copy(vm.monEOpt1),
                medEOpt1: angular.copy(vm.medEOpt1),
                // monEOpt: angular.copy(vm.monEOpt),
                // markEOpt: angular.copy(vm.markEOpt),
                markEOpt1: angular.copy(vm.markEOpt1),
                pupilDataList: angular.copy(vm.pupilDataList),
                pageCur: vm.view.pageCur,
                monDataList: angular.copy(vm.monDataList),
                // xTits: angular.copy(vm.xTits),
                backList: angular.copy(vm.backList)
            });
            if (user.beCode != 'sybx') {
                if (vm.view.pageCur !== vm.view.pageCount) {
                    vm.view.pageCur++;
                    _this.getobsDataPrint(vm, regOptId, docId, o.ev_list, docType);
                } else {
                    vm.PAGES = o.PAGES;
                }
            }

        });
    }

    _this.checkInput = function(event, startOper, docType) {
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
        } else if (!startOper.anaesRecord.anaesEffect && user.beCode == 'qnzzyyy') {
            return '请选择麻醉效果';
        } else if ((user.beCode == 'hbgzb' || user.beCode == 'sybx') && !startOper.regOpt.frontOperForbidTake) {
            return '请选择术前禁食';
        } else if (!startOper.anaesRecord.optBodys || startOper.anaesRecord.optBodys.length == 0) {
            return '请选择手术体位';
        } else if (!startOper.realAnaesList || startOper.realAnaesList.length == 0) {
            return '麻醉方法不能为空';
        } else if (!startOper.optRealOperList || startOper.optRealOperList.length == 0) {
            return '实施手术不能为空';
        } else if ((user.beCode == 'syzxyy' || user.beCode == 'cshtyy'|| user.beCode == 'llzyyy' || user.beCode == 'base' || user.beCode == 'qnzzyyy') && (!startOper.optLatterDiagList || startOper.optLatterDiagList.length == 0)) {
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
        angular.forEach(list, function(item) {
            if (typeof item.occurTime == 'number')
                item.strTime = $filter('date')(item.occurTime, 'HH:mm');
        })
        return list;
    }

    _this.showRemark = function(vm, docId, print) { //显示备注栏
        var lastPage = vm.view.pageCur == vm.view.pageCount ? true : false;
        anesRecordInter.searchAllEventListPlus("", { docId: docId, anaesMedNum: 0, medEventNum: 0, infusionNum: 0, egressNum: 0, bloodNum: 0 }).then(function(rs) {
            rs.data.treatMedEvtList = rs.data.medicalevent;
            rs.data.inIoeventList = rs.data.infusionList;
            rs.data.egressList = rs.data.egress;
            vm.rescueevent = rs.data.rescueevent;
            eCharts.refChart(vm, rs.data)
        })
        anesRecordInter.searchAllEventList(function(list) {//备注信息
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
            eCharts.initCheckEventPlus(vm.monEOpt1, checkEventList, print, vm);
            if (print) {
                _this.getNewMonPrint(vm, o.regOptId, o.docId, o.inTime);
            }
        }, {
            docId: docId,
            bloodNum: 0,
            infusionNum: vm.medECfg.syConfig + vm.medECfg.sxConfig,
            medEventNum: vm.medECfg.zlConfig,
            egressNum: vm.medECfg.clConfig,
            anaesMedNum: vm.medECfg.mzConfig,
            anaesEvtNum: 9,
            startTime: vm.timeArr49 ? vm.timeArr49[vm.view.pageCur][0][0] * 1000 : '',
            endTime: vm.timeArr49 ? vm.timeArr49[vm.view.pageCur][48][0] * 1000 : '',
            lastPage: lastPage
        });

        anesRecordInter.searchIOAmoutDetail(docId).then(function(rs) { //备注栏总量
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
    _this.showRemarkPlus = function(vm, docId, print) { //显示备注栏
        var lastPage = vm.view.pageCur == vm.view.pageCount ? true : false;
        anesRecordInter.searchAllEventListPlus("", { docId: docId, anaesMedNum: 0, medEventNum: 0, infusionNum: 0, egressNum: 0, docType: 2 }).then(function(rs) {
            rs.data.treatMedEvtList = rs.data.medicalevent;
            rs.data.inIoeventList = rs.data.infusionList;
            rs.data.egressList = rs.data.egress;
            vm.rescueevent = rs.data.rescueevent;
            eCharts.refChart(vm, rs.data)
        })
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
            eCharts.initCheckEventPlus(vm.monEOpt1, checkEventList, print, vm);
            if (print) {
                _this.getNewMonPrint(vm, o.regOptId, o.docId, o.inTime);
            }
        }, {
            docId: o.docId,
            bloodNum: 0,
            infusionNum: vm.medECfg.syConfig + vm.medECfg.sxConfig,
            medEventNum: vm.medECfg.zlConfig,
            egressNum: vm.medECfg.clConfig,
            anaesMedNum: vm.medECfg.mzConfig,
            anaesEvtNum: 9,
            startTime: vm.timeArr49[vm.view.pageCur][0][0] * 1000,
            endTime: vm.timeArr49[vm.view.pageCur][48][0] * 1000,
            lastPage: lastPage
        });

        anesRecordInter.searchIOAmoutDetail(docId).then(function(rs) { //备注栏总量
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
    _this.medicineEchartCallbackList = function() {
        return {};
    }
}