module.exports = eCharts;

eCharts.$inject = ['$rootScope', 'auth', '$filter', '$timeout', 'anesRecordInter', 'toastr'];

function eCharts($rootScope, auth, $filter, $timeout, anesRecordInter, toastr) {

    let _this = this,
        user = auth.loginUser();
    // 初始化配置项
    _this.config = function(isDrag, dir, fn) {
        return {
            dataLoaded: true,
            drag: isDrag != 1,
            dir: dir,
            event: [{
                dblclick: fn
            }]
        }
    } 
    // 用药的配置项
    _this.medOpt = function(col, row) {
        return {
            grid: {
                top: -1,
                right: 0,
                bottom: 0,
                left: -1
            },
            tooltip: {
                formatter: function(params) { // 格式化medChart提示信息
                    var obj = params.data.evObj;
                    var startTime = $filter('date')(params.name, 'yyyy-MM-dd HH:mm:ss');
                    return obj ? '<div><p>时间：' + startTime + '</p><p>名称：' + obj.name + '</p></div>' : '';
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
    // 采集监测指标配置项
    _this.monOpt = function(col, yArr) {
        return {
            grid: {
                top: -1,
                right: 0,
                bottom: 0,
                left: -1
            },
            tooltip: {
                formatter: function(params) {
                    var seriesName = params.seriesName,
                        name = $filter('date')(params.data.time, 'yyyy-MM-dd HH:mm:ss'),
                        value = params.data.value,
                        unit = params.data.units;
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
    // 标记（入室、麻醉开始、麻醉结束，等其它事件）的配置项
    _this.markOpt = function(col, row) {
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
                    name = params.name;
                    return seriesName + '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' + params.color + '"></i>' + name + '</div>';
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

    _this.getXAxis = function(data, vm) {
        var res = [], // monChart的时间轴
            xLen = data.xAxis[0].data.length,
            temp,
            xTits = []; // 记录时间的
        vm.tempTime = []; // 由于闭包问题导致var的数据丢失，所以放到vm里面
        var callData = {
            resultList: res,
            xTits: xTits
        }
        for (var a = 0; a < xLen; a++) {
            temp = data.xAxis[0].data[a];
            if ((data.changeFreqTime !== '' && temp.value <= data.changeFreqTime) || data.changeFreqTime === '') { // 判断这个轴要不要偏移，当入室时间往前切时changeFreqTime可能为空，这时也要偏移
                temp.value = temp.value - data.offset * 1000; // 轴减去偏移量
                temp.offset = true; // 标识它偏移了
            }
            vm.tempTime.push(temp); // 缓存一份偏移后的轴数据，medChart 要用的
            res.push($filter('date')(temp.value, 'yyyy-MM-dd HH:mm:ss'));
            if (data.xAxis[0].data[a + 1]) { // 偏移需要把一个轴分出10个出来
                var timeEach = parseInt((data.xAxis[0].data[a + 1].value - (data.changeFreqTime !== '' && temp.value >= data.changeFreqTime ? 0 : data.offset * 1000) - temp.value) / 10);
                for (var h = 0; h < 9; h++) {
                    res.push($filter('date')(temp.value + timeEach * (h + 1), 'yyyy-MM-dd HH:mm:ss'));
                }
            }
            if (a % 6 === 0)
                xTits.push($filter('date')(temp.value, 'HH:mm')); // 记录时间
        }
        var tempValue = (vm.tempTime[xLen - 1].offset ? (vm.tempTime[xLen - 1].value + data.offset * 1000) : vm.tempTime[xLen - 1].value) + vm.tempTime[xLen - 1].freq * 1000; // 自己生成下一个点时，需要用没有偏移的时间轴（后台给的原始数据的最后一个）来算
        if (data.changeFreqTime === '') tempValue = tempValue - data.offset * 1000;
        var first = true;
        while (xLen < vm.view.pageSize) { // 后台给的x轴数据生成完成了，现在需要用频率自己算轴了
            var timeEach = first ? parseInt((tempValue - vm.tempTime[xLen - 1].value) / 10) : data.freq * 100;
            vm.tempTime.push({ freq: data.freq, value: tempValue });
            for (var h = 0; h < 9; h++) {
                res.push($filter('date')(vm.tempTime[vm.tempTime.length - 2].value + timeEach * (h + 1), 'yyyy-MM-dd HH:mm:ss'));
            }
            res.push($filter('date')(tempValue, 'yyyy-MM-dd HH:mm:ss'));
            if (xLen % 6 === 0)
                xTits.push($filter('date')(tempValue, 'HH:mm'));
            tempValue = tempValue + data.freq * 1000;
            xLen++;
            first = false;
        }
        callData.resultList = res;
        callData.xTits = xTits;
        return callData;
    }

    _this.getSeries = function(result, monEOpt) { // 生成瞄点数据
        var res = [],
            len = result.series.length,
            xLen = result.xAxis[0].data.length;
        for (var a = 0; a < len; a++) { // 循环x轴
            var t_data = result.series[a].data;
            for (var i = 0; i < t_data.length; i++) { // 循环x轴数据
                result.series[a].data[i].units = result.series[a].units;
                if (t_data[i].symbol === '') {
                    if (t_data[i].amendFlag == 2) { // 等于2说明这个点手动修改过
                        var temp = result.series[a].symbol.split('.');
                        result.series[a].data[i].symbol = 'path://' + result.series[a].symbolSvg;
                        result.series[a].data[i].symbolSize = result.series[a].symbolSize;
                        // result.series[a].data[i].itemStyle = {
                        //     normal: {
                        //         color: '#FF0000'
                        //     }
                        // }
                    } else {
                        delete result.series[a].data[i].symbol;
                    }
                } else {
                    if (t_data[i].amendFlag == 2) {
                        var temp = result.series[a].data[i].symbol.split('.');
                        result.series[a].data[i].symbol = 'path://' + result.series[a].data[i].symbolSvg;
                        result.series[a].data[i].symbolSize = result.series[a].symbolSize;
                        // result.series[a].data[i].itemStyle = {
                        //     normal: {
                        //         color: '#FF0000'
                        //     }
                        // }
                    } else {
                        result.series[a].data[i].symbol = 'path://' + result.series[a].data[i].symbolSvg;
                        result.series[a].data[i].symbolSize = result.series[a].symbolSize;
                        result.series[a].data[i].itemStyle = {
                            normal: {
                                color: result.series[a].color
                            },
                            areaStyle: {
                                color: '#FF0000'
                            }
                        }
                    }
                }
            }
            // 开始把数据放到monChart上面
            var seriesData = new Array();
            var j_index = 0; // 记录瞄点索引
            for (var i = 0, xTime; xTime = new Date(monEOpt.xAxis[0].data[i++]).getTime();) { // 循环X轴
                seriesData[i - 1] = '';
                var isOk = false;
                for (var j = j_index, data; data = result.series[a].data[j++];) { // 循环后台给的点数据
                    if (isOk) break;
                    if (data.time >= xTime && data.time < new Date(monEOpt.xAxis[0].data[i]).getTime()) { // 找到此data适合的位置
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
                    if (data.time == new Date(monEOpt.xAxis[0].data[i - 1]).getTime() && i == monEOpt.xAxis[0].data.length) {
                        seriesData[i - 1] = data;
                    }
                }
            }
            res.push({
                type: result.series[a].type,
                name: result.series[a].name,
                units: result.series[a].units,
                symbol: 'path://' + result.series[a].symbolSvg, //使用SVG格式的图片,便于调整颜色
                symbolSize: result.series[a].symbolSize,
                yAxisIndex: result.series[a].yAxisIndex,
                itemStyle: { normal: { color: result.series[a].color } },
                lineStyle: { normal: { width: 1 } },
                data: seriesData,
                smooth: true,
                max: result.series[a].max,
                min: result.series[a].min,
                connectNulls: true
            });
        }
        return res;
    }

    _this.getMarkSeries = function(markEOpt) {
        var res = [];
        res.push({
            type: 'line',
            name: '',
            lineStyle: { normal: { width: 1, color: '#fff' } },
            data: (function() {
                var temp = [],
                    i = markEOpt.xAxis[0].data.length;
                while (i > 0) {
                    temp.push(''); // 初始化标记轴的数据全部为空
                    i--;
                }
                return temp;
            })()
        });
        return res;
    }
    // 处理用药事件的数据
    _this.option = function(type, array, ev_list) {
        var num = 0,
            site = 0,
            startTime, endTime;
        for (var a = ev_list.length - 1; a >= 0; a--) { // 先清空需要设置的数据，有mz、sy、sx
            if (ev_list[a].type === type) {
                ev_list.splice(a, 1);
            }
        }
        if (array && array.length) {
            for (var a = 0; a < array.length; a++) { // 循环用药或者输血、输液数据
                if (type === 'zl' && a < 11) { // 用药只需要11条，超过11条的数据不做显示，放到备注栏里面
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
                } else if ((type === 'sy' || type === 'sx') && a < 6) { // 输液 输血
                    site = type === 'sy' ? (25 - a * 3) : (7 - a * 3);
                    for (var b = 0; b < array[a].ioeventList.length; b++) {
                        num = Number(array[a].ioeventList[b].dosageAmount);
                        startTime = new Date(array[a].ioeventList[b].startTime).getTime();
                        endTime = new Date(array[a].ioeventList[b].endTime).getTime();
                        ev_list.push({
                            site: site, // 位置
                            type: type, // 状态
                            subType: type === 'sy' ? 1 : 2,
                            name: array[a].name, // 名称
                            dosageAmount: num, // 入量
                            dosageUnit: array[a].ioeventList[b].dosageUnit, // 单位
                            durable: 1,
                            passage: array[a].ioeventList[b].passage, //输液通道
                            startTime: startTime, // 开始时间
                            endTime: endTime, // 结束时间
                            evId: array[a].ioeventList[b].inEventId // 事件的Id
                        })
                    }
                } else if ((type == 'cl') && a < 3) {
                    site = 7 - a * 3;
                    for (var b = 0; b < array[a].egressList.length; b++) {
                        num = Number(array[a].egressList[b].value);
                        startTime = new Date(array[a].egressList[b].startTime).getTime();
                        endTime = new Date(array[a].egressList[b].endTime).getTime();
                        ev_list.push({
                            site: site, // 位置
                            type: type, // 状态
                            name: array[a].name, // 名称
                            dosageAmount: num, // 入量
                            dosageUnit: array[a].egressList[b].dosageUnit, // 单位
                            durable: 1,
                            startTime: startTime, // 开始时间
                            endTime: endTime, // 结束时间
                            evId: array[a].egressList[b].egressId // 事件的Id
                        })
                    }
                }
            }
        }
        return ev_list;
    }
    // 将处理后的数据渲染到页面
    _this.initEvConfig = function(medChartRow, ev_list, vm, print) {
        var evIndex = 0,
            medECfg = vm.medECfg,
            medEOpt = vm.medEOpt,
            pageSize = vm.view.pageSize,
            evOpt = (function() {
                var len = 0;
                var size = 5; // 把echart1的X轴间隔细分成5份
                var curTime, nextTime, timeSpan;
                var res = { x: [], y: [] };
                while (len < pageSize) {
                    curTime = vm.tempTime[len].value; // vm.tempTime是缓存的偏移以后的echart2没有分10份的X轴数据，echart1也要用偏移的数据
                    if (len === pageSize - 1) {
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
        medECfg.dataLoaded = false;
        medEOpt.xAxis[0].data = angular.copy(evOpt.x); // 初始化echart1的X轴数据
        for (var a = 0; a < medChartRow; a++) {
            medEOpt.series[a].data = angular.copy(evOpt.y); // 初始化echart1的Y轴数据
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
                    } else
                        dosageStr = ev_list[a].dosageAmount;
                    medEOpt.series[sIndex].data[len] = {
                        value: ev_list[a].site,
                        evObj: ev_list[a],
                        symbol: 'rect',
                        symbolSize: print ? [4, 10] : [3, 8],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: dosageStr + ' ' + thickStr + ' ' + flowStr,
                                    position: print ? [len <= 10 ? 5 : 2, -5] : [len <= 10 ? 5 : -5, -12]
                                }
                            }
                        }
                    }
                }
                if (ev_list[a].durable && evStartTime < curTime.value && evEndTime >= curTime.value) {
                    if (evEndTime - curTime.value < curTime.freq) {
                        medEOpt.series[sIndex].data[len] = {
                            value: ev_list[a].site,
                            evObj: ev_list[a],
                            symbol: 'rect',
                            symbolSize: print ? [4, 10] : [3, 8],
                            mark: 'end'
                        }
                    } else {
                        var symSize = print ? 3 : 3,
                            color = '#8e8e8e',
                            thickStr = '',
                            flowStr = '',
                            detailList = $filter('filter')(ev_list[a].detailList, function(e, k) {
                                return e.startTime == curTime.value && k > 0;
                            });
                        if (detailList && detailList.length > 0) {
                            symSize = print ? 6 : 6;
                            color = '#000';
                            if (detailList[0].showFlow)
                                flowStr = detailList[0].flow + detailList[0].flowUnit;
                            if (detailList[0].showThick)
                                thickStr = detailList[0].thickness + detailList[0].thicknessUnit;
                        }
                        medEOpt.series[sIndex].data[len] = {
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
                                        position: print ? [0, -8] : [0, -13],
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

    _this.initCheckEvent = function(monEOpt, checkEventList, print) { // 显示血气分析数值到eCharts
        $timeout(function() {
            var seriesList = monEOpt.series[monEOpt.series.length - 1].data;
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = '';
            }
            for (var checkEvent of checkEventList) {
                var interval = 235,
                    axis = 0;
                for (var y of checkEvent.cheEventDetail) {
                    var evStartTime = checkEvent.occurTime;
                    var isOk = false;
                    for (var i = 0, xTime; xTime = new Date(monEOpt.xAxis[0].data[i++]).getTime();) {
                        if (isOk) break;
                        if (evStartTime >= xTime && evStartTime < new Date(monEOpt.xAxis[0].data[i]).getTime()) {
                            var temp = i - 1;
                            while (true) {
                                if (seriesList[temp]) {
                                    temp++;
                                    continue;
                                } else {
                                    seriesList[temp] = {
                                        value: interval,
                                        symbol: 'app/img/ico6.png',
                                        symbolSize: 0.01,
                                        itemStyle: {
                                            normal: {
                                                label: {
                                                    show: true,
                                                    rotate: 0, //旋转角度
                                                    color: '#000000',
                                                    formatter: y.name + ' ' + y.value + y.unit,
                                                    fontSize: print ? 9 : 10,
                                                    position: [axis, 0]
                                                }
                                            }
                                        }
                                    }
                                    isOk = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (print) {
                        interval -= 7;
                        axis -= 1.5;
                    } else {
                        interval -= 5;
                        axis -= 2.5;
                    }
                }
            }
        });
    }

    _this.initSign = function(markEOpt, startOper, pageSize, print) {   // 标记项
        $timeout(function() {
            var seriesList = markEOpt.series[markEOpt.series.length - 1].data, // 得到最后一条标记的数据
                index = 1;
            for (var h = 0; h < seriesList.length; h++) {
                seriesList[h] = ''; // 初始化标记数据都为空
            }
            for (var a = 0; a < startOper.anaeseventList.length; a++) {
                if (startOper.anaeseventList[a].code >= 2 && startOper.anaeseventList[a].code != 9) {
                    var evStartTime = new Date($filter('date')(new Date(startOper.anaeseventList[a].occurTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                    var isOk = false;
                    for (var i = 0, xTime; xTime = new Date(markEOpt.xAxis[0].data[i++]).getTime();) {
                        if (isOk) break;
                        if (evStartTime >= xTime && evStartTime < new Date(markEOpt.xAxis[0].data[i]).getTime()) {
                            var temp = i - 1;
                            while (true) {
                                if (seriesList[temp]) {
                                    temp++;
                                    continue;
                                } else {
                                    var evObj = getEvIcon(startOper.anaeseventList[a].code);
                                    seriesList[temp] = {
                                        value: 5,
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
                                    if (print) {
                                        seriesList[temp].symbol = 'image://' + evObj.src.replace('.png', '-3.png')
                                        symbolSize: 14
                                    }
                                    if (!evObj.src) {
                                        for (var item of startOper.anaeseventList) {
                                            if (item.code === startOper.anaeseventList[a].code) {
                                                seriesList[temp].name = startOper.anaeseventList[a].codeName;
                                                seriesList[temp].symbol = 'image://app/img/white.png';
                                                seriesList[temp].symbolSize = 7;
                                                seriesList[temp].itemStyle.normal.label.formatter = index + '';
                                                seriesList[temp].itemStyle.normal.label.position = [3, -3];
                                                seriesList[temp].itemStyle.normal.label.fontSize = 15;
                                                seriesList[temp].itemStyle.normal.label.show = true;
                                            }
                                        }
                                    }
                                    isOk = true;
                                    break;
                                }
                            }
                            if (startOper.anaeseventList[a].code > 9)
                                index += 1;
                        }
                    }
                }
            }
        })
    }

    _this.refMedicalChart = function(vm, params, type, medChartRow, ev_list, pageSize) {
        anesRecordInter.searchEventList(params).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[params.key] = result.data.resultList;
            _this.option(type, result.data.resultList, ev_list);
            _this.initEvConfig(medChartRow, ev_list, vm, false);
        });
    }

    _this.refIoEventChart = function(vm, ioParams, type, key, medChartRow, ev_list, pageSize) {
        anesRecordInter.searchIoeventGroupByDefIdList(ioParams).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[key] = result.data.resultList;
            _this.option(type, result.data.resultList, ev_list);
            _this.initEvConfig(medChartRow, ev_list, vm, false);
        });
    }

    _this.refEgressEventChart = function(vm, ioParams, type, key, medChartRow, ev_list, pageSize) {
        anesRecordInter.searchEgressGroupByDefIdList(ioParams).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[key] = result.data.resultList;
            _this.option(type, result.data.resultList, ev_list);
            _this.initEvConfig(medChartRow, ev_list, vm, false);
        });
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
}