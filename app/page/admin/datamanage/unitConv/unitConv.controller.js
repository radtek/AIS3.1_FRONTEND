UnitConvCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', 'toastr', '$uibModal'];

module.exports = UnitConvCtrl;

function UnitConvCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, toastr, $uibModal) {
    i18nService.setCurrentLang('zh-cn');

    $scope.hideImport = true;

    var promise;
    var params = {
        "pageNo": 1,
        "pageSize": 15,
        "sort": "",
        "orderBy": "",
        "filters": []
    }

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        paginationPageSizes: [ 15, 30, 50], // 配置每页行数可选参数
        rowHeight: 40,
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                init();
            });
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
                        if (!!value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    init();
                }, 2000)
            });
        },
        columnDefs: [{
            field: 'baseUnit',
            name: '基础单位'
        }, {
            field: 'transUnit',
            name: '转换单位'
        }, {
            field: 'transProp',
            name: '转换比例'
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-really-message="是否确定删除?" confirm=grid.appScope.del(row.entity)>删除</a></div>'
        }]
    };
    
    $scope.btnAdd = function() {
        showModule();
    }

    $scope.edit = function(entity) {
        showModule(entity);
    }

    $scope.del = function(entity) {
        IHttp.post('bas/delBasUnitTrans', { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = $scope.gridOptions.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function showModule(entity) {
        var scope = $rootScope.$new();
        scope.item = {
            opt: entity
        };
        var modalInstance = $uibModal.open({
            animation: true,
            template: require('./modal.html'),
            controller: require('./modal.controller'),
            backdrop: 'static',
            scope: scope
        });
        modalInstance.result.then(function(data) {
            init();
        }, function(data) {
            console.log(data)
        });
    }

    init();

    function init() {
        IHttp.post('bas/selectBasUnitTrans', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var data = rs.data;
            $scope.gridOptions.data = data.resultList;
            $scope.gridOptions.totalItems = data.total;
        });
    }
}
