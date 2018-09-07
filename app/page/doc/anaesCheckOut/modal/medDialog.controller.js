MedDialogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'toastr', 'auth', 'anaesCheckOutServe', '$uibModalInstance'];

module.exports = MedDialogCtrl;

function MedDialogCtrl($rootScope, $scope, IHttp, $filter, toastr, auth, anaesCheckOutServe, $uibModalInstance) {
    vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;

    IHttp.post('interfacedata/queryTakeMedRecordList', {regOptId: regOptId}).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        var data = rs.data.medList;
        $scope.gridOptions.data = data;
        $scope.gridOptions.totalItems = rs.data.total;
    });

    $scope.gridOptions = {
        enableFiltering: false, //  表格过滤栏
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: false, // 分页
        useExternalSorting: true,
        columnDefs: [{
                field: 'medicineName',
                displayName: '取药名称',
                cellTooltip: function(row, col) {
                    return row.entity.medicineName;
                }
            }, {
                field: 'batch',
                displayName: '批次',
                cellTooltip: function(row, col) {
                    return row.entity.batch;
                }
            }, {
                field: 'spec',
                displayName: '规格',
                cellTooltip: function(row, col) {
                    return row.entity.spec;
                }
            }, {
                field: 'number',
                displayName: '取药数量',
                cellTooltip: function(row, col) {
                    return row.entity.number;
                }
            }, {
                field: 'type',
                displayName: '类型',
                cellTooltip: function(row, col) {
                    return row.entity.type;
                }
            }, {
                field: 'taketime',
                displayName: '取药时间',
                cellTooltip: function(row, col) {
                    return row.entity.taketime;
                }
            }, {
                field: 'takeUser',
                displayName: '取药人',
                cellTooltip: function(row, col) {
                    return row.entity.takeUser;
                }
            }]
    };

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}
