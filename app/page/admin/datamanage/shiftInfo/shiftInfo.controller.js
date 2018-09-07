ShiftInfoCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', 'toastr', '$uibModal', '$timeout', '$filter'];

module.exports = ShiftInfoCtrl;

function ShiftInfoCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, toastr, $uibModal, $timeout, $filter) {
    i18nService.setCurrentLang('zh-cn');
    $scope.hideImport = true;
    $scope.tabIndex = 0;
    $scope.tabView = function(index) {
        $scope.tabIndex = index;
        init();
    }

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
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach(this.grid.columns, function(column) {
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
            field: 'beid',
            name: '局点编号'
        }, {
            field: 'beName',
            name: '局点名称',
            enableSorting: false,
            enableFiltering: false
        }, {
            field: 'content',
            name: '班次'
        }, {
            field: 'startTime',
            name: '开始时间',
            enableSorting: false,
            enableFiltering: false
        }, {
            field: 'endTime',
            name: '结束时间',
            enableSorting: false,
            enableFiltering: false
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-really-message="是否确定删除?" confirm=grid.appScope.del(row.entity)>删除</a></div>'
        }]
    }

    $scope.btnAdd = function() {
        showModule();
    }

    $scope.edit = function(entity) {
        showModule(entity);
    }

    $scope.del = function(entity) {
        var tabIndex = $scope.tabIndex,
            url = '';
        if (tabIndex == 0)
            url = 'bas/delBasDoctorShiftInfo';
        else if (tabIndex == 1)
            url = 'bas/delBasShiftInfo';
        else if (tabIndex == 2)
            url = 'bas/delBasNursplanTime';

        IHttp.post(url, { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = $scope.gridOptions.data;
            list.forEach(function(i, j, k) {
                if (k[j].id == entity.id)
                    k.splice(j, 1);
            })
        });
    }

    function showModule(entity) {
        var scope = $rootScope.$new();
        scope.item = {
            opt: entity,
            tabIndex: $scope.tabIndex
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
        var tabIndex = $scope.tabIndex,
            url = '';
        if (tabIndex == 0)
            url = 'bas/selectDocShiftInfo';
        else if (tabIndex == 1)
            url = 'bas/selectBasShiftInfo';
        else if (tabIndex == 2)
            url = 'bas/selectBasNursplanTime';

        IHttp.post(url, params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var data = rs.data.resultList;
            data.forEach(function(i, j, k) {
                var startTime = k[j].startTime,
                    endTime = k[j].endTime;
                k[j].startTime = $filter('date')(startTime, 'yyyy-MM-dd');
                k[j].endTime = $filter('date')(endTime, 'yyyy-MM-dd');
            })
            $scope.gridOptions.data = data;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }

    $timeout(function() {
        var tabHeight = $('.tabs').height();
        $scope.grid = { "height": tabHeight - 2 + "px" };
    });
}
