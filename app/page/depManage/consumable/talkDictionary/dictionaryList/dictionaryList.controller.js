dictionaryListCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$filter', 'toastr', '$uibModal', 'auth', 'dateFilter', 'uiGridServe', 'select'];

module.exports = dictionaryListCtrl;

function dictionaryListCtrl($rootScope, $scope, IHttp, $timeout, $filter, toastr, $uibModal, auth, dateFilter, uiGridServe, select) {
    var user = auth.loginUser();

    var promise,
        params = uiGridServe.params({
            beid: user.beid,
            module: user.module,
        });
    $scope.outTime = dateFilter(new Date(), 'yyyy-MM-dd HH:mm');

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'instrumentName',
            displayName: '耗材名称',
            width: 240,
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
            }
        },
        //  {
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
            displayName: '库存数量',
            minWidth: 100
        }, {
            field: 'outNumber',
            displayName: '取耗材数量',
            width: 100,
            enableFiltering: false,
            cellTemplate: '<input type="number" transform="number" class="text-center" style="height: 39px;" min="1" ng-max="row.entity.number" ng-disabled="!row.isSelected" ng-model="row.entity.outNumber">',
        }, {
            field: 'effectiveTime',
            displayName: '有效日期',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.effectiveTime;
            }
        }, {
            field: 'ioId',
            displayName: '操作',
            width: 100,
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editIn(row)>取耗材</a></div>'
        }]
    }, function() {
        getPage();
    });

    getPage();

    function getPage() {
        IHttp.post('basedata/queryConsumablesList', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.gridOptions.totalItems = rs.data.total;
            var data = rs.data.resultList;
            for (var i = 0; i < data.length; i++) {
                if (data[i].effectiveTime) {
                    data[i].effectiveTime = $filter('date')(data[i].effectiveTime, 'yyyy-MM-dd');
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
            template: require('../dictionaryList/dictionaryEdit.html'),
            controller: require('../dictionaryList/dictionaryEdit.controller'),
            less: require('../dictionaryList/dictionaryEdit.less'),
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

    select.getAllUser().then((rs) => {
        $scope.getAllUser = rs.data.userItem;
    });

    $scope.piliang = function() {
        var rowArr = $scope.gridApi.selection.getSelectedRows();
        if (rowArr.length == 0) {
            toastr.info('请选择操作项！');
            return;
        } else {
            for (var i = rowArr.length - 1; i >= 0; i--) {
                rowArr[i].outTime = new Date($filter('date')(new Date($scope.outTime), 'yyyy-MM-dd HH:mm')).getTime();
                if (!rowArr[i].outNumber)
                    rowArr.splice(i, 1);
            }
            if(rowArr.length == 0) {
                toastr.info('请输入取耗材数量');
                return;
            }
        }
        if(!$scope.receiveName) {
            toastr.info('请选择领用人！');
            return;
        }else if(!$scope.outTime) {
            toastr.info('请填写领用时间！');
            return;
        }
        IHttp.post('basedata/batAddConsumablesOutRecord', { "receiveName": $scope.receiveName, "outTime": new Date($filter('date')(new Date($scope.outTime), 'yyyy-MM-dd HH:mm')).getTime(), "operator": user.userName, "outType":"1", "resList": rowArr }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            toastr.success(rs.data.resultMessage);
            getPage();
        });
    }
}