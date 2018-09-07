selectlistconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal','auth'];

module.exports = selectlistconfig;

function selectlistconfig($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal,auth) {
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
            displayName: '下拉框名称',
            width:225,
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        },{
            field: 'isEnterOperFinish',
            displayName: '接口类型',//;0:否,1:是
            width:140,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '前端'
                }, {
                    value: "0",
                    label: '后端'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.isEnterOperFinish;
            }
        },{
            field: 'table',
            displayName: '下拉框的接口',
            width:232,
            cellTooltip: function(row, col) {
                return row.entity.table;
            }
        },{
            field: 'aliasName',
            displayName: '接口参数',
            width:210,
            cellTooltip: function(row, col) {
                return row.entity.aliasName;
            }
        },{
            field: 'aliasName',
            displayName: '显示字段',
            width:210,
            cellTooltip: function(row, col) {
                return row.entity.aliasName;
            }
        },{
            field: 'aliasName',
            displayName: '主键字段',
            width:210,
            cellTooltip: function(row, col) {
                return row.entity.aliasName;
            }
        },{
            field: 'isNeed',
            displayName: '是否智能搜索',//0:否,1:是
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
            field: 'required',
            displayName: '智能搜索参数',
            cellTooltip: function(row, col) {
                return row.entity.required;
            }
        },  {
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
            template: require('./editselectlist.html'),
            controller: require('./editselectlist.controller'),
            controllerAs: 'vm',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getNecessaryList();
        });
	}
}