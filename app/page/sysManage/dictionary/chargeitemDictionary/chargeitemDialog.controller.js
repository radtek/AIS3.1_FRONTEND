addChargeItem.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'uiGridConstants', '$uibModal'];

module.exports = addChargeItem;

function addChargeItem($scope, IHttp, $uibModalInstance, $timeout, uiGridConstants, $uibModal) {
    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };

    //收费项目
    $scope.gridChargeItems = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getPage();
            });
            //过滤
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach($scope.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params.filters = filterArr;
                    getPage();
                }, 2000);
            });
        },
        columnDefs: [
        {
            field: 'chargeItemName',
            displayName: '收费名称',
            cellTooltip: function(row, col) {
                return row.entity.chargeItemName;
            }
        },{
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'price',
            displayName: '价格',
            cellTooltip: function(row, col) {
                return row.entity.price;
            }
        }, {
            field: 'type',
            displayName: '类型',
            cellTooltip: function(row, col) {
                return row.entity.type;
            }
        }, {
            field: 'enable',
            displayName: '状态',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                },]
            },
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, {
            field: 'chargeItemId',
            displayName: '添加数量',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><input type="number" min="0" ng-model="number" ng-change=grid.appScope.changeNum(row,number)></div>',
        }]
    };

    var getPage = function() {
        IHttp.post("basedata/queryChargeItem", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridChargeItems.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == 1) {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridChargeItems.data = data.resultList;
        });
    }
    getPage();

    $scope.instru=[];
    $scope.changeNum = function(row,number){
        row.entity.chgItemAmount = number;
        if($scope.instru.length===0){
            $scope.instru.push(row.entity);  
        }else{
            for(var i = 0;i<$scope.instru.length;i++){
                if($scope.instru[i].chargeItemId===row.entity.chargeItemId){
                    $scope.instru[i].chgItemAmount = row.entity.chgItemAmount;
                    return;
                }else if(i+1===$scope.instru.length){
                    $scope.instru.push(row.entity);  
                }
            }
        }
    };

    $scope.save = function(){
        if($scope.datas.length===0){
            for(var i=$scope.instru.length-1;i>=0;i--){
                $scope.datas.push($scope.instru[i]);
                $scope.instru.pop();
            }
        } else {
            var len = $scope.instru.length-1;
            while(len>=0){
                for(var i = 0,k=1;i<$scope.datas.length;i++){
                    if(len<0){
                        $uibModalInstance.dismiss();
                        return;
                    }else if($scope.datas[i].chargeItemId === $scope.instru[len].chargeItemId){
                        $scope.datas[i].chgItemAmount = ($scope.instru[len].chgItemAmount-0) + ($scope.datas[i].chgItemAmount-0);
                        $scope.instru.pop();
                        len = $scope.instru.length-1;
                        k++;
                    }else if(k===$scope.datas.length){
                        $scope.datas.push($scope.instru[len]);
                        $scope.instru.pop();
                        len = $scope.instru.length-1;
                    }else{
                        k++;
                    }
                }
            }
        }
        $uibModalInstance.dismiss();
    }

    $scope.hide = function(){
        $uibModalInstance.dismiss();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
