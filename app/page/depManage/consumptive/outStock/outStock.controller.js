OutStockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = OutStockCtrl;

function OutStockCtrl($rootScope, $scope, IHttp, $timeout, toastr, $uibModal, uiGridServe) {
    var promise,
        params = uiGridServe.params({
            filters: [{
                field: "inOutType",
                value: "O"
            }]
        });

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
            field: 'inOutWayName',
            displayName: '出库方式',
            cellTooltip: function(row, col) {
                return row.entity.inOutWayName;
            }
        }, {
            field: 'inOutAmount',
            displayName: '出库数量',
            cellTooltip: function(row, col) {
                return row.entity.inOutAmount;
            }
        }, {
            field: 'minPackageUnit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.minPackageUnit;
            }
        }, {
            field: 'inOutDate',
            displayName: '出库日期',
            cellTooltip: function(row, col) {
                return row.entity.inOutDate;
            }
        }, {
            field: 'invoiceNumber',
            displayName: '发票号',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.invoiceNumber;
            }
        }, {
            field: 'chargeItemId',
            displayName: '收费项目ID',
            cellTooltip: function(row, col) {
                return row.entity.chargeItemId;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'firm',
            displayName: '厂家',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.firm;
            }
        }, {
            field: 'priceStock',
            displayName: '入库价',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.priceStock;
            }
        }, {
            field: 'inOutMoney',
            displayName: '出库金额',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.inOutMoney;
            }
        }, {
            field: 'productionDate',
            displayName: '生产日期',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.productionDate;
            }
        }, {
            field: 'expiryDate',
            displayName: '失效日期',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.expiryDate;
            }
        }, {
            field: 'nurse',
            displayName: '发放人',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.nurse;
            }
        }, {
            field: 'ioId',
            displayName: '操作',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editOut(row.entity.ioId,"O")>编辑</a><span>|</span><a href="" ng-click=grid.appScope.deleteOut(row)>删除</a></div>'
        }]
    }, function(){
        getPage();
    });

    function getPage() {
        IHttp.post('basedata/searchInOutInfo', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    $scope.editOut = function(id, tag) {
        var scope = $rootScope.$new();
        scope.data = {
            tagId: id,
            tagType: 'Out',
            tag: tag
        };
        $uibModal.open({
            animation: true,
            template: require('../modal/materialOutput/materialOutput.html'),
            controller: require('../modal/materialOutput/materialOutput.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(() => {
            getPage();
        })
    };

    // 删除
    $scope.deleteOut = function(row) {
        let deleteInParams = {
            ioId: row.entity.ioId,
            inOutType: 'O',
            materielType: 'I'
        };
        IHttp.post('basedata/deleteInOutInfoById', deleteInParams).then((rs) => {
            if (rs.data.resultCode != 1) return;
            toastr.info('删除成功！');
            getPage();
        });
    }
}