StatWithMonthCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout'];

module.exports = StatWithMonthCtrl;

function StatWithMonthCtrl( $rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout) {
	var page = $rootScope.$state.current.name,
	    tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.query(row.entity)>查看</a><span>|</span><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-click=grid.appScope.cancel(row.entity)>取消</a></div>';

	i18nService.setCurrentLang('zh-cn');

	// IHttp.get('./app/page/demo/demo.json').then(function(rs) {
	//     $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
	// });

	$scope.params = {
	    pageNo: 1,
	    pageSize: 15,
	    sort: '',
	    orderBy: '',
	    filters: [],
	    state: '01,02,08'
	};

	var promise;

	$scope.eConfig = {
	    dataLoaded: true
	};
	$scope.eOption = {
	    tooltip: {
	        //trigger: 'axis',
	        axisPointer: { type: 'shadow' }
	    },
	    grid: { right: '40px', bottom: '70px', left: '40px' },
	    dataZoom: [{ show: true, start: 0, end: 100 }, { type: 'inside', start: 0, end: 100 }],
	    legend: {},
	    xAxis: {},
	    yAxis: {},
	    series: []
	};

	$scope.echartsData = {
	  "series" : [ {
	    "name" : "全麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 ],
	    "stack" : ""
	  }, {
	    "name" : "硬膜外麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "腰麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "臂麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "颈丛麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "局麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "持续硬膜外麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "表麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "静脉麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "骶丛麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "基础麻醉",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "支气管内麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "经鼻插管全麻",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  }, {
	    "name" : "神经阻滞麻醉",
	    "type" : "line",
	    "data" : [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	    "stack" : ""
	  } ],
	  "time" : [ "2016年10月", "2016年11月", "2016年12月", "2017年1月", "2017年2月", "2017年3月", "2017年4月" ],
	  "yAxis" : {
	    "name" : "",
	    "type" : "value",
	    "max" : 5,
	    "min" : 0,
	    "order" : ""
	  },
	  "legend" : {
	    "data" : [ "全麻", "硬膜外麻", "腰麻", "臂麻", "颈丛麻", "局麻", "持续硬膜外麻", "表麻", "静脉麻", "骶丛麻", "基础麻醉", "支气管内麻", "经鼻插管全麻", "神经阻滞麻醉" ]
	  },
	  "value" : [ [ "0", "0", "0", "0", "0", "0", "1" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ], [ "0", "0", "0", "0", "0", "0", "0" ] ],
	  "resultCode" : "1",
	  "anaesMethodName" : [ "全麻", "硬膜外麻", "腰麻", "臂麻", "颈丛麻", "局麻", "持续硬膜外麻", "表麻", "静脉麻", "骶丛麻", "基础麻醉", "支气管内麻", "经鼻插管全麻", "神经阻滞麻醉" ],
	  "xAxis" : {
	    "data" : [ "2016年10月", "2016年11月", "2016年12月", "2017年1月", "2017年2月", "2017年3月", "2017年4月" ]
	  },
	  "resultMessage" : "查询麻醉例数成功",
	  "tableList" : [ {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "1",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "全麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "硬膜外麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "腰麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "臂麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "颈丛麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "局麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "持续硬膜外麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "表麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "静脉麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "骶丛麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "基础麻醉"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "支气管内麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "经鼻插管全麻"
	  }, {
	    "2017年2月" : "0",
	    "2017年1月" : "0",
	    "2016年10月" : "0",
	    "2017年3月" : "0",
	    "2017年4月" : "0",
	    "2016年12月" : "0",
	    "2016年11月" : "0",
	    "麻醉方法" : "神经阻滞麻醉"
	  } ]
	};

	$scope.eChartOption = function(data) {
	    var len = data.xAxis.data.length * data.series.length;
	    if (len >= 50 && len <= 150) {
	        $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 60;
	    } else if (len >= 150 && len <= 250) {
	        $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 40;
	    } else if (len >= 250 && len <= 500) {
	        $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 25;
	    } else if (len > 500) {
	        $scope.eOption.dataZoom[0].end = $scope.eOption.dataZoom[1].end = 15;
	    }
	    $scope.eOption.tooltip = {
	        trigger: 'axis',
	        axisPointer: { type: 'shadow' }
	    };
	    $scope.eOption.grid = { right: '40px', bottom: '70px', left: '40px' };
	    $scope.eOption.legend = data.legend;
	    $scope.eOption.xAxis = data.xAxis;
	    $scope.eOption.yAxis = data.yAxis;
	    if (len < 50) {
	        $scope.eOption.series = (function() {
	            var res = [];
	            data.series.map(function(data) {
	                data.barWidth = 15;
	                res.push(data);
	            })
	            return res;
	        })();
	    } else {
	        $scope.eOption.series = data.series;
	    }
	    return $scope.eOption;
	}

	$scope.eChartOption($scope.echartsData);

	$scope.gridOptions = {
	    enableFiltering: false, // 过滤栏显示
	    enableGridMenu: true, // 配置按钮显示
	    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
	    useExternalSorting: true,
	    useExternalPagination: true, // 分页
	    paginationPageSizes: [ 15, 30, 50],
	    rowHeight: 40,
	    paginationPageSize: $scope.params.pageSize,
	    onRegisterApi: function(gridApi) {
	        $scope.gridApi = gridApi;
	        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	            if (sortColumns.length === 0) {
	                $scope.params.orderBy = '';
	            } else {
	                $scope.params.orderBy = sortColumns[0].sort.direction;
	                $scope.params.sort = sortColumns[0].colDef.field;
	            }
	            getPage();
	        });
	        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
	            $scope.params.pageNo = newPage;
	            $scope.params.pageSize = pageSize;
	            getPage();
	        });
	        $scope.gridApi.core.on.filterChanged($scope, function() {
	            $scope.grid = this.grid;
	            if (promise) {
	                $timeout.cancel(promise);
	            }
	            promise = $timeout(function() {
	                var filterArr = [];
	                angular.forEach($scope.grid.columns, function(column) {
	                    var fieldName = column.field;
	                    var value = column.filters[0].term;
	                    if (value === null) {
	                        value = "";
	                    }
	                    if (value !== undefined) {
	                        filterArr.push({
	                            field: fieldName,
	                            value: value
	                        });
	                    }
	                });
	                $scope.params.filters = filterArr;
	                getPage();
	            }, 1000)

	        });
	    },
	    columnDefs: [  {
	        field: 'operRoomName',
	        name: '手术室',
	        cellTooltip: function(row, col) {
	            return row.entity.operRoomName;
	        }
	    },{
	        field: 'pcs',
	        name: '台号',
	        cellTooltip: function(row, col) {
	            return row.entity.pcs;
	        }
	    },{
	        field: 'deptName',
	        name: '科室',
	        cellTooltip: function(row, col) {
	            return row.entity.deptName;
	        }
	    },{
	        field: 'bed',
	        name: '床号',
	        cellTooltip: function(row, col) {
	            return row.entity.bed;
	        }
	    }, {
	        field: 'sex',
	        name: '性别',
	        cellTooltip: function(row, col) {
	            return row.entity.sex;
	        }
	    }, {
	        field: 'age',
	        name: '年龄',
	        cellTooltip: function(row, col) {
	            return row.entity.age;
	        }
	    },{
	        field: 'name',
	        name: '姓名',
	        cellTooltip: function(row, col) {
	            return row.entity.name;
	        }
	    },{
	        field: 'designedOptName',
	        name: '手术名称',
	        cellTooltip: function(row, col) {
	            return row.entity.designedOptName;
	        }
	    },  {
	        field: 'operatorName',
	        name: '手术医生',
	        cellTooltip: function(row, col) {
	            return row.entity.operatorName;
	        }
	    }, {
	        field: 'designedAnaesMethodName',
	        name: '麻醉方法',
	        cellTooltip: function(row, col) {
	            return row.entity.designedAnaesMethodName;
	        }
	    }, {
	        field: 'anesthetistName',
	        name: '麻醉医生',
	        visible: false,
	        cellTooltip: function(row, col) {
	            return row.entity.anesthetistName;
	        }
	    }, {
	        field: 'circunurseName1',
	        name: '第一巡回护士',
	        visible: false,
	        cellTooltip: function(row, col) {
	            return row.entity.circunurseName1;
	        }
	    }, {
	        field: 'instrnurseName1',
	        name: '第一洗手护士',
	        cellTooltip: function(row, col) {
	            return row.entity.instrnurseName1;
	        }
	    }, {
	        field: 'optLevel',
	        name: '手术等级',
	        cellTooltip: function(row, col) {
	            return row.entity.optLevel;
	        }
	    }, {
	        field: 'cutLevel',
	        name: '切口等级',
	        cellTooltip: function(row, col) {
	            return row.entity.cutLevel;
	        }
	    }, {
	        name: '操作',
	        enableSorting: false,
	        enableFiltering: false,
	        cellTemplate: tempHtml
	    }]
	};

	$scope.gridOptions.data = [
	{
	  "operRoomName": "第01手术室",
	  "pcs": 2,
	  "deptName": "外一科",
	  "bed": "2",
	  "sex": "男",
	  "age": "1岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "楚鸿",
	  "designedOptName": "III°腭裂兰氏修复术(单侧完全性腭裂修复)",
	  "operatorName": "潘鸿庆",
	  "assistantName": "",
	  "designedAnaesMethodName": "全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "争艳 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "一级",
	  "cutLevel": "",
	  "hid": "1236584",
	  "operaDate": "2017-02-14"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "",
	  "bed": "",
	  "sex": "男",
	  "age": "50岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "hk020",
	  "designedOptName": "",
	  "operatorName": "陈志鹏",
	  "assistantName": "",
	  "designedAnaesMethodName": "全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "",
	  "cutLevel": "",
	  "hid": "",
	  "operaDate": "2017-03-29"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 2,
	  "deptName": "",
	  "bed": "",
	  "sex": "男",
	  "age": "12岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "0228",
	  "designedOptName": "",
	  "operatorName": "潘鸿庆",
	  "assistantName": "",
	  "designedAnaesMethodName": "全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "二级",
	  "cutLevel": "",
	  "hid": "",
	  "operaDate": "2017-02-28"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "",
	  "bed": "",
	  "sex": "女",
	  "age": "36岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "test22010",
	  "designedOptName": "",
	  "operatorName": "陈志鹏",
	  "assistantName": "",
	  "designedAnaesMethodName": "局麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "",
	  "cutLevel": "",
	  "hid": "",
	  "operaDate": "2017-02-20"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "",
	  "bed": "",
	  "sex": "女",
	  "age": "11岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "gggg",
	  "designedOptName": "",
	  "operatorName": "许乙威",
	  "assistantName": "",
	  "designedAnaesMethodName": "全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "",
	  "cutLevel": "",
	  "hid": "",
	  "operaDate": "2017-03-29"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "",
	  "bed": "",
	  "sex": "男",
	  "age": "44岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "test22014",
	  "designedOptName": "",
	  "operatorName": "陈志鹏",
	  "assistantName": "",
	  "designedAnaesMethodName": "全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "一级",
	  "cutLevel": "",
	  "hid": "",
	  "operaDate": "2017-03-28"
	},
	{
	  "operRoomName": "第01手术室",
	  "pcs": 1,
	  "deptName": "产科病房",
	  "bed": "32",
	  "sex": "女",
	  "age": "19岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "asdfw",
	  "designedOptName": "",
	  "operatorName": "梁世妙",
	  "assistantName": "",
	  "designedAnaesMethodName": "经鼻插管全麻",
	  "instrnurseName1": " ",
	  "circunurseName1": "护士长 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "一级",
	  "cutLevel": "",
	  "hid": "23",
	  "operaDate": "2017-02-08"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "内一科",
	  "bed": "2",
	  "sex": "男",
	  "age": "52岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "孙苏",
	  "designedOptName": "骨骺固定术",
	  "operatorName": "邓国华冯晓慧",
	  "assistantName": "冯晓慧",
	  "designedAnaesMethodName": "局麻",
	  "instrnurseName1": "唐琳琳 柳娇",
	  "circunurseName1": "高冬珂 魏漪",
	  "anesthetistName": "  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "柳娇",
	  "circunurseName2": "魏漪",
	  "optLevel": "一级",
	  "cutLevel": "1",
	  "hid": "126548",
	  "operaDate": "2017-01-22"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "内一科",
	  "bed": "3",
	  "sex": "男",
	  "age": "52岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "李帆",
	  "designedOptName": "肝移植术（含全肝切除术）",
	  "operatorName": "邓国华",
	  "assistantName": "",
	  "designedAnaesMethodName": "神经阻滞麻醉",
	  "instrnurseName1": " ",
	  "circunurseName1": "高冬珂 ",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "",
	  "circunurseName2": "",
	  "optLevel": "一级",
	  "cutLevel": "1",
	  "hid": "2648754",
	  "operaDate": "2017-01-22"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "内一科",
	  "bed": "2",
	  "sex": "男",
	  "age": "38岁",
	  "ageMon": "8",
	  "ageDay": 21,
	  "name": "何其正",
	  "designedOptName": "带瓣全程主动脉人工血管置换术(主动脉瓣-双髂动脉间各分支动脉的移植)",
	  "operatorName": "龚国龄邓芬,周帆,赵飞跃",
	  "assistantName": "邓芬,周帆,赵飞跃",
	  "designedAnaesMethodName": "神经阻滞麻醉",
	  "instrnurseName1": "唐琳琳 柳娇",
	  "circunurseName1": "高冬珂 魏漪",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "柳娇",
	  "circunurseName2": "魏漪",
	  "optLevel": "一级",
	  "cutLevel": "1",
	  "hid": "120458",
	  "operaDate": "2017-02-04"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "内一科",
	  "bed": "4",
	  "sex": "男",
	  "age": "52岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "张志忠",
	  "designedOptName": "取腓骨术(带血管加收40%)",
	  "operatorName": "李锋郭金强",
	  "assistantName": "郭金强",
	  "designedAnaesMethodName": "骶丛麻",
	  "instrnurseName1": "唐琳琳 柳娇",
	  "circunurseName1": "高冬珂 魏漪",
	  "anesthetistName": "程望  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "柳娇",
	  "circunurseName2": "魏漪",
	  "optLevel": "一级",
	  "cutLevel": "1",
	  "hid": "1248990",
	  "operaDate": "2017-01-20"
	},
	{
	  "operRoomName": "第02手术室",
	  "pcs": 1,
	  "deptName": "内一科",
	  "bed": "8",
	  "sex": "男",
	  "age": "36岁",
	  "ageMon": "",
	  "ageDay": "",
	  "name": "秦逸",
	  "designedOptName": "",
	  "operatorName": "周帆",
	  "assistantName": "",
	  "designedAnaesMethodName": "局麻",
	  "instrnurseName1": "唐琳琳 柳娇",
	  "circunurseName1": "高冬珂 魏漪",
	  "anesthetistName": "  ",
	  "circuanesthetistName": "",
	  "perfusiondoctorName": "",
	  "instrnurseName2": "柳娇",
	  "circunurseName2": "魏漪",
	  "optLevel": "一级",
	  "cutLevel": "2",
	  "hid": "24876954",
	  "operaDate": "2017-01-22"
	}
  	];

	function getPage() {

	}

	// 编辑
	$scope.edit = function(row) {
	    $rootScope.$state.go('editOperDateil', {
	        // uid: row.entity.regOptId
	    });
	}

	// 查看
	$scope.query = function(row) {
	    $rootScope.$state.go('preOperDateil', {
	        // uid: row.entity.regOptId
	    });
	}

	// 打印
	$scope.print = function(row) {

	}

	// 取消
	$scope.cancel = function(row) {

	}

	$scope.$on('export',function(){
        $scope.gridApi.exporter.csvExport('all','visible');//导出所有的行和显示的列
    });

	$scope.$on('query',function(ev, data){
		console.log('麻醉医患比', data);
	})

	$scope.$emit('childInited');
}