module.exports = anesRecordServe;

anesRecordServe.$inject = ['$rootScope', 'IHttp', 'auth', '$filter'];

function anesRecordServe($rootScope, IHttp, auth, $filter) {
    let user = auth.loginUser();
    let timer_rt;
    let self = {
        asaLevel: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'asa_level' }),
        optBody: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'opt_body' }),
        leaveTo: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'leave_to' }),
        /*
         * anaes_level: 麻醉分级
         */
        getSysCode: function(type) {
            return IHttp.post("basedata/searchSysCodeByGroupId", { groupId: type });
        },
        startOper: function(regOptId, pageState) {
            return IHttp.post('operCtl/startOper', { regOptId: regOptId, accessSource: pageState == 0 ? 'start' : '' });
        },
        getObsData: function(regOptId, pageCur, pageSize, inTime) {
            return IHttp.post('operCtl/getobsData', { regOptId: regOptId, no: pageCur, size: pageSize, inTime: inTime });
        },
        getObsDataNew: function(regOptId, inTime, startTime) {
            return IHttp.post('operCtl/getobsDataNew', { regOptId: regOptId, inTime: inTime, startTime: startTime });
        },
        getIntervalObsData: function(regOptId, hisTimes, freq, pageCur, pageSize, inTime) {
            return IHttp.post('operCtl/getIntervalObsData', { regOptId: regOptId, times: hisTimes, freq: freq, no: pageCur, size: pageSize, inTime: inTime });
        },
        anaesOperTime: function(docId) {
            return IHttp.post("operation/searchTimesByCode", { docId: docId });
        },
        totleIoEvent: function(id) {
            return IHttp.post("operation/totleIoEvent", { docId: id });
        },
        startTimerRt: function(regOptId) {
            start_rt();

            function rtData_() {
                self.rtData(regOptId, function(msg, list) {
                    start_rt();
                });
            }

            function start_rt() {
                if (timer_rt)
                    clearTimeout(timer_rt);
                timer_rt = setTimeout(rtData_, 1000);
            }
        },
        stopTimerRt: function() {
            clearTimeout(timer_rt);
        },
        /*
         * bloodNum (bloodinIoeventList | sx)：输血
         * infusionNum (transfusioninIoeventList | sy)：入量 / 输液
         * medEventNum (treatMedEvtList | zl)：治疗用药 / 用药情况
         * egressNum (outIoevent | cl)：出量
         * anaesMedNum (anaesMedEvtList | mz)：麻醉用药
         * anaesEvtNum 记录麻醉事件
         * startTime 当前页的开始时间
         * endTime 当前页的结束时间，用来查询范围值内备注栏信息
         */
        searchAllEventList: function(callback, docId, bloodNum, infusionNum, medEventNum, egressNum, anaesMedNum, anaesEvtNum, startTime, endTime, lastPage, leaveTo) {
            var self = this;
            IHttp.post("operation/searchAllEventList", { docId: docId, bloodNum: bloodNum, infusionNum: infusionNum, medEventNum: medEventNum, egressNum: egressNum, anaesMedNum: anaesMedNum, anaesEvtNum: anaesEvtNum, startTime: startTime, endTime: endTime }).then(function(result) {
                if (result.data.resultCode != '1') return;
                var res = result.data,
                    list = [], // 对象数组，带isTitle的是事件的头
                    arr = [];
                res = self.addPacuRecData(res);
                if (res.anaesevent && res.anaesevent.length > 0) { // 始终让麻醉事件放第一位
                    list.push({ isTitle: true, name: self.getEventName['anaesevent'] });
                    for (var n = 0; n < res.anaesevent.length; n++) {
                        res.anaesevent[n].eventName = 'anaesevent';
                        list.push(res.anaesevent[n]);
                    }
                }
                for (var i in res) {
                    arr = [];
                    if (i == 'anaesevent' || i == 'resultCode' || i == 'resultMessage') continue;
                    if (lastPage && i == 'analgesicMedEvt' && res[i].analgesicMethod.length > 0 || res[i].length > 0 || i == 'inPacuInfo' || i == 'atPacuInfo' || i == 'outPacuInfo') {
                        if (i == 'inPacuInfo') {
                            if (leaveTo == '2' && res[i].enterTime != '' || res[i].enterTemp != '' || self.getTrachealIntub(res[i].trachealIntub) != 'undefined' || self.getTrachealCatheter(res[i].trachealCatheter) != 'undefined' || self.getConscious(res[i].conscious) != 'undefined') {
                                list.push({ isTitle: true, name: self.getEventName[i] });
                            }
                        } else if (i == 'atPacuInfo') {
                            if (leaveTo == '2' && res[i].ventilatorTime != '' || self.getTrachealCatheterExt(res[i]) != 'undefined' || self.getCutDressings(res[i].cutDressings) != 'undefined' || self.getSputumSuction(res[i]) != 'undefined' || self.getVomit(res[i].vomit) != 'undefined') {
                                list.push({ isTitle: true, name: self.getEventName[i] });
                            }
                        } else if (i == 'outPacuInfo') {
                            if (leaveTo == '2' && res[i].exitTime != '' || res[i].sense != '' || self.getVenousPatency(res[i].venousPatency) != 'undefined' || res[i].stewardScore != '' || self.getLeaveTo(res[i].leaveTo) != 'undefined') {
                                list.push({ isTitle: true, name: self.getEventName[i] });
                            }
                        } else {
                            list.push({ isTitle: true, name: self.getEventName[i] });
                        }
                        if (i == 'analgesicMedEvt') {
                            if (res[i].analgesicMethod == 0)
                                list.push({ analgesicMethod: '镇痛方式: 无' });
                            else if (res[i].analgesicMethod == 1)
                                list.push({ analgesicMethod: '镇痛方式: PCIA' });
                            else if (res[i].analgesicMethod == 2)
                                list.push({ analgesicMethod: '镇痛方式: PCEA' });
                            else if (res[i].analgesicMethod == 3)
                                list.push({ analgesicMethod: '镇痛方式: PCSA' });
                            else if (res[i].analgesicMethod == 4)
                                list.push({ analgesicMethod: '镇痛方式: PCNA' });

                            if (res[i].flow1 && res[i].flow2)
                                list.push({ flow: '流速：' + res[i].flow1 + ' ' + res[i].flowUnit1 + '，' + res[i].flow2 + ' ' + res[i].flowUnit2 });
                            else if (res[i].flow1)
                                list.push({ flow: '流速：' + res[i].flow1 + ' ' + res[i].flowUnit1 });
                            else if (res[i].flow2)
                                list.push({ flow: '流速：' + res[i].flow2 + ' ' + res[i].flowUnit2 });

                            arr = angular.copy(res[i].analgesicMedEvtList);
                        } else if (i == 'inPacuInfo') {
                            arr.push(angular.copy(res[i]));
                        } else if (i == 'atPacuInfo') {
                            arr.push(angular.copy(res[i]));
                        } else if (i == 'outPacuInfo') {
                            arr.push(angular.copy(res[i]));
                        } else {
                            arr = angular.copy(res[i]);
                        }
                    }

                    for (var j = 0; j < arr.length; j++) {
                        if (i == 'ctlBreath') {
                            list.push({ eventName: i, type: arr[j].type, startTime: arr[j].startTime });
                            continue;
                        }
                        if (i == 'otherevent') {
                            list.push({ eventName: i, title: arr[j].title, startTime: arr[j].startTime });
                            continue;
                        }
                        if (i == 'shiftChange') {
                            list.push({ eventName: i, shiftChangedPeople: arr[j].shiftChangedPeople, shiftChangedPeopleId: arr[j].shiftChangedPeopleId, shiftChangePeople: arr[j].shiftChangePeople, shiftChangePeopleId: arr[j].shiftChangePeopleId, shiftChangeTime: arr[j].shiftChangeTime });
                            continue;
                        }
                        if (i == 'rescueevent') {
                            list.push({ eventName: i, model: arr[j].model, startTime: arr[j].startTime });
                            continue;
                        }
                        if (i == 'checkeventList') {
                            list.push({ eventName: i, cheEventName: arr[j].cheEventName, cheEventDetail: arr[j].checkeventItemRelationList, occurTime: arr[j].occurTime });
                            continue;
                        }
                        if (i == 'infusionList' && user.beCode === 'hbgzb') {
                            list.push({ eventName: i, name: arr[j].name, dosageAmount: arr[j].dosageAmount, dosageUnit: arr[j].dosageUnit, startTime: arr[j].startTime, endTime: arr[j].endTime });
                            continue;
                        }
                        if (i == 'bloodList' && user.beCode === 'hbgzb') {
                            list.push({ eventName: i, name: arr[j].name, blood: arr[j].blood, dosageAmount: arr[j].dosageAmount, dosageUnit: arr[j].dosageUnit, startTime: arr[j].startTime, endTime: arr[j].endTime });
                            continue;
                        }
                        if (i == 'inPacuInfo') {
                            if (arr[j].enterTime != '')
                                list.push({ eventName: i, name: '入PACU时间', value: arr[j].enterTime ? $filter('date')(new Date(arr[j].enterTime), 'HH:mm') : '' });
                            if (arr[j].enterTemp != '')
                                list.push({ eventName: i, name: '入室体温', value: arr[j].enterTemp + '℃' });
                            if (self.getTrachealIntub(arr[j].trachealIntub) != 'undefined')
                                list.push({ eventName: i, name: '气管插管', value: self.getTrachealIntub(arr[j].trachealIntub) });
                            if (self.getTrachealCatheter(arr[j].trachealCatheter) != 'undefined')
                                list.push({ eventName: i, name: '气管导管', value: self.getTrachealCatheter(arr[j].trachealCatheter) });
                            if (self.getConscious(arr[j].conscious) != 'undefined')
                                list.push({ eventName: i, name: '意识', value: self.getConscious(arr[j].conscious) });
                            continue;
                        }
                        if (i == 'atPacuInfo') {
                            if (arr[j].ventilatorTime != '')
                                list.push({ eventName: i, name: '上呼吸机时间', value: arr[j].ventilatorTime ? $filter('date')(new Date(arr[j].ventilatorTime), 'HH:mm') : '' });
                            if (self.getTrachealCatheterExt(arr[j]) != 'undefined')
                                list.push({ eventName: i, name: '拔气管导管时间', value: self.getTrachealCatheterExt(arr[j]) });
                            if (self.getCutDressings(arr[j].cutDressings) != 'undefined')
                                list.push({ eventName: i, name: '切口敷料', value: self.getCutDressings(arr[j].cutDressings) });
                            if (self.getSputumSuction(arr[j]) != 'undefined')
                                list.push({ eventName: i, name: '吸痰', value: self.getSputumSuction(arr[j]) });
                            if (self.getVomit(arr[j].vomit) != 'undefined')
                                list.push({ eventName: i, name: '呕吐', value: self.getVomit(arr[j].vomit) });
                            continue;
                        }
                        if (i == 'outPacuInfo') {
                            if (arr[j].exitTime != '')
                                list.push({ eventName: i, name: '出PACU时间', value: arr[j].exitTime ? $filter('date')(new Date(arr[j].exitTime), 'HH:mm') : '' });
                            if (arr[j].sense != '')
                                list.push({ eventName: i, name: '神志', value: arr[j].sense });
                            if (self.getVenousPatency(arr[j].venousPatency) != 'undefined')
                                list.push({ eventName: i, name: '静脉通畅', value: self.getVenousPatency(arr[j].venousPatency) });
                            if (arr[j].stewardScore != '')
                                list.push({ eventName: i, name: 'Steward苏醒评分', value: arr[j].stewardScore });
                            if (self.getLeaveTo(arr[j].leaveTo) != 'undefined')
                                list.push({ eventName: i, name: '出室去向', value: self.getLeaveTo(arr[j].leaveTo) });
                        }
                        if (arr[j].medicalEventList && arr[j].medicalEventList.length > 0) {
                            arr[j].medicalEventList.forEach(function(item) {
                                list.push({ eventName: i, name: item.name, dosage: item.dosage, dosageUnit: item.dosageUnit, startTime: item.startTime ? $filter('date')(new Date(item.startTime), 'HH:mm') : '', endTime: item.endTime ? $filter('date')(new Date(item.endTime), 'HH:mm') : '', durable: item.durable, flow: item.flow, flowUnit: item.flowUnit, thickness: item.thickness, thicknessUnit: item.thicknessUnit });
                            });
                            continue;
                        }
                        if (arr[j].egressList && arr[j].egressList.length > 0) {
                            arr[j].egressList.forEach(function(item) {
                                list.push({ eventName: i, name: item.name, value: item.value, dosageUnit: item.dosageUnit, startTime: item.startTime ? $filter('date')(new Date(item.startTime), 'HH:mm') : '' });
                            });
                            continue;
                        }
                        if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
                            arr[j].ioeventList.forEach(function(item) {
                                list.push({ eventName: i, name: item.name, dosageAmount: item.dosageAmount, dosageUnit: item.dosageUnit, startTime: item.startTime ? $filter('date')(new Date(item.startTime), 'HH:mm') : '', endTime: item.endTime ? $filter('date')(new Date(item.endTime), 'HH:mm') : '' });
                            });
                            continue;
                        }
                        if (arr[j].vaildCheckItems && arr[j].vaildCheckItems.length > 0) {
                            arr[j].vaildCheckItems.forEach(function(item) {
                                list.push({ eventName: 'checkdetail', name: item.name, value: item.value, unit: item.unit });
                            });
                            continue;
                        }
                    }
                }
                if (list.length % 9 != 0) {
                    for (var h = 0; h < list.length % 9; h++) {
                        list.push({ id: 1 });
                    }
                }
                callback(list);
            });
        },
        getEvIcon: function(code) {
            if (code == 2)
                return { name: '麻醉开始', src: 'app/img/ico-mzsz.png' };
            else if (code == 3 || (code == 41 && user.beCode == 'hbgzb'))
                return { name: '气管插管', src: 'app/img/ico-qgcg.png' };
            else if (code == 4)
                return { name: '手术开始', src: 'app/img/ico-ssks.png' };
            else if (code == 5)
                return { name: '手术结束', src: 'app/img/ico-ssjs.png' };
            else if (code == 6 || (code == 42 && user.beCode == 'hbgzb'))
                return { name: '气管拔管', src: 'app/img/ico-qgbg.png' };
            else
                return { name: '', src: '' };
        },
        queryItem: function(query, url, callback) {
            IHttp.post("basedata/" + url, { filters: [{ field: 'pinYin', value: query }] }).then(function(result) {
                if (result.data.resultCode != '1') return;
                callback(result.data.resultList);
            });
        },
        rtData: function(regOptId, callback) {
            IHttp.post("operCtl/getrtData", { regOptId: regOptId }).then(function(result) {
                if (result.data.resultCode != '1') return;
                var msg = '';
                result.data.devices.forEach(function(item) {
                    if (item.status == 0) {
                        msg += item.deviceName + '、';
                    }
                });
                callback(msg.substr(0, msg.length - 1), result.data.monitorList);
            });
        },
        getEventName: {
            checkeventList: '检验事件',
            otherevent: '其它事件',
            ctlBreath: '呼吸事件',
            rescueevent: '抢救事件',
            shiftChange: '交换班事件',
            medicalevent: '用药事件',
            infusionList: '输液',
            bloodList: '输血',
            egress: '出量',
            anaesevent: '麻醉事件',
            analgesicMedEvt: '镇痛事件',
            inPacuInfo: '入复苏室',
            atPacuInfo: '复苏中',
            outPacuInfo: '出复苏室'
        },
        eChart1: {
            config: function(fn, isDrag) {
                return {
                    dataLoaded: true,
                    drag: isDrag != 1,
                    dir: 'x',
                    event: [{
                        dblclick: fn
                    }]
                }
            },
            option: function(row, col, formatter) {
                return {
                    grid: {
                        top: -21,
                        left: -25,
                        right: 0,
                        bottom: -20,
                        containLabel: true
                    },
                    tooltip: {
                        formatter: formatter
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: {
                            show: false,
                            interval: 0
                        },
                        splitLine: {
                            show: true,
                            interval: 4,
                            lineStyle: {
                                color: 'red',
                                type: 'dashed',
                                opacity: 0.5
                            }
                        },
                        data: []
                    }, {
                        type: 'category',
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { show: false },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'red',
                                opacity: 0.8
                            }
                        },
                        data: (function() {
                            var list = [];
                            for (var i = 0; i < col; i++)
                                list.push(i);
                            return list;
                        })()
                    }],
                    yAxis: [{
                        min: 0,
                        max: row * 3,
                        interval: 3,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { show: false },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'red',
                                type: 'dashed',
                                opacity: 0.5
                            },
                            interval: 0
                        }
                    }],
                    series: (function() {
                        var list = [];
                        for (var i = 0; i < row; i++) {
                            list.push({
                                type: 'line',
                                lineStyle: { normal: { width: 1 } },
                                itemStyle: { normal: { color: '#000' } },
                                data: []
                            });
                        }
                        return list;
                    })()
                }
            }
        },
        eChart2: {
            config: function(fn, isDrag) {
                return {
                    dataLoaded: true,
                    drag: isDrag != 1,
                    dir: 'y',
                    event: [{
                        click: fn
                    }]
                }
            },
            option: function(col, yArr, grid) {
                return {
                    grid: grid || {
                        top: -21,
                        left: -30,
                        right: -44,
                        bottom: -20,
                        containLabel: true
                    },
                    tooltip: {
                        formatter: function(params) {
                            var seriesName = params.seriesName,
                                name = $filter('date')(params.data.time, 'yyyy-MM-dd HH:mm:ss'),
                                value = params.data.value,
                                unit = params.data.units;
                            if (params.seriesName == 'mark') {
                                seriesName = params.data.name;
                                name = params.name;
                                return seriesName + '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' + params.color + '"></i>' + name + '</div>';
                            } else
                                return seriesName + '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' + params.color + '"></i>' + name + ' &nbsp;&nbsp;' + value + '(' + unit + ')</div>';
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: {
                            show: false,
                            interval: 0
                        },
                        splitLine: {
                            show: true,
                            interval: 9,
                            lineStyle: {
                                color: 'red',
                                type: 'dashed',
                                opacity: 0.5
                            }
                        },
                        data: []
                    }, {
                        type: 'category',
                        axisTick: { show: false },
                        axisLine: { show: false },
                        axisLabel: { show: false },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'red',
                                opacity: 0.8
                            }
                        },
                        data: (function() {
                            var list = [];
                            for (var i = 0; i < col; i++)
                                list.push(i);
                            return list;
                        })()
                    }],
                    yAxis: (function() {
                        var res = [];

                        for (var i = 0; i < yArr.length; i++) {
                            res.push({
                                type: 'value',
                                min: yArr[i].min,
                                max: yArr[i].max,
                                interval: yArr[i].interval,
                                axisTick: { show: false },
                                axisLine: { show: false },
                                axisLabel: { show: false },
                                splitLine: { show: false }
                            });
                            // 显示找点区域X轴辅助线
                            if (i == 0) {

                                res[i].splitLine.show = true;
                                res[i].splitLine.lineStyle = {
                                    color: ['red'],
                                    type: 'dashed',
                                    opacity: 0.5
                                }
                            }
                        }
                        return res;
                    })(),
                    series: []
                }
            }
        },
        getYAxis: function(rsArr, refArr) {
            var res = [];
            for (var a = 0; a < refArr.length; a++) {
                res.push(angular.extend({}, rsArr[a], refArr[a]));
            }
            return res;
        },
        firstSpot: function(inTime, regOptId, docId) {
            return IHttp.post("operCtl/firstSpot", { inTime: inTime, regOptId: regOptId, docId: docId });
        },
        getPupilData: function(regOptId, inTime, pageSize, pageCur, callback) {
            IHttp.post("operCtl/getPupilData", { regOptId: regOptId, inTime: inTime, size: pageSize, no: pageCur }).then(function(result) {
                if (result.data.resultCode != '1') return;
                result.data.pupilDataList.forEach(function(item) {
                    if (item.left) item.left = item.left - 0;
                    if (item.right) item.right = item.right - 0;
                });
                callback(result.data.pupilDataList);
            });
        },
        getNewMon: function(regOptId, inTime, pageSize, pageCur) {
            return IHttp.post("operCtl/getmonData", { regOptId: regOptId, inTime: inTime, size: pageSize, no: pageCur });
        },
        editInfo: function(regOptId, height, weight) {
            IHttp.post("operation/saveRegOptWH", { regOptId: regOptId, height: height, weight: weight });
        },
        changeRadio: function(startOper) {
            try {
                startOper.anaesRecord.patAnalgesia = JSON.stringify(startOper.anaesRecord.patAnalgesia_);
                startOper.anaesRecord.optBody = JSON.stringify(startOper.anaesRecord.optBodys);
            } catch (e) {}
            var param = {
                anaRecordId: startOper.anaesRecord.anaRecordId,
                state: startOper.regOpt.state,
                regOptId: startOper.anaesRecord.regOptId,
                asaLevel: startOper.anaesRecord.asaLevel,
                asaLevelE: startOper.anaesRecord.asaLevelE,
                anaesLevel: startOper.anaesRecord.anaesLevel,
                optLevel: startOper.anaesRecord.optLevel,
                frontOperForbidTake: startOper.regOpt.frontOperForbidTake,
                patAnalgesia: startOper.anaesRecord.patAnalgesia,
                frontOperSpecialCase: startOper.regOpt.frontOperSpecialCase,
                postOperState: startOper.anaesRecord.postOperState,
                leaveTo: startOper.anaesRecord.leaveTo,
                optBodys: startOper.anaesRecord.optBodys == '' ? [] : startOper.anaesRecord.optBodys,
                medicineKeep: startOper.anaesRecord.medicineKeep
            }
            IHttp.post("document/updateAnaesRecord", param);
        },
        initData: function(data) {
            data.regOpt.emergency = data.regOpt.emergency + '';
            data.regOpt.frontOperForbidTake = data.regOpt.frontOperForbidTake + '';
            try {
                if (data.anaesRecord.patAnalgesia) {
                    data.anaesRecord.patAnalgesia_ = JSON.parse(data.anaesRecord.patAnalgesia);
                } else {
                    data.anaesRecord.patAnalgesia_ = {};
                }
                if (data.anaesRecord.optBody) {
                    // data.anaesRecord.optBody_ = JSON.parse(data.anaesRecord.optBody);
                } else {
                    data.anaesRecord.optBody_ = [];
                }
            } catch (e) {
                console.error(e);
                data.anaesRecord.patAnalgesia_ = {};
                data.anaesRecord.optBody_ = [];
            }
            return data;
        },
        watchLists: {
            save: function(url, params) {
                IHttp.post("operation/" + url, params);
            },
            saveOptLatterDiag: function(docId, list, old) {
                if (list == old) return;
                var url = "saveOptLatterDiag",
                    params = [];
                if (list.length) {
                    list.forEach(function(item) {
                        params.push({ docId: docId, diagDefId: item.diagDefId, name: item.name });
                    });
                } else {
                    params[0] = { docId: docId, diagDefId: '', name: '' };
                }
                this.save(url, params);
            },
            saveOptRealOper: function(docId, list, old) {
                if (list == old) return;
                var url = "saveOptRealOper",
                    params = [];
                if (list.length) {
                    list.forEach(function(item) {
                        params.push({ docId: docId, operDefId: item.operDefId, name: item.name });
                    });
                } else {
                    params[0] = { docId: docId, operDefId: '', name: '' };
                }
                this.save(url, params);
            },
            saveRealAnaesMethod: function(docId, list, old) {
                if (list == old) return;
                var url = "saveRealAnaesMethod",
                    params = [];
                if (list.length) {
                    list.forEach(function(item) {
                        params.push({ docId: docId, anaMedId: item.anaMedId, name: item.name });
                    });
                } else {
                    params[0] = { docId: docId, anaMedId: '', name: '' };
                }
                this.save(url, params);
            },
            saveRegOptDesigned: function(regOptId, regOpt) {
                var url = "saveRegOptDesigned",
                    designedOptCode = [],
                    designedOptName = [],
                    diagnosisCode = [],
                    diagnosisName = [];
                if (regOpt.diagnosisCodes.length) {
                    regOpt.diagnosisCodes.forEach(function(item) {
                        diagnosisCode.push(item.diagDefId);
                        diagnosisName.push(item.name);
                    });
                }
                if (regOpt.designedOptCodes.length) {
                    regOpt.designedOptCodes.forEach(function(item) {
                        designedOptCode.push(item.operDefId);
                        designedOptName.push(item.name);
                    });
                }
                params = {
                    regOptId: regOptId,
                    designedOptCodes: regOpt.designedOptCodes,
                    designedOptCode: designedOptCode.join(','),
                    designedOptName: designedOptName.join(','),
                    diagnosisCodes: regOpt.diagnosisCodes,
                    diagnosisCode: diagnosisCode.join(','),
                    diagnosisName: diagnosisName.join(',')
                };
                this.save(url, params);
            }
        },
        updateEnterRoomTime: function(regOptId, inTime, docId, anaEventId, code) {
            return IHttp.post("operCtl/updateEnterRoomTime", { regOptId: regOptId, inTime: inTime, docId: docId, code: code, anaEventId: anaEventId });
        },
        saveAnaesevent: function(anaEventId, docId, code, operState, nowTime) {
            return IHttp.post("operation/saveAnaesevent", { anaEventId: anaEventId, docId: docId, code: code, state: operState, occurTime: nowTime });
        },
        saveParticipant: function(params) {
            return IHttp.post("operation/saveParticipant", params);
        },
        updobsdat: function(param, regOptId) {
            param.docId = regOptId;
            return IHttp.post("operCtl/updobsdat", param);
        },
        saveMonitorPupil: function(param) {
            IHttp.post("operCtl/saveMonitorPupil", param).then(function(rs) {
                if (rs.data.resultCode == '1') {
                    param.id = rs.data.pupilId;
                }
            });
        },
        endOperation: function(regOptId, docId, state, occurtime, leaveTo, code, reasons) {
            return IHttp.post("operCtl/endOperation", { regOptId: regOptId, reasons: reasons, anaesevent: { docId: docId, state: state, occurTime: occurtime, leaveTo: leaveTo, code: code, docType: '1' } });
        },
        checkInput: function(event, startOper) {
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
            } else if (!startOper.anaesRecord.optLevel && user.beCode == 'qnzrmyy') {
                return '请选择手术等级';
            } else if ((user.beCode == 'hbgzb' || user.beCode == 'sybx') && !startOper.regOpt.frontOperForbidTake) {
                return '请选择术前禁食';
            } else if (!startOper.anaesRecord.optBodys || startOper.anaesRecord.optBodys.length == 0) {
                return '请选择手术体位';
            } else if (!startOper.realAnaesList || startOper.realAnaesList.length == 0) {
                return '麻醉方法不能为空';
            } else if (!startOper.optRealOperList || startOper.optRealOperList.length == 0) {
                return user.beCode == 'nhfe' || user.beCode == 'qnzrmyy' || user.beCode == 'xycdyy' ? '实施手术不能为空' : '手术方式不能为空';
            } else if ((user.beCode == 'nhfe' || user.beCode == 'qnzrmyy' || user.beCode == 'xycdyy') && (!startOper.optLatterDiagList || startOper.optLatterDiagList.length == 0)) {
                return '手术后诊断不能为空';
            } else if (user.beCode == 'hbgzb' && (!startOper.optLatterDiagList || startOper.optLatterDiagList.length == 0)) {
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
        },
        searchEventList: function(opt) {
            return IHttp.post("operation/" + opt.url, opt.param);
        },
        batchHandleObsDat: function(param, callback) {
            if (param.length == 0) return;
            IHttp.post("operCtl/batchHandleObsDat", param).then(function(result) {
                if (result.data.resultCode != '1') return;
                callback();
            });
        },
        searchOperPerson: function(docId, role) {
            return IHttp.post('operation/queryOperPersonListByDocId', { docId: docId, role: role });
        },
        verifyDrugOverTime(docId) { // 验证药品结束时间
            return IHttp.post('operation/searchNoEndTimeList', { docId: docId });
        },
        searchIOAmoutDetail: function(docId) {
            return IHttp.post('operCtl/searchIOAmoutDetail', { docId: docId });
        },
        // id 事件id
        // type 1: 治疗用药， 2：麻醉用药，3：镇痛用药，I：入量，O：出量
        // subType 1：输液，2：输血
        // startTime 开始时间
        // endTime 结束时间
        updateEventTime: function(docId, evId, type, subType, startTime, endTime) {
            if (type == 'zl')
                type = 1;
            else if (type == 'mz')
                type = 2;
            else if (type == 'sy' || type == 'sx')
                type = 'I';
            else if (type == 'cl')
                type = 'O';
            return IHttp.post('operation/updateEventTime', { docId: docId, id: evId, type: type, subType: subType, startTime: $filter('date')(startTime, 'yyyy-MM-dd HH:mm:ss'), endTime: endTime ? $filter('date')(endTime, 'yyyy-MM-dd HH:mm:ss') : '' })
        },
        saveMedicalEventDetail: function(id, docId, medEventId, flow, flowUnit, thickness, thicknessUnit, insertTime, showFlow, showThick) {
            return IHttp.post('operation/saveMedicalEventDetail', { id: id, docId: docId, medEventId: medEventId, flow: flow, flowUnit: flowUnit, thickness: thickness, thicknessUnit: thicknessUnit, insertTime: insertTime, showFlow: showFlow, showThick: showThick });
        },
        searchIoeventGroupByDefIdList: function(params) {
            return IHttp.post('operation/searchIoeventGroupByDefIdList', params);
        },
        searchIoeventList: function(params) {
            return IHttp.post('operation/searchIoeventList', params);
        },
        addPacuRecData: function(data) {
            if (data.docAnaesPacuRec) {
                data.inPacuInfo = data.docAnaesPacuRec;
                data.atPacuInfo = data.docAnaesPacuRec;
                data.outPacuInfo = data.docAnaesPacuRec;
            }
            return data;
        },
        getConscious: function(code) { //意识
            if (code == '1')
                return '未清醒';
            else if (code == '2')
                return '会意';
            else if (code == '3')
                return '睁眼';
            else if (code == '4')
                return '哭啼';
            else
                return 'undefined';
        },
        getTrachealCatheter: function(code) { //气管导管
            if (code == '1')
                return '已拔';
            else if (code == '2')
                return '未拔';
            else
                return 'undefined';
        },
        getTrachealIntub: function(code) { //气管插管
            if (code == '1')
                return '是';
            else if (code == '2')
                return '否';
            else
                return 'undefined';
        },
        getTrachealCatheterExt: function(item) { //拔气管导管
            if (item.trachealCatheterExt == '1')
                return '未拔';
            else if (item.trachealExtTime !== '')
                return $filter('date')(new Date(item.trachealExtTime), 'HH:mm');
            else
                return 'undefined';
        },
        getCutDressings: function(code) { //切口敷料
            if (code == '1')
                return '干净';
            else if (code == '2')
                return '渗血';
            else if (code == '3')
                return '脱落';
            else
                return 'undefined';
        },
        getSputumSuction: function(item) { //吸痰
            var sputumSuction = '';
            if (item.sputumSuction != '') {
                if (JSON.parse(item.sputumSuction).code == 1) {
                    sputumSuction = '有(' + JSON.parse(item.sputumSuction).value + ')';
                } else if (JSON.parse(item.sputumSuction).code == 2) {
                    sputumSuction = '无';
                } else if (JSON.parse(item.sputumSuction).code == 3) {
                    sputumSuction = 'undefined';
                }
            } else {
                sputumSuction = 'undefined';
            }
            return sputumSuction;
        },
        getVomit: function(code) { //呕吐
            if (code == '1')
                return '有';
            else if (code == '2')
                return '无';
            else
                return 'undefined';

        },
        getVenousPatency: function(code) { //静脉通畅
            if (code == '1')
                return '通畅';
            else if (code == '2')
                return '不通畅';
            else
                return 'undefined';

        },
        getLeaveTo: function(code) { //出室去向
            if (code == '1')
                return 'ICU';
            else if (code == '2')
                return '回病房';
            else if (code == '3')
                return '出院';
            else if (code == '4')
                return '死亡';
            else
                return 'undefined';
        }
    }
    return self;
}
