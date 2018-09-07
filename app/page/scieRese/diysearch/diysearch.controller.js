diysearch.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal', '$q', '$filter'];

module.exports = diysearch;
//toastr,auth
function diysearch($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal, $q, $filter) {
    var vm = this;
    vm.bundle = {table_name:"yjx"};
    vm.bundle2 = { value: "禁食", checked: false };
    $scope.dataColumns = $scope.dataTables = [
        { value: "禁食", checked: false }
    ];
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    initTableName();
    function initTableName() {
        IHttp.post('/sys/selectAllView').then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.dataTables = [];
            $scope.dataTables = rs.data.resultList;
            vm.bundle = rs.data.resultList[0];
            initviewName("init");
        });
    }
    $scope.changeTable = function() {
        initviewName("init");
    }
    function initviewName(flag) {
        IHttp.post('/sys/selectAllColumnsOfView', {"viewName": vm.bundle.table_name}).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.dataColumns = [];
            $scope.dataColumns = rs.data.resultList;
            $scope.params.pageNo=1;
           $scope.gridoperaRoom.exporterCsvFilename=vm.bundle.table_name+".csv";
            vm.bundle2=[];
            if(flag==="init"){
                    for(var i=0;i<3;i++){
                 vm.bundle2.push(rs.data.resultList[i]);
                }
            }
            
            $scope.search();
        });

    }
    $scope.search=function(flag){
        var columnList=[];
        var columnDefs=[];
        for(var i=0;i<vm.bundle2.length;i++){
            columnList.push(vm.bundle2[i].id);//传参
            columnDefs.push({
                field: vm.bundle2[i].id,
                name: vm.bundle2[i].value,
                cellTooltip: function(row, col) {
                    return row.entity.value;
                }
            })
        }
        $scope.params.viewName=vm.bundle.table_name;
        $scope.params.columnList=columnList;
        if(flag===undefined){
            $scope.gridoperaRoom.paginationCurrentPage=1;
            $scope.params.pageNo=1;
        }
        IHttp.post('/sys/selectByColumns', $scope.params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridoperaRoom.columnDefs=columnDefs;
             $scope.gridoperaRoom.totalItems=rs.data.total;
             $scope.gridoperaRoom.data=rs.data.resultList;
            
        });
    }  

    $scope.gridoperaRoom = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationCurrentPage:1,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        exporterCsvFilename: '自定义数据.csv',
        exporterOlderExcelCompatibility: true, //为true时不使用utf-16编码
        onRegisterApi: function(gridApi) {
            //排序
            // gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            //     if (sortColumns.length === 0) {
            //         $scope.params.orderBy = '';
            //     } else {
            //         $scope.params.orderBy = sortColumns[0].sort.direction;
            //         $scope.params.sort = sortColumns[0].colDef.field;
            //     }
            //     getDocList();
            // });
            //分页
            $scope.gridApiOptions=gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                $scope.search("page");
            });
            //过滤
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
            //         getDocList();
            //     }, 1000)
            // });
        },
        columnDefs: [{
            field: 'name',
            displayName: '自定义文书名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'enable',
            displayName: '页面状态',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                }, ]
            },
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        },{
            field: 'roomType',
            displayName: '审核状态',            
            cellTooltip: function(row, col) {
                return row.entity.roomType;
            }
        }, {
            field: 'operRoomId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-click=grid.appScope.setDoc(row)>设置　</a><a ng-click=grid.appScope.editDoc(row)>|　编辑　</a><a ng-if="row.entity.roomType == \'审核通过\'"  ng-click=grid.appScope.enableDoc(row)><span ng-if="row.entity.enable ==\'启用\'">|　禁用　</span><span ng-if="row.entity.enable ==\'禁用\'">|　启用　</span></a><a ng-if="row.entity.roomType != \'审核通过\'" ng-click=grid.appScope.checkDoc(row)>|　审核　</a><a ng-if="row.entity.roomType != \'审核通过\'"  ng-click=grid.appScope.delDoc(row)>|　删除</a></div>',
        }],
        data: []
    };
    $scope.export = function() {
        $scope.gridApiOptions.exporter.csvExport('visible', 'visible');
    };
}
