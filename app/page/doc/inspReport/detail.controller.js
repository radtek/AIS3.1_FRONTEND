InspReportDetailCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'items', '$uibModalInstance', 'toastr', 'auth'];

module.exports = InspReportDetailCtrl;

function InspReportDetailCtrl($rootScope, $scope, IHttp, items, $uibModalInstance, toastr, auth) {
    $scope.report = items;
    var params = {
        // pageNo: 1,
        // pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [{
            field: 'recId',
            value: items.id
        }]
    }

    $scope.gridOptions = {
        enableFiltering: false, //  表格过滤栏
        enableGridMenu: true, //表格配置按钮
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: false, // 分页
        useExternalSorting: true,
        columnDefs: [ {
            field: 'name',
            displayName: '项目名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'val',
            displayName: '结果',
            cellTooltip: function(row, col) {
                return row.entity.val;
            }
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, {
            field: 'refVal',
            displayName: '参考值',
            cellTooltip: function(row, col) {
                return row.entity.refVal;
            }
        }, {
            field: 'result',
            displayName: '结果异常提示',
            cellTooltip: function(row, col) {
                return row.entity.result;
            }
        }]
    };

    IHttp.post('inspect/getPatInspectItemList', params).then(function(rs) {
        if (rs.data.resultCode != '1')
            return;
        $scope.gridOptions.data = rs.data.resultList;
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}