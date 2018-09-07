MenuCtrl.$inject = ['$rootScope', '$scope', 'auth', 'IHttp', 'toastr', '$filter'];

module.exports = MenuCtrl;

function MenuCtrl($rootScope, $scope, auth, IHttp, toastr, $filter) {
    var vm = this;

    vm.modelList = [{ "codeValue": "CTRLCENT", "codeName": "控制中心模块" }];

    $scope.selModel = "CTRLCENT";
    $scope.zSelected = {};

    // 获取局点信息
    IHttp.post('sys/selectBusForDropDown', {}).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.hospital = rs.data.sysBusDropDown;
    });

    // 获取文书列表 
    function getAllDocument(beid) {
        IHttp.post('sys/searchAllDocumentByBeid', { beid: beid }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.docTableList = rs.data.resultList;
        });
    }

    // 监听局点变化，刷新树目录
    $scope.$watch('selHospModel', function(n) {
        if (!n) return;
        getimformation(n.beid);
        IHttp.post('sys/getMenuTree', { beid: n.beid, module: $scope.selModel }).then(function(rs) {
            if (rs.data.resultCode != 1) {
                toastr.warning(rs.data.resultMessage);
                return;
            }
            $scope.zOption = rs.data.roleMenus;
            getDict(n.beid, 'page_authority');
            $scope.zSelected.beName = n.name;
            $scope.zSelected.beid = n.beid;
            getAllDocument(n.beid);
            $scope.$evalAsync();
        });
    });

    // 监听模块变化，刷新树目录
    $scope.$watch('selModel', function(n) {
        if (!n) return;
        if ($scope.selModel == "CTRLCENT") {
            $scope.selModelStr = "控制中心";
        } else if ($scope.selModel == "OPRM") {
            $scope.selModelStr = "术中";
        } else if ($scope.selModel == "PACU") {
            $scope.selModelStr = "复苏室";
        } else if ($scope.selModel == "LRGSCRN") {
            $scope.selModelStr = "大屏";
        }
        if (!$scope.selHospModel) {
            return;
        }

        IHttp.post('sys/getMenuTree', { beid: $scope.selHospModel.beid, module: $scope.selModel }).then(function(rs) {
            if (rs.data.resultCode != 1) {
                toastr.warning(rs.data.resultMessage);
                return;
            }
            $scope.zOption = rs.data.roleMenus;
            getDict(n.beid, 'page_authority');
            $scope.$evalAsync();
        });
    });

    // 菜单树事件
    $scope.zConfig = {
        dataLoaded: true,
        event: [{
            onClick: function(event, treeId, treeNode) {
                $scope.zSelected = {
                    "id": treeNode.id,
                    "beid": treeNode.beid,
                    "beName": treeNode.beName,
                    "name": treeNode.name,
                    "type": treeNode.type,
                    "isLeftMenu": treeNode.isLeftMenu,
                    "module": treeNode.module,
                    "icon": treeNode.icon,
                    "target": treeNode.target,
                    "url": treeNode.url,
                    "priority": treeNode.priority,
                    "parentId": treeNode.parentId,
                    "parentIds": treeNode.parentIds,
                    "permission": '',
                    "enable": treeNode.enable,
                    "urlType": treeNode.urlType,
                    "docTableId": treeNode.docTableId,
                    "sort": treeNode.sort
                };
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var sNodes = treeObj.getSelectedNodes();
                if (sNodes.length > 0) {
                    var node = sNodes[0].getParentNode();
                    if (node) {
                        $scope.parentItem = [{
                            id: node.id,
                            name: node.name
                        }]
                        $scope.zSelected.parentId = node.id;
                        $scope.zSelected.parentIds = node.parentIds + ',' + node.id;
                    }
                    // 获取同级目录数
                    var nodeLen = $('#' + treeNode.tId).siblings().length + 1;
                    var a = 0,
                        nodeIndex = [];
                    while (a < nodeLen) {
                        a += 1;
                        nodeIndex.push(a);
                    }
                    $scope.nodeIndex = nodeIndex;

                    // 权限回显
                    if (treeNode.permission) {
                        console.log($scope.authority)
                        var permissionArr = treeNode.permission.split(',');
                        for (var i = 0; i < $scope.authority.length; i++) {
                            $scope.authority[i].active = 0;
                        }
                        for (var a = 0; a < permissionArr.length; a++) {
                            $filter('filter')($scope.authority, function(item, key) {
                                if (item.codeValue == permissionArr[a]) {
                                    item.active = 1;
                                }
                            });
                        }
                    }
                }
                if (!$scope.zSelected.beid) {
                    $scope.zSelected.beid = $scope.selHospModel.beid;
                    $scope.zSelected.beName = $scope.selHospModel.name;
                    $scope.zSelected.enable = 1;
                    $scope.zSelected.module = $scope.selModel;
                    $scope.zSelected.isLeftMenu = 0;
                    $scope.zSelected.type = 1;
                }
                if (!$scope.zSelected.beName) {
                    $scope.zSelected.beName = $scope.selHospModel.name;
                }
                $scope.$evalAsync();
            }
        }, {
            onRemove: function(event, treeId, treeNode) {
                if (treeNode.id) {
                    IHttp.post('sys/delMenu', { "id": treeNode.id, "beid": treeNode.beid }).then(function(rs) {
                        if (rs.data.resultCode != 1) {
                            refreshTree();
                        }
                    });
                }
            }
        }],
        setting: {
            data: {
                simpleData: {
                    enable: true
                }
            },
            edit: {
                enable: true,
                drag: {
                    isCopy: false,
                    isMove: false
                },
                showRenameBtn: false,
                showRemoveBtn: setRemoveBtn
            },
            callback: {},
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom
            }
        }
    };

    var newCount = 1;

    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function() {
            var zTree = $.fn.zTree.getZTreeObj("tree");
            zTree.addNodes(treeNode, {
                pId: treeNode.id,
                name: "新的节点" + (newCount++)
            });
            return false;
        });
    };

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    };

    function setRemoveBtn(treeId, treeNode) {
        return !treeNode.isParent;
    }

    // 提交
    $scope.btnSubmit = function() {
        if (angular.equals({}, $scope.zSelected) || !$scope.zSelected || $scope.zSelected && !$scope.zSelected.beName)
            return;

        var url = 'sys/addMenu';
        if ($scope.zSelected.id)
            url = 'sys/updateMenu';

        var permission = '';
        for (var a = 0; a < $scope.authority.length; a++) {
            if ($scope.authority[a].active)
                permission += $scope.authority[a].codeValue + ',';
        }
        if (permission.length > 0)
            $scope.zSelected.permission = permission.substring(0, permission.length - 1);

        IHttp.post(url, $scope.zSelected).then(function(rs) {
            if (rs.data.resultCode != 1) {
                refreshTree();
            } else
                toastr.success(rs.data.resultMessage);
            refreshTree();
        });
    }

    // 取消
    $scope.btnCancel = function() {
        $scope.zSelected = {};
    }

    function refreshTree() {

        IHttp.post('sys/getMenuTree', { beid: $scope.selHospModel.beid, module: $scope.selModel }).then(function(rs) {
            if (rs.data.resultCode != 1) {
                toastr.warning(rs.data.resultMessage);
                return;
            }
            // sessionStorage.removeItem("menu");
            // sessionStorage.setItem('menu', JSON.stringify(rs.data.roleMenus));
            $scope.zOption = rs.data.roleMenus;
            $scope.$evalAsync();
        });
    }

    function getDict(beid, type) {
        if (!beid) {}
        beid = $scope.selHospModel.beid;
        // 操作权限 pageAuthority
        IHttp.post('sys/getDictItemList', { "beid": beid, "groupId": type }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            $scope.authority = rs.data.dictItemList;
        });
    }

    function getimformation(beid) {
        IHttp.post('sys/getDictItemList', {
                groupId: "module",
                beid: beid
            })
            .then(
                function(rs) {
                    var data = rs.data;
                    if (data.resultCode === "1") {
                        vm.modelList = data.dictItemList;
                    }
                }
            );
    }
}