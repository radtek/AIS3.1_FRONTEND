stockSeachCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$timeout', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = stockSeachCtrl;

function stockSeachCtrl($rootScope, $scope, IHttp, auth, $timeout, toastr, $uibModal, uiGridServe) {
    var promise,
        user = auth.loginUser();
    var params = uiGridServe.params({ beid: user.beid });


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
            field: 'number',
            displayName: '总库存数量',
            cellTooltip: function(row, col) {
                return row.entity.number;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showInfo(row)>查看明细</a></div>'
        }]
    }, function() {
        getPage();
    });

    getPage();

    function getPage() {
        IHttp.post('basedata/queryAnaesMedicineListGroupByNFS', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    $scope.showInfo = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };

        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../stockSeach/stockSeachInfo.html'),
            controller: require('../stockSeach/stockSeachInfo.controller'),
            less: require('../stockSeach/stockSeachInfo.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        })
    };
}