const echarts = require('echarts');

module.exports = eChart;

function eChart() {
    return {
        restrict: 'EA',
        scope: {
            config: '=eConfig',
            option: '=eOption'
        },
        controller: ['$scope', '$element', '$timeout', controller],
        link: link
    }

    function controller($scope, $element, $timeout) {
        var _this = this;
        $scope.chart = echarts.init($element[0]);

        _this.showLoading = function(loadingOption) {
            var op = loadingOption || { text: '数据加载中' };
            $scope.chart.showLoading(op);
        };

        _this.hideLoading = function() {
            $scope.chart.hideLoading();
        };

        _this.timeout = function(fn) {
            $timeout(fn, 1000);
        }

        _this.emitU = function(preDrag) {
            $scope.$emit('upEOption', preDrag);
        }

        _this.emitA = function(obj) {
            $scope.$emit('addPoint', obj);
        }

        _this.isExistent = function(eOpt, preDrag, eCfg, target) {
            var res = { type: false },
                series, xAxis, yAxis;
            // X: 左右移动; Y: 上下移动
            if (eCfg.dir == 'x' && preDrag[0] >= 0) {
                series = angular.copy(eOpt.series[preDrag[0]]);
                xData = angular.copy(eOpt.xAxis[0].data);
                if (xData.length == series.data.length) {
                    res = angular.extend(series.data[preDrag[1]], res);
                    // 最小，最大值是平均分配的，用于计算水平移动时，它对应的时间。
                    res.min = 0;
                    res.max = xData.length;
                }
            } else if (eCfg.dir == 'y') {
                if (_this.opt && !target) {
                    for (var a = 0; a < eOpt.series.length; a++) {
                        series = eOpt.series[a];
                        yAxis = eOpt.yAxis[series.yAxisIndex];
                        if (series.name == _this.opt.eventName) {
                            res = {
                                type: true,
                                eventId: _this.opt.eventId,
                                eventName: _this.opt.eventName,
                                seriesIndex: a,
                                yAxisIndex: series.yAxisIndex,
                                symbol: series.symbol,
                                interval: yAxis.interval,
                                min: yAxis.min,
                                max: yAxis.max
                            }
                            break;
                        }
                    }
                } else if (preDrag[0] >= 0) {
                    series = angular.copy(eOpt.series[preDrag[0]]);
                    yAxis = angular.copy(eOpt.yAxis[series.yAxisIndex]);
                    if (yAxis) {
                        res = {
                            type: false,
                            eventName: series.name,
                            seriesIndex: preDrag[0],
                            yAxisIndex: series.yAxisIndex,
                            symbol: series.symbol,
                            interval: yAxis.interval,
                            min: yAxis.min,
                            max: yAxis.max
                        }
                    } else
                        res = { type: false }
                }
            }
            return res;
        }

        $scope.$on('selPoint', function(ev, opt) {
            _this.opt = opt;
        })
    }

    function link(scope, element, attrs, ctrl) {
        var chart = scope.chart;

        // 事件绑定
        if (scope.config && scope.config.event) {
            if (angular.isArray(scope.config.event)) {
                angular.forEach(scope.config.event, function(value, key) {
                    for (var e in value) {
                        chart.on(e, value[e]);
                    }
                })
            }
        }

        if (scope.config && scope.config.group) {
            chart.group = scope.config.group;
        }

        if (scope.config && scope.config.connect) {
            echarts.connect(scope.config.connect);
        }

        // 解决多表格无法重画的问题
        window.onresize = function() {
            var eChartDom = angular.element(document).find('.echarts');
            for (var i = 0; i < eChartDom.length; i++) {
                echarts.getInstanceByDom(eChartDom[i]).resize();
            }
        }

        // 自定义参数 -
        // event 定义事件
        // dataLoaded 数据是否加载
        scope.getDom = function() {
            return {
                'height': element[0].offsetHeight,
                'width': element[0].offsetWidth
            };
        }

        if (scope.config && scope.config.resize) {
            scope.$watch(scope.getDom, function(n) {
                chart.resize();
            }, true);
        }

        scope.$watch(function() {
            return scope.config;
        }, function(value) {
            if (value) { refreshChart(); }
        }, true);

        // 图表原生option
        scope.$watch(function() {
            return scope.option;
        }, function(value) {
            if (value) { refreshChart(); }
        }, true);

        function refreshChart() {
            if (!scope.config)
                return;
            if (scope.config.dataLoaded === true) {
                chart.clear();
                ctrl.showLoading(scope.config.loadingOption);
            } else {
                chart.setOption(scope.option, true);
                chart.resize();
                ctrl.hideLoading();
            }
        }

        if (scope.config && scope.config.drag) {
            // 获取图形组件的Zrender实例
            var zr = chart.getZr();
            // 初始化拖动前数据点对应的seriesIndex、dataIndex和value，以及defIndex
            var preDrag = [-100, -100, -100];
            // 图形组件网格的高度、容器左下Y坐标、容器左上Y坐标、鼠标按下的坐标
            var hgh, maxY, minY, pointInPixel, obj, tempNum;

            ctrl.timeout(function() {
                // 水平拖动，最大最小范围值
                maxX = element[0].offsetWidth;
                minX = 0;
                // 垂直拖动，最大最小范围值
                maxY = element[0].offsetTop + element[0].offsetHeight;
                minY = element[0].offsetTop + scope.option.grid.top;
            });

            // 图形鼠标按下事件，获取鼠标按下位置数据点索引和值
            chart.on('mousedown', function(ev) {
                preDrag = [-100, -100, -100];
                // 持续用药中间的小点不让拖动(不包括流速、浓度的点)
                if (ev.data.symbol == 'rect' && ev.data.symbolSize < 5)
                    return;
                // 鼠标按下位置在数据点
                if (ev.componentType == 'series') { //鼠标按下位置在数据点
                    // 数据点的索引和值
                    if (scope.config.dir == 'x') {
                        // preDrag[2] 用来存储移动时的索引
                        preDrag = [ev.seriesIndex, ev.dataIndex, ev.dataIndex];
                    } else if (scope.config.dir == 'y')
                        preDrag = [ev.seriesIndex, ev.dataIndex, ev.value];
                }
            })

            // Zrender鼠标按下事件，获取鼠标按下位置坐标
            zr.on('mousedown', function(ev) {
                // 鼠标按下的坐标
                pointInPixel = [ev.offsetX, ev.offsetY];
                obj = ctrl.isExistent(scope.option, preDrag, scope.config, ev.target);
                hgh = obj.max - obj.min;
            })

            // Zrender鼠标移动事件,计算鼠标位置对应的数据值并重新绘图
            zr.on('mousemove', function(ev) {
                // 当前对象是否移动
                if (scope.config.dir == 'x' && preDrag[1] >= 0 && Math.abs(pointInPixel[0] - ev.offsetX) > 0 && hgh > 0) {
                    tempNum = Math.round(ev.offsetX * hgh / maxX);
                    if (tempNum >= 0 && tempNum != preDrag[1]) {
                        scope.option.series[preDrag[0]].data[preDrag[2]] = '';
                        scope.option.series[preDrag[0]].data[tempNum] = obj;
                        preDrag[2] = tempNum;
                        // 重新绘图
                        refreshChart();
                    }
                } else if (scope.config.dir == 'y' && preDrag[1] >= 0 && Math.abs(pointInPixel[1] - ev.offsetY) > 0 && hgh > 0) {
                    // 鼠标移动过程中新的值
                    if (obj.min == 0)
                        tempNum = hgh * (maxY - ev.offsetY) / (maxY - minY);
                    else
                        tempNum = hgh * (maxY - ev.offsetY) / (maxY - minY) + obj.min;
                    if (tempNum >= 0) {
                        scope.option.series[preDrag[0]].data[preDrag[1]].value = Number(tempNum.toFixed(1));
                        // 重新绘图
                        refreshChart();
                    }
                }
            })

            // Zrender鼠标释放事件，恢复拖动前的默认值
            zr.on('mouseup', function(ev) {
                if (scope.config.dir == 'x') {
                    if (preDrag[1] >= 0 && Math.abs(pointInPixel[0] - ev.offsetX) > 0)
                        ctrl.emitU(preDrag);

                } else if (scope.config.dir == 'y') {

                    if (preDrag[1] >= 0 && Math.abs(pointInPixel[1] - ev.offsetY) > 0) {
                        if (obj.eventName = 'TEMP') {
                           preDrag[2] =Math.round(preDrag[2]);
                            scope.option.series[preDrag[0]].data[preDrag[1]].value =Math.round(Number(tempNum.toFixed(1)));
                        }
                        ctrl.emitU(preDrag);
                    }

                    // 添加新点
                    if (obj && obj.type && hgh > 0) {
                        var pointInGrid = chart.convertFromPixel('grid', pointInPixel);
                        if (obj.min == 0)
                            pointInGrid[1] = hgh * (maxY - ev.offsetY) / (maxY - minY);
                        else
                            pointInGrid[1] = hgh * (maxY - ev.offsetY) / (maxY - minY) + obj.min;
                        // 获取X轴的索引
                        var arr = scope.option.series[obj.seriesIndex].data;
                        obj.xAxisIndex = findPoint(arr, pointInGrid[0]);
                        obj.value = Number(pointInGrid[1].toFixed(1));
                        if (obj.eventName = 'TEMP') {
                            scope.option.series[obj.seriesIndex].data[obj.xAxisIndex].value=obj.value =Math.round(obj.value);
                        }
                        refreshChart();
                        ctrl.emitA(obj);
                    }
                }
                preDrag = [-100, -100, -100];
                // 重新绘图
                refreshChart();
            })
        }

        function findPoint(arr, curIndex) {
            for (var a = 0; a < 10; a++) {
                if (arr[curIndex + a])
                    return curIndex + a;
                else if (arr[curIndex - a])
                    return curIndex - a;
            }
        }
    }
}