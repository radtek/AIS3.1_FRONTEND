userDefinedNecessary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal','auth'];

module.exports = userDefinedNecessary;

function userDefinedNecessary($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal,auth) {
	var promise;
    var vm = this;
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var user=auth.loginUser();
    
    $scope.gridOptions = {
        enableFiltering: false,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight:40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getNecessaryList();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getNecessaryList();
            });
            
        },
        columnDefs: [{
            field: 'name',
            displayName: '文书名称',
            width:225,
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        },{
            field: 'table',
            displayName: '文书对应的表名',
            width:232,
            cellTooltip: function(row, col) {
                return row.entity.table;
            }
        },{
            field: 'isEnterOperFinish',
            displayName: '术中是否必须完成',//;0:否,1:是
            width:140,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '是'
                }, {
                    value: "0",
                    label: '否'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.isEnterOperFinish;
            }
        },{
            field: 'isNeed',
            displayName: '是否必须完成',//0:否,1:是
            width:110,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '是'
                }, {
                    value: "0",
                    label: '否'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.isNeed;
            }
        },{
            field: 'isOperShow',
            displayName: '是否术中展示',//0:否,1:是"
            width:110,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '是'
                }, {
                    value: "0",
                    label: '否'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.isOperShow;
            }
        },{
            field: 'aliasName',
            displayName: '前端依赖的别名',
            width:210,
            cellTooltip: function(row, col) {
                return row.entity.aliasName;
            }
        },{
            field: 'operationState',
            displayName: '文书类型',//术前:03,术中:04,复苏:05,术后:06
            width:80,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "03",
                    label: '术前'
                }, {
                    value: "04",
                    label: '术中'
                },{
                    value: "05",
                    label: '复苏'
                }, {
                    value: "06",
                    label: '术后'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.operationState;
            }
        },{
            field: 'required',
            displayName: '文书必填项',
            cellTooltip: function(row, col) {
                return row.entity.required;
            }
        }, {
            field: 'enable',
            displayName: '是否可用',//0-不可用，1-可用
            width:80,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '可用'
                }, {
                    value: "0",
                    label: '不可用'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        }, {
            field: 'docId',
            displayName: '操作',
            width:66,
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-click=grid.appScope.setNecessary(row)>编辑</a></div>',
        }],
        data: []
    };

    $scope.refresh = function() {
        getNecessaryList();
    }

    var getNecessaryList = function() {
        IHttp.post("basedata/selectBasDocumentByBeid", {"beid":user.beid}).then(function(data) {
            data = data.data;
            $scope.gridOptions.totalItems = data.resultList.length;
            for (var i = 0; i < data.resultList.length; i++) {
                data.resultList[i].isEnterOperFinish_=data.resultList[i].isEnterOperFinish;
                if (data.resultList[i].isEnterOperFinish == 1) {
                    data.resultList[i].isEnterOperFinish = '是';
                } else {
                    data.resultList[i].isEnterOperFinish = '否';
                }
                data.resultList[i].isNeed_=data.resultList[i].isNeed;

                if (data.resultList[i].isNeed == 1) {
                    data.resultList[i].isNeed = '是';
                } else {
                    data.resultList[i].isNeed = '否';
                }
                data.resultList[i].isOperShow_=data.resultList[i].isOperShow;

                if (data.resultList[i].isOperShow == 1) {
                    data.resultList[i].isOperShow = '是';
                } else {
                    data.resultList[i].isOperShow = '否';
                }
                data.resultList[i].operationState_=data.resultList[i].operationState;

                if (data.resultList[i].operationState == '03') {//;术前:03,术中:04,复苏:05,术后:06
                    data.resultList[i].operationState = '术前';
                } else if(data.resultList[i].operationState == '04') {
                    data.resultList[i].operationState = '术中';
                } else if(data.resultList[i].operationState == '05') {
                    data.resultList[i].operationState = '复苏';
                } else if(data.resultList[i].operationState == '06') {
                    data.resultList[i].operationState = '术后';
                }
                data.resultList[i].enable_=data.resultList[i].enable;

                if (data.resultList[i].enable == 1) {//;0-不可用，1-可用
                    data.resultList[i].enable = '可用';
                } else {
                    data.resultList[i].enable = '不可用';
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getNecessaryList();

	$scope.setNecessary=function(row){
		var scope = $rootScope.$new();
        if (row === undefined) {
            scope.state = 0;
        } else {
            scope.item = row.entity;         
        }
        $uibModal.open({
            animation: true,            
            template: require('./editNecessary.html'),
            controller: require('./editNecessary.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getNecessaryList();
        });
	}
}