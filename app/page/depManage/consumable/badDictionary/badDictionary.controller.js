badDictionaryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'confirm', '$filter', '$timeout', 'toastr', '$uibModal', 'auth', 'uiGridServe'];

module.exports = badDictionaryCtrl;

function badDictionaryCtrl($rootScope, $scope, IHttp, confirm, $filter, $timeout, toastr, $uibModal, auth, uiGridServe) {
    var promise,
        user = auth.loginUser(),
        thisyear = new Date().getFullYear();
    var params = uiGridServe.params({ beid: user.beid });

    $scope.startTime = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.endTime = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.type = '1';
    $scope.years = [];

    for (var i = 0; i < 10; i++) {
        $scope.years.push(thisyear - i);
    }
    $scope.pmoth = "" + thisyear;

    $scope.eConfig1 = {
        dataLoaded: true
    };

    $scope.eConfig2 = {
        dataLoaded: true
    };

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'loseTime',
            displayName: '时间',
            enableFiltering: false,
            width: 130,
            cellTooltip: function(row, col) {
                return row.entity.loseTime;
            }
        }, {
            field: 'instrumentName',
            displayName: '耗材名称',
            width: 230,
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
            }
        },
        //  {
        //     field: 'firm',
        //     displayName: '厂家名称',
        //     cellTooltip: function(row, col) {
        //         return row.entity.firm;
        //     }
        // },
         {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, 
        {
            field: 'batch',
            displayName: '耗材批号',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'price',
            displayName: '进价',
            cellTooltip: function(row, col) {
                return row.entity.price;
            }
        }, {
            field: 'loseNumber',
            displayName: '报损',
            cellTooltip: function(row, col) {
                return row.entity.loseNumber;
            }
        }, {
            field: 'loseReason',
            displayName: '报损原因',
            cellTooltip: function(row, col) {
                return row.entity.loseReason;
            }
        }, {
            field: 'remark',
            displayName: '备注',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            }
        }, {
            field: 'loseType',
            displayName: '报损类型',
            cellTooltip: function(row, col) {
                return row.entity.loseType;
            }
        }, {
            field: 'operator',
            displayName: '经办人',
            cellTooltip: function(row, col) {
                return row.entity.operator;
            }
        }, {
            field: 'loseName',
            displayName: '报损人',
            cellTooltip: function(row, col) {
                return row.entity.loseName;
            }
        }]
    }, function() {
        getPage();
    });

    getPage();

    function getPage() {
        var type = $scope.type;
        if (!type) {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            }
        }
        if (type === '1') {
            $scope.pa = {
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                queryType: 2,
                beid: user.beid
            };
        }
        if (type === '2') {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            } else {
                $scope.pa = {
                    startTime: $scope.pmoth,
                    queryType: 1,
                    beid: user.beid
                };
            }
        }

        params.filters = [{ "field": "startTime", "value": $scope.pa.startTime },
            { "field": "queryType", "value": $scope.pa.queryType }
        ];
        if (type === "1") {
            params.filters.push({ "field": "endTime", "value": $scope.pa.endTime })
        }

        IHttp.post('basedata/queryConsumablesLoseRecordList', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            var data = rs.data.resultList;
            for (var i = 0; i < data.length; i++) {
                if (data[i].loseTime) {
                    data[i].loseTime = $filter('date')(data[i].loseTime, 'yyyy-MM-dd HH:mm');
                }
                //1 普通报损，2 手术报损，3清点报损
                if (data[i].loseType == '1') {
                    data[i].loseType = "普通报损";
                } else if (data[i].loseType == '2') {
                    data[i].loseType = "手术报损";
                } else if (data[i].loseType == '3') {
                    data[i].loseType = "清点报损";
                }
            }
            $scope.gridOptions.data = data;
        });
    }

    $scope.EXCEL = function() {
        pagesize = $scope.gridOptions.totalItems;
        params.pageNo = 1;
        params.pageSize = pagesize;
        getPage();
        setTimeout(function() {
            uiGridServe.exports('报损记录');
            pagesize = 15;
        }, 1000);
    }

    $scope.addInput = function(tag) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: tag
        };

        $uibModal.open({
            animation: true,
            template: require('../badDictionary/badDictionaryAdd.html'),
            controller: require('../badDictionary/badDictionaryAdd.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(() => {
            getPage();
        })
    };

    getDatazhu();

    function getDatazhu() {
        var type = $scope.type;
        if (!type) {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            }
        }
        if (type === '1') {
            $scope.pa = {
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                queryType: 2,
                beid: user.beid
            };
        }
        if (type === '2') {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            } else {
                $scope.pa = {
                    startTime: $scope.pmoth,
                    queryType: 1,
                    beid: user.beid
                };
            }
        }

        promise = IHttp.post('basedata/queryConsumablesLoseRecordForLine', $scope.pa);
        promise.then(function(rr) {
            //柱形图和折线图
            var rs = rr.data;
            $scope.eConfig1.dataLoaded = false;
            $scope.eOptionva = {
                tooltip: { trigger: 'axis' },
                grid: { top: 30, left: 30, right: 30 },
                toolbox: {
                    show: true,
                    itemSize: 20,
                    itemGap: 30,
                    right: 150,
                    feature: {
                        magicType: {
                            type: ['line', 'bar']
                        }
                    }
                },
                xAxis: rs.dataStat.xAxis,
                yAxis: {
                    type: 'value',
                    name: '天数',
                    min: 0,

                },
                series: rs.dataStat.series
            };
            $scope.eOptionva.series[0].barWidth = 20;
            $scope.eOptionva.series[0].itemStyle = {
                normal: { color: '#436eee' }
            }
            $scope.eOptionva.xAxis[0].axisLabel = { interval: 0 }
            $scope.eOptionva.xAxis[0].splitLine = { show: false }

            for (var i = 0; i < $scope.eOptionva.series.length; i++) {
                $scope.eOptionva.series[i].type = "bar";
            }
        });
    }

    getDatayuan();

    function getDatayuan() {
        var type = $scope.type;
        if (!type) {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            }
        }
        if (type === '1') {
            $scope.pa = {
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                queryType: 2,
                beid: user.beid
            };
        }
        if (type === '2') {
            if (!$scope.pmoth) {
                $scope.pa = {
                    startTime: $scope.pmoth = new Date().getFullYear(),
                    queryType: 1,
                    beid: user.beid
                };
            } else {
                $scope.pa = {
                    startTime: $scope.pmoth,
                    queryType: 1,
                    beid: user.beid
                };
            }
        }

        promise = IHttp.post('basedata/queryConsumablesLoseRecordForPie', $scope.pa);
        promise.then(function(rr) {
            //饼图
            $scope.eConfig2.dataLoaded = false;
            var rs2 = rr.data;
            if (rs2.resultCode != "1") {
                return false;
            }
            var colors = ['#5cb85c', '#FFFF00', '#F0AD4E', '#FF6600', '#C23531', '#CC0000', '#990000', '#660000'];
            var legenddata = [];
            for (var i = 0; i < rs2.dataStat.seriesPies[0].data.length; i++) {
                //rs2.dataStat[i].itemStyle = { normal: { color: colors[i] } };
                legenddata.push(rs2.dataStat.seriesPies[0].data[i].name);
            }
            $scope.optionPie = {
                title: {
                    text: '报损原因分析',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: "#333333",
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    //orient: 'vertical',
                    //x: 'left',
                    textStyle: { color: "#333333" },
                    data: legenddata
                },

                series: [{
                    name: '报损原因分析',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    minAngle: 1,
                    data: rs2.dataStat.seriesPies[0].data
                }]
            };
        });
    }

    $scope.query = function() {
        getPage();
        getDatazhu();
        getDatayuan();
    }
}