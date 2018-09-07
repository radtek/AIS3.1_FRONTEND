instrsuitlistDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$state', 'confirm', 'toastr', '$uibModal', '$timeout'];

module.exports = instrsuitlistDictionary;

function instrsuitlistDictionary($rootScope, $scope, IHttp, uiGridConstants, $state, confirm, toastr, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;
    // 手术包列表
    $scope.gridInstrsuitlist = {
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
                getInstrsuitlist();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getInstrsuitlist();
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
                    getInstrsuitlist();
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '手术包名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
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
            field: 'totalAmount',
            displayName: '总数',
            cellTooltip: function(row, col) {
                return row.entity.totalAmount;
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
            },
        }, {
            field: 'instrsuitId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.editInstrsuitlist(row.entity.instrsuitId)>编辑</a></div>',
        }]
    };

    $scope.refresh = function() {
        getInstrsuitlist();
    }

    var getInstrsuitlist = function() {
        IHttp.post("basedata/queryInstrsuitList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridInstrsuitlist.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridInstrsuitlist.data = data.resultList;
        });
    }
    getInstrsuitlist();

    $scope.editInstrsuitlist = function(id) {
        $scope.edit = true;
        $scope.InstrsuitId = id;
        $scope.Instrsuitlist = {};
        initDialog();
    }

    // --------------------------------------------------------------------------
    //器械列表;
    $scope.gridInstrsuitQx = {
        columnDefs: [{
            field: 'name',
            displayName: '名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'amount',
            displayName: '数量',
            cellTemplate: '<div class="dtdiv div-bg-100" style="padding-top: 5px;"><input type="number" class="noborder3" min="0" transform="number" ng-model="row.entity.amount" ng-blur="grid.appScope.updateAmount(row.entity);" style="width: 50px;border-bottom: none!important;background-color: transparent;"></div>',
            cellTooltip: function(row, col) {
                return row.entity.amount;
            }
        }, {
            field: 'instrumentId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click="grid.appScope.deleteInstrument(row, \'qx\')">删除</a></div>'
        }],
        data: []
    };
    //敷料列表;
    $scope.gridInstrsuitFl = {
        columnDefs: [{
            field: 'name',
            displayName: '名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'amount',
            displayName: '数量',
            cellTemplate: '<div class="dtdiv div-bg-100" style="padding-top: 5px;"><input type="number" class="noborder3" min="0" transform="number" ng-model="row.entity.amount" ng-blur="grid.appScope.updateAmount(row.entity);" style="width: 50px;border-bottom: none!important;background-color: transparent;"></div>',
            cellTooltip: function(row, col) {
                return row.entity.amount;
            }
        }, {
            field: 'instrumentId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click="grid.appScope.deleteInstrument(row, \'fl\')">删除</a></div>'
        }],
        data: []
    };

    $scope.updateAmount = function(row) {
        if (!row) return;
        IHttp.post('basedata/saveInstrSuitRel', {instrSuitRelId: row.instrSuitRelId, amount: row.amount}).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
            }
        });
    }

    var initDialog = function() {
        if ($scope.InstrsuitId) {
        	$scope.lable = '编辑手术包';
        	getinstrumentList();
        } else {
        	$scope.lable = '新增手术包';
        }
    }

    // 获取单个
    var getinstrumentList = function() {
        IHttp.post("basedata/queryInstrsuitById", { instrsuitId: $scope.InstrsuitId }).then(function(rs) {
            data = rs.data;
            $scope.Instrsuitlist = data.instrsuit;
            // $scope.Instrsuitlist.enable = $scope.Instrsuitlist.enable + '';
            $scope.gridInstrsuitQx.data = data.instrumentList;
            $scope.gridInstrsuitFl.data = data.dressingList;
        });
    }

    $scope.deleteInstrument = function(row, type) {
        confirm.tips().show('你是否要删除该器械？').then(function() {
            var index;
            if (type === 'qx') {
                var gridData = $scope.gridInstrsuitQx.data;
            }else {
                var gridData = $scope.gridInstrsuitFl.data;
            }
            for(var i = 0; i < gridData.length; i++){
                if(gridData[i].instrumentId === row.entity.instrumentId){
                    index = i;
                }
            }
            gridData.splice(index,1);
        });
    }

    $scope.openinstr = function(code) {
        var scope = $rootScope.$new();
        scope.code = code;
        if (code === 'qx') {
            scope.datas = $scope.gridInstrsuitQx.data;
        }else if(code === 'fl') {
            scope.datas = $scope.gridInstrsuitFl.data;
        }
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./editInstrsuitlist.html'),
            controller: require('./editInstrsuitlist.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        });
    }

    $scope.saveInstrsuitlist = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        let instrSuitRelList = [];
        angular.forEach($scope.gridInstrsuitQx.data, function(item, index) {
            item.type = '1';
            instrSuitRelList.push(item);
        });
        angular.forEach($scope.gridInstrsuitFl.data, function(item, index) {
            item.type = '2';
            instrSuitRelList.push(item);
        });
        promise = $timeout(function() {
            IHttp.post("basedata/updateInstrsuit", {
                instrsuit: $scope.Instrsuitlist,
                instrSuitRelList: instrSuitRelList
            }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                    $scope.cancel();
                }
                $rootScope.btnActive = true;
            });
        }, 500);
    }

    $scope.cancel = function() {
        getInstrsuitlist();
        $scope.gridInstrsuitQx.data = [];
        $scope.gridInstrsuitFl.data = [];
        $scope.edit = false;
        $scope._name = false;
        $scope._enable = false;
        $scope._price = false;
    }

    // 验证
    function verify() {
        return $scope.instrsuitlist.$valid && !!($scope.Instrsuitlist.name || $scope.Instrsuitlist.enable || $scope.Instrsuitlist.price)
    }
}
