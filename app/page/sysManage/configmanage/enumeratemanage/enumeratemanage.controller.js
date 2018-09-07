enumeratemanage.$inject = ['$rootScope', '$scope', 'auth', 'IHttp', 'toastr', '$timeout', 'uiGridTreeViewConstants', 'i18nService', '$uibModal', '$filter', 'uiGridConstants'];

module.exports = enumeratemanage;

function enumeratemanage($rootScope, $scope, auth, IHttp, toastr, $timeout, uiGridTreeViewConstants, i18nService, $uibModal, $filter, uiGridConstants) {
    i18nService.setCurrentLang('zh-cn');
    var  loginInfo = auth.loginUser();

    var promise;
    var paramsGroup = {
        "pageNo": 1,
        "pageSize": 20,
        "sort": "",
        "orderBy": "",
        "beid":loginInfo.beid,
        "filters": []
    };

    var paramsGroupById = {
        "pageNo": 1,
        "pageSize": 5,
        "sort": "",
        "orderBy": "",
        "filters": []
    };
    paramsGroupById.beid=loginInfo.beid;
    //$scope.gridOptions.expandableRowHeight=127+40*,
    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        paginationPageSizes: [10, 20, 30, 50], // 配置每页行数可选参数
        paginationPageSize: 20,     // 每页默认显示行数
        expandableRowTemplate: require('./expand.html'),
        expandableRowHeight: 284,
        expandableRowScope: {
            editItem: function(entity) {
                edit(entity, 'editItem');
            },
            delItem: function(entity) {
                delItem(entity);
            }
        },
        columnDefs: [
            { field: 'groupId', name: '组编码' },
            { field: 'groupName', name: '组名称' }, {
                name: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.editGroup(row.entity)>编辑</a><span>|</span><a ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delGroup(row.entity)>删除</a></div>'
            }
        ],
        onRegisterApi: onRegisterApiGroup
    };

    var gridOptionsGroupById = {
        enableSorting: false,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        useExternalSorting: false, // 使用外部排序
        paginationPageSizes: [5, 10], // 配置每页行数可选参数
        paginationPageSize: 5, // 每页默认显示行数
        showGridFooter: true, // 显示页脚        
        columnDefs: [
            { field: 'codeValue', name: '值' },
            { field: 'codeName', name: '展示文本' }, {
                field: 'enable',
                name: '状态',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{ value: 'true', label: '启用' }, { value: 'false', label: '禁用' }]
                },
                cellFilter: 'fieldEnable'
            }, {
                name: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.editItem(row.entity)>编辑</a><span>|</span><a ng-really-message="是否确定删除?" ng-really-click=grid.appScope.delItem(row.entity)>删除</a></div>'
            }
        ],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paramsGroupById.pageNo = newPage;
                paramsGroupById.pageSize = pageSize;
                initGroupById();
            });
        }
    };

    function onRegisterApiGroup(gridApi) {
        // 分页
        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            paramsGroup.pageNo = newPage;
            paramsGroup.pageSize = pageSize;
            initGroup();
        });

        // 状态变化前 控制只能展开一个
        gridApi.expandable.on.rowExpandedBeforeStateChanged($scope, function(row) {
            if (!row.isExpanded) {
                paramsGroupById.pageNo = 1;
                gridApi.expandable.collapseAllRows();
            }
        });

        // 展开 内部grid
        gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
            if (row.isExpanded) {
                paramsGroupById.filters = [{
                    field: 'beid',
                    value: row.entity.beid
                }, {
                    field: 'groupId',
                    value: row.entity.groupId
                }];
                paramsGroupById.pageNo = 1;
                initGroupById();
                row.entity.editItem = function() {
                    edit(row.entity, 'addItem');
                }
            } else {
                paramsGroupById.pageNo = 1;
                gridOptionsGroupById.data = [];
            }
        });

        // 过滤
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
                    if (value!==undefined && value!=='' && value!==null) {
                        filterArr.push({
                            field: fieldName,
                            value: value
                        });
                    }
                });
                paramsGroup.filters = filterArr;
                initGroup();
            }, 2000)
        });
    }

    initGroup();

    function initGroup() {
        IHttp.post('sys/getDictItemGroups', paramsGroup).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = rs.data.resultList;
            for (var a = 0; a < list.length; a++) {
                list[a].gridOptionsGroupById = gridOptionsGroupById;
            }
            $scope.gridOptions.data = list;
            $scope.gridOptions.totalItems = rs.data.total;
            paramsGroupById.pageNo = 1;
        });
    }

    function initGroupById() {
        IHttp.post('sys/getDictItemsByGroupId', paramsGroupById).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = rs.data.resultList;
            gridOptionsGroupById.data = list;

            gridOptionsGroupById.totalItems = rs.data.total;
        });
    }

    $scope.btnAdd = function() {
        edit(null, 'addGroup');
    }
    $scope.editGroup = function(entity) {
        edit(entity, 'editGroup');
    }
    $scope.delGroup = function(entity) {
        IHttp.post('sys/deleteDictItemGroup', { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = $scope.gridOptions.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function delItem(entity) {
        IHttp.post('sys/deleteDictItem', { id: entity.id }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = gridOptionsGroupById.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function edit(entity, type) {
        var scope = $rootScope.$new();
        scope.item = {
            type: type,
            entity: entity
        };

        if (type == 'addItem')
            scope.item.len = gridOptionsGroupById.data.length + 1;
        else if (type == 'editItem')
            scope.item.len = gridOptionsGroupById.data.length;

        var modalInstance = $uibModal.open({
            animation: true,
            template: require('./modal.html'),
            controller: require('./modal.controller'),
            backdrop: 'static',
            scope: scope
        });

        modalInstance.result.then(function(data) {
            if (type == 'addGroup' || type == 'editGroup')
                initGroup();
            else
                initGroupById();
        }, function(data) {
            //console.log(data)
        });
    }
}
