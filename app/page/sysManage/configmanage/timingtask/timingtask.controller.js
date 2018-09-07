timingtask.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal','toastr'];

module.exports = timingtask;

function timingtask($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal,toastr) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridTiming = {
        enableFiltering: false,
        enableSorting: false,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        showGridFooter: true, // 显示页脚
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: false,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            // gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            //     if (sortColumns.length === 0) {
            //         $scope.params.orderBy = '';
            //     } else {
            //         $scope.params.orderBy = sortColumns[0].sort.direction;
            //         $scope.params.sort = sortColumns[0].colDef.field;
            //     }
            //     getTimingTask();
            // });
            // //分页
            // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            //     $scope.params.pageNo = newPage;
            //     $scope.params.pageSize = pageSize;
            //     getTimingTask();
            // });
            // //过滤
            // gridApi.core.on.filterChanged($scope, function() {
            //     $scope.grid = this.grid;
            //     if (promise) {
            //         $timeout.cancel(promise);
            //     }
            //     promise = $timeout(function() {
            //         var filterArr = [];
            //         angular.forEach($scope.grid.columns, function(column) {
            //             var fieldName = column.field;
            //             var value = column.filters[0].term;
            //             if (value) {
            //                 filterArr.push({
            //                     field: fieldName,
            //                     value: value
            //                 });
            //             }
            //         });
            //         $scope.params.filters = filterArr;
            //         getTimingTask();
            //     }, 1000)
            // });
        },
        columnDefs: [{
            field: 'taskName',
            displayName: '任务名称',
            cellTemplate:'<div > <input type="text"  ng-change="grid.appScope.updatacolumn(row,1)" ng-model="row.entity.taskName" style="border:0;background-color:transparent;height:40px;text-align:center" /> </div>',
            cellTooltip: function(row, col) {
                return row.entity.taskName;
            }
        }, {
            field: 'taskGroup',
            displayName: '任务组',
            cellTemplate:'<div > <input type="text"  ng-change="grid.appScope.updatacolumn(row,2)" ng-model="row.entity.taskGroup" style="border:0;background-color:transparent;height:40px;text-align:center" /> </div>',
            cellTooltip: function(row, col) {
                return row.entity.taskGroup;
            }
        }, {
            field: 'createTime',
            displayName: '创建时间',
            enableCellEdit: false,
            cellFilter: 'date:"yyyy-MM-dd HH:mm"',
            cellTooltip: function(row, col) {
                return $filter('date')(row.entity.createTime, 'yyyy-MM-dd HH:mm');
            }
        }, {
            field: 'updateTime',
            displayName: '更新时间',
            enableCellEdit: false,
            cellFilter: 'date:"yyyy-MM-dd HH:mm"',
            cellTooltip: function(row, col) {
                return $filter('date')(row.entity.updateTime, 'yyyy-MM-dd HH:mm');
            }
        }, {
            field: 'taskStatus',
            displayName: '是否启用',
            enableCellEdit: false,
            cellFilter: "enabledSelect",
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                },]
            },
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        }, {
            field: 'cronExpression',
            displayName: '表达式',
            enableCellEdit: false,
            cellTooltip: function(row, col) {
                return row.entity.cronExpression;
            }
        }, {
            field: 'description',
            displayName: '描述',
            enableCellEdit: false,
            cellTooltip: function(row, col) {
                return row.entity.description;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableCellEdit: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" >' +
                '<a ng-click=grid.appScope.cron(row)>表达式&nbsp</a>' +
                '<a  ng-if="row.entity.taskStatus==0"  ng-click=grid.appScope.toogleStatus(row)>启用&nbsp</a>' +
                '<a ng-if="row.entity.taskStatus==1"  ng-click=grid.appScope.toogleStatus(row)>禁用&nbsp</a>' +
                '<a ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delTimingTask(row)>删除&nbsp</a>' +
                '</div>',
        }],
        rowTemplate: '<div ui-grid-cell ng-blur="grid.appScope.detail(row);"   class="ui-grid-cell" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ></div>',
        data: []
    };
    $scope.updatacolumn=function(row,value){
        
        var params={};
        params.id=row.entity.id;
        switch(value){
            case 1: 
            var x=row.entity.taskName;
            params.taskName=x;
            break;
            case 2: 
            var x=row.entity.taskGroup;
            params.taskGroup=x;
            break;
        }
        if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    IHttp.post("sys/updateTaskSchedule", params).then(function(rs) {
                        if (rs.data.resultCode === '1') {
                            toastr.success(rs.data.resultMessage);
                            getTimingTask();
                        }
                    });
                }, 500)
    }
    $scope.toogleStatus=function(row){
        var params={};
        if (row === undefined) {
            params.id = 0;
        } else {
            params.id = row.entity.id;
        }
        params.taskStatus=row.entity.taskStatus==1?0:1;
        IHttp.post("sys/updateTaskSchedule", params).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                getTimingTask();
            }
        });
    }
    $scope.cron=function(row){
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.id = 0;
            scope.taskStatus=0;
        } else {
            scope.id = row.entity.id;
            scope.cronExpression=row.entity.cronExpression;
        }
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./cron.html'),
            controller: require('./cron.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function(data) {
            getTimingTask();
        });
    }
    $scope.refresh = function() {
        getTimingTask();
    }
    var getTimingTask = function() {
        IHttp.post("sys/searchAllTaskSchedule", {}).then(function(rs) {
            if (rs.data.resultCode != 1) {
                return;
            }
            $scope.gridTiming.data = rs.data.resultList;
            $scope.gridTiming.data = rs.data.resultList;
        })
    }
    getTimingTask();

    // $scope.addTimingTask = function(row) {
    //     var scope = $rootScope.$new();
    //     if (row === undefined) {
    //         scope.id = 0;
    //     } else {
    //         scope.id = row.entity.id;
    //     }
    //     $uibModal.open({
    //         animation: true,
    //         size: 'lg',
    //         template: require('./taskdialog.html'),
    //         controller: require('./taskdialog.controller'),
    //         controllerAs: 'vm',
    //         backdrop: 'static',
    //         scope: scope
    //     }).result.then(function(data) {
    //         getTimingTask();
    //     });
    // }
    $scope.delTimingTask = function(row) {
        if (row === undefined) {
            id = 0;
        } else {
            id = row.entity.id;
        }
        IHttp.post("sys/deleteTaskSchedule", {id:id}).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                getTimingTask();
            }
        });
    }

}
