InspReportCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'toastr', 'select', 'auth', '$filter'];

module.exports = InspReportCtrl;

function InspReportCtrl($rootScope, $scope, IHttp, $uibModal, toastr, select, auth, $filter) {
    var vm = this,
        promise;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();

    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
    });
    var params = {
        pageNo: 1,
        pageSize: 1000,
        sort: '',
        orderBy: '',
        filters: [{field: 'regOptId', value: regOptId}]
    }

    // $scope.gridOptions = {
    //     enableFiltering: true, //  表格过滤栏
    //     paginationPageSizes: [ 15, 30, 50],
    //     rowHeight: 40,
    //     useExternalPagination: true, // 分页
    //     useExternalSorting: true,
    //     onRegisterApi: function(gridApi) {
    //         $scope.gridApi = gridApi;
    //         gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
    //             params.pageNo = newPage;
    //             params.pageSize = pageSize;
    //             initData();
    //         });
    //         gridApi.core.on.filterChanged($scope, function() {
    //             $scope.grid = this.grid;
    //             if (promise) {
    //                 $timeout.cancel(promise);
    //             }
    //             promise = $timeout(function() {
    //                 var filterArr = [];
    //                 angular.forEach($scope.grid.columns, function(column) {
    //                     var fieldName = column.field;
    //                     var value = column.filters[0].term;
    //                     if (value === null) {
    //                         value = "";
    //                     }
    //                     if (value !== undefined) {
    //                         filterArr.push({
    //                             field: fieldName,
    //                             value: value
    //                         });
    //                     }
    //                 });
    //                 params.filters = filterArr;
    //                 initData();
    //             }, 1000)
    //         });
    //     },
    //     columnDefs: [{
    //         field: 'date',
    //         displayName: '申请日期',
    //         width: 110,
    //         cellTooltip: function(row, col) {
    //             return row.entity.date;
    //         }
    //     }, {
    //         field: 'reportDate',
    //         displayName: '报告日期',
    //         width: 110,
    //         cellTooltip: function(row, col) {
    //             return row.entity.reportDate;
    //         }
    //     }, {
    //         field: 'dep',
    //         displayName: '申请科室',
    //         width:96,
    //         cellTooltip: function(row, col) {
    //             return row.entity.dep;
    //         }
    //     }, {
    //         field: 'instruction',
    //         displayName: '详细信息',
    //         width: 180,
    //         cellTooltip: function(row, col) {
    //             return row.entity.instruction;
    //         }
    //     }, {
    //         field: 'reqDoctorId',
    //         displayName: '申请医生',
    //         width:96,
    //         cellTooltip: function(row, col) {
    //             return row.entity.reqDoctorId;
    //         }
    //     }, {
    //         field: 'remark',
    //         displayName: '备注',
    //         cellTooltip: function(row, col) {
    //             return row.entity.remark;
    //         }
    //     }, {
    //         field: 'state',
    //         displayName: '状态',
    //         cellTooltip: function(row, col) {
    //             return row.entity.state;
    //         }
    //     }, {
    //         field: 'regOptId',
    //         displayName: '操作',
    //         width: 70,
    //         enableSorting: false,
    //         enableFiltering: false,
    //         cellTemplate: '<div class="ui-grid-cell-contents" ><a class="viewa" ng-click="grid.appScope.toView(row.entity)">查看</a></div>',
    //     }]
    // };

    // his导入
    $scope.import = function(event) {
        IHttp.post("interfacedata/queryCheckListMaster", { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            toastr.success(rs.data.resultMessage);
            initData();
        });
    }

    initData();

    function initData() {
        IHttp.post("inspect/getPatInspectRecordList", params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            rs.data.resultList.forEach(function(i) {
                i.date = $filter('date')(i.date, 'yyyy-MM-dd');
                i.reportDate = $filter('date')(i.reportDate, 'yyyy-MM-dd');
                // i.state = i.state == '1' ? '未出报告' : (i.state == '2' ? '未审核' : '已审核');
            });
            $scope.griddata = rs.data.resultList;
            $scope.gridtotal = rs.data.total;
        });
    }

    // 查看
    $scope.toView = function(entity) {
        $uibModal.open({
            template: require('./detail.html'),
            controller: require('./detail.controller.js'),
            size: 'lg',
            resolve: {
                items: entity
            }
        });
    }

    $scope.$on('save', () => {
        save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
}