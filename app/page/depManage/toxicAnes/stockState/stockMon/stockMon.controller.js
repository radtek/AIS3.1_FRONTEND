stockMonCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = stockMonCtrl;

function stockMonCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr, $uibModal, uiGridServe) {
    var promise;
    $scope.param = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    };

    var params = uiGridServe.params();

    $scope.grid = { 'height': '731px' }

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
            displayName: '药品批号',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'lastMonthAllNum',
            displayName: '上月总结存',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.lastMonthAllNum;
            }
        }, {
            field: 'monthAllInNum',
            displayName: '本月总库存',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.monthAllInNum;
            }
        }, {
            field: 'monthAllOutNum',
            displayName: '本月总取药',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.monthAllOutNum;
            }
        }, {
            field: 'monthAllRetreatNum',
            displayName: '本月总退药',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.monthAllRetreatNum;
            }
        }, {
            field: 'monthAllLoseNum',
            displayName: '本月总报损',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.monthAllLoseNum;
            }
        }, {
            field: 'monthAllNum',
            displayName: '本月总库存',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.monthAllNum;
            }
        }]
    }, function() {
        getPage();
    });

    $scope.export = function(type) {
        pagesize = $scope.gridOptions.totalItems;
        params.pageNo = 1;
        params.pageSize = pagesize;
        getPage();
        setTimeout(function() {
            uiGridServe.exports('库存月报表');
            pagesize = 15;
        }, 1000);
    }

    getPage();

    function getPage() {
        $scope.param.month = parseInt($scope.param.month);
        var filters = angular.copy(params.filters);
        if ($scope.param.month < 10) $scope.param.month = '0' + $scope.param.month;
        var searchDate = $scope.param.year + '-' + $scope.param.month;
        params.filters = [{
            field: "queryMonth",
            value: searchDate
        }];
        for(var i=0; i<filters.length; i++) {
            if (filters[i].value && filters[i].field !== 'queryMonth')
                params.filters.push(filters[i]);
        }
        IHttp.post('basedata/queryAnaesMedicineByMonth', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }
    
    $scope.query = function() {
        getPage();
    }
}