pharmacyCtrl.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'toastr', 'auth', '$filter', 'select', 'confirm'];

module.exports = pharmacyCtrl;

function pharmacyCtrl($scope, IHttp, $uibModalInstance, $timeout, toastr, auth, $filter, select, confirm) {
    var vm = this,
        promise,
        user = auth.loginUser(),
        tabType, // tabs.list 类型
        isApply, // 是套用模板页还是事件列表页
        _data; // 存储原始数据

    vm.tempArry = []; // 存储临时的事件项
    vm.tabs = {
        curIndex: 0,
        list: [{ title: '全部', type: '' }, { title: '麻醉用药', type: '1' }, { title: '治疗用药', type: '2' }, { title: '镇痛药', type: '3' }, { title: '输液', type: 'I' }, { title: '出量', type: 'O' }, { title: '麻醉事件', type: '4' }]
    }

    // 去除掉不需要显示的 tabs 项
    for (var i = vm.tabs.list.length - 1; i >= 0; i--) {
        if ($scope.types.indexOf(vm.tabs.list[i].type) < 0)
            vm.tabs.list.splice(i, 1)
    }

    // 选择当前的 tabs 标签页
    vm.selectCurTab = function(index) {
        vm.tabs.curIndex = index;
        tabType = angular.copy(vm.tabs.list[index].type);
        initComData()
        // 切换Tab时，如果dataList没有任何变化，并且tempArry也没有任何数据，就执行
        if (angular.equals(_data, vm.dataList) && vm.tempArry.length <= 0) {
            initTableData()
        } else {
            vm.save();
        }
    }

    // 获取事件类型
    vm.getType = function(type) {
        var _type;
        for (var a = 0; a < vm.tabs.list.length; a++) {
            _type = vm.tabs.list[a].type;
            if (_type == type)
                return vm.tabs.list[a].title;
        }
    }

    // 根据类型获取下拉值接口 
    vm.searchTypeData = function(query) {
        return select.searchEventListByType(tabType, query);
    }

    // 用药途径
    select.getMedicalTakeWayList().then(res => {
        vm.wayList = res.data.resultList;
    })

    // 监听添加事件
    var evItem = $scope.$watch('vm.evItem', (n, o) => {
        if (n == o && n == undefined)
            return;
        vm.add(n);
    })

    function initComData() {
        // 根据类型获取下使用频次最多数据
        select.searchCommonUseEventListByType(tabType).then(res => {
            vm.searchCommData = res;
        })
    }

    function initTableData() {
        // 获取已添加的数据
        select.searchSelectedEventByType(tabType, $scope.docId).then(res => {
            vm.dataList = res;
            vm.dataList.forEach(item => {
                if (item.startTime)
                    item.startTime = $filter('date')(item.startTime, 'yyyy-MM-dd HH:mm')
                if (item.endTime)
                    item.endTime = $filter('date')(item.endTime, 'yyyy-MM-dd HH:mm')
            })
            _data = angular.copy(vm.dataList);
        })
    }

    // 删除单个事件
    vm.del = function(index, row) {
        if (row.id) {
            confirm.show().then(res => {
                IHttp.post('operation/deleteEventById', { type: row.type, id: row.id }).then(res => {
                    if (res.data.resultCode != 1) return;
                    toastr.info(res.data.resultMessage)
                    vm.dataList.splice(index, 1)
                })
            })
        } else {
            vm.tempArry.splice(index, 1)
        }
    }

    // 添加单个事件
    vm.add = function(item) {
        var a = $filter('filter')(vm.dataList, row => {
                return item.name == row.name && item.spec == row.spec;
            }),
            b = $filter('filter')(vm.tempArry, row => {
                return item.name == row.name && item.spec == row.spec;
            }),
            arr = [];
        if (a.length > 0 || b.length > 0) {
            confirm.show('您添加的【' + item.name + '】已经存在，是否继续添加？').then(res => {
                item.type = tabType;
                item.durable = 0;
                item.isTpl = false;
                arr.push(item);
                initDataList(arr);
            })
        } else {
            item.type = tabType;
            item.durable = 0;
            item.isTpl = false;
            arr.push(item);
            initDataList(arr);
        }
    }

    // 保存
    vm.save = function(callback) {
        if (angular.equals(_data, vm.dataList) && vm.tempArry.length <= 0) {
            initGroup(false)
        } else {
            var dataList = angular.copy(vm.dataList);
            dataList.forEach(item => {
                if (item.startTime)
                    item.startTime = new Date(item.startTime).getTime();
                if (item.endTime)
                    item.endTime = new Date(item.endTime).getTime();
            })
            var tempArry = angular.copy(vm.tempArry);
            tempArry.forEach(item => {
                if (item.startTime)
                    item.startTime = new Date(item.startTime).getTime();
                if (item.endTime)
                    item.endTime = new Date(item.endTime).getTime();
                dataList.push(item)
            })

            if (promise) {
                $timeout.cancel(promise);
            }
            promise = $timeout(function() {
                IHttp.post('operation/batchSaveEventList', {
                    docId: $scope.docId,
                    type: tabType,
                    createUser: user.userName,
                    eventList: dataList
                }).then(function(rs) {
                    if (rs.data.resultCode != '1') return;

                    initTableData();
                    vm.tempArry = [];

                    if (callback)
                        callback();
                });
            }, 500);
        }
    }

    // 取消操作（如果在套用模板页，取消操作将会回到事件列表，选择的模板数据也不会保存）
    vm.cancel = function() {
        if (!isApply) {
            $uibModalInstance.dismiss();
            evItem();
        }
        initGroup(false)
    }
    // 保存为模板时，先将数据保存到数据库，再弹出保存为模板的对话框，给用户定义模板名
    vm.saveTpl = function() {
        if (angular.equals(_data, vm.dataList) && vm.tempArry.length <= 0)
            $uibModalInstance.close({ state: 'saveTpl', data: angular.copy(vm.dataList) })
        else {
            vm.save(function() {
                $uibModalInstance.close({ state: 'saveTpl', data: angular.copy(vm.dataList) })
            })
        }
    }

    // 应用模板
    vm.applyTpl = function() {
        $scope.isCollapsed1 = false;
        initGroup(true)
    }
    // 添加模板数据
    vm.useTpl = function(item) {
        try {
            vm.tempArry = JSON.parse(item.tempJson)
        } catch (e) {
            vm.tempArry = [];
        }
        vm.tempArry.forEach(item => {
            if (!item.startTime)
                item.startTime = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm')
            if (item.durablem && !item.endTime)
                item.endTime = $filter('date')(new Date(item.startTime).getTime() + 6000, 'yyyy-MM-dd HH:mm')
        })
    }

    initGroup(false)

    function initGroup(flag) {
        isApply = flag;
        vm.isApply = flag;
        if (flag) {
            vm.groupList = {
                "display": "block"
            }
            vm.groupMenu = {
                "margin-right": "15px",
                "width": "200px",
                "transition": "width 0.1s",
                "-moz-transition": "width 0.1s",
                "-webkit-transition": "width 0.1s",
                "-o-transition": "width 0.1s",
            }
            initTpl();
            vm.tplState = '';
            vm.tplName = '';
        } else { // 取消
            vm.groupMenu = {
                "width": "0"
            }
            vm.groupList = {
                "display": "none"
            }
            vm.tempArry = [];
        }
    }

    function initTpl() {
        IHttp.post('basedata/queryAnaesDoctempList', {
            pageNo: '',
            pageSize: '',
            type: vm.tplState || '',
            createUser: user.userName,
            filters: [{
                field: "medTempName",
                value: vm.tplName || ''
            }]
        }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            vm.tplPrivate = [];
            vm.tplPublic = [];
            rs.data.resultList.forEach(item => {
                if (item.type == 1)
                    vm.tplPrivate.push(item)
                else if (item.type == 2)
                    vm.tplPublic.push(item)
            })
        });
    }

    function initDataList(list) {
        // 将其它的事件也添加到 dataList
        list.forEach(item => {
            if (tabType == item.type || tabType == '') {
                if (!item.startTime)
                    item.startTime = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm')
                if (item.durablem && !item.endTime)
                    item.endTime = $filter('date')(new Date(item.startTime).getTime() + 6000, 'yyyy-MM-dd HH:mm')
                vm.tempArry.push(item)
            }
        })
    }
}