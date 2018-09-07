OperRoomScheduleCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'select', 'auth', '$uibModal', 'uiGridServe'];

module.exports = OperRoomScheduleCtrl;

function OperRoomScheduleCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, select, auth, $uibModal, uiGridServe) {
    var promise,
        page = $rootScope.$state.current.name,
        beCode = auth.loginUser().beCode,
        tempHtml = '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.cancelItem(row.entity,1)>取消</a></div>',
        params = uiGridServe.params({ state: '01,02,08' });

    $scope.beCode = beCode;

    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    });

    // 手术台次

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    });

    select.getOptBody().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.optBodyList = rs.data.resultList;
    });
    
    //需要排重的下拉选项字段
    let nurseFields = [
        'instrnurseId1', //洗手护士
        'instrnurseId2',
        'circunurseId1', //巡回护士
        'circunurseId2'
    ]

    $scope.gridOptions = uiGridServe.option({
        paginationState: 0,
        enableCellEditOnFocus: true,
        enableFiltering: false,
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
            visible:false,
            name: '时间',
            width: 70
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            width: 90
        }],
        rowTemplate: '<div ui-grid-cell class="ui-grid-cell" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ng-dblclick="grid.appScope.detail(row.entity);"></div>'
    }, function(){
        $scope.$emit('childRefresh');
    });

    $scope.detail = function(entity) {
        var scope = $rootScope.$new();
        // var url = 'rowDetail';
        // if (beCode === 'qnzrmyy') {
        //     url = 'qnz/rowDetail';
        // }
        scope.data = entity;
        scope.tabIndex = 0;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/rowDetail/rowDetail.html'),
            controller: require('../modal/rowDetail/rowDetail.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs == 'success') {
                $scope.$emit('childRefresh');
            }
        });
    }

    $scope.$on('query', (event, params) => {
        params.type = 0;
        params.dispStep = 1;
        if (beCode == 'qnzrmyy') {
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
            if (item.circunurseId1 || item.operRoomId || item.startTime || item.pcs) {
                if (!item.circunurseId1) {
                    toastr.warning('请为患者安排巡回护士');
                    return;
                }
                if (!item.operRoomId) {
                    toastr.warning('请为患者安排手术间');
                    return;
                }
                if (!item.operaDate) {
                    toastr.warning('请为患者安排手术日期');
                    return;
                }
                if (!item.startTime) {
                    toastr.warning('请为患者安排具体手术时间');
                    return;
                }
                if (!item.pcs && beCode !== 'nhfe') {
                    toastr.warning('请为患者安排台次');
                    return;
                }
                dispatchList.push(item)
            }
        }

        if (dispatchList.length <= 0) {
            toastr.warning('患者未安排巡回护士、手术间、手术日期、手术时间、台次不能为空');
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
        } else {
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