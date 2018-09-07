editUserGroupMgt.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', '$timeout', 'select', 'confirm', 'toastr'];

module.exports = editUserGroupMgt;

function editUserGroupMgt($rootScope, $scope, IHttp, $uibModalInstance, $timeout, select, confirm, toastr) {
    var promise;
    var ztree;
    $scope.selModel = 'CTRLCENT';
    $scope.param = {};
    $scope.config = {
        setting: { 
            check: { enable: true },
            data: { simpleData: { enable: true } }
        }
    }

    IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'role_type' }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.roleTypes = rs.data.resultList;
    });

    $scope.getMenuModel = function (){
        getRoleById($scope.selModel);
    };

    $scope.queryMenu = function (module){
        $scope.param.module = module;
        IHttp.post('sys/queryRoleById', { id: $scope.role ? $scope.role.id : '', module : module}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.param.role = rs.data.role;
            $scope.param.roleMenus = rs.data.roleMenus;
            $scope.option = rs.data.roleMenus;
            $timeout(function() {
                ztree = $scope.ztree;
            }, 100);
        });
    }

    function getRoleById(module) {
        $scope.param.module = module;
        IHttp.post('sys/queryRoleById', { id: $scope.role ? $scope.role.id : '', module: module }).then(
            function(rs) {
                var data = rs.data;
                if (data.resultCode === "1") {
                    $scope.option = getCheckNodes(data.roleMenus);
                    for(var i=0; i<$scope.option.length; i++) {
                        if ($scope.option[i].open)
                            $scope.option[i].open = false;
                    }
                    $scope.$evalAsync();
                    $timeout(function() {
                        ztree = $scope.ztree;
                    }, 100);
                    //$scope.zNodes = data.roleMenus;                    
                }
            }
        );
    }

    getRoleById("CTRLCENT");

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        var roleMenus = getTreeChecked($scope.option);
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            $scope.param.role = $scope.role;
            $scope.param.roleMenus = roleMenus;
            IHttp.post('sys/updateRole', $scope.param)
                .then(
                    function(rs) {
                        var data = rs.data;
                        $rootScope.btnActive = true;
                        if (data.resultCode === "1") {
                            toastr.info("保存成功。所设置的权限在该角色下次登录时开始应用。");
                            $uibModalInstance.close();
                        }
                    }
                );
        }, 500);
    }

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
        var selected = ztree.getCheckedNodes();
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

    $scope.cancel = function() {
        $uibModalInstance.close();
    }

    // 验证
    function verify() {
        return $scope.roleform.$valid && !!($scope.role.name || $scope.role.roleType || $scope.role.enable)
    }
}
