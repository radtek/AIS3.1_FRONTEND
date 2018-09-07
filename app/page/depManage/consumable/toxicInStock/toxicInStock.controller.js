toxicInStockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'confirm', '$timeout', '$filter', 'toastr', '$uibModal', 'auth', 'uiGridServe'];

module.exports = toxicInStockCtrl;

function toxicInStockCtrl($rootScope, $scope, IHttp, confirm, $timeout, $filter, toastr, $uibModal, auth, uiGridServe) {
    var user = auth.loginUser();
    var promise,
        params = uiGridServe.params({
            beid: user.beid,
            module: user.module,
        });


    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'instrumentName',
            displayName: '耗材名称',
            width: 240,
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
            }
        }, 
        // {
        //     field: 'firm',
        //     displayName: '厂家名称',
        //     cellTooltip: function(row, col) {
        //         return row.entity.firm;
        //     }
        // }, 
        {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, 
        {
            field: 'batch',
            displayName: '耗材批号',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'number',
            displayName: '数量',
            cellTooltip: function(row, col) {
                return row.entity.number;
            }
        }, {
            field: 'operator',
            displayName: '经办人',
            cellTooltip: function(row, col) {
                return row.entity.operator;
            }
        }, {
            field: 'productionTime',
            displayName: '生产日期',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.productionTime;
            }
        }, {
            field: 'effectiveTime',
            displayName: '有效日期',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.effectiveTime;
            }
        }, {
            field: 'operateTime',
            displayName: '入库日期',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.operateTime;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editIn(row)>编辑</a><span ng-if="!row.entity.checkName">|</span><a href="" ng-click=grid.appScope.checkIn(row) ng-if="!row.entity.checkName">核对</a><span ng-if="!row.entity.checkName">|</span><a href="" ng-click=grid.appScope.deleteIn(row) ng-if="!row.entity.checkName">删除</a></div>'
        }]
    }, function() {
        getPage();
    });

    getPage();

    function getPage() {
        IHttp.post('basedata/queryConsumablesInRecordList ', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            var data = rs.data.resultList;
            for (var i = 0; i < data.length; i++) {
                if (data[i].productionTime) {
                    data[i].productionTime = $filter('date')(data[i].productionTime, 'yyyy-MM-dd');
                }
                if (data[i].effectiveTime) {
                    data[i].effectiveTime = $filter('date')(data[i].effectiveTime, 'yyyy-MM-dd');
                }
                if (data[i].operateTime) {
                    data[i].operateTime = $filter('date')(data[i].operateTime, 'yyyy-MM-dd HH:mm');
                }
            }
            $scope.gridOptions.data = data;
        });
    }

    $scope.addInput = function() {
        $scope.editIn();
    }

    $scope.editIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };

        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../toxicInStock/toxicInStockEdit.html'),
            controller: require('../toxicInStock/toxicInStockEdit.controller'),
            less: require('../toxicInStock/toxicInStockEdit.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        })
    };

    $scope.checkIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '1',
            row: row
        };

        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../toxicInStock/toxicInStockEdit.html'),
            controller: require('../toxicInStock/toxicInStockEdit.controller'),
            less: require('../toxicInStock/toxicInStockEdit.less'),
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
        confirm.show("是否确认删除此记录？").then(function(data) {
            var deleteInParams = {
                id: row.entity.id
            };
            IHttp.post('basedata/delConsumablesInRecord', deleteInParams).then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    toastr.info("删除成功！");
                    getPage();
                }
            });
        });
    }
}