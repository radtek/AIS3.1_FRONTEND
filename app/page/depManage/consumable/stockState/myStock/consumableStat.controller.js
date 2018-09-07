consumableStatCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', '$timeout', 'auth', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = consumableStatCtrl;

function consumableStatCtrl($rootScope, $scope, IHttp, $filter, $timeout, auth, toastr, $uibModal, uiGridServe) {
    var time = new Date($filter('date')(new Date(), 'yyyy-MM-dd 08:00')).getTime();
    $scope.startTime = $filter('date')(new Date(), 'yyyy-MM-dd 08:00');
    $scope.endTime = $filter('date')(new Date(time + 3600000 * 24), 'yyyy-MM-dd HH:mm');

    var promise,
        params = uiGridServe.params();

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'instrumentName',
            displayName: '耗材名称',
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'chargeAmount',
            displayName: '记账数量',
            cellTooltip: function(row, col) {
                return row.entity.chargeAmount;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showOut(row)>记账明细</a></div>'
        }]
    },getPage);

    getPage();

    function getPage(self) {
        var startTime = $scope.startTime;
        var endTime = $scope.endTime;
        var filters = angular.copy(params.filters);
        if(self){//对话框有GRID，从服务里给回调函数把页码传出来更新页码
            params.pageNo=self.params.pageNo;
            params.pageSize=self.params.pageSize;
        }
        params.filters = [
            {field: "startTime", value: startTime},
            {field: "endTime", value: endTime}
        ];
        for(var i=0; i<filters.length; i++) {
            if (filters[i].value && filters[i].field !== 'startTime' && filters[i].field !== 'endTime')
                params.filters.push(filters[i]);
        }
        IHttp.post('basedata/cntInstrumentUseByOperat', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }

    $scope.export = function(type) {
        pagesize = $scope.gridOptions.totalItems;
        params.pageNo = 1;
        params.pageSize = pagesize;
        getPage();
        setTimeout(function() {
            uiGridServe.exports('记账耗材总数统计');
            pagesize = 15;
        }, 1000);
    }
    $scope.showOut = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row,
            startTime: $scope.startTime,
            endTime: $scope.endTime
        };
        var modalInstance=$uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../myStock/consumableStat_dialog.html'),
            controller: require('../myStock/consumableStat_dialog.controller'),
            less: require('../myStock/myStockInfo.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        });
        modalInstance.result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        });
    }

    $scope.query = function() {
        getPage();
    }
}