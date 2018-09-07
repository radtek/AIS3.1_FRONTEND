AnesRecordLogCtrl.$inject = ['$rootScope', '$scope','IHttp', 'anesRecordServe_yxrm', 'auth', 'dateFilter', '$filter', '$q', '$timeout', 'toastr', '$uibModal', 'select', 'confirm'];

module.exports = AnesRecordLogCtrl;

function AnesRecordLogCtrl($rootScope, $scope, IHttp, anesRecordServe_yxrm, auth, dateFilter, $filter, $q, $timeout, toastr, $uibModal, select, confirm) {
    // 获取文书的标题
    $scope.docInfo = auth.loginUser();
    $scope.setting = $rootScope.$state.current.data;
    $scope.disabledOutBtn = false;

    var toas, // 控制只显示一个toast
        docId,
        inTime, // 入室时间
        index, // 记录瞄点索引
        operState, // 手术状态
        freq, // 采集频率
        // timer_point, // 瞄点定时器
        timer_rt, // 实时监控定时器
        vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        pageSize = 49, // 一页显示条数
        ev_list = [], // 用药、输液、输血数据保存
        eChartRow1 = 20, // eChart1 的 行数
        eChartCol = 8,
        eChartRow2 = 24, // eChart2 的 行数
        historyData = [];

    $scope.view = { // 同步界面的数据
        pageCur: 0, // 当前页数
        pageCount: 1, // 总页数
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false // 控制数据视图是否显示
    };
    $scope.pageState = $scope.setting.pageState;
    if ($scope.pageState == 2)
        $scope.view.pageCur = 1;

    $scope.saved = true;
    $scope.regOptId = regOptId;
    $scope.optLevelList = ['一级', '二级', '三级', '四级'];
    $scope.backList = [];
    vm.tempTime = []; // 缓存x轴数据
    vm.monDataList = [];

    // $timeout.cancel(timer_point);
    // $timeout.cancel(timer_rt);
    $scope.$on('$stateChangeStart', function() { // 监听路由跳转，关闭定时器
        //     $timeout.cancel($rootScope.timer_point);
        $timeout.cancel(timer_rt);
    });

    anesRecordServe_yxrm.asaLevel.then(function(result) { // asa下拉选项值
        $scope.asaLevel = result.data.resultList;
    });
    anesRecordServe_yxrm.optBody.then(function(result) { // 手术体位下拉选项值
        $scope.optBody = result.data.resultList;
    });
    anesRecordServe_yxrm.leaveTo.then(function(result) { // 出室去向下拉选项值
        $scope.leaveTo = result.data.resultList;
    });
    anesRecordServe_yxrm.getSysCode('anaes_level').then(function(result) { // 出室去向下拉选项值
        $scope.anaesLevel = result.data.resultList;
    });

    // 双击快速编辑用药
    $scope.eConfig1 = anesRecordServe_yxrm.eChart1.config(function(data) {
        if ($scope.pageState == 1 || data.data.mark == 'end')
            return;
        var scope = $rootScope.$new();
        scope.parm = { docId: docId, data: data };
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/fastAddEvent.html'),
            controller: require('./model/fastAddEvent.controller.js'),
            scope: scope
        }).result.then(function(rs) {
            searchEventList(rs);
        });
    }, $scope.pageState);

    $scope.eOption1 = anesRecordServe_yxrm.eChart1.option(eChartRow1, eChartCol, function(params) { // 格式化echart1提示信息
        var obj = params.data.evObj;
        var startTime = $filter('date')(params.name, 'yyyy-MM-dd HH:mm:ss');
        return obj ? '<div><p>时间：' + startTime + '</p><p>名称：' + obj.name + '</p></div>' : '';
    });

    // 单击瞄点，修改瞄点值
    $scope.eConfig2 = anesRecordServe_yxrm.eChart2.config(function(data) {
        if ($scope.pageState == 1 || isMove || data.seriesName == 'mark' || data.componentType == "markLine") {
            isMove = false;
            return;
        }
        // 删除点
        confirm.show('名称：' + data.seriesName + ' ，值：' + data.value, '是否确定删除？').then((rs) => {
            data.data.value = '';
            anesRecordServe_yxrm.updobsdat(data.data, regOptId).then((rs) => {
                if (rs.data.resultCode != 1) return;
                getobsData();
            })
        })
    }, $scope.pageState);

    $scope.eOption2 = anesRecordServe_yxrm.eChart2.option(eChartCol, [{ min: -10, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 1, max: 32 }]);
    var isMove = false;
    $scope.$on('upEOption', function(a, b) {
        isMove = true;
        var dir = a.targetScope.config.dir,
            series = a.targetScope.option.series[b[0]],
            data = series.data[b[1]],
            iconUrl = '',
            updFlow = false;
        if (series.name != "TEMP") {
            data.value = Math.round(data.value)
        }
        if (dir == 'x') {
            data = series.data[b[2]];
            if (data.symbol == 'rect' && data.symbolSize > 5)
                updFlow = true;
            var xAxis = a.targetScope.option.xAxis[0].data;
            var evId,
                type = data.evObj.type,
                subType = data.evObj.subType,
                originalTime = xAxis[b[1]].value,
                newTime = xAxis[b[2]].value,
                otherTime,
                params = {
                    canve: 'zl',
                    key: 'treatMedEvtList',
                    param: {
                        docId: docId,
                        type: '1'
                    },
                    url: 'searchMedicaleventGroupByCodeList'
                }
            if (type == 'zl')
                evId = data.evObj.medicalEvent.medEventId;
            else
                evId = data.evObj.evId;
            if (data.evObj.durable) {
                if (Math.abs(xAxis[b[1]].value - data.evObj.startTime) < xAxis[b[1]].freq)
                    otherTime = data.evObj.endTime;
                else
                    otherTime = data.evObj.startTime;
            }
            if (!updFlow) {
                anesRecordServe_yxrm.updateEventTime(docId, evId, type, subType, newTime, otherTime).then(function(rs) {
                    // if (rs.data.resultCode != 1) return;
                    if (type == 'zl')
                        $scope.startOper.treatMedEvtList = rs.data.resultList;
                    else if (type == 'sy')
                        $scope.startOper.inIoeventList = rs.data.resultList;
                    else if (type == 'cl')
                        $scope.startOper.outIoeventList = rs.data.resultList;
                    setOption(type, rs.data.resultList);
                    initEvConfig();
                    showRemark(docId);
                });
            } else {
                var detailList = data.evObj.detailList,
                    medEventId,
                    id;
                if (newTime >= data.evObj.endTime || newTime <= data.evObj.startTime) {
                    toastr.error("修改的时间必须在" + $filter('date')(new Date(data.evObj.startTime), 'yyyy-MM-dd HH:mm:ss') + " 至 " + $filter('date')(new Date(data.evObj.endTime), 'yyyy-MM-dd HH:mm:ss') + "之间");
                    refMedicalChart(params, type);
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
                anesRecordServe_yxrm.saveMedicalEventDetail(id, docId, medEventId, flow, flowUnit, thickness, thicknessUnit, newTime, showFlow, showThick).then(function(rs) {
                    refMedicalChart(params, type);
                });
            }
        } else {
            if (series.name == 'mark')
                return;
            if (data.symbol)
                iconUrl = data.symbol;
            else
                iconUrl = series.symbol;
            if (iconUrl.indexOf('-2.png') < 0 && ($scope.docInfo.beCode != 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy'))
                data.symbol = iconUrl.replace('.png', '-2.png');
            data.observeName = series.name;
            vm.saveMon(data);
        }
    })

    $scope.$on('addPoint', function(a, b) {
        if (isMove) return;
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
        anesRecordServe_yxrm.updobsdat(curPoint, regOptId).then((rs) => {
            if (rs.data.resultCode != 1) return;
            getobsData();
        })
    })

    // 开始手术 
    anesRecordServe_yxrm.startOper(regOptId, $scope.pageState).then(function(rs) {
        if (rs.data.resultCode != '1') return;
        docId = rs.data.anaesRecord.anaRecordId;
        $scope.docId = docId;
        $scope.operState = operState = rs.data.regOpt.state;
        $scope.startOper = anesRecordServe_yxrm.initData(rs.data);
        // setOption('mz', $scope.startOper.anaesMedEvtList); // 麻醉用药情况瞄点数据生成
        setOption('zl', $scope.startOper.treatMedEvtList); // 治疗用药情况瞄点数据生成
        setOption('sy', $scope.startOper.inIoeventList); // 输液输血情况瞄点数据生成
        setOption('cl', $scope.startOper.outIoeventList); // 出量情况瞄点数据生成
        if ($scope.startOper.anaeseventList.length == 0) { // 判断有没有事件（入室事件），没有则需要调firstSpot接口
            anesRecordServe_yxrm.firstSpot(new Date().getTime(), regOptId, docId).then(function(result) {
                if (result.data.resultCode != '1') return;
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
        oiSelectChange(docId); // 监听数据进行保存操作
    });

    $scope.getDiagnosedefList = function(query) {
        return select.getDiagnosedefList(query);
    }

    $scope.getOperdefList = function(query) {
        return select.getOperdefList(query);
    };

    select.getAnaesMethodList().then((rs) => {
        $scope.anaesMethodList = rs.data.resultList;
    })

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

    $scope.getOperaList = function(query) {
        var paras = [];
        for (var a = 1; a < arguments.length; a++) {
            if (arguments[a])
                paras.push(arguments[a]);
        }
        return select.getOperators(query, paras);
    }

    vm.editInfo = function() { // 保存病人信息
        anesRecordServe_yxrm.editInfo(regOptId, $scope.startOper.regOpt.height, $scope.startOper.regOpt.weight);
    }

    vm.changeRadio = function() { // 保存手术信息
        anesRecordServe_yxrm.changeRadio($scope.startOper);
    }

    vm.time_watch = function(code, leaveTo) { // 处理麻醉事件 vm.event为html页面ng-init赋值的
        if (operState != '04') return;
        var nowTime = new Date().getTime();
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
                } else if (vm.event.cs && vm.event.cs.occurTime) {
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
                $scope.startOper.anaesRecord.leaveTo = leaveTo;
                vm.outOper();
                break;
        }
    }

    vm.toPrevPage = function(param) { // 上一页
        if ($scope.view.pageDone && $scope.view.pageCur > 1) {
            $scope.view.pageCur--;
            getobsData();
        }
    }

    vm.toNextPage = function() { // 下一页
        if ($scope.view.pageDone && $scope.view.pageCur != $scope.view.pageCount) {
            $scope.view.pageCur++;
            if ($scope.view.pageCur > $scope.view.pageCount) {
                $scope.view.pageCur = 1;
            }
            getobsData();
        }
    }

    vm.saveMon = function(param) { // 保存术中记录数据
        anesRecordServe_yxrm.updobsdat(param, regOptId).then(function(rs) {
            getNewMon();
        });
    }

    vm.saveMonitorPupil = function(param) { // 保存瞳孔数据
        anesRecordServe_yxrm.saveMonitorPupil(param);
    }

    vm.saveMonitorXdt = function(index, value, $event) { // 保存心电图数据
        IHttp.post('operCtl/saveMonitorPupil', vm.pupilDataList[index * 3]).then(function(rs) {
            if (rs.data.resultCode === '1') {
                vm.pupilDataList[index * 3].id = rs.data.pupilId
            }
        });
    }

    vm.cancelOper = function() { // 取消手术
        // if (!$scope.startOper.anaesRecord.leaveTo) {
        //     toastr.warning('出室去向不能为空');
        //     return;
        // }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'ua',
            template: require('../../tpl/userModal/userModal.html'),
            controller: require('../../tpl/userModal/userModal.controller.js')
        }).result.then(function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./model/cancelOper.html'),
                controller: require('./model/cancelOper.controller.js')
            }).result.then(function(data) {
                var date = new Date().getTime();
                anesRecordServe_yxrm.endOperation(regOptId, docId, '08', date, $scope.startOper.anaesRecord.leaveTo, 7, data).then(function(result) {
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
        });
    }

    vm.outOper = function() { // 出室
        anesRecordServe_yxrm.verifyDrugOverTime(docId).then((rs) => {
            if (rs.data.resultCode != 1) return;
            if (rs.data.name) {
                toastr.warning('【' + rs.data.name + '】还没有结束时间');
                return
            }
            var text = anesRecordServe_yxrm.checkInput(vm.event, $scope.startOper); // 出室需要校验字段
            if (text) {
                toastr.warning(text);
            } else {
                // 检查持续用药是否有未填写结束时间的记录;
                var treatMedEvtList = $scope.startOper.treatMedEvtList;
                var drugName = "";
                // for(var treatMedEvt of treatMedEvtList) {
                // }
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    size: 'ua',
                    template: require('./model/outRoomTime.html'),
                    controller: require('./model/outRoomTime.controller.js')
                }).result.then(function(data) {
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        size: 'ua',
                        template: require('../../tpl/userModal/userModal.html'),
                        controller: require('../../tpl/userModal/userModal.controller.js')
                    }).result.then(function() {
                        var date = new Date($filter('date')(new Date(data.outRoomTime), 'yyyy-MM-dd HH:mm')).getTime();
                        anesRecordServe_yxrm.endOperation(regOptId, docId, operState, date, $scope.startOper.anaesRecord.leaveTo, 9).then(function(result) {
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
                });
            }
        });
    }

    vm.modelAnaesthetic = function(code) { // 麻醉用药、麻醉前用药、药物维持
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/nhfe/modelAnaesthetic_yxyy.html'),
            controller: require('./model/nhfe/modelAnaesthetic.controller.js'),
            resolve: { items: { docId: docId, type: code } }
        }).result.then(function(rs) {
            searchEventList(rs); // 更新echart1
        });
    }

    vm.anesEvent = function() { // 麻醉事件
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
                    state: operState,
                    callback: function(inTime, anaEventId, model) {
                        updateEnterRoomTime(inTime, anaEventId, 1, function(list) {
                            model(list); // 把事件回调到模态框里面进行更新
                        });
                    }
                }
            }
        }).result.then(function(data) {
            $scope.startOper.anaeseventList = data.list; // 更新麻醉事件
            if (data.outTime)
                $scope.view.pageCur = 0;
            getobsData();
            if (data.inTime || data.outTime) {
                $timeout(function() {
                    vm.operEditView(1);
                }, 1000);
            }
            showRemark(docId); // 更新备注
            initSign();   // 更新标记
        });
    }

    vm.modelInput = function(code) { // 输液情况
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/nhfe/inputInfo.html'),
            controller: require('./model/inputInfo.controller.js'),
            resolve: { items: { docId: docId, type: code } }
        }).result.then(function(rs) {
            searchEventList(rs); // 更新echart1
            // if ($scope.docInfo.beCode == 'qnzrmyy')
            //     searchIOAmoutDetail();
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
            searchEventList(rs); // 更新echart1
            // if ($scope.docInfo.beCode == 'qnzrmyy')
            //     searchIOAmoutDetail();
        });
    }

    vm.monitorConfig = function() { // 术中监测
        if (operState != '04') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/monitorConfig.html'),
            controller: require('./model/monitorConfig.controller.js'),
            resolve: { items: { regOptId: regOptId, number: 5 } }
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
            $scope.startOper.showList = list;
            getobsData();
        });
    }

    vm.operEditView = function(code) { // 打开数据视图
        if (code === 1) {
            $scope.view.viewShow = false;
        } else {
            $scope.view.viewShow = true;
        }
        $scope.seriesView = angular.copy($scope.eOption2.series); // 打开前冻结数据，不让它变化了
        $scope.seriesView.pop(); //最后一条是标记，要去掉
        $scope.saveSeriesView = []; // 用来保存数据的，ng-blur就会push进去
    }

    vm.saveEditView = function() { // 批量保存修改瞄点值
        anesRecordServe_yxrm.batchHandleObsDat($scope.saveSeriesView, function() {
            getobsData();
            $scope.view.viewShow = false;
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
            if (rs != undefined && !angular.equals({}, rs)) {
                $scope.startOper.anaesRecord.analgesicMethod = rs.analgesicMethod;
                $scope.startOper.anaesRecord.flow1 = rs.flow1;
                $scope.startOper.anaesRecord.flowUnit1 = rs.flowUnit1;
                $scope.startOper.anaesRecord.flow2 = rs.flow2;
                $scope.startOper.anaesRecord.flowUnit2 = rs.flowUnit2;
            }
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

    vm.modelSpecialMaterials = function() { // 特殊材料
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/specialMaterials.html'),
            controller: require('./model/specialMaterials.controller.js'),
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
        var sy = $scope.startOper.inIoeventList && $scope.startOper.inIoeventList.length > 0 ? $scope.startOper.inIoeventList : $scope.startOper.transfusioninIoeventList;
        if ($scope.startOper.anaesMedEvtList.length == 0 && $scope.startOper.treatMedEvtList.length == 0 && sy && sy.length == 0) {
            toastr.warning('请先添加数据');
            return;
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./model/saveAsTemp.html'),
            controller: require('./model/saveAsTemp.controller.js'),
            resolve: { items: { mz: $scope.startOper.anaesMedEvtList, zl: $scope.startOper.treatMedEvtList, sy: sy } }
        });
    }

    vm.loadTemp = function() { // 加载模板
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./model/nhfe/loadTemp.html'),
            controller: require('./model/loadTemp.controller.js'),
            controllerAs: 'vm',
            resolve: { items: { regOptId: regOptId, docId: docId } }
        }).result.then(function(rs) {
            rs.forEach(function(item) {
                searchEventList(item);
            });
        });
    }

    vm.onAKeyPrint = function() { // 一键打印
        if (operState == '04') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        var scope = $rootScope.$new();
        scope.row = $scope.startOper.regOpt;
        scope.user = auth.loginUser();
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('../../oper/modal/print.html'),
            controller: require('../../oper/modal/print.controller.js'),
            scope: scope
        }).result.then(function() {}, function() {});
    }

    vm.onPrint = function() { // 打印
        if (operState == '04') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        window.open($rootScope.$state.href('anesRecordPrint_qnz', { regOptId: regOptId }));
    }

    vm.recipePrint = function(type) {
        if (operState == '04') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        scope.docId = docId;
        scope.recipeType = type;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./recipe/recipeModal.html'),
            controller: require('./recipe/recipeModal.controller.js'),
            scope: scope
        });
    }

    // 实时监控
    var rtData = function() {
        anesRecordServe_yxrm.rtData(regOptId, function(msg, list) {
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
        inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
            return item.code == 1;
        })[0].occurTime; // 实时更新入室时间
        $scope.view.pageDone = false; // 控制上一页下一页按钮不可以
        $timeout.cancel($rootScope.timer_point);
        anesRecordServe_yxrm.getObsData(regOptId, $scope.view.pageCur, pageSize, inTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            for (seriesData of result.data.series) {
                if (seriesData.name == 'RESP') {
                    historyData = angular.copy(seriesData.data);
                }
            }
            $scope.eConfig2.dataLoaded = false;
            if (result.data.xAxis[0].data.length == 0) { // 修改入室时间时有用，修改入室时间可能会一个点都没有，则需要补一下
                if (result.data.freq == result.data.md.intervalTime) { // 如果相等，说明没有修改频率
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.freq * 1000 });
                } else {
                    result.data.xAxis[0].data.push({ freq: result.data.freq, value: result.data.md.time + result.data.md.intervalTime * 1000 });
                }
            }
            freq = result.data.freq;
            $scope.view.pageCount = result.data.total <= pageSize ? 1 : Math.ceil((result.data.total - 1) / (pageSize - 1)); // 计算总页数
            if ($scope.view.pageCur == 0) { // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
                $scope.view.pageCur = $scope.view.pageCount;
            }
            if ($scope.pageState != 0 || operState != '04') { // 如果不是在术中或者手术已经结束就不要瞄点啦，只需要获取历史点数据
                getIntervalObsData(result.data, -1);
                return;
            }
            // 代码能到这里说明它在术中且手术正在执行
            if ($scope.view.pageCur != $scope.view.pageCount) { // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
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
                anesRecordServe_yxrm.getIntervalObsData(regOptId, hisTimes, freq, $scope.view.pageCur, pageSize, inTime).then(function(res) {
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
        $scope.eOption2.yAxis = anesRecordServe_yxrm.getYAxis(angular.copy(result.yAxis), angular.copy($scope.eOption2.yAxis));

        if (result.total < pageSize) { // 计算瞄点的索引
            index = (result.total - 1) % pageSize;
        } else {
            index = (result.total - 1) % (pageSize - 1) == 0 ? (pageSize - 1) : (result.total - 1) % (pageSize - 1);
        }
        $scope.view.pageCount = result.total <= pageSize ? 1 : Math.ceil((result.total - 1) / (pageSize - 1));
        if ($scope.view.pageCur == 0) {
            $scope.view.pageCur = $scope.view.pageCount;
        }

        showRemark(docId);
        initEvConfig();
        getPupilData();
        // getXdtData();
        initSign();
        getNewMon();

        $scope.view.pageDone = true;
        if (sideTime < 0) return;
        start_rt(); // 实时监测数据
        var startTime = result.md.time + result.md.intervalTime * 1000; // 计算下一个瞄点时间
        var onLoad = function() { // 瞄新点方法  

            // if ($scope.operState === 'END'){                
            //     return;
            // }
            // if (!($rootScope.$state.current.name.indexOf('mid') > -1 || $rootScope.$state.current.name ==='anesRecordPage_yxrm')) {
            //     return;
            // }

            anesRecordServe_yxrm.getObsDataNew(regOptId, inTime, startTime).then(function(data) {
                data = data.data;
                if (data.resultCode != '1' || data.xAxis[0].data.length <= 0)
                    return;
                freq = data.freq;
                for (observe of data.series) {
                    if (observe.name == 'RESP') {
                        historyData.push(observe.data[0]);
                    }
                }
                if (data.total < pageSize)
                    index = (data.total - 1) % pageSize;
                else
                    index = (data.total - 1) % (pageSize - 1) == 0 ? (pageSize - 1) : (data.total - 1) % (pageSize - 1);
                if (onlySave) return;
                if (index == 1 && data.total > pageSize) { // 新页
                    $scope.view.pageCur++;
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
                // getXdtData();
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
        if ($scope.pageState == 0) { // 术中瞄点一般走这里
            start_point(sideTime);
        }

        function start_point(time) {
            if ($rootScope.timer_point){
                $timeout.cancel($rootScope.timer_point);
                //return;
            }
            if (!($rootScope.$state.current.name.indexOf('mid') > -1 || $rootScope.$state.current.name ==='anesRecordPage_yxrm')) {
                $timeout.cancel($rootScope.timer_point);
                return;
            } 
            if($scope.operState === 'END'){
                $timeout.cancel($rootScope.timer_point);
                return;
            }

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
                        if ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy')
                            rs.series[a].data[i].symbol = 'image://' + temp[0] + '.' + temp[1];
                        else
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
                        if ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy')
                            rs.series[a].data[i].symbol = temp[0] + '.' + temp[1];
                        else
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
            name: 'mark',
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

    function anaesOperTime(docId) { // 查询麻醉时长与手术时长
        anesRecordServe_yxrm.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.anaesTime) $scope.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) $scope.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
        });
    }

    function totleIoEvent(id) { // 查询出入量总量
        anesRecordServe_yxrm.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (result.data.blood) $scope.view.blood = result.data.blood + 'ml';
            if (result.data.egress) $scope.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) $scope.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) $scope.view.ioevent = result.data.ioevent + 'ml';
        });
    }

    function showRemark(docId) { // 备注栏
        var len = vm.tempTime.length;
        var endTime = vm.tempTime[len - 1].value;
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
                if (item.eventName == 'shiftChange') {
                    if (item.shiftChangePeopleId != $scope.docInfo.userName) {
                        $scope.disabledOutBtn = true;
                    } else {
                        $scope.disabledOutBtn = false;
                    }
                }
                if (item.name == '呼吸事件' && ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy')) {
                    list.splice(index, 1);
                }
                index += 1;
            }
        }, docId, 0, 6, medEventNum, 3, anaesMedNum, 9, vm.tempTime[0].value, endTime, lastPage);

        if ($scope.docInfo.beCode == 'qnzrmyy' || $scope.docInfo.beCode == 'yxyy') {
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
    }

    function getPupilData() { // 瞳孔数据
        anesRecordServe_yxrm.getPupilData(regOptId, inTime, pageSize, $scope.view.pageCur, function(list) {
            $scope.pupilDataList = list;
        });
    }

    function setOption(type, array) { //    
        var num = 0,
            site = 0,
            startTime, endTime;
        for (var a = ev_list.length - 1; a >= 0; a--) { // 先清空需要设置的数据，有mz、sy、sx
            if (ev_list[a].type == type) {
                ev_list.splice(a, 1);
            }
        }
        // 58 = 行数 * 3 - 2
        if (array && array.length) {
            for (var a = 0; a < array.length; a++) { // 循环用药或者输血、输液数据
                if (type == 'zl' && a < 11) { // 用药只需要11条，超过11条的数据不做显示，放到备注栏里面
                    site = 58 - a * 3; // 算出每一条用药信息的位置，及所在echart1上的行数
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
                            durable: endTime > startTime ? 1 : 0,
                            startTime: startTime, // 开始时间
                            endTime: endTime, // 结束时间
                            evId: array[a].ioeventList[b].inEventId // 事件的Id
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
                            durable: endTime > startTime ? 1 : 0,
                            startTime: startTime, // 开始时间
                            endTime: endTime, // 结束时间
                            evId: array[a].egressList[b].egressId
                        })
                    }
                }
            }
        }
    }

    function initEvConfig() { // 绑定用药输液数据到表格上
        var evIndex = 0,
            evOpt = (function() {
                var len = 0;
                var size = 5; // 把echart1的X轴间隔细分成5份
                var curTime, nextTime, timeSpan;
                var res = { x: [], y: [] };
                while (len < pageSize) {
                    curTime = vm.tempTime[len].value; // vm.tempTime是缓存的偏移以后的echart2没有分10份的X轴数据，echart1也要用偏移的数据
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
        $scope.eConfig1.dataLoaded = false;
        $scope.eOption1.xAxis[0].data = angular.copy(evOpt.x); // 初始化echart1的X轴数据
        for (var a = 0; a < eChartRow1; a++) {
            $scope.eOption1.series[a].data = angular.copy(evOpt.y); // 初始化echart1的Y轴数据
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
                        symbolSize: [4, 10],
                        // itemStyle: {
                        // },
                        // label: {
                        //     show: true,
                        //     formatter: dosageStr + ' ' + thickStr + ' ' + flowStr,
                        //     position: [len <= 10 ? 5 : -5, -12]
                        // }
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: dosageStr + ' ' + thickStr + ' ' + flowStr,
                                    position: [len <= 10 ? 5 : -5, -12]
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
                            symbolSize: [4, 10],
                            mark: 'end'
                        }
                    } else {
                        var symSize = 3,
                            color = '#8e8e8e',
                            thickStr = '',
                            flowStr = '',
                            detailList = $filter('filter')(ev_list[a].detailList, function(e, k) {
                                return e.startTime == curTime.value && k > 0;
                            });
                        if (detailList && detailList.length > 0) {
                            symSize = 10;
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
                                        position: [0, -13]
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

    function initSign() { // 标记点
        $timeout(function() {
            var eachWidth = $('.echart2').width() / (pageSize - 1), // 算出每一小格格物理距离
                seriesList = $scope.eOption2.series[$scope.eOption2.series.length - 1].data, // 得到最后一条标记的数据
                signCount = 0,
                index = 1;
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = ''; // 初始化标记数据都为空
            }
            var anaeseventList = [];
            for (var item of $scope.backList) {
                if (item.eventName === 'anaesevent') {
                    anaeseventList.push(item);
                }
            }
            var value = -5, position_ = 0;
            for (var a = 0; a < $scope.startOper.anaeseventList.length; a++) {
                if ($scope.startOper.anaeseventList[a].code >= 2 && $scope.startOper.anaeseventList[a].code != 9) {
                    var evStartTime = new Date($filter('date')(new Date($scope.startOper.anaeseventList[a].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                    var isOk = false,
                        diffTime = 0;
                    if (a > 0) {
                        var upTime = new Date($filter('date')(new Date($scope.startOper.anaeseventList[a - 1].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                        diffTime = evStartTime - upTime;
                        if (diffTime <= 30000) {
                            value += 5;
                            position_ -= 5;
                        }else {
                            value = -5;
                            position_ = 0;
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
                                    if (evObj.src)
                                        signCount += 1;
                                    seriesList[temp] = {
                                        value: value,
                                        name: evObj.name,
                                        symbol: 'image://' + evObj.src,
                                        symbolSize: 15,
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
                                        for (var item of anaeseventList) {
                                            if (item.code === $scope.startOper.anaeseventList[a].code) {
                                                seriesList[temp].name = $scope.startOper.anaeseventList[a].codeName;
                                                seriesList[temp].symbol = 'image://app/img/white.png';
                                                seriesList[temp].symbolSize = 7;
                                                seriesList[temp].itemStyle.normal.label.formatter = index + '';
                                                seriesList[temp].itemStyle.normal.label.position = [3, position_];
                                                seriesList[temp].itemStyle.normal.label.fontSize = 12;
                                                seriesList[temp].itemStyle.normal.label.show = true;
                                            }
                                        }
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

    function getXdtData() { // 获取心电图数据
        IHttp.post('operCtl/getPupilData', { regOptId: regOptId, inTime: inTime, size: pageSize, no: $scope.view.pageCur }).then(function(rs) {
            vm.pupilDataList = rs.data.pupilDataList;
        });
    }

    function getNewMon() { // 术中记录数据获取
        var monDataList = [];
        var RESPList = historyData;
        anesRecordServe_yxrm.getNewMon(regOptId, inTime, pageSize, $scope.view.pageCur).then(function(rs) {
            monDataList = rs.data.monDataList;
            for (var monData of monDataList) {
                for (var respEnt of RESPList) {
                    if (respEnt.symbol && respEnt.time == monData.time && (respEnt.symbol.indexOf("ico-fzhx") >= 0 || respEnt.symbol.indexOf("ico-kzhx") >= 0)) {
                        monData.showIE = true;
                    }
                }
            }
            vm.monDataList = monDataList;
        });
    }

    function oiSelectChange(docId) { // 监听数据进行保存操作
        $scope.$watch('startOper.optLatterDiagList', function(list, old) {
            anesRecordServe_yxrm.watchLists.saveOptLatterDiag(docId, list, old);
        }, true);
        $scope.$watch('startOper.optRealOperList', function(list, old) {
            anesRecordServe_yxrm.watchLists.saveOptRealOper(docId, list, old);
        }, true);
        $scope.$watch('startOper.realAnaesList', function(list, old) {
            anesRecordServe_yxrm.watchLists.saveRealAnaesMethod(docId, list, old);
        }, true);
        $scope.$watch('startOper.anaesRecord.optBodys', function(val) {
            if (!angular.isArray(val)) return;
            anesRecordServe_yxrm.changeRadio($scope.startOper);
        });
        $scope.$watch('startOper.anesDocList', function(list, old) {
            if (list == old) return;
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '03', role: 'A', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordServe_yxrm.saveParticipant(params);
        }, true);
        $scope.$watch('startOper.operatDocList', function(list, old) {
            if (list == old) return;
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '07', role: 'O', userLoginName: item.operatorId ? item.operatorId : item.id });
            }
            anesRecordServe_yxrm.saveParticipant(params);
        }, true);
        $scope.$watch('startOper.instruNurseList', function(list, old) {
            if (list == old) return;
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '04', role: 'N', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordServe_yxrm.saveParticipant(params);
        }, true);
        $scope.$watch('startOper.nurseList', function(list, old) {
            if (list == old) return;
            var params = [];
            for (var item of list) {
                params.push({ docId: docId, name: item.name, operatorType: '05', role: 'N', userLoginName: item.id ? item.id : item.userName });
            }
            anesRecordServe_yxrm.saveParticipant(params);
        }, true);
    }

    function updateEnterRoomTime(inTime, anaEventId, code, callback) { // 更新入室时间
        anesRecordServe_yxrm.updateEnterRoomTime(regOptId, inTime, docId, anaEventId, code).then(function(result) {
            if (result.data.resultCode != '1') return;
            if (callback) callback(result.data.anaeseventList); // 此回调是麻醉事件弹框里面修改了入室时间后进行的回调
            $scope.startOper.anaeseventList = result.data.anaeseventList;
            inTime = $filter('filter')($scope.startOper.anaeseventList, function(item) {
                return item.code == 1;
            })[0].occurTime;
            $scope.view.pageCur = 1; // 只要跟新了入室时间，就跳转到第一页
            getobsData();
        });
    }

    function saveTime(nowTime, anaEventId, code) { // 保存麻醉事件
        $scope.saved = false;
        anesRecordServe_yxrm.saveAnaesevent(anaEventId, docId, code, operState, nowTime).then(function(result) {
            if (result.data.resultCode != '1') return;
            $scope.startOper.anaeseventList = result.data.resultList;
            initSign();
            showRemark(docId);
            $scope.saved = true;
            if (code == 5) anaesOperTime(docId);
        });
    }

    function searchEventList(opt) { // 用药、输液、输血处理方法
        anesRecordServe_yxrm.searchEventList(opt).then(function(result) {
            if (result.data.resultCode != '1') return;
            $scope.startOper[opt.key] = result.data.resultList;           
            if (opt.canve) {
                setOption(opt.canve, result.data.resultList);
                initEvConfig();
                showRemark(docId);
            }
        });
    }

    function refMedicalChart(params, type) {
        anesRecordServe_yxrm.searchEventList(params).then(function(result) {
            if (result.data.resultCode !== '1') return;
            $scope.startOper[params.key] = result.data.resultList;
            setOption(type, result.data.resultList);
            initEvConfig();
        });
    }

    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }

    
}
