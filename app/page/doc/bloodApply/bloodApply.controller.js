BloodApplyCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'toastr', 'select', 'auth', 'confirm', '$filter'];

module.exports = BloodApplyCtrl;

function BloodApplyCtrl($rootScope, $scope, IHttp, $uibModal, toastr, select, auth, confirm, $filter) {
    var vm = this;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.processState = 'NO_END';
    $scope.$emit('readonly', $scope.setting);
    $scope.$emit('changeBtnText', { id: 'saveBtn', text: '申请' });
    $scope.docInfo = auth.loginUser();

    vm.selectList = ['阴性', '阳性'];
    vm.bloodTypeList = ['A', 'B', 'AB', 'O'];
    vm.pcsList = ['1', '2', '3', '4', '5'];

    function initData() {
        IHttp.post("document/searchOptBloodTransRecordByRegOptId", { regOptId: regOptId }).then(function(rs) {
            $scope.gridOptions.data = rs.data.bloodTransItem;
            $scope.gridOptions.data.forEach(function(i) {
                i.bloodId = i.bloodId + '';
                i.status_ = i.status == '1' ? '未申请' : '申请成功';
                i.date_ = $filter('date')(i.date, 'yyyy-MM-dd HH:mm');
            });
            vm.regOptItem = rs.data.regOpt;
            $scope.bloodTransRecord = rs.data.bloodTransRecord;
            $scope.dispatch = rs.data.dispatch;
            $scope.bloodTransRecord.pcs = ($scope.bloodTransRecord.pcs || $scope.dispatch.pcs) + '';
            $scope.$emit('processState', 'NO_END');
        });
    }

    initData();

    $scope.gridOptions = {
        enableFiltering: false, //  表格过滤栏
        paginationPageSizes: [15, 30, 50],
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: false, // 分页
        useExternalSorting: true,
        columnDefs: [{
            field: 'bloodName',
            width: 120,
            displayName: '血液品种',
            cellTooltip: function(row, col) {
                return row.entity.bloodName;
            }
        }, {
            field: 'bloodDosage',
            displayName: '输血剂量',
            cellTooltip: function(row, col) {
                return row.entity.bloodDosage;
            }
        }, {
            field: 'bloodUnit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.bloodUnit;
            }
        }, {
            field: 'bloodType',
            displayName: '血型',
            cellTooltip: function(row, col) {
                return row.entity.bloodType;
            }
        }, {
            field: 'date_',
            displayName: '取血时间',
            width: 135,
            cellTooltip: function(row, col) {
                return row.entity.date_;
            }
        }, {
            field: 'status_',
            displayName: '状态',
            cellTooltip: function(row, col) {
                return row.entity.status_;
            }
        }, {
            field: 'id',
            width: 120,
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.edit(row)>编辑</a> <span>|</span> <a href="" ng-click=grid.appScope.delete(row)>删除</a></div>'
        }],
        data: []
    };

    $scope.edit = function(row) {
        if (row.entity.status_ === '申请成功') return;
        var scope = $rootScope.$new();
        scope.entity = row.entity;
        scope.list = $scope.list;
        $uibModal.open({
            animation: true,
            template: require('./modal/applyBlood.html'),
            controller: require('./modal/applyBlood.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData();
        }, (err) => {});
    }

    $scope.update = function(event, value) {
        if (!event && value === '') return;
        IHttp.post("document/updateBloodTransRecord", $scope.bloodTransRecord).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                initData();
            }
        });
    }

    IHttp.post("basedata/queryBloodList", { regOptId: regOptId }).then(function(rs) {
        $scope.list = rs.data.bloodList;
    });

    $scope.add = function() {
        var scope = $rootScope.$new();
        scope.id = $scope.bloodTransRecord.bloodTransId;
        scope.list = $scope.list;
        $uibModal.open({
            animation: true,
            template: require('./modal/applyBlood.html'),
            controller: require('./modal/applyBlood.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData();
        }, (err) => {});
    }

    function save(event) {
        let content = '确定申请输血吗？<br>选择"是"申请输血，选择"否"取消申请';
        confirm.show(content).then(function(data) {
            IHttp.post("interfacedata/sendOperBloodDataToHis", { regOptId: regOptId }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                    initData();
                }
            });
        });
    }

    $scope.delete = function(row) {
        if (row.entity.status_ === '申请成功') return;
        IHttp.post("document/deteleBloodTransItem", { id: row.entity.id }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                initData();
            }
        });
    }

    $scope.$on('save', () => {
        save();
    });

    $scope.$on('print', () => {
        $scope.$emit('doc-print');
    });
}