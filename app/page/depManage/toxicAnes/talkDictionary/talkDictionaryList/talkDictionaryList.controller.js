talkDictionaryListCtrl.$inject = ['$rootScope', '$scope', 'confirm', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', '$filter', 'toastr', '$uibModal', 'auth', 'select'];

module.exports = talkDictionaryListCtrl;

function talkDictionaryListCtrl($rootScope, $scope, confirm, IHttp, i18nService, uiGridConstants, $timeout, $filter, toastr, $uibModal, auth, select) {

    i18nService.setCurrentLang('zh-cn');
    var user = auth.loginUser();
    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        orderBy: '',
        sort: '',
        beid: user.beid,
        module: user.module,
        filters: []
    };

    $scope.gridOptions = {
        resizable: true,
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getPage();
            });
            $scope.gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach($scope.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    //$scope.params.filters.splice(1, $scope.params.filters.length - 1, ...filterArr);
                    $scope.params.filters = filterArr;
                    getPage();
                }, 1000)

            });
        },
        columnDefs: [{
            field: 'medicineName',
            displayName: '药品名称',
            width: 200,
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
            field: 'outNumber',
            displayName: '取药',
            cellTooltip: function(row, col) {
                return row.entity.outNumber;
            }
        }, {
            field: 'showRetreatNumber',
            displayName: '退药',
            cellTooltip: function(row, col) {
                return row.entity.showRetreatNumber;
            }
        }, {
            field: 'loseNumber',
            displayName: '报损',
            cellTooltip: function(row, col) {
                return row.entity.loseNumber;
            }
        }, {
            field: 'actualNumber',
            displayName: '实际',
            cellTooltip: function(row, col) {
                return row.entity.actualNumber;
            }
        }, {
            field: 'outType1',
            displayName: '出库方式',
            cellTooltip: function(row, col) {
                return row.entity.outType1;
            }
        }, {
            field: 'operator',
            displayName: '经办人',
            cellTooltip: function(row, col) {
                return row.entity.operator;
            }
        }, {
            field: 'receiveName',
            displayName: '领用人',
            cellTooltip: function(row, col) {
                return row.entity.receiveName;
            }
        }, {
            field: 'effectiveTime',
            displayName: '有效日期',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.effectiveTime;
            }
        }, {
            field: 'outTime',
            displayName: '出库日期',
            enableFiltering: false,
            width: 130,
            cellTooltip: function(row, col) {
                return row.entity.outTime;
            }
        }, {
            field: 'retreatNumber',
            displayName: '退药数量',
            width: 100,
            enableFiltering: false,
            cellTemplate: '<input type="number" transform="number" class="text-center" style="height: 39px;" min="1" ng-max="row.entity.actualNumber" ng-disabled="!row.isSelected" ng-model="row.entity.retreatNumber">',
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            width: 130,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editIn(row)>退药</a><span>|</span><a href="" ng-click=grid.appScope.setbad(row)>报损</a><span>|</span><a href="" ng-click=grid.appScope.deleteIn(row)>删除</a></div>'
        }]
    };

    function getPage() {
        IHttp.post('basedata/queryMedicineOutRecordList', $scope.params).then(function(rs) {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.totalItems = rs.data.total;
                var data = rs.data.resultList;
                for (var i = 0; i < data.length; i++) {

                    if (data[i].effectiveTime) {
                        data[i].effectiveTime = $filter('date')(data[i].effectiveTime, 'yyyy-MM-dd');
                    }
                    if (data[i].outTime) {
                        data[i].outTime = $filter('date')(data[i].outTime, 'yyyy-MM-dd HH:mm');
                    }
                    //1 普通取药，2 手术取药
                    if (data[i].outType === '1') {
                        data[i].outType1 = "普通取药";
                    } else if (data[i].outType === '2') {
                        data[i].outType1 = "手术取药";
                    }

                    data[i].retreatNumber = '';

                }
                $scope.gridOptions.data = data;
            }
        });
    }

    getPage();

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
                template: require('../talkDictionaryList/talkDictionaryEdit.html'),
                controller: require('../talkDictionaryList/talkDictionaryEdit.controller'),
                less: require('../talkDictionaryList/talkDictionaryEdit.less'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            })
            .result
            .then((data) => {
                if (data === 'success') {
                    getPage();
                }
            })
    };

    $scope.setbad = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row
        };

        $uibModal.open({
                animation: true,
                size: 'lg',
                template: require('../talkDictionaryList/badDictionaryEdit.html'),
                controller: require('../talkDictionaryList/badDictionaryEdit.controller'),
                less: require('../talkDictionaryList/badDictionaryEdit.less'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            })
            .result
            .then((data) => {
                if (data === 'success') {
                    getPage();
                }
            })
    };

    $scope.deleteIn = function(row) {
        confirm.show("是否确认删除此记录？").then(function(data) {
            var deleteInParams = {
                id: row.entity.id
            };

            IHttp.post('basedata/delMedicineOutRecord', deleteInParams)
                .then((rs) => {
                    if (rs.status === 200 && rs.data.resultCode === '1') {
                        toastr.info("删除成功！");
                        getPage();
                    }

                });
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
                if (!rowArr[i].retreatNumber)
                    rowArr.splice(i, 1);
            }
            if(rowArr.length == 0) {
                toastr.info('请输入退药数量');
                return;
            }
        }
        if(!$scope.retreatName) {
            toastr.info('请选择退药人！');
            return;
        }
        IHttp.post('basedata/batAddMedicineRetreatRecord', { "retreatName": $scope.retreatName, "retreatreason": "", "operator": user.userName, "resList": rowArr }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            toastr.success(rs.data.resultMessage);
            getPage();
        });
    }
}