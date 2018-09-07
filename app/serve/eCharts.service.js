module.exports = eCharts;

eCharts.$inject = ['$rootScope', 'auth', '$filter', '$timeout', 'anesRecordInter', 'toastr', 'baseConfig'];

function eCharts($rootScope, auth, $filter, $timeout, anesRecordInter, toastr, baseConfig) {
    let _this = this,
        getMed = baseConfig.getMed(),
        getI = baseConfig.getI(),
        getOther = baseConfig.getOther(),
        user = auth.loginUser();
    _this.config = function(isDrag, dir, eventList, obj) {
        let rowConfig = { //各类行数
            'mzConfig': getMed.mzyRows ? getMed.mzyRows : 0,
            'zlConfig': getMed.zlyRows ? getMed.zlyRows : 0,
            'ztConfig': 0,
            'syConfig': getI.syRows ? getI.syRows : 0,
            'sxConfig': getI.sxRows ? getI.sxRows : 0,
            'clConfig': getOther.oRows ? getOther.oRows : 0,
            'mzyName': getMed.mzyName ? getMed.mzyName : '麻醉药',
            'zlyName': getMed.zlyName ? getMed.zlyName : '治疗药',
            'syName': getI.syName ? getI.syName : '输液',
            'sxName': getI.sxName ? getI.sxName : '输血',
            'oName': getOther.oName ? getOther.oName : '出量'
        };

        function splitNum(num) {
            var result = [];
            for (var i = 0; i < num; i++) {
                result.push(i)
            }
            return result;
        }
        return angular.merge({}, rowConfig, { //各类到最下边的总行数
            'sum': rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig + rowConfig.zlConfig + rowConfig.mzConfig,
            'mzTotal': rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig + rowConfig.zlConfig + rowConfig.mzConfig,
            'zlTotal': rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig + rowConfig.zlConfig,
            'ztTotal': rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig,
            'syTotal': rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig,
            'sxTotal': rowConfig.clConfig + rowConfig.sxConfig,
            'clTotal': rowConfig.clConfig,
            'mzArr': splitNum(rowConfig.mzConfig),
            'zlArr': splitNum(rowConfig.zlConfig),
            'ztArr': splitNum(rowConfig.ztConfig),
            'syArr': splitNum(rowConfig.syConfig),
            'sxArr': splitNum(rowConfig.sxConfig),
            'clArr': splitNum(rowConfig.clConfig),
            dataLoaded: false,
            drag: isDrag != 1,
            dir: dir,
            event: [eventList]
        }, obj ? obj : {});
    }
    _this.config1 = function(isDrag, dir, eventList, obj) {
        return angular.merge({}, {
            dataLoaded: false,
            drag: isDrag != 1,
            isAdd: false,
            selPoint: true,
            dir: dir,
            event: [eventList]
        }, obj);
    }
    _this.medOpt1 = function(col, vm) {
        return {
            grid: {
                top: -1,
                right: 0,
                bottom: 0,
                left: -1
            },
            tooltip: { //提示框显示
                triggerOn: "none",
                formatter: function(params) {
                    var intnum = parseInt(params.data.value[0]);
                    var floatnum = parseFloat((params.data.value[0] - intnum).toFixed(3));
                    var timestamp;
                    if (!floatnum) {
                        timestamp = vm.timeArr49[vm.view.pageCur][intnum][0];
                    } else {
                        timestamp = vm.timeArr49[vm.view.pageCur][intnum][0] + vm.timeArr49[vm.view.pageCur][intnum][2] * floatnum;
                    }
                    return "时间: " + new Date(timestamp * 1000).toLocaleString() + "<br>" + "名称: " + params.data.ev_list.name + "<br>";
                }
            },
            xAxis: [{
                min: 0,
                max: 48,
                type: 'value',
                axisLine: {
                    onZero: false
                },
                interval: 1,
                axisLabel: {
                    rotate: 15,
                    show: false,
                    "interval": 0,
                    formatter: function(value, index) {
                        var date = new Date(value);
                        var texts = [(date.getHours() + 1), date.getSeconds()];
                        if (index % 2 == 0) {
                            //  return new Date(parseInt(value) * 1000).toLocaleString();
                            //+ "," + dataArr[index][2]
                            return (index);
                        }
                    }
                },
                "boundaryGap": false,
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "splitLine": {
                    "show": true,
                    "lineStyle": {
                        "color": "red",
                        "type": "dashed",
                        "opacity": 0.5
                    }
                },
            }, {
                "type": "category",
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "axisLabel": {
                    "show": false
                },
                "splitLine": {
                    "show": true,
                    "lineStyle": {
                        "color": "red",
                        "opacity": 0.8
                    }
                },
                "data": [0, 1, 2, 3, 4, 5, 6, 7]
            }],
            yAxis: [{
                "min": 0,
                "max": vm.medECfg.sum * 3,
                "interval": 3,
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "axisLabel": {
                    "show": false
                },
                "splitLine": {
                    "show": true,
                    "lineStyle": {
                        "color": "red",
                        "type": "dashed",
                        "opacity": 0.5
                    },
                    "interval": 0
                }
            }],
            series: []
        }
    }
    _this.monOpt1 = function(col, yArr) {
        return {
            grid: {
                top: -1,
                right: 0,
                bottom: 0,
                left: -1
            },
            tooltip: {
                triggerOn: "none",
                formatter: function(params) {
                    var seriesName = params.seriesName,
                        name = $filter('date')(params.data.time, 'yyyy-MM-dd HH:mm:ss'),
                        value = params.data.value[1].toFixed(2),
                        unit = params.data.units;
                    // if(params.seriesIndex==2||params.seriesIndex==1){
                    //     value = (params.data.value[1]/10).toFixed(2);
                    // }
                    return seriesName + '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' + params.color + '"></i>' + name + ' &nbsp;&nbsp;' + value + '(' + unit + ')</div>';
                }
            },
            xAxis: [{
                min: 0,
                max: 48,
                type: 'value',
                axisLine: {
                    onZero: false
                },
                interval: 1,
                axisLabel: {
                    rotate: 15,
                    show: false,
                    "interval": 0,
                    formatter: function(value, index) {
                        var date = new Date(value);
                        var texts = [(date.getHours() + 1), date.getSeconds()];
                        if (index % 2 == 0) {
                            //  return new Date(parseInt(value) * 1000).toLocaleString();
                            //+ "," + dataArr[index][2]
                            return (index);
                        }
                    }
                },
                "boundaryGap": false,
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "splitLine": {
                    "show": true,
                    "lineStyle": {
                        "color": "red",
                        "type": "dashed",
                        "opacity": 0.5
                    }
                },
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
                        splitLine: { show: false },
                        axisLine: { onZero: false }
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
                    // if(res[res.length-1].max-res[res.length-1].min>0){//温度中心
                    //    res[res.length-1].max*=10;
                    //    res[res.length-1].min*=10;
                    //    res[res.length-1].interval*=10;
                    // }
                }
                return res;
            })(),
            series: []
        }
    }
    _this.markOpt1 = function(col, row) {
        return {
            grid: {
                top: -1,
                right: 0,
                bottom: 0,
                left: -1
            },
            tooltip: {
                formatter: function(params) {
                    seriesName = params.data.name;
                    name = $filter('date')(params.data.occurTime, 'yyyy-MM-dd HH:mm:ss');
                    return seriesName + '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' + params.color + '"></i>' + name + '</div>';
                }
            },
            xAxis: [{
                min: 0,
                max: 48,
                type: 'value',
                axisLine: {
                    onZero: false
                },
                interval: 1,
                axisLabel: {
                    rotate: 15,
                    show: false,
                    "interval": 0,
                    formatter: function(value, index) {
                        var date = new Date(value);
                        var texts = [(date.getHours() + 1), date.getSeconds()];
                        if (index % 2 == 0) {
                            //  return new Date(parseInt(value) * 1000).toLocaleString();
                            //+ "," + dataArr[index][2]
                            return (index);
                        }
                    }
                },
                "boundaryGap": false,
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "show": false
                },
                "splitLine": {
                    "show": true,
                    "lineStyle": {
                        "color": "red",
                        "type": "dashed",
                        "opacity": 0.5
                    }
                },
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
            yAxis: {
                type: 'value',
                min: 0,
                max: 10,
                interval: 10,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: []
        }
    }
    _this.getYAxis = function(rsArr, refArr) {
        var res = [];
        for (var a = 0; a < refArr.length; a++) {
            res.push(angular.extend({}, rsArr[a], refArr[a]));
        }
        return res;
    }
    _this.getSeries1 = function(result, vm) { // 生成瞄点数据  
        var res = [];
        for (var i = 0; i < result.series.length; i++) {
            res.push(angular.merge({}, angular.copy(result.series[i]), {
                lineStyle: {
                    "normal": {
                        "width": 1,
                        color: "black"
                    }
                },
                itemStyle: {
                    "normal": {
                        color: result.series[i].color ? result.series[i].color : undefined
                    }
                },
                id: result.series[i].name,
                smooth: true,
                symbol: "path://" + result.series[i].symbolSvg,
                animation: false,
                "connectNulls": true
            }));
            for (var j = 0; j < result.series[i].data.length; j++) {
                if (vm.timeArr49) {
                    res[i].data[j].value = [_this.translateTimeValue(result.series[i].data[j].offsetTime ? result.series[i].data[j].offsetTime : result.series[i].data[j].time / 1000, vm.timeArr49[vm.view.pageCur]), result.series[i].data[j].value];
                    res[i].data[j].numValue = result.series[i].data[j].value;
                    res[i].data[j].units = res[i].units;
                    if (result.series[i].data[j].symbolSvg) {
                        res[i].data[j].symbol = "path://" + result.series[i].data[j].symbolSvg;
                    } else {
                        res[i].data[j].symbol = undefined;
                        res[i].data[j].symbolSvg = undefined;
                    }
                }

            }
        }
        return res;
    }
    _this.option = function(type, array, ev_list, vm) { //分别讲字段转换成ev_list
        var num = 0,
            site = 0,
            seriesAarr = [],
            startTime, endTime;
        for (var a = ev_list.length - 1; a >= 0; a--) { // 先清空需要设置的数据，有mz、sy、sx
            if (ev_list[a].type === type) {
                ev_list.splice(a, 1);
            }
        }

        if (array && array.length) {
            for (var a = 0; a < array.length; a++) { // 循环用药或者输血、输液数据
                if (type === 'mz' && a < vm.medECfg.mzConfig) { // 用药只需要6条，超过11条的数据不做显示，放到备注栏里面
                    site = (vm.medECfg.mzTotal * 3) - 2 - a * 3; // 算出每一条用药信息的位置，及所在echart1上的行数
                    for (var b = 0; b < array[a].medicalEventList.length; b++) { // 同一种药肯能在不同的时间段用，所以需要循环处理
                        if (array[a].medicalEventList[b].medDetailList.length > 1) { //持续用药有流速点
                            for (var c = 0; c <= array[a].medicalEventList[b].medDetailList.length; c++) {
                                if (c == 0) { //起点
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }))
                                } else if (c == array[a].medicalEventList[b].medDetailList.length && c > 0) { //终点
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], { site: site, type: type }))
                                } else { //流速点
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b].medDetailList[c], { site: site, type: type, name: array[a].medicalEventList[b].name }))
                                }
                            }
                        } else if (array[a].medicalEventList[b].medDetailList.length == 1) {
                            if (array[a].medicalEventList[b].durable == "1") { //持续无流速点
                                if (!array[a].medicalEventList[b].endTime) { //如果持续用药没填结束时间的,做单点显示
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }));
                                    ev_list.push({ site: site });
                                } else {
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }));
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], { site: site, type: type }));
                                }

                            } else { //单独点
                                ev_list.push({ site: site });
                                ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }))
                                ev_list.push({ site: site });
                            }

                        }
                    }
                } else if (type === 'zl' && a < vm.medECfg.zlConfig) { // 用药只需要5条，超过11条的数据不做显示，放到备注栏里面
                    site = (vm.medECfg.zlTotal * 3) - 2 - a * 3; // 算出每一条用药信息的位置，及所在echart1上的行数
                    for (var b = 0; b < array[a].medicalEventList.length; b++) { // 同一种药肯能在不同的时间段用，所以需要循环处理
                        if (array[a].medicalEventList[b].medDetailList.length > 1) { //持续用药有流速点
                            for (var c = 0; c <= array[a].medicalEventList[b].medDetailList.length; c++) {
                                if (c == 0) { //起点
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }))
                                } else if (c == array[a].medicalEventList[b].medDetailList.length && c > 0) { //终点
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], { site: site, type: type }))
                                } else { //流速点
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b].medDetailList[c], { site: site, type: type, name: array[a].medicalEventList[b].name }))
                                }
                            }
                        } else if (array[a].medicalEventList[b].medDetailList.length == 1) {
                            if (array[a].medicalEventList[b].durable == "1") { //持续无流速点
                                if (!array[a].medicalEventList[b].endTime) { //如果持续用药没填结束时间的,做单点显示
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }));
                                    ev_list.push({ site: site });
                                } else {
                                    ev_list.push({ site: site });
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }));
                                    ev_list.push(angular.merge({}, array[a].medicalEventList[b], { site: site, type: type }));
                                }
                            } else { //单独点
                                ev_list.push({ site: site });
                                ev_list.push(angular.merge({}, array[a].medicalEventList[b], array[a].medicalEventList[b].medDetailList[0], { site: site, type: type }))
                                ev_list.push({ site: site });
                            }

                        }
                    }

                } else if ((type === 'sy' || type === 'sx') && a < vm.medECfg.syConfig + vm.medECfg.sxConfig) { // 输液 输血
                    switch (user.beCode) {
                        case 'sybx':
                            switch (type) {
                                case 'sy':
                                    if (type === 'sy' && a < vm.medECfg.syConfig) {
                                        site = (vm.medECfg.syTotal * 3) - 2 - a * 3;
                                        for (let c = 0; c < array[a].ioeventList.length; c++) {
                                            ev_list.push({ site: site });
                                            ev_list.push(angular.merge({}, array[a].ioeventList[c], { site: site, type: type, subType: 1 }));
                                            ev_list.push(angular.merge({}, array[a].ioeventList[c], { site: site, type: type, subType: 1 }));
                                            ev_list.push({ site: site });
                                        }
                                    }
                                    break;
                                case 'sx':
                                    if (type === 'sx' && a < vm.medECfg.sxConfig) {
                                        site = (vm.medECfg.sxTotal * 3) - 2 - a * 3;
                                        for (let c = 0; c < array[a].ioeventList.length; c++) {
                                            ev_list.push({ site: site });
                                            ev_list.push(angular.merge({}, array[a].ioeventList[c], { site: site, type: type, subType: 2 }));
                                            ev_list.push(angular.merge({}, array[a].ioeventList[c], { site: site, type: type, subType: 2 }));
                                            ev_list.push({ site: site });
                                        }
                                    }
                                    break;
                            }
                            break;
                        default:
                            site = type === 'sy' ? (vm.medECfg.syTotal * 3 - 2 - a * 3) : (vm.medECfg.sxTotal * 3 - 2 - a * 3);
                            for (let c = 0; c < array[a].ioeventList.length; c++) {
                                ev_list.push({ site: site });
                                ev_list.push(angular.merge({}, array[a].ioeventList[c], { site: site, type: type, subType: type === 'sy' ? 1 : 2 }))
                                ev_list.push({ site: site });
                            }
                    }


                } else if ((type == 'cl') && a < vm.medECfg.clConfig) {
                    site = vm.medECfg.clTotal * 3 - 2 - a * 3;
                    for (var c = 0; c < array[a].egressList.length; c++) {
                        ev_list.push({ site: site });
                        ev_list.push(angular.merge({}, array[a].egressList[c], { site: site, type: type }))
                        ev_list.push({ site: site });
                    }
                }
            }
        }
        return ev_list;
    }

    _this.initEvConfig = function(ev_list, vm, print) { // 绑定用药输液 、输血(本溪)数据到表格上
        var evIndex = 0,
            medECfg = vm.medECfg,
            medEOpt1 = vm.medEOpt1,
            pageSize = vm.view.pageSize;
        medECfg.dataLoaded = false;
        medEOpt1.series = [];
        for (var i = 0; i < ev_list.length; i++) {
            if (i == 0 || ev_list[i].site != medEOpt1.series[medEOpt1.series.length - 1].id) {
                medEOpt1.series.push({ //给每个series加基本样式
                    // data: databox,
                    id: ev_list[i].site,
                    // ev_list_item: ev_list[i],
                    type: 'line',
                    smooth: true,
                    "symbolSize": medECfg.BeSmall ? [2, 5] : [4, 10],
                    "symbol": "rect",
                    "itemStyle": {
                        normal: {
                            color: "black",
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#555'
                        }
                    },
                    animation: false
                });
            }
            if (!medEOpt1.series[medEOpt1.series.length - 1].data) {
                medEOpt1.series[medEOpt1.series.length - 1].data = [];
            }
            var TimeValue;
            if (ev_list[i].dosage != undefined && ev_list[i].showFlow != undefined && ev_list[i].showThick != undefined) { //起始点（本溪其他）
                if (ev_list[i].durable == "1") { //开始点
                    TimeValue = _this.translateTimeValue(ev_list[i].startTime / 1000, vm.timeArr49[vm.view.pageCur]);
                }
                if (ev_list[i].durable == "0") { //单独点
                    TimeValue = _this.translateTimeValue(ev_list[i].startTime / 1000, vm.timeArr49[vm.view.pageCur]);
                }
            } else if (ev_list[i].dosage != undefined && ev_list[i].showFlow == undefined && ev_list[i].showThick == undefined) { //结束点 终点
                TimeValue = _this.translateTimeValue(ev_list[i].endTime / 1000, vm.timeArr49[vm.view.pageCur]);
                ev_list.endPoint = true;
            } else if (ev_list[i].showFlow != undefined && ev_list[i].showThick != undefined && ev_list[i].dosage == undefined) { //流速点
                TimeValue = _this.translateTimeValue(ev_list[i].startTime / 1000, vm.timeArr49[vm.view.pageCur]);
            } else { //空
                if (ev_list[i].type) {
                    if (angular.equals(ev_list[i], ev_list[i - 1])) { //输液输血转换后的ev_list两个一样 后一个用endTime
                        TimeValue = _this.translateTimeValue(ev_list[i].endTime / 1000, vm.timeArr49[vm.view.pageCur]);
                        ev_list[i].endPoint = true;
                    } else {
                        TimeValue = _this.translateTimeValue(ev_list[i].startTime / 1000, vm.timeArr49[vm.view.pageCur]);
                    }
                } else {
                    TimeValue = '';
                }

            }
            if (medECfg.BeSmall && (ev_list[i].type == "zl" || ev_list[i].type == "mz")) { //打印
                var labelPosition = [-15, -8];
            } else if (medECfg.BeSmall && (ev_list[i].type != "zl" || ev_list[i].type != "mz")) { //打印
                var labelPosition = [-4, -12];
            } else if (!medECfg.BeSmall && (ev_list[i].type == "zl" || ev_list[i].type == "mz")) { //非打印
                var labelPosition = [-15, -12];
            } else if (!medECfg.BeSmall && (ev_list[i].type != "zl" || ev_list[i].type != "mz")) { //非打印非用药
                var labelPosition = [-4, -12];
            } else {
                var labelPosition = [-15, -12];
            }
            var itemObj = {
                value: [TimeValue, ev_list[i].site],
                ev_list: ev_list[i],
                "label": {
                    normal: {
                        "show": true,
                        "formatter": function(params) {
                            var result = "";
                            if (params.data.ev_list.showOption == "3") {
                                result += params.data.ev_list.dosage + params.data.ev_list.dosageUnit
                            }
                            if (params.data.ev_list.showThick) {
                                result += params.data.ev_list.thickness + params.data.ev_list.thicknessUnit
                            }
                            if (params.data.ev_list.showFlow) {
                                result += params.data.ev_list.flow + params.data.ev_list.flowUnit;
                            }
                            if (params.data.ev_list.dosage != undefined && params.data.ev_list.showFlow == undefined && params.data.ev_list.showThick == undefined) {
                                return "";
                            }
                            if (params.data.ev_list.endPoint) return '';
                            if (params.data.ev_list.value) {
                                result += params.data.ev_list.value;
                            }
                            if (params.data.ev_list.dosageAmount) {
                                result += params.data.ev_list.dosageAmount;
                            }
                            if(user.beCode=='sybx'&&params.data.ev_list.type=='sy'&&!params.data.ev_list.endPoint){
                                result +=  " "+params.data.ev_list.passage;
                            }
                            return result;
                        },
                        "position": labelPosition,
                        color: "black"
                    }

                }
            };
            if (medECfg.BeSmall) {
                itemObj.label.normal.fontWeight = "bold";
            } //打印加粗
            if (ev_list[i].type == "zl" || ev_list[i].type == "mz") { //浓度流速点
                if (ev_list[i].showFlow != undefined && ev_list[i].showThick != undefined && ev_list[i].dosage == undefined) { //流速点
                    if (medECfg.BeSmall) {
                        angular.merge(itemObj, { "symbolSize": [5, 5] })
                    } else {
                        angular.merge(itemObj, { "symbolSize": [7, 7] })
                    }
                }
            }
            medEOpt1.series[medEOpt1.series.length - 1].data.push(itemObj);
        }
    }
    _this.initCheckEventPlus = function(monEOpt, checkEventList, print, vm) { // 显示检验事件值到eCharts 
        if (monEOpt.series.length > 0 && monEOpt.series[monEOpt.series.length - 1].name != "blood") { //血气分析
            monEOpt.series.push({
                type: "line",
                name: "blood",
                yAxisIndex: 0,
                data: [],
                forbidBind: true,
                lineStyle: {
                    normal: {
                        color: "#fff",
                        width: 1
                    }
                }
            })
            for (var checkEvent of checkEventList) {
                var evIndex = _this.translateTimeValue(checkEvent.occurTime / 1000, vm.timeArr49[vm.view.pageCur]),
                    num = print ? 39 : 43;
                checkEvent.value = [evIndex > num ? num : evIndex, 230];
                checkEvent.symbolSize = 0.001;
                checkEvent.label = {
                    normal: {
                        show: true,
                        color: "black",
                        position: [1, 1],
                        formatter: function(params) {
                            var result = '';
                            for (var checkItem of params.data.cheEventDetail) {
                                result += checkItem.name + checkItem.value + checkItem.unit + "\n";
                            }
                            return result;
                        }
                    }
                }
                monEOpt.series[monEOpt.series.length - 1].data.push(checkEvent);
            }
        }
    }
    _this.initSign1 = function(markEOpt, startOper, pageSize, print, vm) {
        $timeout(function() {
            markEOpt.series = [{ data: [], type: "line", name: "mark", connectNulls: false, animation: false }];
            var seriesList = markEOpt.series[markEOpt.series.length - 1].data; // 得到最后一条标记的数据
            var index = 1;
            for (var a = 0; a < startOper.anaeseventList.length; a++) {
                if (startOper.anaeseventList[a].code >= 2 && startOper.anaeseventList[a].code != 9) {
                    var occurTime = startOper.anaeseventList[a].occurTime;
                    var evObj = getEvIcon(startOper.anaeseventList[a].code);
                    var item = {
                        value: [_this.translateTimeValue(occurTime / 1000, vm.timeArr49[vm.view.pageCur]), 5],
                        name: evObj.name,
                        occurTime: occurTime,
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
                    };
                    if (print) {
                        item.symbol = 'image://' + evObj.src.replace('.png', '-3.png')
                        symbolSize: 14
                    }
                    if (!evObj.src) {
                        item.name = startOper.anaeseventList[a].codeName;
                        item.symbol = 'image://app/img/white.png';
                        item.symbolSize = 7;
                        item.itemStyle.normal.label.formatter = index + '';
                        item.itemStyle.normal.label.position = [3, 0];
                        item.itemStyle.normal.label.fontSize = 12;
                        item.itemStyle.normal.label.show = true;
                    }
                    seriesList.push([]);
                    seriesList.push(item);
                    seriesList.push([]);
                    if (startOper.anaeseventList[a].code > 9)
                        index += 1;
                }
            }
        })
    }
    _this.initSignPacu = function(markEOpt, startOper, pageSize, print, vm) {
        $timeout(function() {
            markEOpt.series = [{ data: [], type: "line", name: "mark", connectNulls: false, animation: false }];
            var seriesList = markEOpt.series[markEOpt.series.length - 1].data; // 得到最后一条标记的数据
            var index = 1;
            for (var a = 0; a < startOper.pacueventList.length; a++) {
                if (startOper.pacueventList[a].code >= 2 && startOper.pacueventList[a].code != 9) {
                    var occurTime = startOper.pacueventList[a].occurTime;
                    var evObj = getEvIcon(startOper.pacueventList[a].code);
                    var item = {
                        value: [_this.translateTimeValue(occurTime / 1000, vm.timeArr49[vm.view.pageCur]), 5],
                        name: evObj.name,
                        occurTime: occurTime,
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
                    };
                    if (print) {
                        item.symbol = 'image://' + evObj.src.replace('.png', '-3.png')
                        symbolSize: 14
                    }
                    if (!evObj.src) {
                        item.name = startOper.pacueventList[a].codeName;
                        item.symbol = 'image://app/img/white.png';
                        item.symbolSize = 7;
                        item.itemStyle.normal.label.formatter = index + '';
                        item.itemStyle.normal.label.position = [3, 0];
                        item.itemStyle.normal.label.fontSize = 12;
                        item.itemStyle.normal.label.show = true;
                    }
                    seriesList.push([]);
                    seriesList.push(item);
                    seriesList.push([]);
                    if (startOper.pacueventList[a].code > 9)
                        index += 1;
                }
            }
        })
    }
    _this.refMedicalChart = function(vm, params, type, ev_list, pageSize) {
        anesRecordInter.searchEventList(params).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[params.key] = result.data.resultList;
        });
    }
    _this.refIoEventChart = function(vm, ioParams, type, key, ev_list, pageSize) {
        anesRecordInter.searchIoeventGroupByDefIdList(ioParams).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[key] = result.data.resultList;
        });
    }

    _this.refEgressEventChart = function(vm, ioParams, type, key, ev_list, pageSize) {
        anesRecordInter.searchEgressGroupByDefIdList(ioParams).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[key] = result.data.resultList;
        });
    }
    _this.refChart = function(vm, result) {
        // console.log(result)  1、流速浓度对话框返回结果
        var ev_list = [];
        if (result.anaesMedEvtList) {
            result.anaesMedevent = result.anaesMedEvtList;//浓度流速对话框
        }
        if (result.medicalevent)
            result.treatMedEvtList = result.medicalevent;//startoper和saveMedicalEventDetail-treatMedEvtList searchalleventlist-medicalevent
        if (result.infusionList)
            result.inIoeventList = result.infusionList;
        if (result.egress)
            result.egressList = result.egress;
        _this.option("mz", result.anaesMedevent, ev_list, vm);
        _this.option("zl", result.treatMedEvtList, ev_list, vm);
        _this.option("sy", result.inIoeventList, ev_list, vm);
        _this.option("sx", result.bloodList, ev_list, vm);
        _this.option("cl", result.egressList, ev_list, vm);
        vm.startOper.anaesMedEvtList = result.anaesMedevent;
        vm.startOper.treatMedEvtList = result.treatMedEvtList;
        vm.startOper.inIoeventList = result.inIoeventList;
        vm.startOper.bloodList = result.bloodList;
        vm.startOper.outIoeventList = result.egressList;
        _this.initEvConfig(ev_list, vm, false);
    }

    function getEvIcon(code) {
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
    }
    _this.translateTimeValue = function(timestamp, dataArr) {
        if (!timestamp || !dataArr) {
            return [];
        }
        if (timestamp > 100) { //传入时间戳
            for (var j = 0; j < dataArr.length; j++) {
                if (timestamp == dataArr[j][0]) {
                    return j;
                } else if (timestamp < dataArr[j][0]) {
                    if (j < 1) { //时间戳比第一个点还小
                        return -1;
                    } else if (j < dataArr.length) { //显示时间范围内的点
                        var floatdiget = parseFloat(((timestamp - dataArr[j - 1][0]) / dataArr[j - 1][2]).toFixed(3));
                        return j - 1 + floatdiget;
                    }
                } else if (timestamp > dataArr[dataArr.length - 1][0]) { //比最后一个坐标还大
                    return 50;
                }
            }
        }
        if (timestamp < 100) { //传入 数值轴
            for (var j = 0; j < dataArr.length; j++) {
                if (timestamp == j) {
                    return dataArr[j][0];
                } else if (timestamp < j) {
                    if (j < 1) { //时间戳比第一个点还小
                        return -1;
                    } else if (j < dataArr.length) { //显示时间范围内的点
                        // var floatdiget = parseFloat(((timestamp - dataArr[j - 1][0]) / dataArr[j - 1][2]).toFixed(3));
                        var intD = dataArr[parseInt(timestamp)][0];
                        var floatD = (timestamp - parseInt(timestamp)) * dataArr[j - 1][2];
                        // return j - 1 + floatdiget;
                        return parseInt(intD + floatD);
                    }
                } else if (timestamp == -1) { //比最后一个坐标还大
                    return -1;
                } else if (timestamp == 50) { //比最后一个坐标还大
                    return 50;
                }
            }
        }


    }
}