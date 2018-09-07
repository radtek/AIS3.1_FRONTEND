OperRoomSchedule_yxrmCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'select', 'auth', '$uibModal'];

module.exports = OperRoomSchedule_yxrmCtrl;

function OperRoomSchedule_yxrmCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, select, auth, $uibModal) {
    var page = $rootScope.$state.current.name,
        tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.cancelItem(row.entity,1)>取消</a></div>';
    var beCode = auth.loginUser().beCode;
    $scope.beCode = beCode;
    var params = {
        pageNo: 1,
        pageSize:15,
        sort: '',
        orderBy: '',
        filters: [],
        state: '01,02,08'
    };

    var promise;

    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    });

    select.operroom().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.operroom = rs.data.resultList;
    })

    // 手术台次
    select.sysCodeBy('pacType').then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.pacList = rs.data.resultList;
    })


    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    });

    select.getOptBody().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.optBodyList = rs.data.resultList;
    })

    //需要排重的下拉选项字段
    let nurseFields = [
        'instrnurseId1', //洗手护士
        'instrnurseId2',
        'circunurseId1', //巡回护士
        'circunurseId2'
    ]

    $scope.gridOptions = {
        enableFiltering: false, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showGridFooter: false, // 显示页脚
        useExternalPagination: true, // 分页
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        // enableCellEdit: false,
        enableCellEditOnFocus: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                $scope.$emit('childRefresh');
            });
            // if (beCode != 'qnzrmyy' && beCode != 'nhfe') {
            //     gridApi.core.on.paginationChanged($scope, function(newPage, pageSize) {
            //         params.pageNo = newPage;
            //         params.pageSize = pageSize;
            //         $scope.$emit('childRefresh');
            //     });
            // }
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
                    params.filters = filterArr;
                    $scope.$emit('childRefresh');
                }, 1000)

            });
        },
        columnDefs: [{
            field: 'emergencyName',
            name: '类型',
            width: 70
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            minWidth: 160
        }, {
            field: 'bed',
            name: '床号',
            width: 70
        }, {
            field: 'sex',
            name: '性别',
            width: 55
        }, {
            field: 'age',
            name: '年龄',
            width: 55
        }, {
            field: 'name',
            name: '姓名',
            width: 90
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 200
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 110
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            minWidth: 150
        }, {
            field: 'operaDate',
            name: '手术日期',
            width: 100
        }, {
            field: 'startTime',
            name: '时间',
            cellTemplate: '<div class="dtdiv div-bg-80" ng-mouseover="row.entity.showtimediv=true" ng-if="!row.entity.showtimediv">{{row.entity.startTime}}</div><datetime-picker ng-if="row.entity.showtimediv" flex ng-model="row.entity.startTime" datepicker="false" timepicker="true" format="H:i">',
            cellClass: 'nurse-startTime',
            width: 70
        }, {
            field: 'operRoomId',
            name: '手术室',
            cellClass: 'nurse-operRoomName',
            cellTemplate: '<div class="dtdiv div-bg-100" ng-mouseover="row.entity.showoperRoomNamediv=true" ng-if="!row.entity.showoperRoomNamediv">{{row.entity.operRoomName}}</div><oi-select style="width:100px" ng-if="row.entity.showoperRoomNamediv" oi-options="item.operRoomId as item.name for item in grid.appScope.operroom track by item.operRoomId" ng-model="row.entity.operRoomId" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 90
        }, {
            field: 'pcs',
            name: '手术台次',
            cellClass: 'nurse-pcs',
            cellTemplate: '<div class="dtdiv div-bg-80" ng-mouseover="row.entity.showpcsdiv=true" ng-if="!row.entity.showpcsdiv">{{row.entity.pcsName}}</div><oi-select ng-if="row.entity.showpcsdiv" oi-options="item.codeValue as item.codeName for item in grid.appScope.pacList track by item.codeValue" ng-model="row.entity.pcs" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 100
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90
        }],
		rowTemplate: '<div ng-class="{true:\'row-active\'}[row.isMouseover && row.beCode === \'yxrm\']" ng-mouseenter="grid.appScope.mouseenter(row);" ng-mouseleave="row.isMouseover=false" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
        //rowTemplate: '<div ui-grid-cell class="ui-grid-cell" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ng-dblclick="grid.appScope.detail(row.entity);"></div>'
    };
	
	$scope.mouseenter = function(row) {
        angular.forEach($scope.gridApi.grid.rows, function(item, index) {
            item.isMouseover = false;
            item.beCode = beCode;
        });
        row.isMouseover = true;
        row.beCode = beCode;
    }
	 // 取消
    $scope.cancel = function(row) {

    }

    $scope.focus = function(row, col) {
        let selectedList = [];
        col.colDef.editDropdownOptionsArray = [];
        for (let nurse of nurseFields) {
            if (nurse !== col.field && row[nurse]) {
                selectedList.push(row[nurse]);
            }

        }
        col.colDef.editDropdownOptionsArray = $scope.nurseList.filter((nurse) => {
            let i = 0;
            for (; i < selectedList.length; i++) {
                if (nurse.userName === selectedList[i]) {
                    break;
                }
            }
            return i === selectedList.length;
        });
    }

    /*if (beCode == 'qnzrmyy' || beCode == 'nhfe') {
        $scope.gridOptions.showGridFooter = true;
    }
    $scope.detail = function(entity) {
        var scope = $rootScope.$new();
        var url = 'rowDetail';
        if (beCode === 'qnzrmyy') {
            url = 'qnz/rowDetail';
        }
        scope.data = entity;
        scope.tabIndex = 0;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/rowDetail/' + url + '.html'),
            controller: require('../modal/rowDetail/rowDetail.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs == 'success') {
                $scope.$emit('childRefresh');
            }
        });
    }*/

    $scope.$on('query', (event, params) => {
        params.type = 0;
        params.dispStep = 1;
        if (beCode == 'qnzrmyy' || beCode == 'yxyy' ) {
            params.pageNo = undefined;
            params.pageSize = undefined;
        }
        IHttp.post('basedata/searchNoEndListSchedule', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions.data = rs.data.resultList;
        });
    })

    $scope.$on('save', (event) => {
        var dispatchList = [];
        for (var a in $scope.gridOptions.data) {
            var item = $scope.gridOptions.data[a - 0];
            if (item.isLocalAnaes == '1')
                item.isHold = '0';
            if (item.operRoomId && item.pcs) {
                dispatchList.push(item)
            }
        }

        if (dispatchList.length <= 0) {
            toastr.warning('请为患者安排手术间和台次');
            return;
        }

        IHttp.post('basedata/dispatchOperation', {
            dispatchList: dispatchList,
            roleType: auth.loginUser().roleType
        }).then((rs) => {
            $scope.$emit('childRefresh');
            if (rs.data.resultCode != 1)
                return
            toastr.info(rs.data.resultMessage);
        });
    })

    // 取消手术
    $scope.cancelItem = function(item, type) {
        var scope = $rootScope.$new();
        scope.data = {
            items: item
        };
        if (beCode === 'nhfe') {
            $uibModal.open({
                animation: true,
                template: require('../modal/cancelConfirm/cancelConfirm.html'),
                controller: require('../modal/cancelConfirm/cancelConfirm.controller'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            }).result.then((rs) => {
                if (rs === 'success') {
                    $scope.$emit('childRefresh');
                }
            });
        }else {
            $uibModal.open({
                animation: true,
                template: require('../../oper/modal/modal.html'),
                controller: require('../../oper/modal/modal.controller'),
                controllerAs: 'vm',
                backdrop: 'static',
                scope: scope
            }).result.then((rs) => {
                if (rs === 'success') {
                    $scope.$emit('childRefresh');
                }
            });
        }
    }

    $scope.$emit('childInited');
}