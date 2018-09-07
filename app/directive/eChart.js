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
            $timeout(fn, 0);
        }
        _this.emitAll = function(flag, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
            $scope.$emit(flag, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
        }
    }

    function link(scope, element, attrs, ctrl) {
        var chart = scope.chart;
        scope.$on('refresh', function(ev) { //鼠标切换series更新
            refreshChart()
        })
        scope.$on('selPoint', function(ev, opt) {
            if (scope.config.selPoint) { //监测项配选点配置
                if (opt) {
                    for (var i = 0; i < scope.option.series.length; i++) {
                        if (scope.option.series[i].name == opt.eventName) {
                            scope.targetseriesIndex = i;
                            break;
                        }
                    }
                }
            }
        })
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
                // ctrl.showLoading(scope.config.loadingOption);
            } else {
                chart.setOption(scope.option, true);
                chart.resize();
                ctrl.hideLoading();
                if (scope.config.isAdd) {
                    bindfn();
                }
            }
            var eChartDom = angular.element(document).find('.echarts');
            for (var i = 0; i < eChartDom.length; i++) {
                echarts.getInstanceByDom(eChartDom[i]).resize();
            }
        }

        if (scope.config && scope.config.drag) {
            // 获取图形组件的Zrender实例
            var zr = chart.getZr();
            // 初始化拖动前数据点对应的seriesIndex、dataIndex和value，以及defIndex
            var preDrag = [-100, -100, -100];
            // 图形组件网格的高度、容器左下Y坐标、容器左上Y坐标、鼠标按下的坐标
            var hgh, maxY, minY, pointInPixel, obj, tempNum;
            zr.on('dblclick', function(params) {
                if (scope.config.event[0].zrdblclick) {
                    scope.config.event[0].zrdblclick(params, scope);
                }
            })
            zr.on('click', function(params) {
                if (scope.config.event[0].zrClickFn) {
                    scope.config.event[0].zrClickFn(params, scope);
                }
            });

            // Zrender鼠标移动事件,计算鼠标位置对应的数据值并重新绘图
            zr.on('mousemove', function(ev) {
                if (ev.target && !isNaN(ev.target.seriesIndex)) {
                    if (!scope.config.isAdd) {
                        scope.targetseriesIndex = ev.target.seriesIndex;
                        scope.targetdataIndex = ev.target.dataIndex;
                        bindfn(ev.target);
                    }
                }
                if (scope.config.event[0].zrMoveFn)
                    scope.config.event[0].zrMoveFn(ev, scope);
            })
        }

        function itemdblclickFn(dataIndex, transdata, entitydata, obj) {
            if (scope.config.event[0].itemdblclickFn) {
                scope.config.event[0].itemdblclickFn(dataIndex, transdata, entitydata, obj, scope.config);
            }
        }

        function dragEndFn(dataIndex, transdata, entitydata, obj) {
            if (scope.promise) {
                scope.promise = '';
            } else {
                scope.promise = setTimeout(function() {
                    scope.promise = '';
                    if (scope.config.event[0].dragEndFn) {
                        scope.config.event[0].dragEndFn(dataIndex, transdata, entitydata, obj, scope.config);
                        hideTooltip(dataIndex, transdata, entitydata, obj)
                    }
                }, 200);
            }
        }

        function showTooltip(dataIndex, transdata, entitydata, obj) {
            scope.chart.dispatchAction({
                type: 'showTip',
                seriesIndex: scope.targetseriesIndex,
                dataIndex: dataIndex
            });
        }

        function hideTooltip(dataIndex, transdata, entitydata, obj) {
            scope.chart.dispatchAction({
                type: 'hideTip'
            });
        }

        function onPointDragging(dataIndex, transdata, entitydata, obj) {
            var oldValue = angular.copy(transdata[dataIndex].value);
            transdata[dataIndex].value = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: !isNaN(entitydata.series.yAxisIndex) ? entitydata.series.yAxisIndex : 0 }, this.position);
            if (scope.config.dir == "x") {
                transdata[dataIndex].value[1] = oldValue[1];
            }
            if (scope.config.dir == "y") {
                transdata[dataIndex].value[0] = oldValue[0];
            }
            scope.chart.setOption(entitydata);
            bindfn();
        }

        function bindfn(target) { //传参 以传参点绑定 否者已已经触发的series绑定
            if (!target) { //切换serious  加点后不传参绑定
                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
            } else { //鼠标移动切换绑定
                var transdata = scope.option.series[target.seriesIndex].data;
                var entitydata = { series: scope.option.series[target.seriesIndex] };
            }
            if (entitydata.series.forbidBind) {
                return "";
            }
            scope.chart.setOption({
                graphic: echarts.util.map(transdata, function(item, dataIndex) {
                    if (item.value[0] == '') { //空值不綁定
                        return;
                    }
                    var item_temp;
                    if (!item.value) {
                        item_temp = item;
                    } else {
                        item_temp = item.value;
                    }
                    var obj = {
                        target: target,
                        dataIndex: dataIndex
                    }
                    return {
                        type: 'circle',
                        position: scope.chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: !isNaN(entitydata.series.yAxisIndex) ? entitydata.series.yAxisIndex : 0 }, item_temp),
                        shape: {
                            r: 5
                        },
                        invisible: true,
                        draggable: true,
                        ondblclick: echarts.util.curry(itemdblclickFn, dataIndex, transdata, entitydata, obj),
                        ondragend: echarts.util.curry(dragEndFn, dataIndex, transdata, entitydata, obj),
                        ondrag: echarts.util.curry(onPointDragging, dataIndex, transdata, entitydata, obj),
                        onmousemove: echarts.util.curry(showTooltip, dataIndex, transdata, entitydata, obj),
                        onmouseout: echarts.util.curry(hideTooltip, dataIndex, transdata, entitydata, obj),
                        z: 100
                    };
                })
            });
        }
    }
}