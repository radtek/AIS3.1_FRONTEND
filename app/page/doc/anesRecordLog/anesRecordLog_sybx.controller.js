AnesRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'baseConfig', 'anesRecordInter', 'anesRecordServe', 'eCharts', 'anesRecordServe_sybx', 'auth', '$filter', '$q', '$timeout', 'toastr', '$uibModal', 'select', 'confirm'];

module.exports = AnesRecordLogCtrl;

function AnesRecordLogCtrl($rootScope, $scope, IHttp, baseConfig, anesRecordInter, anesRecordServe, eCharts, anesRecordServe_sybx, auth, $filter, $q, $timeout, toastr, $uibModal, select, confirm) {
    // 获取文书的标题
    let vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        docId,
        inTime, // 入室时间
        index, // 记录瞄点索引
        ev_list = [], // 用药、输液、输血数据保存
        freq, // 采集频率
        eChartCol = 8,
        historyData = [],
        toas, // 控制只显示一个toast
        operState, // 手术状态
        timer_rt, // 实时监控定时器
        pageSize = 49, // 一页显示条数
        eChartRow1 = 22, // eChart1 的 行数
        eChartRow2 = 29, // eChart2 的 行数
        summary, // 麻醉总结
        oldValue;
        
    let pageName = $rootScope.$state.current.name;
    vm.docInfo = auth.loginUser();
    vm.docUrl = auth.loginUser().titlePath;
    vm.setting = angular.copy($rootScope.$state.current.data);
    vm.regOptId = regOptId;
    let bConfig = baseConfig.getOther(); //其它配置
    vm.mongArrs = anesRecordServe.getArray(bConfig.mongRows);
    vm.mongRows = bConfig.mongRows;
    vm.medSet = baseConfig.getMed();
    vm.monOpt = {
        mmhg: ['mmHg', '220', '', '200', '', '180', '', '160', '', '140', '', '120', '', '100', '', '80', '', '60', '', '40', '', '20', '', '0'],
        c: ['', '℃', '', '38', '', '36', '', '34', '', '32', '', '30', '', '28', '', '26', '', '24', '', '22', '', '20'],
        kpa: ['', 'KPa', '28', '', '', '24', '', '', '20', '', '', '16', '', '', '12', '', '', '8', '', '', '4']
    };

    $scope.disabledOutBtn = false;
    $scope.lineH = 28;

    if (document.body.clientWidth < 1250) {
        $scope.lineH = 22;
        $('.echarts').width(543);
    }else {
        if (pageName === 'anesRecordPage_sybx') {
            $('.echarts').width(document.body.clientWidth - ($("#aside").width() + $("#timeTd").width() + $("#summaryTd").width() + 50));
        }else {
            $('.echarts').width(document.body.clientWidth - ($("#aside").width() + $("#timeTd").width() + $("#summaryTd").width() + 50) - 210);
        }
    }
    vm.view = { // 同步界面的数据
        pageCur: 0, // 当前页数
        pageCount: 1, // 总页数
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false, // 控制数据视图是否显示
        pageSize: 49 // 默认一页大小 49
    };
    vm.pageState = vm.setting.pageState;
    if (vm.pageState == 2)
        vm.view.pageCur = 1;

    $scope.regOptId = regOptId;
    vm.tempTime = []; // 缓存x轴数据

    // $timeout.cancel(timer_point);
    // $timeout.cancel(timer_rt);
    vm.monDataList = [];

    if (vm.docInfo.beCode === 'sybx') {
        vm.optLevelList = ['1', '2', '3', '4'];
    } else {
        vm.optLevelList = ['一级', '二级', '三级', '四级'];
    }
    $scope.$on('$stateChangeStart', function() { // 监听路由跳转，关闭定时器
        //     $timeout.cancel(timer_point);
        $timeout.cancel(timer_rt);
    });

    anesRecordServe_sybx.asaLevel.then(function(result) { // asa下拉选项值
        $scope.asaLevel = result.data.resultList;
    });
    anesRecordServe_sybx.optBody.then(function(result) { // 手术体位下拉选项值
        $scope.optBody = result.data.resultList;
    });
    anesRecordServe_sybx.leaveTo.then(function(result) { // 出室去向下拉选项值
        $scope.leaveTo = result.data.resultList;
    });

    $scope.setOprmAnaesDocHeight = function(event) {
        if (document.body.clientWidth < 1250) {
            if ($scope.startOper.anesDocList.length > 1) {
                $('#secondDiv').height(56);
                $('#oprmAnaesDoc').height(52);
            } else if ($scope.startOper.anesDocList.length == 1) {
                $('#secondDiv').height(28);
                $('#oprmAnaesDoc').height(26);
            }
        }
    }
    $scope.eConfig2 = anesRecordServe_sybx.eChart2.config(function(data) { // 单击瞄点，修改瞄点值
        if (vm.pageState == 1)
            return;
        // 删除点
        confirm.show('名称：' + data.seriesName + ' ，值：' + data.value, '是否确定删除？').then((rs) => {
            data.data.value = '';
            anesRecordServe_sybx.updobsdat(data.data, regOptId).then((rs) => {
                if (rs.data.resultCode != 1) {
                    toastr.error(rs.data.resultMessage);
                    return;
                }
                getobsData();
            })
        })
    }, vm.pageState);

    $scope.eOption2 = anesRecordServe_sybx.eChart2.option(0, [{ min: -10, max: 280, interval: 10 }, { min: 13, max: 42, interval: 1 }], {
        top: -1,
        left: -1,
        right: 0,
        bottom: 0,
        containLabel: false
    });
    $scope.$on('upEOption', function(a, b) {
        var updFlow = false,
            dir = a.targetScope.config.dir,
            series = a.targetScope.option.series[b[0]],
            data = series.data[b[1]],
            iconUrl = '';
        if (dir == 'x') {
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
            vm.saveMon(data);
        }
    })

    $scope.$on('addPoint', function(a, b) {
        if (!b.xAxisIndex)
            return;
        var curPoint = a.targetScope.option.series[b.seriesIndex].data[b.xAxisIndex];
        curPoint.value = b.value + '';
        curPoint.symbol = b.symbol.replace('.png', '-2.png');
        anesRecordServe_sybx.updobsdat(curPoint, regOptId).then((rs) => {
            if (rs.data.resultCode != 1) {
                toastr.error(rs.data.resultMessage);
                return;
            }
            getobsData();
        })
    })

    // filter 精确匹配
    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }
    // 用药
    vm.medECfg = eCharts.config(vm.pageState, 'x', {
        zrdblclick: function(params, scope) { //双击加浓度流速
            if (params.target) { //阻值点的双击事件
                return;
            }
            //没有触发series点击无效  scope.targetseriesIndex就是第几个series  !params.target && params.topTarget
            params.positionValue = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [params.offsetX, params.offsetY]);
            params.seriesIndex = scope.targetseriesIndex;
            var offsetX = parseInt(params.positionValue[0]);
            var offsetY = parseInt(params.positionValue[1]);
            if ((offsetY - 1) % 3 == 0) { //Y轴高过1   
            } else if ((offsetY + 1 - 1) % 3 == 0) {
                offsetY += 1;
            } else if ((offsetY - 1 - 1) % 3 == 0) {
                offsetY -= 1;
            } else {
                return;
            }
            var check, checkName;
            for (var i = 0; i < vm.medEOpt1.series.length; i++) { //检查是否X在持续用药中
                if (vm.medEOpt1.series[i].id == offsetY) {
                    check = true;
                    // name=
                    for (var j = 0; j < vm.medEOpt1.series[i].data.length; j++) {
                        if (vm.medEOpt1.series[i].data[j].ev_list && vm.medEOpt1.series[i].data[j].ev_list.name) {
                            var checkEv_list = vm.medEOpt1.series[i].data[j].ev_list;
                            checkName = vm.medEOpt1.series[i].data[j].ev_list.name;
                            break;
                        }
                    }
                    break;
                }
            }
            if (!check) {
                return;
            }
            var offsetXtimestamp = eCharts.translateTimeValue(params.positionValue[0], vm.timeArr49[vm.view.pageCur]) * 1000;
            var box = {};
            if (checkEv_list.type == "zl") {
                for (var k = 0; k < vm.startOper.treatMedEvtList.length; k++) {
                    for (var l = 0; l < vm.startOper.treatMedEvtList[k].medicalEventList.length; l++) {
                        if (vm.startOper.treatMedEvtList[k].medicalEventList[l].name == checkName && vm.startOper.treatMedEvtList[k].medicalEventList[l].startTime < offsetXtimestamp && vm.startOper.treatMedEvtList[k].medicalEventList[l].endTime > offsetXtimestamp) {
                            checkEv_list = angular.merge(checkEv_list, vm.startOper.treatMedEvtList[k].medicalEventList[l])
                            box.flag = true;
                            box.k = k;
                            box.l = l;
                            box.offsetXtimestamp = offsetXtimestamp;
                            break;

                        }
                    }
                    if (box.flag) {
                        break;
                    }
                }
            }
            if (checkEv_list.type == "mz") {
                for (var k = 0; k < vm.startOper.anaesMedEvtList.length; k++) {
                    for (var l = 0; l < vm.startOper.anaesMedEvtList[k].medicalEventList.length; l++) {
                        if (vm.startOper.anaesMedEvtList[k].medicalEventList[l].name == checkName && vm.startOper.anaesMedEvtList[k].medicalEventList[l].startTime < offsetXtimestamp && vm.startOper.anaesMedEvtList[k].medicalEventList[l].endTime > offsetXtimestamp) {
                            checkEv_list = angular.merge(checkEv_list, vm.startOper.anaesMedEvtList[k].medicalEventList[l])
                            box.flag = true;
                            box.k = k;
                            box.l = l;
                            box.offsetXtimestamp = offsetXtimestamp;
                            break;

                        }
                    }
                    if (box.flag) {
                        break;
                    }
                }
            }

            if (box.flag) {
                var scope = $rootScope.$new();
                scope.parm = { isAdd: true, ev_list: checkEv_list, offsetXtimestamp: box.offsetXtimestamp };
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    template: require('./model/fastAddEventPlus.html'),
                    controller: require('./model/fastAddEventPlus.controller.js'),
                    scope: scope
                }).result.then(function(rs) {
                    if (!rs.param.dataArr) { //关闭对话框刷新
                        searchAllEventListPlus();
                    } else {
                        eCharts.refChart(vm, rs.param.dataArr)
                    }
                });
            }

        },
        dragEndFn: function(dataIndex, transdata, entitydata, obj, config) { //拖动后
            anesRecordServe.upEOption1(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, vm.view.pageSize);
        },
        itemdblclickFn: function(dataIndex, transdata, entitydata, obj, config) { //双击点事件
            var scope = $rootScope.$new();
            //最后一个点终止
            if (transdata[dataIndex].ev_list.dosage != undefined && transdata[dataIndex].ev_list.showFlow == undefined && transdata[dataIndex].ev_list.showThick == undefined) {
                return;
            }
            if (transdata[dataIndex].ev_list.type == "zl" || transdata[dataIndex].ev_list.type == "mz") {

            } else {
                return;
            }
            scope.parm = { dataIndex: dataIndex, transdata: transdata, entitydata: entitydata, obj: obj };
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./model/fastAddEventPlus.html'),
                controller: require('./model/fastAddEventPlus.controller.js'),
                scope: scope
            }).result.then(function(rs) {
                anesRecordServe.upEOption1(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, vm.view.pageSize);
            });
        }
    });
    vm.medEOpt1 = eCharts.medOpt1(eChartCol, vm);
    // 监测项
    vm.monECfg = eCharts.config1(vm.pageState, 'y', {
        zrClickFn: function(params, scope) { //点击加点
            if (!isNaN(scope.targetseriesIndex) && scope.config.isAdd) {
                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
                var pointInPixel = [params.offsetX, params.offsetY];
                var pointInGrid = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: entitydata.series.yAxisIndex ? entitydata.series.yAxisIndex : 0 }, pointInPixel); //chart
                if (!transdata[Math.round(pointInGrid[0])]) {
                    return;
                }
                transdata[Math.round(pointInGrid[0])].value = pointInGrid[1];
                transdata[Math.round(pointInGrid[0])].symbol = entitydata.series.symbol;
                var params = angular.merge(transdata[Math.round(pointInGrid[0])]);
                if (entitydata.series.name !== 'TEMP') {
                    params.value = Math.round(params.value);
                }
                anesRecordServe.addPoint(vm, params);
            }
        },
        dragEndFn: function(dataIndex, transdata, entitydata, obj, config) { //拖动后
            anesRecordServe.upEOption1(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, vm.view.pageSize);
        },
        itemdblclickFn: function(dataIndex, transdata, entitydata, obj, config) {
            var data = angular.merge({ seriesName: entitydata.series.name }, transdata[dataIndex]);
            anesRecordServe.deletePoint1(vm, data); // 删除点
        },
        zrMoveFn: function(ev, scope) { //划过加点
            return;
            if (!isNaN(scope.targetseriesIndex) && scope.config.isAdd) {

                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
                var pointInPixel = [ev.offsetX, ev.offsetY];
                var pointInGrid = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: entitydata.series.yAxisIndex ? entitydata.series.yAxisIndex : 0 }, pointInPixel); //chart
                if (!transdata[Math.round(pointInGrid[0])]) {
                    // toastr.error('此处暂时不能添加点');
                    return;
                }
                if (transdata[Math.round(pointInGrid[0])].value[1] != '') { //如果有值 终止
                    return
                }
                transdata[Math.round(pointInGrid[0])].value = pointInGrid[1];
                transdata[Math.round(pointInGrid[0])].symbol = entitydata.series.symbol;
                // ctrl.emitAll("addPoint", angular.merge(transdata[Math.round(pointInGrid[0])]))
                anesRecordServe.addPoint(vm, angular.merge(transdata[Math.round(pointInGrid[0])]));
            }
        }
    });
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32, interval: 1 }]);
    // 事件标记
    vm.markECfg = eCharts.config1(1);

    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete
    // 开始手术
    anesRecordServe_sybx.startOper(regOptId, vm.pageState).then(function(rs) {
        if (rs.data.resultCode != '1') return;
        docId = rs.data.anaesRecord.anaRecordId;
        $scope.operState = operState = rs.data.regOpt.state;
        $scope.startOper = anesRecordServe_sybx.initData(rs.data);
        vm.startOper = angular.copy(anesRecordServe.initData(rs.data));
        setTimeout(function() { $scope.$broadcast('refresh', {}); }, 50);

        if ($scope.startOper.anaesMedEvtList && $scope.startOper.anaesMedEvtList.length > 0) {
            $scope.startOper.anaesRecord.anaesBeforeMed = 1;
        }else {
            $scope.startOper.anaesRecord.anaesBeforeMed = 0;
        }
        if ($scope.startOper.anaeseventList.length == 0) { // 判断有没有事件（入室事件），没有则需要调firstSpot接口
            if (vm.setting.readonly)
                return;
            anesRecordServe_sybx.firstSpot(new Date().getTime(), regOptId, docId).then(function(result) {
                if (result.data.resultCode != '1') return;
                vm.startOper.anaeseventList = anesRecordServe.dateFormat(result.data.anaeseventList);
                if (result.data.anaeseventList.length > 0) {
                    $scope.startOper.anaeseventList = result.data.anaeseventList; // 补完点以后重新赋值事件list
                    getobsData();
                } else {
                    toastr.error('手术开始失败');
                }
            });
        } else {
            getobsData();
        }
        anaesOperTime(docId); // 查询麻醉时长与手术时长
        totleIoEvent(docId); // 查询出入量总量
        oiSelectChange(docId); // 监听数据进行保存操作
        mergeData();
    });

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    };

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })
    vm.getDiagnosedefList = function(query, arr) {
        return select.getDiagnosedefList(query, arr);
    };
    $scope.getAnesList = function(query) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getRole('ANAES_DOCTOR', query, paras);
    }

    $scope.getNurseList = function(query) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getRole('NURSE', query, paras);
    }

    $scope.getOperaList = function(query, filed) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getOperators(query, paras);
    }

    vm.editInfo = function() { // 保存病人信息
        anesRecordServe_sybx.editInfo(regOptId, $scope.startOper.regOpt.height, $scope.startOper.regOpt.weight);
    }

    vm.changeRadio = function() { // 保存手术信息
        anesRecordServe_sybx.changeRadio($scope.startOper);
    }

    vm.time_watch = function(code, time) { // 处理麻醉事件 vm.event为html页面ng-init赋值的
        var nowTime = time || new Date().getTime();
        switch (code) {
            case 1:
                if (vm.event.mzks && vm.event.mzks.occurTime < nowTime) {
                    toastr.warning('入室时间不能大于麻醉开始时间');
                } else {
                    updateEnterRoomTime(nowTime, vm.event.rs ? vm.event.rs.anaEventId : '', code);
                }
                break;
            case 2:
                if (vm.event.ssks && vm.event.ssks.occurTime < nowTime) {
                    toastr.warning('麻醉开始时间不能大于手术开始时间');
                } else {
                    saveTime(nowTime, vm.event.mzks ? vm.event.mzks.anaEventId : '', code);
                }
                break;
            case 3:
                saveTime(nowTime, vm.event.zg ? vm.event.zg.anaEventId : '', code);
                break;
            case 4:
                if (!vm.event.mzks) {
                    toastr.warning('麻醉开始时间不能为空');
                } else if (vm.event.ssjs && vm.event.ssjs.occurTime < nowTime) {
                    toastr.warning('手术开始时间不能大于手术结束时间');
                } else {
                    saveTime(nowTime, vm.event.ssks ? vm.event.ssks.anaEventId : '', code);
                }
                break;
            case 5:
                if (!vm.event.mzks) {
                    toastr.warning('麻醉开始时间不能为空');
                } else if (!vm.event.ssks) {
                    toastr.warning('手术开始时间不能为空');
                } else if (vm.event.cs && vm.event.cs.occurTime < nowTime) {
                    toastr.warning('手术结束时间不能大于出室时间');
                } else {
                    saveTime(nowTime, vm.event.ssjs ? vm.event.ssjs.anaEventId : '', code);
                }
                break;
            case 6:
                if (!vm.event.zg) {
                    toastr.warning('请先进行置管');
                } else {
                    saveTime(nowTime, vm.event.bg ? vm.event.bg.anaEventId : '', code);
                }
                break;
        }
    }

    vm.toPrevPage = function(param) { // 上一页
        if (vm.view.pageDone && vm.view.pageCur > 1) {
            vm.view.pageCur--;
            getobsData();

        }
    }
    //监听左右键控制上一页|下一页
    $(document).keyup(function(event) {
        if (event.keyCode == 37) {
            vm.toPrevPage();
        } else if (event.keyCode == 39) {
            vm.toNextPage();
        } else if (event.keyCode == 33) { //第一页
            vm.view.pageCur = 1;
            getobsData();
        } else if (event.keyCode == 34) { //最后一页
            vm.view.pageCur = 0;
            getobsData();
        }
    });
    vm.toNextPage = function() { // 下一页
        if (vm.view.pageDone && vm.view.pageCur != vm.view.pageCount) {
            vm.view.pageCur++;
            if (vm.view.pageCur > vm.view.pageCount) {
                vm.view.pageCur = 1;
            }
            getobsData();

        }
    }

    vm.saveMon = function(param) { // 保存术中记录数据
        anesRecordServe_sybx.updobsdat(param, regOptId);
    }

    vm.saveMonitorPupil = function(param) { // 保存瞳孔数据
        anesRecordServe_sybx.saveMonitorPupil(param);
    }

    vm.cancelOper = function() { // 取消手术
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'ua',
            template: require('../../tpl/userModal/userModal.html'),
            controller: require('../../tpl/userModal/userModal.controller.js')
        }).result.then(function() {
            var date = new Date().getTime();
            anesRecordServe_sybx.endOperation(regOptId, docId, '08', date, $scope.startOper.anaesRecord.leaveTo, 7, "").then(function(result) {
                if (result.data.resultCode != '1') return;
                // anaesOperTime(docId); // 查询麻醉时长与手术时长
                $scope.operState = operState = 'END'; // 标记手术状态为END
                toastr.info('取消手术成功');
                $scope.startOper.anaeseventList.push({ code: 9, occurTime: date }); // 手动设置出室事件
                $timeout.cancel($rootScope.timer_point); // 关闭定时器
                $timeout.cancel(timer_rt);
                // $scope.$emit('processState', operState);
                $rootScope.$state.go($scope.crumbs[0].url);
            });
        });
    }

    vm.outOper = function() { // 出室
        var text = anesRecordServe_sybx.checkInput(vm.event, $scope.startOper); // 出室需要校验字段
        if (text) {
            toastr.warning(text);
        } else {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                size: 'ua',
                template: require('../../tpl/userModal/userModal.html'),
                controller: require('../../tpl/userModal/userModal.controller.js')
            }).result.then(function() {
                var date = new Date().getTime();
                anesRecordServe_sybx.endOperation(regOptId, docId, operState, date, $scope.startOper.anaesRecord.leaveTo, 9).then(function(result) {
                    if (result.data.resultCode != '1') return;
                    anaesOperTime(docId);
                    $scope.operState = operState = 'END';
                    toastr.info('出室成功');
                    $scope.startOper.anaeseventList = result.data.resultList;
                    $timeout.cancel($rootScope.timer_point);
                    $timeout.cancel(timer_rt);
                    $scope.$emit('processState', operState);
                });
            });
        }
    }

    vm.modelAnaesthetic = function(code) { // 麻醉用药、麻醉前用药、药物维持
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/modelAnaesthetic.html'),
            controller: require('./model/modelAnaesthetic.controller.js'),
            resolve: { items: { docId: docId, type: code } }
        }).result.then(function(rs) {
            searchEventList(rs); // 更新echart1
        });
    }
    vm.anesEvent = function() { // 麻醉事件
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./model/anesEvent.html'),
                controller: require('./model/anesEvent.controller.js'),
                resolve: {
                    items: {
                        list: angular.copy($scope.startOper.anaeseventList), // 考虑到删除和添加事件时无法同步界面，手动回显数据
                        docId: docId,
                        regOptId: regOptId,
                        state: rs.data.resultRegOpt.state,
                        callback: function(inTime1, anaEventId, model) {
                            inTime=inTime1;
                            updateEnterRoomTime(inTime1, anaEventId, 1, function(list) {
                                model(list); // 把事件回调到模态框里面进行更新
                            });
                        }
                    }
                }
            }).result.then(function(data) {
            $scope.startOper.anaeseventList = data.list; // 更新麻醉事件
            if (data.outTime)
                vm.view.pageCur = 0;
            getobsData();
            if (data.inTime || data.outTime) {
                $timeout(function() {
                    vm.operEditView(1);
                }, 1000);
            }
            showRemark(docId); // 更新备注
            initSign(); // 更新标记
            });
        });
    }
    vm.modelInput = function(code) { // 输液情况
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/inputInfo.html'),
            controller: require('./model/inputInfo.controller.js'),
            resolve: { items: { docId: docId, type: code } }
        }).result.then(function(rs) {
            searchEventList(rs); // 更新echart1
        });
    }

    vm.outIoevent = function() { // 出量
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/outIoevent.html'),
            controller: require('./model/outIoevent.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function(rs) {
            // showRemark(docId);
            // totleIoEvent(docId);
            searchEventList(rs); // 更新echart1
        });
    }

    vm.monitorConfig = function() { // 术中监测
        if (operState != '04') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/monitorConfig.html'),
            controller: require('./model/monitorConfig.controller.js'),
            resolve: { items: { regOptId: regOptId, number: 7 } }
        }).result.then(function(list) {
            $scope.startOper.leftShowList = list;
            getNewMon(); // 更新检测数据
        });
    }

    var tempSzjcKey = 666;
    vm.selPoint = function(key, opt) {
        if (!opt || tempSzjcKey == key) {
            $scope.szjcKey = 666;
            tempSzjcKey = 666;
            opt = null;
        } else {
            tempSzjcKey = key;
            $scope.szjcKey = key;
        }
        $scope.$broadcast('selPoint', opt);
    }

    vm.modelIntrMong = function() { // 麻醉监测标记点设置
        if (operState != '04') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/modelIntrMong.html'),
            controller: require('./model/modelIntrMong.controller.js'),
            resolve: { items: { regOptId: regOptId, number: 4 } }
        }).result.then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    list[i].eventId = list[i].realEventId;
                }
            }
            $scope.startOper.showList = list;
            getobsData();
        });
    }

    vm.operEditView = function(code) { // 打开数据视图
        if (code === 1) {
            vm.view.viewShow = false;
        } else {
            vm.view.viewShow = true;
        }
        $scope.seriesView = angular.copy($scope.eOption2.series); // 打开前冻结数据，不让它变化了
        $scope.seriesView.pop(); //最后一条是标记，要去掉
        $scope.saveSeriesView = []; // 用来保存数据的，ng-blur就会push进去
    }

    vm.saveEditView = function() { // 批量保存修改瞄点值
        anesRecordServe_sybx.batchHandleObsDat($scope.saveSeriesView, function() {
            getobsData();
            vm.view.viewShow = false;
        });
    }

    vm.analgesia = function() { // 镇痛方式
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/analgesia.html'),
            controller: require('./model/analgesia.controller.js'),
            resolve: {
                items: {
                    docId: docId,
                    regOptId: regOptId,
                    state: operState,
                    analgesicMethod: $scope.startOper.anaesRecord.analgesicMethod,
                    flow1: $scope.startOper.anaesRecord.flow1,
                    flowUnit1: $scope.startOper.anaesRecord.flowUnit1,
                    flow2: $scope.startOper.anaesRecord.flow2,
                    flowUnit2: $scope.startOper.anaesRecord.flowUnit2,
                    anaesRecord: $scope.startOper.anaesRecord
                }
            }
        }).result.then(function(rs) {
            if (rs == undefined) return;
            $scope.startOper.anaesRecord.analgesicMethod = rs.analgesicMethod;
            showRemark(docId);
        });
    }

    vm.modelERespire = function() { // 呼吸事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/nhfe/modelERespire.html'),
            controller: require('./model/nhfe/modelERespire.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            showRemark(docId);
            getobsData();
        });
    }

    vm.modelEInspect = function() { // 检验事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/inspectionEvent.html'),
            controller: require('./model/inspectionEvent.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            showRemark(docId);
        });
    }

    vm.modelRemark = function() { // 其他事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/remarkInfo.html'),
            controller: require('./model/remarkInfo.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            showRemark(docId);
        });
    }

    vm.modelPersRep = function() { // 交接班
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/persTranInfo.html'),
            controller: require('./model/persTranInfo.controller.js'),
            resolve: { items: { docId: docId, regOptId: regOptId } }
        }).result.then(function() {
            showRemark(docId);
        });
    }

    vm.modelESave = function() { // 抢救事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/rescueEvent.html'),
            controller: require('./model/rescueEvent.controller.js'),
            resolve: { items: { docId: docId, regOptId: regOptId } }
        }).result.then(function() {
            getobsData();
        });
    }

    vm.modelHzTime = function() { // 显示间隔
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/modelHzTime.html'),
            controller: require('./model/modelHzTime.controller.js'),
            resolve: { items: { regOptId: regOptId } }
        }).result.then(function() {
            getobsData();
        });
    }

    vm.saveAsTemp = function() { // 另存为模板，保存用药、输液、输血数据
        if ($scope.startOper.treatMedEvtList.length == 0 && $scope.startOper.transfusioninIoeventList.length == 0 && $scope.startOper.bloodinIoeventList.length == 0) {
            toastr.warning('请先添加数据');
            return;
        }
        for (var item of $scope.startOper.showList) {
            item.$$hashKey = undefined;
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/saveAsTemp.html'),
            controller: require('./model/saveAsTemp.controller.js'),
            resolve: { items: { zl: $scope.startOper.treatMedEvtList, sy: $scope.startOper.transfusioninIoeventList, sx: $scope.startOper.bloodinIoeventList, szpzx: $scope.startOper.leftShowList, szjcx: $scope.startOper.showList } }
        });
    }

    vm.loadTemp = function() { // 加载模板
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/loadTemp.html'),
            controller: require('./model/loadTemp.controller.js'),
            controllerAs: 'vm',
            resolve: { items: { regOptId: regOptId, docId: docId } }
        }).result.then(function(rs) {
            for (var obj of rs) {
                if (obj.canve == 'szpzx') {
                    $scope.startOper.leftShowList = obj.result;
                } else if (obj.canve == 'szjcx') {
                    $scope.startOper.showList = obj.result;
                    getobsData();
                }
            }
            rs.forEach(function(item) {
                searchEventList(item);
            });
        });
    }

    vm.onPrint = function() { // 打印
        console.log(vm.timeArr49[vm.view.pageCur])
        console.log(JSON.stringify($scope.eOption2))
        if (operState == '04') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        window.open($rootScope.$state.href('anesRecordPrint_sybx', { regOptId: regOptId }));
    }

    vm.summary = function() { // 麻醉总结
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/summary.html'),
            controller: require('./model/summary.controller.js'),
            resolve: { items: { regOptId: regOptId, docId: docId } }
        }).result.then(function() {
            loadSummary()
        });
    }

    // 实时监控
    var rtData = function() {
        anesRecordServe_sybx.rtData(regOptId, function(msg, list) {
            if (msg) {
                if (!toas)
                    toas = toastr.error('设备 [' + msg + '] 连接出错！');
                else
                    toastr.refreshTimer(toas);
            }
            $scope.realTimeData = list;
            start_rt();
        });
    }

    function start_rt() {
        if (timer_rt)
            $timeout.cancel(timer_rt);
        timer_rt = $timeout(rtData, 1000);
    }

    function getobsData() { // 获取历史点
        // anesRecordServe.getobsData(vm, regOptId, docId, ev_list);
        inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
            return item.code == 1;
        })[0].occurTime; // 实时更新入室时间
        vm.view.pageDone = false; // 控制上一页下一页按钮不可以
        $timeout.cancel($rootScope.timer_point);
        anesRecordServe_sybx.getObsData(regOptId, vm.view.pageCur, pageSize, inTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            $scope.eConfig2.dataLoaded = false;
            if (result.data.xAxis[0].data.length == 0) { // 修改入室时间时有用，修改入室时间可能会一个点都没有，则需要补一下
                if (result.data.freq == result.data.md.intervalTime) { // 如果相等，说明没有修改频率
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.freq * 1000 });
                } else {
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.md.intervalTime * 1000 });
                }
            }
            freq = result.data.freq;
            vm.view.pageCount = result.data.total <= pageSize ? 1 : Math.ceil((result.data.total - 1) / (pageSize - 1)); // 计算总页数
            anesRecordServe.createOrUpdateTimeArr49(vm, result); ///////////更新时间轴
            if (vm.view.pageCur == 0) { // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
                vm.view.pageCur = vm.view.pageCount;
            }
            if (vm.pageState != 0 || operState != '04') { // 如果不是在术中或者手术已经结束就不要瞄点啦，只需要获取历史点数据
                getIntervalObsData(result.data, -1);
                return;
            }
            // 代码能到这里说明它在术中且手术正在执行
            if (vm.view.pageCur != vm.view.pageCount) { // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
                getIntervalObsData(result.data, 'paging', true);
                return;
            }
            var t, hisTimes = [],
                times_ = new Date($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).getTime();
            if (freq == result.data.md.intervalTime) { // 这个判断是算出下一个点的时间（还没有瞄出来，将要瞄的下一个点）
                t = result.data.md.time + freq * 1000;
            } else {
                t = result.data.md.time + result.data.md.intervalTime * 1000;
            }
            while (t < times_) { // 计算要补点的时间点，累加频率后再和当前时间对比
                hisTimes.push(t);
                t += freq * 1000;
            }
            if (hisTimes.length > 0) {
                anesRecordServe_sybx.getIntervalObsData(regOptId, hisTimes, freq, vm.view.pageCur, pageSize, inTime).then(function(res) {
                    res.data.offset = result.data.offset; // getIntervalObsData这个接口没有offset与changeFreqTime，其实应该后台加上的，他们懒；加这个是为了补了点后后面要算偏移的
                    res.data.changeFreqTime = result.data.changeFreqTime;
                    getIntervalObsData(res.data, t - times_); // t - times_的值就是下一个点的时间（还没瞄的点）
                });
            } else {
                getIntervalObsData(result.data, t - times_);
            }
        });
    }

    /*
        result:数据源
        sideTime:瞄下一个点的时间差
                -1代表不需要瞄点，
                'paging'代表不需要更新echart2，但需要调瞄点接口；只有在翻页后传paging
    */
    function getIntervalObsData(result, sideTime, onlySave) { // 补点 
        $scope.eOption2.xAxis[0].data = getXAxis(result);
        $scope.eOption2.series = getSeries(result);
        $scope.eOption2.yAxis = anesRecordServe_sybx.getYAxis(angular.copy(result.yAxis), angular.copy($scope.eOption2.yAxis));
        if (result.total < pageSize) { // 计算瞄点的索引
            index = (result.total - 1) % pageSize;
        } else {
            index = (result.total - 1) % (pageSize - 1) == 0 ? (pageSize - 1) : (result.total - 1) % (pageSize - 1);
        }
        vm.view.pageCount = result.total <= pageSize ? 1 : Math.ceil((result.total - 1) / (pageSize - 1));
        if (vm.view.pageCur == 0) {
            vm.view.pageCur = vm.view.pageCount;
        }

        showRemark(docId);
        
        getPupilData();
        initSign();
        getNewMon();

        vm.view.pageDone = true;
        if (sideTime < 0) return;
        start_rt(); // 实时监测数据
        var startTime = result.md.time + result.md.intervalTime * 1000; // 计算下一个瞄点时间
        var onLoad = function() { // 瞄新点方法
            anesRecordServe_sybx.getObsDataNew(regOptId, inTime, startTime).then(function(data) {
                anesRecordServe.createOrUpdateTimeArr49(vm, result, data); //
                data = data.data;
                if (data.resultCode != '1' || data.xAxis[0].data.length <= 0)
                    return;
                freq = data.freq;
                if (data.total < pageSize)
                    index = (data.total - 1) % pageSize;
                else
                    index = (data.total - 1) % (pageSize - 1) == 0 ? (pageSize - 1) : (data.total - 1) % (pageSize - 1);
                if (onlySave) return;
                if (index == 1 && data.total > pageSize) { // 新页
                    vm.view.pageCur++;
                    vm.view.pageCount++;
                    getobsData();
                } else {
                    var len = data.series.length;
                    for (var a = 0; a < len; a++) { // 循环series
                        data.series[a].data[0].units = data.series[a].units; // 把series的units赋值到采集的数据data里面
                        var isOk = false; // 标识是否当前轴是否瞄点
                        for (var i = 0, xTime; xTime = new Date($scope.eOption2.xAxis[0].data[i++]).getTime();) { // 循环x轴
                            if (isOk) break; // 当前xTime瞄了点就不执行了
                            if (data.series[a].data[0].time >= xTime && data.series[a].data[0].time < new Date($scope.eOption2.xAxis[0].data[i]).getTime()) { // 判断点的时间是否在这个区间轴上
                                var temp_ = i - 1;
                                while (true) { // 如果发现echart2上面的这个位置存在点了，就要往后面移动一位
                                    if (!$scope.eOption2.series[a].data[temp_]) {
                                        isOk = true;
                                        $scope.eOption2.series[a].data[temp_] = data.series[a].data[0]; // 找到合适的位置了就给series赋值
                                        break;
                                    } else {
                                        temp_++;
                                    }
                                }
                            }
                            if (data.series[a].data[0].time == new Date($scope.eOption2.xAxis[0].data[i - 1]).getTime() && i == $scope.eOption2.xAxis[0].data.length) { // 保证最后一个轴可以瞄出点来
                                $scope.eOption2.series[a].data[i - 1] = data.series[a].data[0];
                            }
                        }
                        $scope.eOption2.series[a].symbol = 'image://' + data.series[a].symbol; // 设置图片、图片颜色
                        $scope.eOption2.series[a].itemStyle = { normal: { color: data.series[a].color } };
                        if (data.series[a].data[0].symbol == '') { // 要清除data里面为空的symbol，要不让这个点的图片显示不出来
                            delete data.series[a].data[0].symbol;
                        }
                    }
                }
                getPupilData();
                getNewMon();
            });
            startTime += result.freq * 1000; // 下一点的开始时间
            start_point(freq * 1000);
        }
        if (sideTime == 'paging') { // 翻页了，不是最后一页，下一个瞄点的时间-当前时间算出下一瞄点的时间
            var now_date = new Date().getTime();
            start_point(startTime - now_date);
            return;
        }
        if (vm.pageState == 0) { // 术中瞄点一般走这里
            start_point(sideTime);
        }

        function start_point(time) {
            if ($rootScope.timer_point)
                $timeout.cancel($rootScope.timer_point);
            $rootScope.timer_point = $timeout(onLoad, time);
        }
    }

    function getXAxis(rs) { // 生成x坐标
        var res = [], // echart2的时间轴
            xLen = rs.xAxis[0].data.length,
            temp;
        vm.tempTime = []; // 由于闭包问题导致var的数据丢失，所以放到vm里面
        $scope.xTits = []; // 记录时间的
        for (var a = 0; a < xLen; a++) {
            temp = rs.xAxis[0].data[a];
            if ((rs.changeFreqTime != '' && temp.value <= rs.changeFreqTime) || rs.changeFreqTime == '') { // 判断这个轴要不要偏移，当入室时间往前切时changeFreqTime可能为空，这时也要偏移
                temp.value = temp.value - rs.offset * 1000; // 轴减去偏移量
                temp.offset = true; // 标识它偏移了
            }
            vm.tempTime.push(temp); // 缓存一份偏移后的轴数据，echart1要用的
            res.push($filter('date')(temp.value, 'yyyy-MM-dd HH:mm:ss'));
            if (rs.xAxis[0].data[a + 1]) { // 偏移需要把一个轴分出10个出来
                var timeEach = parseInt((rs.xAxis[0].data[a + 1].value - (rs.changeFreqTime != '' && temp.value >= rs.changeFreqTime ? 0 : rs.offset * 1000) - temp.value) / 10);
                for (var h = 0; h < 9; h++) {
                    res.push($filter('date')(temp.value + timeEach * (h + 1), 'yyyy-MM-dd HH:mm:ss'));
                }
            }
            if (a % 6 == 0)
                $scope.xTits.push($filter('date')(temp.value, 'HH:mm')); // 记录时间
        }
        var tempValue = (vm.tempTime[xLen - 1].offset ? (vm.tempTime[xLen - 1].value + rs.offset * 1000) : vm.tempTime[xLen - 1].value) + vm.tempTime[xLen - 1].freq * 1000; // 自己生成下一个点时，需要用没有偏移的时间轴（后台给的原始数据的最后一个）来算
        if (rs.changeFreqTime == '') tempValue = tempValue - rs.offset * 1000;
        var first = true;
        while (xLen < pageSize) { // 后台给的x轴数据生成完成了，现在需要用频率自己算轴了
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

    function getSeries(rs) { // 生成瞄点数据
        var res = [],
            len = rs.series.length,
            xLen = rs.xAxis[0].data.length;
        for (var a = 0; a < len; a++) { // 循环x轴
            var t_data = rs.series[a].data;
            for (var i = 0; i < t_data.length; i++) { // 循环x轴数据
                rs.series[a].data[i].units = rs.series[a].units;
                if (t_data[i].symbol == '') {
                    if (t_data[i].amendFlag == 2) { // 等于2说明这个点手动修改过
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
            // 开始把数据放到echart2上面
            var seriesData = new Array();
            var j_index = 0; // 记录瞄点索引
            for (var i = 0, xTime; xTime = new Date($scope.eOption2.xAxis[0].data[i++]).getTime();) { // 循环X轴
                seriesData[i - 1] = '';
                var isOk = false;
                for (var j = j_index, data; data = rs.series[a].data[j++];) { // 循环后台给的点数据
                    if (isOk) break;
                    if (data.time >= xTime && data.time < new Date($scope.eOption2.xAxis[0].data[i]).getTime()) { // 找到此data适合的位置
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
                symbolSize: rs.series[a].symbolSize,
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
        res.push({ // 最后一个为标记
            type: 'line',
            name: '',
            silent: true,
            lineStyle: { normal: { width: 1, color: '#fff' } },
            data: (function() {
                var temp = [],
                    i = $scope.eOption2.xAxis[0].data.length;
                while (i > 0) {
                    temp.push(''); // 初始化标记轴的数据全部为空
                    i--;
                }
                return temp;
            })()
        });
        return res;
    }

    function anaesOperTime(docId) { // 查询麻醉时长与手术时长
        anesRecordServe_sybx.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.anaesTime) vm.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) vm.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
        });
    }

    function totleIoEvent(id) { // 查询出入量总量
        anesRecordServe_sybx.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.blood) vm.view.blood = result.data.blood + 'ml';
            if (result.data.egress) vm.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) vm.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) vm.view.ioevent = result.data.ioevent + 'ml';
        });
    }

    function showRemark(docId) { // 备注栏
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
            for (var item of list) {
                if (item.eventName == 'shiftChange') {
                    if (item.shiftChangePeopleId != vm.docInfo.userName) {
                        $scope.disabledOutBtn = true;
                    } else {
                        $scope.disabledOutBtn = false;
                    }
                }
            }
        }, docId, 3, 5, 11, 3, 0, 9, startTime, endTime, lastPage);
    }

    function getPupilData() { // 瞳孔数据
        anesRecordServe_sybx.getPupilData(regOptId, inTime, pageSize, vm.view.pageCur, function(list) {
            $scope.pupilDataList = list;
        });
    }

    function initSign() { // 标记点
        $timeout(function() {
            var eachWidth = $('.echart2').width() / (pageSize - 1); // 算出每一小格格物理距离
            var seriesList = $scope.eOption2.series[$scope.eOption2.series.length - 1].data; // 得到最后一条标记的数据
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = ''; // 初始化标记数据都为空
            }
            for (var a = 0; a < $scope.startOper.anaeseventList.length; a++) {
                if ($scope.startOper.anaeseventList[a].code >= 2 && $scope.startOper.anaeseventList[a].code != 9) {
                    var evStartTime = $scope.startOper.anaeseventList[a].occurTime;
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
                                        symbol: 'image://' + evObj.src,
                                        symbolSize: 14
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

    function getNewMon() { // 术中记录数据获取
        anesRecordServe_sybx.getNewMon(regOptId, inTime, pageSize, vm.view.pageCur).then(function(result) {
            $scope.monDataList = result.data.monDataList;
        });
    }

    function oiSelectChange(docId) { // 监听数据进行保存操作
        $scope.$watch('startOper.optLatterDiagList', function(list, old) {
            anesRecordServe_sybx.watchLists.saveOptLatterDiag(docId, list, old);
        }, true);
        $scope.$watch('startOper.optRealOperList', function(list, old) {
            anesRecordServe_sybx.watchLists.saveOptRealOper(docId, list, old);
        }, true);
        $scope.$watch('startOper.realAnaesList', function(list, old) {
            anesRecordServe_sybx.watchLists.saveRealAnaesMethod(docId, list, old);
        }, true);
        $scope.$watch('startOper.anaesRecord.optBodys', function(val) {
            if (val == undefined) return;
            anesRecordServe_sybx.changeRadio($scope.startOper);
        });

        $scope.$watch('startOper.anesDocList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '03', role: 'A', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordServe_sybx.saveParticipant(params);
        }, true);
        $scope.$watch('startOper.operatDocList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '07', role: 'O', userLoginName: item.id ? item.id : item.operatorId });
            }
            anesRecordServe_sybx.saveParticipant(params);
        }, true);
        $scope.$watch('startOper.nurseList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '05', role: 'N', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordServe_sybx.saveParticipant(params);
        }, true);
    }

    function updateEnterRoomTime(inTime, anaEventId, code, callback) { // 更新入室时间
        anesRecordServe_sybx.updateEnterRoomTime(regOptId, inTime, docId, anaEventId, code).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (callback) callback(result.data.anaeseventList); // 此回调是麻醉事件弹框里面修改了入室时间后进行的回调
            $scope.startOper.anaeseventList = result.data.anaeseventList;
            vm.startOper.anaeseventList =angular.copy(result.data.anaeseventList);
            inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
                return item.code == 1;
            })[0].occurTime;
            vm.view.pageCur = 1; // 只要跟新了入室时间，就跳转到第一页
            getobsData();
        });
    }

    function saveTime(nowTime, anaEventId, code) { // 保存麻醉事件
        anesRecordServe_sybx.saveAnaesevent(anaEventId, docId, code, operState, nowTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            vm.startOper.anaeseventList=$scope.startOper.anaeseventList = result.data.resultList;
            initSign();
            showRemark(docId);
            if (code == 5) anaesOperTime(docId);
        });
    }

    function searchEventList(opt) { // 用药、输液、输血处理方法
        anesRecordInter.searchAllEventListPlus("", { docId: docId, anaesMedNum: 0, medEventNum: 0, infusionNum: 0, egressNum: 0, bloodNum: 0 }).then(function(rs) {
            rs.data.treatMedEvtList = rs.data.medicalevent;
            rs.data.inIoeventList = rs.data.infusionList;
            rs.data.egressList = rs.data.egress;
            vm.rescueevent = rs.data.rescueevent;
            eCharts.refChart(vm, rs.data)
        }) //更新用药echarts

        if (opt.canve && opt.canve != 'zl')
            totleIoEvent(docId);
        anesRecordServe_sybx.searchEventList(opt).then(function(result) {
            if (result.data.resultCode != '1') return;
            $scope.startOper[opt.key] = result.data.resultList;
            if (opt.canve) {
                // setOption(opt.canve, result.data.resultList);
                
                showRemark(docId);
            }
            mergeData();
        });
    }

    function initShowList() {
        IHttp.post('basedata/getAnaesRecordShowListByRegOptId', { position: 0, regOptId: regOptId, enable: "1" }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
        });
    }

    function mergeData() {
        if ($scope.startOper.transfusioninIoeventList) {
            $scope.ioList = $scope.startOper.transfusioninIoeventList.concat($scope.startOper.bloodinIoeventList);

        }
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
    
    $scope.$on('$stateChangeStart', function() { // 监听路由跳转，关闭定时器
        anesRecordServe.stopTimerRt();
    });
}