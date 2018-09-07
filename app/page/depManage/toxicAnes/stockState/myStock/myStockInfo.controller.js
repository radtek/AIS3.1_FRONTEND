myStockInfoCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr','$uibModal', '$uibModalInstance', 'select', '$filter', 'auth', 'uiGridServe'];

module.exports = myStockInfoCtrl;

function myStockInfoCtrl($rootScope, $scope, IHttp, $timeout, toastr,$uibModal, $uibModalInstance, select, $filter, auth, uiGridServe) {
    vm = this;
    vm.title = "查看明细";
    var promise,
        params = uiGridServe.params();

    if ($scope.data.row) {
        vm.title = "查看个人物资明细";
        getPage($scope.data)
    }

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'medicineName',
            displayName: '药品名称',
            cellTooltip: function(row, col) {
                return row.entity.medicineName;
            }
        }, {
            field: 'firm',
            displayName: '厂家名称',
            cellTooltip: function(row, col) {
                return row.entity.firm;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'batch',
            displayName: '批号',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        },
        //  {
        //     field: 'inOutMoney',
        //     displayName: '类型',
        //     cellTooltip: function(row, col) {
        //         return row.entity.inOutMoney;
        //     }
        // },
         {
            field: 'outNumber',
            displayName: '取药',
            cellTooltip: function(row, col) {
                return row.entity.outNumber;
            }
        }, {
            field: 'retreatNumber',
            displayName: '退药',
            cellTooltip: function(row, col) {
                return row.entity.retreatNumber;
            }
        }, {
            field: 'loseNumber',
            displayName: '报损',
            cellTooltip: function(row, col) {
                return row.entity.loseNumber;
            }
        }, {
            field: 'actualNumber',
            displayName: '实际',
            cellTooltip: function(row, col) {
                return row.entity.actualNumber;
            }
        }, {
            field: 'outTime1',
            displayName: '取药时间',
            width: 140,
            cellTooltip: function(row, col) {
                return row.entity.outTime1;
            }
        }
        // , {
        //     field: 'id',
        //     displayName: '关联操作',
        //     enableFiltering: false,
        //     enableSorting: false,
        //     cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showIn(row)>详情</a></div>'
        // }
        ]
    }, function() {
        getPage();
    });
    $scope.showIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row,
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            params:params
        };
        var modalInstance=$uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../myStock/myStockInfo_dialog.html'),
            controller: require('../myStock/myStockInfo_dialog.controller'),
            less: require('../myStock/myStockInfo.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        });
        // modalInstance.result.then((data) => {
        //     if (data === 'success') {
        //         getPage();
        //     }
        // });
        modalInstance.result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        });
    }
    function getPage(data) {
        var startTime = data.startTime;
        var endTime = data.endTime;
        var medicineName = $scope.data.row.entity.medicineName;
        var firm = $scope.data.row.entity.firm;
        var spec = $scope.data.row.entity.spec;
        var receiveName = $scope.data.row.entity.receive;
        params.filters = [{ "field": "startTime", "value": startTime },
            { "field": "endTime", "value": endTime },
            { "field": "receiveName", value: receiveName },
            { "field": "firm", "value": firm },
            { "field": "medicineName", "value": medicineName },
            { "field": "spec", "value": spec }
        ];

        IHttp.post('basedata/queryMedicineOutRecordList', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            for (var i = 0; i < rs.data.resultList.length; i++) {
                rs.data.resultList[i].outTime1 = $filter('date')(rs.data.resultList[i].outTime, 'yyyy-MM-dd HH:mm');
            }
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
}