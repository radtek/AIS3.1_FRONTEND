myStockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', '$timeout', 'auth', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = myStockCtrl;

function myStockCtrl($rootScope, $scope, IHttp, $filter, $timeout, auth, toastr, $uibModal, uiGridServe) {
    var time = new Date($filter('date')(new Date(), 'yyyy-MM-dd 08:00')).getTime();
    $scope.startTime = $filter('date')(new Date(), 'yyyy-MM-dd 08:00');
    $scope.endTime = $filter('date')(new Date(time + 3600000 * 24), 'yyyy-MM-dd HH:mm');

    var promise,
        params = uiGridServe.params();

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'receiveName',
            displayName: '名称',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.receiveName;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'medicineName',
            displayName: '药品名称',
            cellTooltip: function(row, col) {
                return row.entity.medicineName;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'firm',
            displayName: '厂家名称',
            cellTooltip: function(row, col) {
                return row.entity.firm;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allOutNumber',
            displayName: '总取药',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.allOutNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allRetreatNumber',
            displayName: '总退药',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.allRetreatNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allLoseNumber',
            displayName: '总报损',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.allLoseNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'chargeAmount',
            displayName: '计费数量',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.chargeAmount;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allActualNumber',
            displayName: '总使用',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.allActualNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allActualNumber',
            displayName: '实际使用',
            enableFiltering: false,
            visible:false,
            cellTooltip: function(row, col) {
                return row.entity.allActualNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'outTime',
            displayName: '时间',
            visible: false,
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.outTime;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showIn(row)>毒麻药明细</a>&nbsp|&nbsp<a href="" ng-click=grid.appScope.showOut(row)>计费明细</a></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }]
    },getPage);

    getPage();

    function setColor(row) {
        if (!row.entity.chargeAmount) {
            return 'my-stock-red';
        }else if (row.entity.allActualNumber != row.entity.chargeAmount) {
            return 'my-stock-red';
        }else if(row.entity.chargeAmount == 0 && row.entity.allActualNumber != 0) {
            return 'my-stock-red';
        }else {
            return '';
        }
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
            template: require('../myStock/myStockInfo_dialog.html'),
            controller: require('../myStock/myStockInfo_dialog.controller'),
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
        IHttp.post('basedata/queryAnaesMedicineByPersonal', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            var data = rs.data.resultList;
            for (var i = 0; i < data.length; i++) {
                if (data[i].outTime) {
                    data[i].outTime = $filter('date')(data[i].outTime, 'yyyy-MM-dd HH:mm');
                }
            }
            $scope.gridOptions.data = data;
        });
    }

    $scope.export = function(type) {
        pagesize = $scope.gridOptions.totalItems;
        params.pageNo = 1;
        params.pageSize = pagesize;
        getPage();
        setTimeout(function() {
            uiGridServe.exports('个人物资使用情况');
            pagesize = 15;
        }, 1000);
    }

    $scope.showIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row,
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            params:params
        };
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../myStock/myStockInfo.html'),
            controller: require('../myStock/myStockInfo.controller'),
            less: require('../myStock/myStockInfo.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((data) => {
            if (data === 'cancel') {
                getPage();
            }
        })
    }

    $scope.query = function() {
        getPage();
    }
}