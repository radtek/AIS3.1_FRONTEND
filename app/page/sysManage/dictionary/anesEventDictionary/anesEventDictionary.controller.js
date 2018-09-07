anesEventDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', 'confirm', 'toastr', '$timeout', 'auth'];

module.exports = anesEventDictionary;

function anesEventDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, confirm, toastr, $timeout, auth) {
    var promise,
        user = auth.loginUser(),
        params = {
            pageNo: 1,
            pageSize: 15,
            sort: '',
            orderBy: '',
            filters: []
        };

    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,

        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                getPage();
            });
            //过滤
            gridApi.core.on.filterChanged($scope, function() {
                var _this = this;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach(_this.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    getPage();
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '事件名称'
        },{
            field: 'docType',
            visible:false,
            displayName: '事件类型'
        }, {
            field: 'eventValue',
            displayName: '事件值'
        }, {
            field: 'enable',
            displayName: '状态',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                }]
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div ng-hide="row.entity.name==\'入室\'||row.entity.name==\'麻醉开始\'||row.entity.name==\'手术开始\'||row.entity.name==\'手术结束\'||row.entity.name==\'麻醉结束时间\'||row.entity.name==\'出室时间\'||row.entity.name==\'入PACU时间\'||row.entity.name==\'出PACU时间\'" class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editAnaesEvent(row.entity)>编辑</a> | <a href="" ng-click=grid.appScope.deleteAnaesEvent(row.entity)>删除</a><span></div>',
        }],
        data: []
    };

    $scope.editAnaesEvent = function(row) {
        var scope = $rootScope.$new();
        scope.beCode = user.beCode;
        if (row === undefined) {
            scope.id = 0;
        } else {
            scope.id = row.id;
            scope.name = row.name;
            scope.enable = row.enable;
            scope.docType=row.docType;
        }
        $uibModal.open({
            animation: true,
            template: require('./editAnesEventDictionary.html'),
            controller: require('./editAnesEventDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getPage();
        });
    }

    $scope.deleteAnaesEvent = function(row) {
        confirm.show('你是否要删除该麻醉事件？').then(function() {
            IHttp.post('basedata/deleteAnaesEventById', { id: row.id }).then(function(rs) {
                if (rs.data.resultCode != 1) return;
                toastr.success(rs.data.resultMessage);
                getPage();
            });
        }, function() {
            return;
        });
    }

    $scope.refresh = function() {
        getPage();
    }

    var getPage = function() {
        var url = 'basedata/selectALlAnaesEvent';
        IHttp.post(url, params).then(function(data) {
            data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
                if (data.resultList[i].docType == '2') {
                    data.resultList[i].docType = '复苏记录单事件';
                } else if (data.resultList[i].docType == '1') {
                    data.resultList[i].docType = '麻醉记录单事件';
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getPage();
}