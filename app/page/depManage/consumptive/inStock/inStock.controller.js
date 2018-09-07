InStockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = InStockCtrl;

function InStockCtrl($rootScope, $scope, IHttp, $timeout, toastr, $uibModal, uiGridServe) {

    var promise,
        params = uiGridServe.params({
            filters: [{
                field: "inOutType",
                value: "I"
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
            field: 'businessSerialNumber',
            displayName: '业务流水号',
            cellTooltip: function(row, col) {
                return row.entity.businessSerialNumber;
            }
        }, {
            field: 'invoiceNumber',
            displayName: '发票号',
            cellTooltip: function(row, col) {
                return row.entity.invoiceNumber;
            }
        }, {
            field: 'inOutWayName',
            displayName: '入库方式',
            cellTooltip: function(row, col) {
                return row.entity.inOutWayName;
            }
        }, {
            field: 'inOutAmount',
            displayName: '入库数量',
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
            field: 'priceStock',
            displayName: '入库价',
            cellTooltip: function(row, col) {
                return row.entity.priceStock;
            }
        }, {
            field: 'inOutMoney',
            displayName: '入库金额',
            cellTooltip: function(row, col) {
                return row.entity.inOutMoney;
            }
        }, {
            field: 'inOutDate',
            displayName: '入库日期',
            cellTooltip: function(row, col) {
                return row.entity.inOutDate;
            }
        }, {
            field: 'chargeItemId',
            displayName: '收费项目ID',
            visible: false,
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
            field: 'ioId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editIn(row)>编辑</a><span>|</span><a href="" ng-click=grid.appScope.deleteIn(row)>删除</a></div>'
        }]
    }, function(){
        getPage();
    });
    
    $scope.$on('refresh', () => {
        getPage();
    })

    $scope.$on('addInput', () => {
        $scope.editIn();
    })

    $scope.editIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/materialInput/materialInput.html'),
            controller: require('../modal/materialInput/materialInput.controller'),
            less: require('../modal/materialInput/materialInput.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        })
    };

    $scope.deleteIn = function(row) {
        var deleteInParams = {
            ioId: row.entity.ioId,
            inOutType: 'I',
            materielType: 'I'
        };
        IHttp.post('basedata/deleteInOutInfoById', deleteInParams).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                toastr.info("删除成功！");
                getPage();
            }
        });
    }

    function getPage() {
        IHttp.post('basedata/searchInOutInfo', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }
}