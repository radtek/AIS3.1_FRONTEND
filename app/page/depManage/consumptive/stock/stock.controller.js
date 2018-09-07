StockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = StockCtrl;

function StockCtrl($rootScope, $scope, IHttp, $timeout, toastr, $uibModal, uiGridServe) {

    var promise,
        params = uiGridServe.params();
    console.log(params)

    getPage();

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'name',
            displayName: '物资名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'batch',
            displayName: '批次',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'productionDate',
            displayName: '生产日期',
            cellTooltip: function(row, col) {
                return row.entity.productionDate;
            }
        }, {
            field: 'expiryDate',
            displayName: '失效日期',
            cellTooltip: function(row, col) {
                return row.entity.expiryDate;
            }
        }, {
            field: 'priceMinPackage',
            displayName: '零售价格',
            cellTooltip: function(row, col) {
                return row.entity.priceMinPackage;
            }
        }, {
            field: 'minPackageUnit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.minPackageUnit;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'chargeItemId',
            displayName: '收费项目号',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.chargeItemId;
            }
        }, {
            field: 'batch',
            displayName: '批次',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'firm',
            displayName: '厂商',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.firm;
            }
        }, {
            field: 'inventoryAmount',
            displayName: '库存数量',
            cellTooltip: function(row, col) {
                return row.entity.inventoryAmount;
            }
        }, {
            field: 'invtId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editOut(row.entity.invtId,"S")>出库</a><span>|</span><a href="" ng-click=grid.appScope.outputDetail(row)>明细</a></div>'
        }]
    }, function(){
        getPage();
    });

    $scope.editOut = function(id, tag) {
        var scope = $rootScope.$new();
        scope.data = {
            tagId: id,
            tag: tag
        };
        $uibModal.open({
            animation: true,
            template: require('../modal/materialOutput/materialOutput.html'),
            controller: require('../modal/materialOutput/materialOutput.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((data) => {
            if (data === 'success')
                getPage();
        })
    };

    $scope.outputDetail = function(row) {
        var scope = $scope.$new();
        scope.data = {
            chargeItemId: row.entity.chargeItemId,
            batch: row.entity.batch
        };

        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/materialDetail/materialDetail.html'),
            controller: require('../modal/materialDetail/materialDetail.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        })
    }

    function getPage() {
        IHttp.post('basedata/searchInventory', params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }
}