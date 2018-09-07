chargeitemDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$timeout', 'confirm', 'toastr'];

module.exports = chargeitemDictionary;

function chargeitemDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $timeout, confirm, toastr) {
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    //科室
    $scope.gridOptions = {
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
        columnDefs: [{
            field: 'chargePackagesName',
            displayName: '收费包名称',
            cellTooltip: function(row, col) {
                return row.entity.chargePackagesName;
            }
        }, {
            field: 'type',
            displayName: '类型',
            cellTooltip: function(row, col) {
                return row.entity.type;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'enable',
            displayName: '有效标志',
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
                }]
            }
        }, {
            field: 'chargePkgId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editChargePackages(row)>编辑</a></div>',
        }],
        data: []
    };

    $scope.gridchargePkg = {
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
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
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
            field: 'chgItemAmount',
            displayName: '数量',
            cellTooltip: function(row, col) {
                return row.entity.chgItemAmount;
            }
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, {
            field: 'chargeItemId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.deleteChargePkg(row)>删除</a><span></div>',
        }]
    };

	$scope.deleteChargePkg = function(row){
		confirm.show('你是否要删除该收费项目？').then(function () {
			var index;
			for(var i=0;i<$scope.gridchargePkg.data.length;i++){
				if($scope.gridchargePkg.data[i].chargeItemId=== row.entity.chargeItemId){
					index = i;
				}
			}
			$scope.gridchargePkg.data.splice(index,1);
		}, function() {
			return;
		});
	}

    $scope.editChargePackages = function(row) {
        $scope.lable = '新增';
        $scope.chargePkg = {};
        $scope.gridchargePkg.data = [];
        $scope.check = true;
        if (row) {
            $scope.dataSourse = row.entity;
            $scope.lable = '编辑';
            initPrice();
        }
    }

    $scope.addChargeitemDictionary = function(row) {
	    var scope = $rootScope.$new();
	    scope.datas = $scope.gridchargePkg.data;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./chargeitemDialog.html'),
            controller: require('./chargeitemDialog.controller'),
            controllerAs: 'vm',
        	scope: scope
        }).result.then(function() {
            getPage();
        });
    }

    $scope.cancel = function() {
        $scope.check = false;
    }

	function initPrice() {
        var filterArr = [];
        filterArr.push({
            field: 'chargePkgId',
            value: $scope.dataSourse.chargePkgId
        });

        if ($scope.grid) {
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
        }
        $scope.params.filters = filterArr;
	    IHttp.post("basedata/queryChargePackagesById", $scope.params ).then(function(data) {
	        data = data.data;
	        $scope.chargePkg = data.chargePackages;
	        $scope.chargePkg.enable = $scope.chargePkg.enable + '';
	        for (var i = 0; i < data.resultList.length; i++) {
	            if (data.resultList[i].enable == '1') {
	                data.resultList[i].enable = '启用';
	            } else {
	                data.resultList[i].enable = '禁用';
	            }
	        }
	        $scope.gridchargePkg.data = data.resultList;
            $scope.params.filters = [];
	    });
	}

    $scope.refresh = function() {
        getPage();
    }

    var getPage = function() {
        IHttp.post("basedata/queryChargePackagesList", $scope.params).then(function(data) {
        	data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == 1) {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getPage();

	$scope.save = function(){
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
    	var params = {
    		chargePackages : $scope.chargePkg,
			chargeItemPackagesRelList : $scope.gridchargePkg.data
    	};

        IHttp.post('basedata/updateChargePackages', params).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $scope.cancel();
                toastr.success(rs.data.resultMessage);
            }
            getPage();
            $rootScope.btnActive = true;
        });
	}

    // 验证
    function verify() {
        return $scope.chargeItemForm.$valid && !!($scope.chargePkg.chargePackagesName || $scope.chargePkg.enable || $scope.chargePkg.type)
    }
}
