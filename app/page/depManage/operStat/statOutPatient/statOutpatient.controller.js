StatOutpatientCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', '$timeout', 'toastr', 'uiGridServe'];

module.exports = StatOutpatientCtrl;

function StatOutpatientCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, $timeout, toastr, uiGridServe) {
    $scope.gridOptions = uiGridServe.option({
        paginationState: 2,
        columnDefs: [{
            field: 'name',
            displayName: '患者姓名',
        }, {
            field: 'sex',
            displayName: '性别',
        }, {
            field: 'age',
            displayName: '年龄'
        }, {
            field: 'hid',
            displayName: '住院号',
        }, {
            field: 'operaDate',
            displayName: '手术日期'
        }, {
            field: 'operatorName',
            displayName: '手术医生'
        }, {
            field: 'designedOptName',
            displayName: '手术名称'
        }, {
            field: 'anesthetistName',
            displayName: '麻醉医生'
        }]
    });

    $scope.$on('query', function(ev, data) {
        delete data.operRoomId;
        IHttp.post('statistics/searchOutpatientOperateList', data).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.data = rs.data.outpatientList;
            }
        });
    });

    $scope.$on('export', () => {
        uiGridServe.exports('门诊手术统计表及明细');
    })

    $scope.$emit('childInited');
}