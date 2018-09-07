DocPatientRateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'uiGridConstants', 'auth'];

module.exports = DocPatientRateCtrl;

function DocPatientRateCtrl($rootScope, $scope, IHttp, $uibModal, uiGridConstants, auth) {
    var systemInfo = auth.loginUser();
    var queryParams = {
        beid: systemInfo.beid,
        pageNo: 1,
        pageSize: 5
    };
    $scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
    $scope.eOption = {
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    $scope.DoctorPatient = {
        anestheDocNum: 0,
        operTotal: 0,
        rate: 0.0,
    };

    $scope.gridOptionsDpEmpty = {
        paginationPageSizes: [5, 10],
        paginationPageSize: queryParams.pageSize,
        resizable: true,
        useExternalPagination: true, // 分页
        enableFiltering: false,
        enableGridMenu: true,
        enableColumnMenus:false,
        rowHeight: 40,
        exporterCsvFilename: '医师总数.csv',
        exporterOlderExcelCompatibility: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                queryParams.pageNo = newPage;
                queryParams.pageSize = pageSize;
                queryDoctorAmount();
            });
        },
        columnDefs: [{
            field: 'recordMonth',
            name: '日期'
        }, {
            field: 'amount',
            name: '医师总数'
        }]
    };

    $scope.gridOptionsDoctorPatient = {
        paginationPageSizes: [5, 10],
        paginationPageSize: 5,
        enableColumnMenus:false,//表头列的菜单按钮，默认fal
        resizable: true,
        rowHeight: 40,
        enableFiltering: false,
        enableGridMenu: true,
        exporterCsvFilename: '麻醉科完成麻醉例数.csv',
        exporterOlderExcelCompatibility: true, //为true时不使用utf-16编码
        onRegisterApi: function(gridApi) {
            $scope.gridApiDoctorPatient = gridApi;
        }
    };

    $scope.$on('query', function(ev, data) {
        queryDoctorAmount();
        IHttp.post('qcMng/searchDoctorPatientRate', data).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                let columns = [];
                let columnArr = rs.data.columnAry;
                for (let i = 0; i < columnArr.length; i++) {
                    let column = {
                        field: columnArr[i],
                        displayName: rs.data.columnAry[i]
                    };
                    columns[i] = column;
                }

                $scope.gridOptionsDoctorPatient.columnDefs = columns;
                $scope.gridOptionsDoctorPatient.data = rs.data.operTableList;

                $scope.DoctorPatient.anestheDocNum = rs.data.anestheDocNum;
                $scope.DoctorPatient.operTotal = rs.data.operTotal;
                $scope.DoctorPatient.rate = rs.data.rate;

                $scope.eOption.series[0].data = [
                    { value: rs.data.rate, name: '麻醉科固定在岗（本院）医师总数' },
                    {
                        value: 100 - rs.data.rate,
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        }
                    }
                ];
                $scope.eConfig.dataLoaded = false;
            }
        });
    });

    function queryDoctorAmount(){
        IHttp.post('basedata/selectAllAnaesDoctorAmount', queryParams).then((rs) => {
            if (rs.data.resultCode !== '1') return;
            $scope.gridOptionsDpEmpty.data = rs.data.resultList;
            $scope.gridOptionsDpEmpty.totalItems = rs.data.total;
        });
    }

    $scope.docTotal = function() {
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./modal/docTotalDetail.html'),
            controller: require('./modal/docTotalDetail.controller.js'),
            controllerAs: 'vm',
            resolve: {}
        }).result.then(function(rs) {
            queryDoctorAmount();
        });
    }

    $scope.export = function(type) {
        if (type === 'gridApiDpEmpty') {
            var pagesize = $scope.gridOptionsDpEmpty.totalItems;
            queryParams.pageNo = 1;
            queryParams.pageSize = pagesize;
            queryDoctorAmount();
            setTimeout(function(){
                $scope.gridApi.exporter.csvExport('all','all');//导出所有的行和列
                queryParams.pageNo = 1;
                queryParams.pageSize = 5;
                queryDoctorAmount();
            },1000);
        }else {
            $scope.gridApiDoctorPatient.exporter.csvExport('all','all');//导出所有的行和列
        }
    };

    $scope.$emit('childInited');

}