module.exports = anesRecordInter;

anesRecordInter.$inject = ['IHttp', '$filter'];

function anesRecordInter(IHttp, $filter) {
    let self = {
        asaLevel: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'asa_level' }),
        optBody: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'opt_body' }),
        leaveTo: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'leave_to' }),
        pacuLeaveTo: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'pacu_leave_to' }),
        anesthesiaEffect: IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'anaes_effect_level' }),
        /*
         * anaes_level: 麻醉分级
         */
        getSysCode: function(type) {
            return IHttp.post("basedata/searchSysCodeByGroupId", { groupId: type });
        },
        startOper: function(regOptId, pageState,obj) {
            return IHttp.post('operCtl/startOper', angular.merge({},{ regOptId: regOptId, accessSource: pageState === 0 ? 'start' : '' },obj));
        },        
        againStartOper: function(regOptId, operRoomId) {
            return IHttp.post('operCtl/againStartOper', { regOptId: regOptId, operRoomId: operRoomId });
        },
        getObsData: function(regOptId, pageCur, pageSize, inTime, docType) {
            return IHttp.post('operCtl/getobsData', { regOptId: regOptId, no: pageCur, size: pageSize, inTime: inTime, docType: docType });
        },
        getObsDataNew: function(regOptId, inTime, startTime, docType) {
            return IHttp.post('operCtl/getobsDataNew', { regOptId: regOptId, inTime: inTime, startTime: startTime, docType: docType });
        },
        getIntervalObsData: function(regOptId, hisTimes, freq, pageCur, pageSize, inTime, docType) {
            return IHttp.post('operCtl/getIntervalObsData', { regOptId: regOptId, times: hisTimes, freq: freq, no: pageCur, size: pageSize, inTime: inTime, docType: docType });
        },
        anaesOperTime: function(docId) {
            return IHttp.post("operation/searchTimesByCode", { docId: docId });
        },
        totleIoEvent: function(id) {
            return IHttp.post("operation/totleIoEvent", { docId: id });
        },
        searchAllEventListPlus: function(callback, opt) {//可查所有用药 液体 出入量
            return IHttp.post("operation/searchAllEventList", opt)
        },
        /*
         * bloodNum (bloodinIoeventList | sx)：输血
         * infusionNum (transfusioninIoeventList | sy)：入量 / 输液
         * medEventNum (treatMedEvtList | zl)：治疗用药 / 用药情况
         * egressNum (outIoevent | cl)：出量
         * anaesMedNum (anaesMedEvtList | mz)：麻醉用药
         * anaesEvtNum 记录术中事件
         * startTime 当前页的开始时间
         * endTime 当前页的结束时间，用来查询范围值内备注栏信息
         */
        searchAllEventList: function(callback, opt) {
            var self = this,
                getEventName = {
                    checkeventList: '血气分析',
                    otherevent: '其它事件',
                    ctlBreath: '呼吸事件',
                    rescueevent: '抢救事件',
                    shiftChange: '交换班事件',
                    anaesMedevent: '麻醉用药',
                    medicalevent: '治疗用药',
                    infusionList: '输液',
                    bloodList: '输血',
                    egress: '出量',
                    anaesevent: '术中事件',
                    analgesicMedEvt: '镇痛事件',
                    inPacuInfo: '入复苏室',
                    atPacuInfo: '复苏中',
                    outPacuInfo: '出复苏室'
                }
            IHttp.post("operation/searchAllEventList", opt).then(function(result) {

                if (result.data.resultCode != '1') return;
                var res = result.data,
                    list = [], // 对象数组，带isTitle的是事件的头
                    arr = [];
                if (res.anaesevent && res.anaesevent.length > 0) { // 始终让术中事件放第一位
                    list.push({ isTitle: true, name: getEventName['anaesevent'] });
                    for (var n = 0; n < res.anaesevent.length; n++) {
                        res.anaesevent[n].eventName = 'anaesevent';
                        list.push(res.anaesevent[n]);
                    }
                }

                for (var i in res) {
                    arr = [];
                    if (i == 'anaesevent' || i == 'resultCode' || i == 'resultMessage' ) continue;
                    if (opt.lastPage && i == 'analgesicMedEvt' && res[i].analgesicMethod.length > 0 || res[i].length > 0) {
                        list.push({ isTitle: true, name: getEventName[i] });
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
                        } else
                            arr = angular.copy(res[i]);
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
                        if (i == 'infusionList') {
                            if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
                                arr[j].ioeventList.forEach(function(item) {
                                    list.push({ eventName: i, name: item.name, dosageAmount: item.dosageAmount, dosageUnit: item.dosageUnit, blood: item.blood, startTime: item.startTime ? $filter('date')(new Date(item.startTime), 'HH:mm') : '', endTime: item.endTime ? $filter('date')(new Date(item.endTime), 'HH:mm') : '' });
                                });
                            } else
                                list.push({ eventName: i, name: arr[j].name, dosageAmount: arr[j].dosageAmount, dosageUnit: arr[j].dosageUnit, startTime: arr[j].startTime, endTime: arr[j].endTime });
                            continue;
                        }
                        if (i == 'bloodList') {
                            list.push({ eventName: i, name: arr[j].name, blood: arr[j].blood, dosageAmount: arr[j].dosageAmount, dosageUnit: arr[j].dosageUnit, startTime: arr[j].startTime, endTime: arr[j].endTime });
                            continue;
                        }
                        //"medicalevent" 'anaesMedevent' 'analgesicMedEvt'多余治疗药备注 多余麻醉药备注 镇痛方式药品备注
                        if (arr[j].medicalEventList && arr[j].medicalEventList.length > 0) {
                            arr[j].medicalEventList.forEach(function(item) { //
                                list.push({ eventName: i, name: item.name, dosage: item.dosage, dosageUnit: item.dosageUnit, proportion: item.proportion, startTime: item.startTime ? $filter('date')(new Date(item.startTime), 'HH:mm') : '', endTime: item.endTime ? $filter('date')(new Date(item.endTime), 'HH:mm') : '', durable: item.durable, flow: item.flow, flowUnit: item.flowUnit, thickness: item.thickness, thicknessUnit: item.thicknessUnit });
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
        firstSpot: function(inTime, regOptId, docId) {
            return IHttp.post("operCtl/firstSpot", { inTime: inTime, regOptId: regOptId, docId: docId });
        },
        firstSpotBase:function(inTime, regOptId, docId) {
            return IHttp.post("operCtl/firstSpotBase", { inTime: inTime, regOptId: regOptId, docId: docId ,docType:2});
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
        getNewMon: function(regOptId, inTime, pageSize, pageCur, docType) {
            return IHttp.post("operCtl/getmonData", { regOptId: regOptId, inTime: inTime, size: pageSize, no: pageCur, docType: docType });
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
                anaesEffect: startOper.anaesRecord.anaesEffect,
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
        endOperation: function(regOptId, docId, state, occurtime, leaveTo, code, reasons,docType) {
            return IHttp.post("operCtl/endOperation", { regOptId: regOptId, reasons: reasons, anaesevent: { docId: docId, state: state, occurTime: occurtime, leaveTo: leaveTo, code: code }, docType: docType });
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
        searchEgressGroupByDefIdList: function(params) {
            return IHttp.post('operation/searchEgressGroupByDefIdList', params);
        },
        searchCheckeventList: function(docId) {
            return IHttp.post('operation/searchCheckeventList', { docId: docId });
        },
        searchCheckeventItemList: function(docId, cheEventId) {
            return IHttp.post('operation/searchCheckeventItemList', { docId: docId, cheEventId: cheEventId });
        }
    }
    return self;
}