editmonitordialog.$inject = ['$rootScope', '$scope', '$filter', '$uibModal', '$uibModalInstance', '$timeout', 'IHttp', 'toastr'];

module.exports = editmonitordialog;

function editmonitordialog($rootScope, $scope, $filter, $uibModal, $uibModalInstance, $timeout, IHttp, toastr) {
    var vm = this;
    var promise;
    // 获取系统时间
    vm.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    if ($scope.item != undefined) {
        vm.title = "编辑设备采集项";
        vm.bus = $scope.item;
    } else {
        vm.title = "添加设备信息";
    }
    $scope.interfaceTypeList = [{
        value: 1,
        label: 'TCP'
    }, {
        value: 2,
        label: '串口'
    }, {
        value: 3,
        label: 'UDP'
    }, {
        value: 4,
        label: '组播'
    }, {
        value: 5,
        label: 'TCP Server'
    }, ];
    $scope.deviceTypeList = [{
        value: 1,
        label: '手术室终端'
    }, {
        value: 2,
        label: '复苏室终端'
    }, {
        value: 3,
        label: '心电监护仪'
    }, {
        value: 4,
        label: '呼吸机'
    }, {
        value: 5,
        label: '麻醉机'
    }, ];

    vm.save = function(type) {
        if (promise) {
            $timeout.cancel(promise);
        }
        var url = "basedata/saveDeviceSpecification";
        promise = $timeout(function() {
            if (!vm.bus.beid) {
                vm.bus.beid = '';
            }
            IHttp.post(url, vm.bus)
                .then(
                    function(rs) {
                        var data = rs.data;
                        if (data.resultCode === "1") {
                            $uibModalInstance.close();
                        }
                    }
                );
        }, 500);
    }
    $scope.changeChecked = function(item) {
        item.checked = item.discount;
        if(item.checked){
            item.checked=1;
        }else{
            item.checked=0;
        }
        item.deviceId = vm.bus.deviceId;
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post("basedata/bindDeviceMonitorConfig", item).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 200)

    }
    vm.close = function() {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
    $scope.params = {
        timestamp: $scope.date,
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
        paginationPageSize: $scope.params.pageSize // 每页默认显示行数   
    };
    var getList = function() { //获取所有采集指标接口
        console.log($scope.item)
        IHttp.post('basedata/queryBasMonitorConfigList', $scope.params)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        $scope.gridOptions.data = data.resultList;
                        $scope.gridOptions.totalItems = data.total;
                        $scope.gridOptions.data.sort(by('eventName'));
                        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                            for (var j = 0; j < $scope.item.subGridOptions.data.length; j++) {
                                if ($scope.gridOptions.data[i].eventId == $scope.item.subGridOptions.data[j].eventId) {
                                    $scope.gridOptions.data[i].discount = 1;
                                }
                            }
                        }
                    }

                }
            );
    }
    getList();
    var by = function(name) {
        return function(o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
            } else {
                throw ("error");
            }
        }
    }

}
