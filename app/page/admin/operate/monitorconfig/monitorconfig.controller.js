monitorconfig.$inject = ['$rootScope', '$scope', 'auth', '$filter', 'i18nService', '$uibModal', 'uiGridConstants', '$timeout', 'toastr', 'IHttp'];

module.exports = monitorconfig;

function monitorconfig($rootScope, $scope, auth, $filter, i18nService, $uibModal, uiGridConstants, $timeout, toastr, IHttp) {
    var vm = this;
    i18nService.setCurrentLang('zh-cn');
    var promise;
    //$scope.$emit('changeEvent');
    // 获取系统时间
    $scope.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    $scope.params = {
        timestamp: $scope.date,
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        "filters": [{ "field": "beid", "value": "0" }, { "field": "roomId", "value": "0" }]
    };

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        useExternalSorting: true, // 使用外部排序
        paginationPageSizes: [15, 30, 50], // 配置每页行数可选参数
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize, // 每页默认显示行数   
        onRegisterApi: function(gridApi) {
            $scope.gridApi=gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getList();
            });
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getList();
            });
            //过滤
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
                        if (!!value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params.filters = filterArr;
                    getList();
                }, 2000)
            });
        }
    };
    $scope.gridOptions.columnDefs = [{
        field: 'eventId',
        displayName: '监测ID'
    }, {
        field: 'eventName',
        displayName: '监测项名称'
    }, {
        field: 'frequency',
        displayName: '频率'
    }, {
        field: 'precision',
        displayName: '精度'
    }, {
        field: 'max',
        displayName: '最大值'
    }, {
        field: 'min',
        displayName: '最小值'
    }, {
        field: 'iconId',
        displayName: '图标',
        cellTemplate: '<div class="ui-grid-cell-contents"><img style="width:15px;height:15px" ng-src="{{row.entity.iconId}}"  /> </div>'
    }, {
        field: 'amendFlag',
        displayName: '修订',
        visible:false
    }, {
        field: 'eventDesc',
        displayName: '描述'
    }, {
        field: 'mustShow',
        displayName: '是否展示',
        cellFilter: 'mustShowFilter'
    }, , {
        field: 'position',
        displayName: '位置',
        cellFilter: 'positionFilter'
    }, {
        field: 'units',
        displayName: '单位'
    }, {
        field: 'optional',
        displayName: '是否采集',
        visible: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><label class="diycheckbox "  ng-class="{\'diycheckbox-m\': row.entity.optional == \'M\'}"  name="upcolumn" title="必选"  ng-click=grid.appScope.updatacolumn(row,\'M\') ></label><label class="diycheckbox "  ng-class="{\'diycheckbox-o\': row.entity.optional == \'O\'}"  name="upcolumn" title="可选"  ng-click=grid.appScope.updatacolumn(row,\'O\') style="margin-left:20px;margin-right:20px"  ></label><label class="diycheckbox " ng-class="{\'diycheckbox-n\': row.entity.optional == \'\'}"  name="upcolumn" title="不选"  ng-click=grid.appScope.updatacolumn(row,\'\') ></label></div>'
    }, {
        'field': 'widthAndHeight',
        displayName: '图标宽高'
    }, {
        field: 'regOptId',
        displayName: '操作',
        enableFiltering: false,
        cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.edit(row)>编辑</a><span ng-show="">&nbsp|&nbsp</span><a ng-show=""  ng-really-message="确定删除吗?" ng-really-click=grid.appScope.del(row)>删除</a></div>',
    }];
    Array.prototype.in_array = function(e) {
        for (i = 0; i < this.length; i++) {
            if (this[i] == e)
                return true;
        }
        return false;
    }
    var getList = function() { //获取所有采集指标接口
        IHttp.post('basedata/queryBasMonitorConfigList', $scope.params)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        if (!sessionStorage.getItem("yjxarr")) {
                            var arr = [];
                        } else {
                            var arr = JSON.parse(sessionStorage.getItem("yjxarr"));
                        }

                        for (var i = 0; i < data.resultList.length; i++) {
                            if (data.resultList[i].enable === 1) {
                                data.resultList[i].enable1 = '启用';
                            } else {
                                data.resultList[i].enable1 = '停用';
                            }

                            if (data.resultList[i].isCurBe === 1) {
                                data.resultList[i].enable1 += '　当前局点';
                            }
                            if (!(arr.in_array(data.resultList[i].iconId))) {
                                arr.push(data.resultList[i].iconId);
                                sessionStorage.setItem('yjxarr', JSON.stringify(arr));
                            }
                        }
                        $scope.gridOptions.data = data.resultList;
                        $scope.gridOptions.totalItems = data.total;
                    }

                }
            );
    }
    getList();

    $scope.del = function(row) {
        // if( !$rootScope.patToVitaState ){
        //        toastr.error('您没有权限！');
        //        return false;
        //    }
        if ($rootScope.permission.indexOf('DEL') === -1) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        var obj = row.entity;
        if (obj.isCurBe === 1) {
            toastr.error('当前局点不能删除！');
            return false;
        }
        //if (confirm("你确定要标记删除此设备吗？")) {
        IHttp.post('sys/delBusEntity', obj).then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getList();
                toastr.info("删除局点成功！");
            }
        });
    }

    $scope.setCurr = function(row) {
        if ($rootScope.permission.indexOf('UPD') === -1) {
            toastr.error("对不起，您没有权限。");
            return;
        }
        var obj = row.entity;
        //if (confirm("你确定要标记删除此设备吗？")) {
        IHttp.post('sys/setCurBe', obj).then(function(rs) {
            var data = rs.data;
            if (data.resultCode === '1') {
                getList();
                toastr.info("设置当前局点成功！");
            }
        });
    }

    $scope.edit = function(row) {
        var scope = $rootScope.$new();
        scope.item = row;
        if (row != undefined) {
            scope.item = angular.extend({}, row.entity);
        } else if ($rootScope.permission.indexOf('UPD') === -1) {
            //        toastr.error("对不起，您没有权限。");
            //    return;
        }
        var transferrModal = $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./editdialog.html'),
            controller: require('./editdialog.controller'),
            controllerAs: 'vm',
            scope: scope
        });
        transferrModal.result.then(function(data) {
            getList();
        }, function() {});
    }

}
