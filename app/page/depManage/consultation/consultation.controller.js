ConsultationCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr', 'confirm'];

module.exports = ConsultationCtrl;

function ConsultationCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr, confirm) {
    var operBtn = '',
        tempHtml = '',
        promise,
        params = {
            loginName: 1,
            pageNo: 1,
            pageSize: 15,
            sort: '',
            orderBy: '',
            filters: []
        },
        pageOption = JSON.parse(sessionStorage.getItem('pageOption'));

    if (pageOption) {
        params = pageOption;
        sessionStorage.setItem('pageOption', null);
    }

    for (var item of $scope.btnsMenu) {
        if (item.url === 'addConsultation') {
            continue;
        } else if (item.url === 'editConsultation') {
            operBtn += '<a ng-click="grid.appScope.edit(row)">' + item.name + '</a><span>&nbsp;|&nbsp;</span>';
        }
    }
    operBtn += '<a ng-click="grid.appScope.delete(row)">删除</a>';
    tempHtml = '<div class="ui-grid-cell-contents">' + operBtn + '</div>';

    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationCurrentPage: params.pageNo,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,

        onRegisterApi: function(gridApi) {
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                $scope.getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                $scope.getPage();
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
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    $scope.getPage();
                }, 1000)
            });
        },
        columnDefs: [{
            field: 'createUserName',
            displayName: '麻醉医生',
            cellTooltip: function(row, col) {
                return row.entity.createUserName;
            }
        }, {
            field: 'startTime',
            displayName: '会诊时间',
            width: '12%',
            cellTooltip: function(row, col) {
                return row.entity.startTime;
            }

        }, {
            field: 'name',
            displayName: '姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'sex',
            displayName: '性别',
            cellTooltip: function(row, col) {
                return row.entity.sex;
            }
        }, {
            field: 'age',
            displayName: '年龄',
            cellTooltip: function(row, col) {
                return row.entity.age;
            }
        }, {
            field: 'deptName',
            displayName: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        }, {
            field: 'regionName',
            displayName: '病区',
            cellTooltip: function(row, col) {
                return row.entity.regionName;
            }
        }, {
            field: 'bed',
            displayName: '床号',
            cellTooltip: function(row, col) {
                return row.entity.bed;
            }
        }, {
            field: 'designedAnaesMethodName',
            displayName: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'operatorName',
            displayName: '手术医生',
            cellTooltip: function(row, col) {
                return row.entity.operatorName;
            }
        }, {
            field: 'remark',
            displayName: '备注',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            }
        }, {
            field: 'regOptId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            // cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.edit(row)>编辑</a><span>|</span><a href="" ng-click=grid.appScope.delete(row)>删除</a></div>',
            cellTemplate: tempHtml
        }]
    };
    // $scope.query = function(row) {
    //     $state.go('dashboard.layout.consultationEdit', {
    //         'param1': row.entity.conttId
    //     });
    // }
    // $scope.addConsultation = function(){
    //     $state.go('dashboard.layout.consultationEdit');
    // }
    // $scope.cancelDialog = function(row){
    //     var confirm = $mdDialog.confirm()
    //         .title('消息提示!')
    //         .textContent('你是否删除该条会诊信息？')
    //         .ariaLabel('Lucky day')
    //         .ok('确定')
    //         .cancel('取消');
    //         $mdDialog.show(confirm).then(function() {
    //           $http.post($rootScope.baseUrl + "/operation/deleteConsultationById", {conttId:row.entity.conttId})
    //             .success(
    //                 function(data){
    //                     if(data.resultCode){
    //                         $scope.getPage();
    //                     }
    //                 }
    //             );
    //         }, function() {

    //         });
    // }


    $scope.getPage = function(isRefresh) {
        IHttp.post("operation/searchConsultation", params).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                if (isRefresh) {
                    toastr.info('刷新成功！');
                }
                $scope.gridOptions.data = rs.data.resultList;
                $scope.gridOptions.totalItems = rs.data.total;
            }
        });
    }
    $scope.getPage();

    // 编辑
    $scope.edit = function(row) {
        if (row) {
            sessionStorage.setItem('pageOption', JSON.stringify(params));
            $rootScope.$state.go('editConsultation', {
                regOptId: row.entity.conttId
            });
        } else {
            $rootScope.$state.go('addConsultation');
        }
    }

    // 查看
    $scope.detail = function(row) {
        $rootScope.$state.go('preOperDateil', {
            // uid: row.entity.regOptId
        });
    }

    // 删除
    $scope.delete = function(row) {
        confirm.show('您确定要删除此条记录吗？').then((data) => {
            IHttp.post('operation/deleteConsultationById', { conttId: row.entity.conttId }).then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    toastr.info('删除成功！');
                    $scope.getPage();
                }
            })
        });
    }
}