talkDictionaryEditCtrl.$inject = ['$rootScope', '$scope','confirm', 'IHttp','i18nService','uiGridConstants','$timeout','toastr', '$uibModalInstance', 'select', '$filter', 'auth'];

module.exports = talkDictionaryEditCtrl;
                               
function talkDictionaryEditCtrl($rootScope, $scope,confirm,  IHttp,i18nService,uiGridConstants,$timeout,  toastr, $uibModalInstance, select, $filter, auth) {
    vm = this;
    vm.title="退耗材";
    var user=auth.loginUser();
    i18nService.setCurrentLang('zh-cn');
    $scope.medicalParams={};

    if ($scope.data.row) {
        vm.title="退耗材";
        $scope.medicalParams =angular.copy($scope.data.row.entity);
        $scope.medicalParams.retreatNumber=undefined;
    } 
    $scope.medicalParams.operator= auth.loginUser().name;

    var promise;
    $scope.params = {
        pageNo: 1,
        pageSize: 5,
        orderBy: '',
        sort: '',
        beid:user.beid,
        module:user.module,
        filters: [{
            field: "outRecordId",
            value: $scope.medicalParams.id
        }]
    };


    $scope.gridOptions = {
        resizable: true,
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: false, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showColumnFooter: true,
        useExternalPagination: true, // 分页
        paginationPageSizes: [5],
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
                    $scope.params.filters.splice(1, $scope.params.filters.length - 1, ...filterArr);
                    getPage();
                }, 1000)

            });
        },
        columnDefs: [
                {
                    field: 'retreatTime',
                    displayName: '时间',     
                    width:130,    
                    cellTooltip: function(row, col) {
                        return row.entity.retreatTime;
                    }
                },
                {
                    field: 'instrumentName',
                    displayName: '耗材名称', 
                    width:150,          
                    cellTooltip: function(row, col) {
                        return row.entity.instrumentName;
                    }
                }, 
                // {
                //     field: 'firm',
                //     displayName: '厂家名称',
                //     cellTooltip: function(row, col) {
                //         return row.entity.firm;
                //     }
                // },
                 {
                    field: 'spec',
                    displayName: '规格',
                    cellTooltip: function(row, col) {
                        return row.entity.spec;
                    }
                }, 
                {
                    field: 'batch',
                    displayName: '耗材批号', 
                    cellTooltip: function(row, col) {
                        return row.entity.batch;
                    }
                }, {
                    field: 'retreatNumber',
                    displayName: '退耗材',
                    cellTooltip: function(row, col) {
                        return row.entity.retreatNumber;
                    }
                }, {
                    field: 'retreatName',
                    displayName: '退耗材人',
                    cellTooltip: function(row, col) {
                        return row.entity.retreatName;
                    }
                }, {
                    field: 'id',
                    displayName: '操作',
                    enableFiltering: false,
                    enableSorting: false,
                    cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.deleteIn(row)>删除</a></div>'
                }
        ]
    };

    function getPage() {
        IHttp.post('basedata/queryConsumablesCommonRetreatRecordList',$scope.params).then(function(rs) {
            // $scope.gridOptions.data = rs.data.searchRegOptByLoginNameAndStateFormBean;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.totalItems = rs.data.total;
                 var data=rs.data.resultList;
                    for (var i = 0; i <data.length; i++) {
                        if(data[i].retreatTime){
                            data[i].retreatTime=$filter('date')(data[i].retreatTime, 'yyyy-MM-dd HH:mm');
                        }
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

        //回写


   };

    $scope.deleteIn = function(row) {
        confirm.show("是否确认删除此记录？").then(function(data) {
            var deleteInParams = {
                id: row.entity.id
            };

            IHttp.post('basedata/delConsumablesRetreatRecord', deleteInParams)
            .then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    toastr.info("删除成功！");
                    getPage();
                }
                
            });
        });    
    }

   
   

    vm.close = function() {
        //$uibModalInstance.close('cancel');
        $uibModalInstance.close('success');
    }

    // select.getChargeItemList()
    // 	.then((rs) => {
    // 		if (rs.status === 200 && rs.data.resultCode === '1') {
    // 			vm.chargeItemList = rs.data.resultList;
    // 		}
    // 	})

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        $scope.medicalParam = angular.copy($scope.medicalParams);
        $scope.medicalParam.retreatType = type;
        $scope.medicalParam.outRecordId=$scope.medicalParam.id;
        $scope.medicalParam.operator= auth.loginUser().userName;
        $scope.medicalParam.effectiveTime=new Date($scope.medicalParam.effectiveTime);
        $scope.medicalParam.outTime=new Date($scope.medicalParam.outTime);
        $scope.medicalParam.id=undefined; 

        IHttp.post('basedata/addConsumablesRetreatRecord', $scope.medicalParam)
            .then((rs) => {
                $rootScope.btnActive = true;
            	if (rs.status === 200 && rs.data.resultCode === '1') {
                     toastr.info("退耗材成功");
            		$uibModalInstance.close('success');
            	} else {
            		$uibModalInstance.dismiss('faild');
            	}
            },(err) => {
            	$uibModalInstance.dismiss(err);
            });    
    }

    select.getAllUser().then((rs) => {
        $scope.operaList = rs.data.userItem;
    });

    // 验证
    function verify() {
         return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.retreatNumber && $scope.medicalParams.retreatName );
        
        
    }
}
