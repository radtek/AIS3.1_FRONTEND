MedFinanceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'toastr', 'auth', '$timeout', 'uiGridConstants', '$uibModalInstance'];

module.exports = MedFinanceCtrl;

function MedFinanceCtrl($rootScope, $scope, IHttp, $filter, toastr, auth, $timeout, uiGridConstants, $uibModalInstance) {
    vm = this;
    var promise;
    let regOptId = $rootScope.$stateParams.regOptId;
    let parent = $scope.$parent;
    let mark = parent.mark;
    let user = auth.loginUser(),
        checked = 0;
    $scope.loginName = user.userName;

    var params = {
        timestamp: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        pageNo: 1,
        pageSize: 15,
        createUser: user.userName,
        roleType: user.roleType,
        sort: '',
        orderBy: '',
        filters: [{ field: 'tempType', value: parent.tempType }, { field: 'tempName', value: '' }, { field: 'type', value: '' }, { field: 'remark', value: '' }]
    };

    $scope.deptList = [];
    IHttp.post('basedata/getDeptList', {}).then(function(rs) {
        if (rs.data.resultCode === '1') {
            if (angular.isArray(rs.data.resultList)) {
                angular.forEach(rs.data.resultList, function(item, index) {
                    $scope.deptList.push({ value: item.name, label: item.name });
                });
            }
        }
    });

    $timeout(function() {
        getPage();
        $scope.gridOptions = {
            enableFiltering: true, //  表格过滤栏
            paginationPageSizes: [15, 30, 50],
            enableColumnMenus:false,//表头列的菜单按钮，默认false
            useExternalFiltering: true, // 过滤的搜索
            useExternalPagination: true, // 分页
            useExternalSorting: true,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                    params.pageNo = newPage;
                    params.pageSize = pageSize;
                    getPage();
                });
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
                    }, 1000);
                });
            },
            columnDefs: [{
                field: 'tempName',
                displayName: '模板名称',
                cellTooltip: function(row, col) {
                    return row.entity.tempName;
                }
            }, {
                field: 'remark',
                displayName: '描述',
                cellTooltip: function(row, col) {
                    return row.entity.remark;
                },
                width: '20%'
            }, {
                field: 'pinyin',
                displayName: '拼音',
                cellTooltip: function(row, col) {
                    return row.entity.pinyin;
                },
                width: '20%'
            }, {
                field: 'createName',
                displayName: '创建人',
                cellTooltip: function(row, col) {
                    return row.entity.createName;
                },
                visible: mark != '核算单'
            }, {
                field: 'createTimeStr',
                displayName: '时间',
                cellTooltip: function(row, col) {
                    return row.entity.createTimeStr;
                },
                visible: mark != '核算单'
            }, {
                field: 'typeStr',
                displayName: '应用级别',
                cellTooltip: function(row, col) {
                    return row.entity.typeStr;
                },
                visible: false,
                width: 100
            }, {
                field: 'id',
                displayName: '操作',
                width: 100,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.apply(row.entity)>应用</a><span ng-if="grid.appScope.loginName===row.entity.createUser">&nbsp;|&nbsp;<a href="" ng-click=grid.appScope.del(row.entity)>删除</a></span></div>'
            }]
        };
    }, 100);

    function getPage() {
        IHttp.post('basedata/queryChargeMedTempList', params).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            var data = rs.data.tempList;
            data.forEach(function(item) {
                item.createTimeStr = $filter('date')(item.createTime, 'yyyy-MM-dd');
                item.typeStr = item.type == 1 ? '个人' : '科室';
                item.tempType = item.tempType == 1 ? '麻醉医生' : '护士';
            });
            $scope.gridOptions.data = data;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }
    $scope.apply = function(row) {
        if (checked === 1) return;
        if (mark == '核算单') {
            if (!$scope.isRequesting) {
                $scope.isRequesting = true;
                IHttp.post('basedata/queryChargeMedTempById', {
                    chargeTempId: row.chargeMedTempId,
                    tempType: row.tempType,
                    regOptId: $scope.regOptId,
                    createUser: user.userName,
                    userType: user.userType,
                    costType: $scope.userType == 'D' ? 1 : 2,
                }).then(function(rs) {
                    $scope.isRequesting = false;
                    if (rs.data.resultCode == '1') {
                        if (row.tempType == 1 || row.tempType == 2)
                            $uibModalInstance.close(rs.data.medTempList);
                        else
                            $uibModalInstance.close(rs.data.chargePayList);
                    }
                }, function() {
                    $scope.isRequesting = false;
                });
            }
        } else {
            $uibModalInstance.close(row);
        }
        checked = 1;
    }

    $scope.del = function(row) {
        if (user.roleType !== 'ANAES_DIRECTOR' && row.type == 2) {
            toastr.warning('只有麻醉科主任或护士长能删除科室模板');
            return;
        }

        var delURL = '',
            delId = '',
            delParams = {};
        if (mark == '核算单') {
            delURL = 'basedata/deleteChargeMedTempById';
            delParams = { chargeMedTempId: row.chargeMedTempId }
        } else if (mark == '麻醉总结') {
            delURL = 'basedata/deleteLiquidTemp';
            delParams = { tempId: row.tempId };
        }
        IHttp.post(delURL, delParams).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $filter('filter')($scope.gridOptions.data, function(e, k) {
                    if (mark == '麻醉总结' && e.tempId == row.tempId)
                        $scope.gridOptions.data.splice(k, 1);
                    else if (mark == '核算单' && e.chargeMedTempId == row.chargeMedTempId)
                        $scope.gridOptions.data.splice(k, 1);
                })
            }
        });
    }

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

}