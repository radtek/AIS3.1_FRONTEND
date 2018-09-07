drugstorageDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout'];

module.exports = drugstorageDictionary;

function drugstorageDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    $scope.gridDrugStorage = {
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
                getMedicine();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getMedicine();
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
                    getMedicine();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '药品名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'briefName',
            displayName: '简称',
            cellTooltip: function(row, col) {
                return row.entity.briefName;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'enable',
            displayName: '状态',
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
                }, ]
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'dosageUnit',
            displayName: '剂量单位',
            cellTooltip: function(row, col) {
                return row.entity.dosageUnit;
            }
        }, {
            field: 'type',
            displayName: '药品分类',
            cellTooltip: function(row, col) {
                return row.entity.type;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "01",
                    label: '治疗用药'
                }, {
                    value: "02",
                    label: '麻醉用药'
                }]
            }
        }, {
            field: 'packageDosageAmount',
            displayName: '每小包剂量',
            cellTooltip: function(row, col) {
                return row.entity.packageDosageAmount;
            }
        }, {
            field: 'medicineId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editDiagnosis(row)>查看</a> <span>|</span> <a href="" ng-click=grid.appScope.editDiagnosistrue(row)>编辑</a></div>'
        }]
    };

    $scope.refresh = function() {
        getMedicine();
    }

    var getMedicine = function() {
        IHttp.post("basedata/queryMedicineList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridDrugStorage.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
                if (data.resultList[i].type === '01') {
                    data.resultList[i].type = '治疗用药';
                } else if (data.resultList[i].type === '02') {
                    data.resultList[i].type = '麻醉用药';
                }
            }
            $scope.gridDrugStorage.data = data.resultList;
        });
    };

    getMedicine();

    //编辑药品
    $scope.editDiagnosistrue = function(row) {
        $uibModal.open({
            animation: true,
            template: require('./editDictionarytwo.html'),
            controller: require('./editDictionarytwo.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            resolve: {
                items: { row: row ? row.entity : '' }
            }
        }).result.then(function() {
            getMedicine();
        });
    }

    $scope.editDiagnosis = function(row) {
        $scope.dataSourse = row.entity;
        $scope.check = true;
        initPrice();
    }

    $scope.cancel = function() {
        $scope.check = false;
    }

    // -------------------------------------------------------

    $scope.gridPriceList = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                initPrice();
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
                    initPrice();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'firm',
            displayName: '厂家',
            cellTooltip: function(row, col) {
                return row.entity.firm;
            }
        }, {
            field: 'batch',
            displayName: '批次',
            cellTooltip: function(row, col) {
                return row.entity.batch;
            }
        }, {
            field: 'minPackageUnit',
            displayName: '最小包单位',
            cellTooltip: function(row, col) {
                return row.entity.minPackageUnit;
            }
        }, {
            field: 'priceMinPackage',
            displayName: '最小单位对应价格',
            cellTooltip: function(row, col) {
                return row.entity.priceMinPackage;
            }
        }, {
            field: 'enable',
            displayName: '是否有效',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'pharmaciesName',
            displayName: '药房名称',
            cellTooltip: function(row, col) {
                return row.entity.pharmaciesName;
            }
        }, {
            field: 'priceId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.openPrice(row)>编辑</a></div>',
        }],
        data: []
    };

    function initPrice() {
        IHttp.post("basedata/editMedicineAandPrice", { medicineId: $scope.dataSourse.medicineId }).then(function(data) {
            data = data.data;
            $scope.medicine = data.medicine;
            $scope.medicine.enable = $scope.medicine.enable + '';
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridPriceList.data = data.resultList;
        });
    }

    // $scope.save = function() {
    //     IHttp.post("basedata/saveMedicine", $scope.medicine).then(function(rs) {
    //         if (rs.data.resultCode === '1') {
    //             getMedicine();
    //             $scope.check = false;
    //         }
    //     });
    // }

    $scope.openPrice = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.priceId = 0;
            scope.code = $scope.medicine.code;
        } else {
            scope.priceId = row.entity.priceId;
        }
        scope.medicineId = $scope.medicine.medicineId;
        $uibModal.open({
            animation: true,
            template: require('./drugstorageDialog.html'),
            controller: require('./drugstorageDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            initPrice();
        });
    }
}
