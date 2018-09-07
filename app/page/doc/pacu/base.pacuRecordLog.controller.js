AnesRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'baseConfig', 'anesRecordInter', 'anesRecordServe', 'eCharts', 'auth', '$filter', '$q', '$timeout', 'toastr', '$uibModal', 'select', 'confirm'];

module.exports = AnesRecordLogCtrl;

function AnesRecordLogCtrl($rootScope, $scope, IHttp, baseConfig, anesRecordInter, anesRecordServe, eCharts, auth, $filter, $q, $timeout, toastr, $uibModal, select, confirm) {
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
        oldValue;
    // 获取文书的标题
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

    vm.view = {
        pageCur: 0, // 当前页数
        pageCount: 1, // 总页数
        pageSize: 49, // 默认一页大小 49
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false // 控制数据视图是否显示
    };

    vm.pageState = vm.setting.pageState;

    if (vm.pageState == 2)
        vm.view.pageCur = 1;

    vm.monDataList = [];

    if (vm.docInfo.beCode == 'syzxyy' || vm.docInfo.beCode == 'cshtyy' ||vm.docInfo.beCode == 'llzyyy' || vm.docInfo.beCode == 'base') {
        vm.optLevelList = ['1', '2', '3', '4'];
    } else {
        vm.optLevelList = ['一级', '二级', '三级', '四级'];
    }
    $scope.$on('$stateChangeStart', function() { // 监听路由跳转，关闭定时器
        anesRecordServe.stopTimerRt();
    });

    anesRecordInter.asaLevel.then(function(result) { // asa下拉选项值
        vm.asaLevel = result.data.resultList;
    });
    anesRecordInter.optBody.then(function(result) { // 手术体位下拉选项值
        vm.optBody = result.data.resultList;
    });
    anesRecordInter.pacuLeaveTo.then(function(result) { // 复苏室出室去向下拉选项值
        vm.pacuLeaveTo = result.data.resultList;
    });
    anesRecordInter.getSysCode('anaes_level').then(function(result) { // 出室去向下拉选项值
        vm.anaesLevel = result.data.resultList;
    });
    select.getAnaesMethodList().then((rs) => {
        vm.anaesMethodList = rs.data.resultList;
    })
    select.sysCodeBy('awareness').then((rs) => {
        $scope.awarenessList = rs.data.resultList;
    })
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
                    template: require('./newmodel/fastAddEventPlus.html'),
                    controller: require('./newmodel/fastAddEventPlus.controller.js'),
                    scope: scope
                }).result.then(function(rs) {
                    if (!rs.param.dataArr) {
                        searchEventList(rs);
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
                template: require('./newmodel/fastAddEventPlus.html'),
                controller: require('./newmodel/fastAddEventPlus.controller.js'),
                scope: scope
            }).result.then(function(rs) {
                eCharts.refChart(vm, rs.param.dataArr)
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
                anesRecordServe.addPoint(vm, angular.merge(transdata[Math.round(pointInGrid[0])]));
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
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32 }]);
    // 事件标记
    vm.markECfg = eCharts.config(1);
    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete
    // 开始手术
    startOper();
    setTimeout(function() { $scope.$broadcast('refresh', {}); }, 1000);

    function startOper() {
        anesRecordInter.startOper(regOptId, vm.pageState, { docType: 2 }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            docId = rs.data.anaesRecord.anaRecordId;
            vm.operState = rs.data.regOpt.state;
            vm.startOper = anesRecordServe.initDataPacu(rs.data);
            if ((vm.operState == '03' || vm.operState == '04' || vm.operState == '05') && vm.pageState != 0 && vm.pageState != 3 || vm.docInfo.roleType != 'ANAES_DIRECTOR')
                vm.setting.readonly = true;
            var flag;
            for (var item of vm.startOper.pacueventList) {
                if (item.codeName == '入PACU时间') {
                    flag = true;
                    anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
                }
            }
            if (!flag) {
                if (vm.setting.readonly) return;
                anesRecordInter.firstSpotBase(new Date().getTime(), regOptId, docId).then(function(result) {
                    if (result.data.resultCode !== '1') return;
                    vm.startOper.pacueventList = anesRecordServe.dateFormat(result.data.pacueventList);
                    if (vm.startOper.pacueventList.length > 0) {
                        if (rs.data.regOpt.emergency == 1) {
                            vm.startOper.anaesRecord.asaLevelE = true;
                            anesRecordInter.changeRadio(vm.startOper);
                        }
                        inTime = getInTime(vm.startOper.pacueventList);
                        anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
                    } else {
                        toastr.error('手术开始失败');
                    }
                });
            }
            if (!inTime)
                inTime = getInTime(vm.startOper.pacueventList);
            // anaesOperTime(docId); // 查询麻醉时长与手术时长
            totleIoEvent(docId); // 查询出入量总量
            oiSelectChange(docId); // 监听数据进行保存操作
        });
    }

    // function setAnalgesicMedEvtName(analgesicMedEvtList) {
    //     var analgesicMedEvtName = '';
    //     for (var item of analgesicMedEvtList) {
    //         if (item.durable == '0') {
    //             if (analgesicMedEvtName == '')
    //                 analgesicMedEvtName = item.name + ' ' + item.dosage + item.medicalEventList[0].dosageUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //             else
    //                 analgesicMedEvtName += '、' + item.name + ' ' + item.dosage + item.medicalEventList[0].dosageUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //         } else if (item.durable == '1') {
    //             if (analgesicMedEvtName == '') {
    //                 if (item.medicalEventList[0].showOption == '1') {
    //                     analgesicMedEvtName = item.name + ' ' + item.medicalEventList[0].flow + item.medicalEventList[0].flowUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 } else if (item.medicalEventList[0].showOption == '2') {
    //                     analgesicMedEvtName = item.name + ' ' + item.medicalEventList[0].thickness + item.medicalEventList[0].thicknessUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 } else if (item.medicalEventList[0].showOption == '3') {
    //                     analgesicMedEvtName = item.name + ' ' + item.medicalEventList[0].dosage + item.medicalEventList[0].dosageUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 }
    //             } else {
    //                 if (item.medicalEventList[0].showOption == '1') {
    //                     analgesicMedEvtName += '、' + item.name + ' ' + item.medicalEventList[0].flow + item.medicalEventList[0].flowUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 } else if (item.medicalEventList[0].showOption == '2') {
    //                     analgesicMedEvtName += '、' + item.name + ' ' + item.medicalEventList[0].thickness + item.medicalEventList[0].thicknessUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 } else if (item.medicalEventList[0].showOption == '3') {
    //                     analgesicMedEvtName += '、' + item.name + ' ' + item.medicalEventList[0].dosage + item.medicalEventList[0].dosageUnit + ' ' + item.medicalEventList[0].medTakeWayName;
    //                 }
    //             }
    //         }
    //     }
    //     vm.analgesicMedEvtName = analgesicMedEvtName;
    // }

    // function setAnaesMedEvtName(anaesMedEvtList) {
    //     var anaesMedEvtName = '';
    //     for (var item of anaesMedEvtList) {
    //         if (anaesMedEvtName == '') {
    //             anaesMedEvtName = item.name;
    //             var medTakeWayName = getMedTakeWayName(item.medicalEventList);
    //             anaesMedEvtName += '(' + medTakeWayName + ')';
    //         } else {
    //             anaesMedEvtName += '、' + item.name;
    //             var medTakeWayName = getMedTakeWayName(item.medicalEventList);
    //             anaesMedEvtName += '(' + medTakeWayName + ')';
    //         }
    //     }
    //     vm.anaesMedEvtName = anaesMedEvtName;
    // }

    function getMedTakeWayName(medicalEventList) {
        var medTakeWayName = '';
        for (var detail of medicalEventList) {
            if (medTakeWayName == '') {
                medTakeWayName = detail.medTakeWayName;
            } else {
                if (medTakeWayName.indexOf(detail.medTakeWayName) < 0)
                    medTakeWayName += ',' + detail.medTakeWayName;
            }
        }
        return medTakeWayName;
    }
    vm.getItem = function(query, url) { // oi-select查询
        if (!query) return;
        var deferred = $q.defer();
        anesRecordInter.queryItem(query, url, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }
    vm.getDiagnosedefList = function(query, arr) {
        return select.getDiagnosedefList(query, arr);
    };
    vm.getOperdefList = function(query, arr) {
        return select.getOperdefList(query, arr);
    };
    vm.getAnesList = function(query, arr) {
        return select.getAnaesthetists(query, arr);
    };
    vm.getOperaList = function(query, arr) {
        return select.getOperators(query, arr);
    };
    vm.getNurseList = function(query, arr) {
        return select.getNurses(query, arr);
    };
    vm.editInfo = function() { // 保存病人信息
        anesRecordInter.editInfo(regOptId, vm.startOper.regOpt.height, vm.startOper.regOpt.weight);
    }

    vm.changeRadio = function() { // 保存手术信息
        if (vm.startOper.anaesRecord.patAnalgesia_.check == 0) {
            vm.startOper.anaesRecord.patAnalgesia_.value = 0;
        }
        anesRecordInter.changeRadio(vm.startOper);
    }

    vm.chageLeaveTo = function(o) {
        vm.startOper.anaesRecord.leaveTo = o.codeValue;
        anesRecordInter.changeRadio(vm.startOper);
    }

    vm.handleKey = function($event, code, i) {
        console.log($event)
        // if($event.which != 13)
        //     return;
        // vm.time_watch(code, i)
        $event.preventDefault();
    }

    vm.time_watch = function(code, i) { // 处理麻醉事件 vm.event为html页面ng-init赋值的
        // if (vm.operState != '04') return;
        var nowTime = new Date().getTime();
        if (i)
            nowTime = new Date($filter('date')(i.occurTime, 'yyyy-MM-dd') + ' ' + i.strTime).getTime();
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
            case 9:
                vm.outOper();
            case 38:
                var param = angular.copy(vm.anaesPacuRec);
                if (!param) return;
                param.enterTime = nowTime;
                IHttp.post("document/saveAnaesPacuRec", param);
                break;
            case 39:
                var param = angular.copy(vm.anaesPacuRec);
                if (!param) return;
                param.exitTime = nowTime;
                IHttp.post("document/saveAnaesPacuRec", param).then((rs) => {
                    getobsDataPacu();
                });
                break;
        }
    }

    vm.toPrevPage = function(param) { // 上一页
        if (vm.view.pageDone && vm.view.pageCur > 1) {
            vm.view.pageCur--;
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        }
    }

    vm.toNextPage = function() { // 下一页
        // console.log(vm.monEOpt1)
        if (vm.view.pageDone && vm.view.pageCur != vm.view.pageCount) {
            vm.view.pageCur++;
            if (vm.view.pageCur > vm.view.pageCount) {
                vm.view.pageCur = 1;
            }
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        }
    }

    vm.saveMon = function(param, item) { // 保存术中记录数据
        anesRecordInter.updobsdat(param, regOptId).then(function(rs) {
            anesRecordServe.getNewMon(vm, regOptId, inTime);
        });
    }

    vm.saveMonitorPupil = function(param, code) { // 保存瞳孔数据
        if (code == "left" && param.id == "" && param.left == "") return;
        if (code == "right" && param.id == "" && param.right == "") return;
        if (code == "reflect" && param.id == "" && param.lightReaction == "") return;
        anesRecordInter.saveMonitorPupil(param);
    }
    vm.toOperRoom = function() {
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('./modal/againStartOper.html'),
            controller: require('./modal/againStartOper.controller.js'),
        }).result.then(function(rs) {
            toastr.info("已转入到手术室！")
        });
    }

    vm.changeBed = function() {
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('./modal/changeBed.html'),
            controller: require('./modal/changeBed.controller.js'),
        }).result.then(function(rs){
            toastr.info("成功切换床位")
        });
    }

    vm.outOper = function() { // 出室
        if (vm.docInfo.beCode === 'syzxyy' || vm.docInfo.beCode == 'cshtyy'|| vm.docInfo.beCode == 'llzyyy' || vm.docInfo.beCode == 'base') {
            confirm.tips().show('请记得对该手术进行费用确认').then((rs) => {
                outOper();
            });
        } else {
            outOper();
        }
    }

    function outOper() {
        anesRecordInter.verifyDrugOverTime(docId).then((rs) => {
            if (rs.data.resultCode != 1) return;
            if (rs.data.name) {
                toastr.warning('【' + rs.data.name + '】还没有结束时间');
                return
            }
            var text = anesRecordServe.checkInput(vm.event, vm.startOper,2); // 出室需要校验字段
            if (text) {
                toastr.warning(text);
            } else {
                // 检查持续用药是否有未填写结束时间的记录;
                var treatMedEvtList = vm.startOper.treatMedEvtList;
                var drugName = "";
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    size: 'ua',
                    template: require('./newmodel/outRoomTime.html'),
                    controller: require('./newmodel/outRoomTime.controller.js')
                }).result.then(function(data) {
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        size: 'ua',
                        template: require('../../tpl/userModal/userModal.html'),
                        controller: require('../../tpl/userModal/userModal.controller.js')
                    }).result.then(function() {
                        var date = new Date($filter('date')(new Date(data.outRoomTime), 'yyyy-MM-dd HH:mm')).getTime();
                        anesRecordInter.endOperation(regOptId, docId, vm.operState, date, vm.startOper.anaesRecord.leaveTo, 9,'',2).then(function(result) {
                            if (result.data.resultCode != '1') return;
                            // anaesOperTime(docId);
                            vm.operState = 'END';
                            toastr.info('出室成功');
                            vm.startOper.anaeseventList = anesRecordServe.dateFormat(result.data.resultList);
                            anesRecordServe.stopTimerPt()
                            anesRecordServe.stopTimerRt();
                            vm.view.pageCur = 0;
                            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
                            $timeout(function() {
                                vm.operEditView(1);
                            }, 1000);
                            $scope.$emit('processState', vm.operState);
                        });
                    });
                });
            }
        })
    }

    vm.ev_pharmacy = function() {
        var scope = $rootScope.$new();
        scope.docId = docId;
        scope.types = '1, I, O, 4';
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: '1200',
            template: require('./newmodel/pharmacy.html'),
            controller: require('./newmodel/pharmacy.controller.js'),
            controllerAs: 'vm',
            scope: scope
        }).result.then(function(res) {
            if (res == undefined) {
                anesRecordInter.searchAllEventListPlus("", { docId: docId, medEventNum: 0, infusionNum: 0, egressNum: 0 }).then(function(rs) {
                    rs.data.treatMedEvtList = rs.data.medicalevent;
                    rs.data.inIoeventList = rs.data.infusionList;
                    rs.data.egressList = rs.data.egress;
                    eCharts.refChart(vm, 20, rs.data)
                })
                return;
            }
            if (res.state == 'saveTpl') {
                scope.data = res.data;
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    template: require('./newmodel/saveTpl.html'),
                    controller: require('./newmodel/saveTpl.controller.js'),
                    controllerAs: 'vm',
                    scope: scope
                }).result.then(function(res) {
                    console.log(res)
                });
            }
        });
    }

    vm.anesEvent = function() { // 麻醉事件
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            var fds = vm;

            if (rs.data.resultCode != '1')
                return;
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./newmodel/anesEvent.html'),
                controller: require('./newmodel/anesEvent.controller.js'),
                resolve: {
                    items: {
                        list: angular.copy(vm.startOper.pacueventList), // 考虑到删除和添加事件时无法同步界面，手动回显数据
                        docId: docId,
                        regOptId: regOptId,
                        state: rs.data.resultRegOpt.state,
                        callback: function(inTime, anaEventId, model) {
                            updateEnterRoomTime(inTime, anaEventId, 1, function(list) {
                                model(list); // 把事件回调到模态框里面进行更新
                            });
                        }
                    }
                }
            }).result.then(function(data) {
                vm.startOper.anaeseventList = anesRecordServe.dateFormat(data.list); // 更新麻醉事件
                if (data.outTime)
                    vm.view.pageCur = 0;
                anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
                if (data.inTime || data.outTime) {
                    $timeout(function() {
                        vm.operEditView(1);
                    }, 1000);
                }
                showRemark(docId); // 更新备注
                // eCharts.initSign(vm.markEOpt, vm.startOper, vm.view.pageSize, false); // 更新标记
                eCharts.initSignPacu(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm); // 更新标记
            });
        });
    }

    vm.selectDN = function() { // 修改手术人员
        var scope = $rootScope.$new();
        scope.anesDocList = angular.copy(vm.startOper.anesDocList);
        scope.operatDocList = angular.copy(vm.startOper.operatDocList);
        scope.nurseList = angular.copy(vm.startOper.nurseList);
        scope.instruNurseList = angular.copy(vm.startOper.instruNurseList);
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/selectDN.html'),
            controller: require('./newmodel/selectDN.controller.js'),
            scope: scope,
            resolve: { items: { docId: docId } }
        }).result.then(function(rs) {
            vm.startOper.anesDocList = rs.anesDocList;
            vm.startOper.operatDocList = rs.operatDocList;
            vm.startOper.nurseList = rs.nurseList;
            vm.startOper.instruNurseList = rs.instruNurseList;
        });
    }

    vm.monitorConfig = function() { // 术中监测
        if (vm.operState !== '04' || vm.operState !== '05') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/monitorConfig.html'),
            controller: require('./newmodel/monitorConfig.controller.js'),
            resolve: { items: { regOptId: regOptId, number: bConfig.mongRows } }
        }).result.then(function(list) {
            vm.startOper.leftShowList = list;
            anesRecordServe.getNewMon(vm, regOptId, inTime); // 更新检测数据
        });
    }

    var tempSzjcKey = 666;
    vm.selPoint = function(key, opt, ev) {
        ev = window.event || ev;
        if (ev.stopPropagation) {
            ev.stopPropagation(); //阻止事件 冒泡传播
        }

        if (!opt || tempSzjcKey == key) {
            vm.szjcKey = 666;
            tempSzjcKey = 666;
            opt = null;
        } else {
            tempSzjcKey = key;
            vm.szjcKey = key;
        }
        if (opt) {
            vm.monECfg.isAdd = true;
        } else {
            vm.monECfg.isAdd = false;
        }
        $scope.$broadcast('selPoint', opt);

    }

    vm.modelIntrMong = function() { // 麻醉监测标记点设置
        if (vm.operState !== '04' || vm.operState !== '05') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/modelIntrMong.html'),
            controller: require('./newmodel/modelIntrMong.controller.js'),
            resolve: { items: { regOptId: regOptId, number: 4 } }
        }).result.then(function(list) {
            vm.startOper.showList = list;
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        });
    }

    vm.operEditView = function(code) { // 打开数据视图
        if (code === 1) {
            vm.view.viewShow = false;
        } else {
            vm.view.viewShow = true;
        }
        vm.seriesView = angular.copy(vm.monEOpt1.series); // 打开前冻结数据，不让它变化了
        if (vm.seriesView.length > 0 && vm.seriesView[vm.seriesView.length - 1].name == "blood") {
            vm.seriesView.pop();
        }
        vm.saveSeriesView = []; // 用来保存数据的，ng-blur就会push进去
    }

    vm.saveEditView = function() { // 批量保存修改瞄点值
        anesRecordInter.batchHandleObsDat(vm.saveSeriesView, function() {
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
            vm.view.viewShow = false;
        });
    }

    vm.setValue = function(value) {
        oldValue = value;
    }

    vm.checkSeriesView = function(series, obj) {
        if (!obj.value) return;
        if (obj.value > series.max || obj.value < series.min) {
            obj.value = oldValue
            toastr.warning("修改的值超过最大值" + series.max + "最小值" + series.min + "范围");
        }
    }


    vm.modelERespire = function() { // 呼吸事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/nhfe/modelERespire.html'),
            controller: require('./newmodel/nhfe/modelERespire.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function(rs) {
            if (rs.refresh) {
                showRemark(docId);
                anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
            }
        });
    }

    vm.modelEInspect = function() { // 检验事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/inspectionEvent.html'),
            controller: require('./newmodel/inspectionEvent.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        });
    }

    vm.modelRemark = function() { // 其他事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/remarkInfo.html'),
            controller: require('./newmodel/remarkInfo.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            showRemark(docId);
        });
    }

    vm.modelPersRep = function() { // 交接班
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/persTranInfo.html'),
            controller: require('./newmodel/persTranInfo.controller.js'),
            resolve: { items: { docId: docId, regOptId: regOptId } }
        }).result.then(function() {
            showRemark(docId);
            searchOperPerson(docId);
        });
    }

    vm.saveAsTemp = function() { // 另存为模板，保存用药、输液、输血数据
        if (vm.startOper.anaesMedEvtList.length === 0 && vm.startOper.treatMedEvtList.length === 0 && vm.startOper.inIoeventList.length === 0 && vm.startOper.outIoeventList.length === 0) {
            toastr.warning('请先添加数据');
            return;
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/saveAsTemp.html'),
            controller: require('./newmodel/saveAsTemp.controller.js'),
            resolve: { items: { zl: vm.startOper.treatMedEvtList, sy: vm.startOper.inIoeventList, mz: vm.startOper.anaesMedEvtList } }
        });
    }

    vm.loadTemp = function() { // 加载模板
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/nhfe/loadTemp.html'),
            controller: require('./newmodel/loadTemp.controller.js'),
            controllerAs: 'vm',
            resolve: { items: { regOptId: regOptId, docId: docId } }
        }).result.then(function(rs) {
            rs.forEach(function(item) {
                if (item.canve !== 'sx')
                    searchAllEventListPlus();
            });
        });
    }


    vm.onPrint = function() { // 打印
        var url = 'anesRecordPrint';
        if (vm.operState === '04') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        if (vm.docInfo.beCode == 'syzxyy' || vm.docInfo.beCode == 'cshtyy'|| vm.docInfo.beCode == 'llzyyy' || vm.docInfo.beCode == 'base')
            url = 'anesRecordPrint_syzxyy';
        window.open($rootScope.$state.href(url, { regOptId: regOptId }));
    }

    function anaesOperTime(docId) { // 查询麻醉时长与手术时长
        anesRecordInter.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.anaesTime) vm.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) vm.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
        });
    }

    function totleIoEvent(id) { // 查询出入量总量
        anesRecordInter.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.blood) vm.view.blood = result.data.blood + 'ml';
            if (result.data.egress) vm.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) vm.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) vm.view.ioevent = result.data.ioevent + 'ml';
        });
    }

    function showRemark(docId) { // 备注栏
        anesRecordServe.showRemarkPlus(vm, docId, false);
    }

    function searchOperPerson(docId) { // 麻醉医生
        anesRecordInter.searchOperPerson(docId, 'A').then(function(list) {
            var anesDocList = [];
            if (list.data.resultList.length > 0) {
                for (item of list.data.resultList) {
                    anesDocList.push({ id: item.userLoginName, name: item.name });
                }
            }
            vm.startOper.anesDocList = anesDocList;
        });
    }

    function oiSelectChange(docId) { // 监听数据进行保存操作
        $scope.$watch('vm.startOper.optLatterDiagList', function(list, old) {
            anesRecordInter.watchLists.saveOptLatterDiag(docId, list, old);
        }, true);
        $scope.$watch('vm.startOper.optRealOperList', function(list, old) {
            anesRecordInter.watchLists.saveOptRealOper(docId, list, old);
        }, true);
        $scope.$watch('vm.startOper.anesDocList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '03', role: 'A', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordInter.saveParticipant(params);
        }, true);
        $scope.$watch('vm.startOper.operatDocList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '07', role: 'O', userLoginName: item.id ? item.id : item.operatorId });
            }
            anesRecordInter.saveParticipant(params);
        }, true);
        $scope.$watch('vm.startOper.nurseList', function(list, old) {
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '05', role: 'N', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordInter.saveParticipant(params);
        }, true);
        $scope.$watch('vm.startOper.instruNurseList', function(list, old) {
            if (list == old) return;
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '04', role: 'N', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordInter.saveParticipant(params);
        }, true);



        $scope.$watch('vm.startOper.realAnaesList', function(list, old) {
            anesRecordInter.watchLists.saveRealAnaesMethod(docId, list, old);
        }, true);
        $scope.$watch('vm.startOper.anaesRecord.optBodys', function(val) {
            if (val === undefined) return;
            anesRecordInter.changeRadio(vm.startOper);
        }, true);
    }

    function updateEnterRoomTime(inTime, anaEventId, code, callback) { // 更新入室时间
        anesRecordInter.updateEnterRoomTime(regOptId, inTime, docId, anaEventId, code).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (callback) callback(result.data.anaeseventList); // 此回调是麻醉事件弹框里面修改了入室时间后进行的回调
            vm.startOper.anaeseventList = anesRecordServe.dateFormat(result.data.anaeseventList);
            inTime = $filter('filter')(vm.startOper.anaeseventList, function(item) {
                return vm.pageState == 3 || vm.pageState == 4 ? item.code === '入PACU时间' : item.code === 1;
            })[0].occurTime;
            vm.view.pageCur = 1; // 只要跟新了入室时间，就跳转到第一页
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        });
    }

    function saveTime(nowTime, anaEventId, code) { // 保存麻醉事件
        anesRecordInter.saveAnaesevent(anaEventId, docId, code, vm.operState, nowTime).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper.anaeseventList = anesRecordServe.dateFormat(result.data.resultList);
            // eCharts.initSign(vm.markEOpt, vm.startOper, vm.view.pageSize, false);
            eCharts.initSignPacu(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm);
            showRemark(docId);
            // if (code === 5) anaesOperTime(docId);
        });
    }

    function searchEventList(opt) { // 用药、输液、输血处理方法

        if (opt.canve && opt.canve !== 'zl')
            totleIoEvent(docId);
        anesRecordInter.searchEventList(opt).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[opt.key] = result.data.resultList;
            if (opt.canve) {
                eCharts.option(opt.canve, result.data.resultList, ev_list);
                eCharts.initEvConfig(ev_list, vm, false);
                showRemark(docId);
            }
        });
    }

    function getInTime(anaesEventList) {
        var inRoomTime,
            arry = $filter('filter')(anaesEventList, function(item) {
                return vm.pageState == 3 || vm.pageState == 4 ? item.codeName === '入PACU时间' : item.code === 1;
            });
        if (arry.length > 0)
            inRoomTime = arry[0].occurTime;
        return inRoomTime;
    }

    //监听左右键控制上一页|下一页
    $(document).keyup(function(event) {
        if (event.keyCode == 37) {
            vm.toPrevPage();
        } else if (event.keyCode == 39) {
            vm.toNextPage();
        } else if (event.keyCode == 33) { //第一页
            vm.view.pageCur = 1;
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        } else if (event.keyCode == 34) { //最后一页
            vm.view.pageCur = 0;
            anesRecordServe.getobsDataPacu(vm, regOptId, docId, ev_list);
        }
    });

    vm.eq = function(a, b) {
        return angular.equals(a, b);
    }
}