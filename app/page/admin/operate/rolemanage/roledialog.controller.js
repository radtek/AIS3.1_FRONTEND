roleMenusCtrl.$inject = ['$rootScope', '$scope', '$filter', '$uibModal', '$uibModalInstance', '$timeout', 'IHttp', 'toastr'];

module.exports = roleMenusCtrl;

function roleMenusCtrl($rootScope, $scope, $filter, $uibModal, $uibModalInstance, $timeout, IHttp, toastr) {
    var vm = this;
    var promise;
    vm.currModel = 'CTRLCENT';
    vm.saved = true;
    vm.btnActive = false;

    if ($scope.item != undefined) {
        vm.role = $scope.item;
        getRoleById(vm.role.id, vm.role.beid, vm.currModel);
        vm.role.enable = vm.role.enable === "启用" ? "1" : "0";
        vm.title = "编辑角色信息";
    } else {
        vm.role = {};
        vm.title = "添加角色信息";
    }

    vm.setCurrModel = function(str) {
        vm.currModel = str;
        getRoleById(vm.role.id, vm.role.beid, vm.currModel);
    }

    $scope.busparams = {
        timestamp: $scope.date,
        pageNo: 1,
        pageSize: 10000,
        sort: '',
        orderBy: '',
        filters: []
    };
    //获得局点数据
    var getList = function() {
        IHttp.post('sys/selectBusEntityList', $scope.busparams)
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        vm.bus = data.sysBusEntityList;
                    }
                }
            );
    }
    getList();

    $scope.getRoleTree=function(){    
        getRoleById(undefined,vm.role.beid,vm.currModel );
    }

    function getMenuPermission(beid) {
        IHttp.post('sys/getMenuPermission', {beid:beid}).then(
            function(rs) {
                var data=rs.data;
                if(data.resultCode==="1"){
                    $scope.zOption = getCheckNodes(data.resultList);
                    $scope.$evalAsync();
                    //$scope.zNodes = data.roleMenus;                    
                }
            }
        );
    }

    function getRoleById(id, beid, model) {
        IHttp.post('sys/queryRoleById', { id: id, beid: beid, module: model }).then(
            function(rs) {
                var data = rs.data;
                if (data.resultCode === "1") {
                    $scope.zOption = getCheckNodes(data.roleMenus);
                    for(var item of $scope.zOption) {
                        if (item.open)
                            item.open = false;
                    }
                    $scope.$evalAsync();
                    //$scope.zNodes = data.roleMenus;                    
                }
            }
        );
    }

    //将后端节点里的 buttonPermissionList 转为子节点数据
    function getCheckNodes(data) {
        var treeData = [];
        for (var i = 0; i < data.length; i++) {
            treeData.push(data[i]);
            if (data[i].buttonPermissionList.length > 0) {
                for (var j = 0; j < data[i].buttonPermissionList.length; j++) {
                    treeData.push({
                        checked: data[i].buttonPermissionList[j].check,
                        id: data[i].buttonPermissionList[j].id,
                        pId: data[i].id,
                        name: data[i].buttonPermissionList[j].name,
                        type: 3
                    });
                }
            }
        }
        return treeData;
    }

    //将前端节点里的type为3的按钮转为 Permission数据
    function getTreeChecked(data) {
        var selected = $.fn.zTree.getZTreeObj("tree").getCheckedNodes();
        var treeData = [];
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].type !== 3) {
                var node = {
                    type: selected[i].type,
                    pid: selected[i].pId,
                    id: selected[i].id,
                    name: selected[i].name,
                    permission: ""
                };
                if (selected[i].children) {
                    var permission = "";
                    for (var j = 0; j < selected[i].children.length; j++) {
                        if (selected[i].children[j].checked === true && selected[i].children[j].type === 3) {
                            permission += selected[i].children[j].id + ",";
                        }
                    }
                    if (permission.length > 1) {
                        permission = permission.substr(0, permission.length - 1);
                    }
                    node.permission = permission;
                }
                treeData.push(node);
            }
        }
        return treeData;
    }

    // 菜单树事件
    $scope.zConfig = {
        dataLoaded: true,
        setting: {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        }
    };
    getimformation("role_type");

    function getimformation(value) {
        IHttp.post('sys/getDictItemList', {
            groupId: value
        }).then(
            function(rs) {
                var data = rs.data;
                if (data.resultCode === "1") {
                    vm.roleTypeList = data.dictItemList;
                }
            }
        );
    }

    vm.close = function() {
        console.log($scope.zOption)
        $uibModalInstance.dismiss('cancel');
    }

    vm.update = function() {
        var roleMenus = getTreeChecked($scope.zOption);
        if (promise) {
            $timeout.cancel(promise);
        }
        vm.saved = false;
        vm.btnActive = true;
        promise = $timeout(function() {
            IHttp.post('sys/updateRole', { role: vm.role, roleMenus: roleMenus,beid:vm.role.beid ,module:vm.currModel })
                .then(
                    function(rs) {
                        var data = rs.data;
                        vm.saved = true;
                        vm.btnActive = false;
                        if (data.resultCode === "1") {
                            toastr.info("保存成功。所设置的权限在该角色下次登录时开始应用。");
                            $uibModalInstance.close();
                        }
                    }
                );
        }, 500);
    }
}
