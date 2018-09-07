KBCtrl.$inject = ['$scope', 'IHttp', '$timeout', 'toastr', '$document', 'confirm', 'auth'];

module.exports = KBCtrl;

function KBCtrl($scope, IHttp, $timeout, toastr, $document, confirm, auth) {

    $document[0].getElementById('knowledge').style.height = $document[0].body.clientHeight - 144 + 'px';

    var currentUser = auth.loginUser();
    var ztree = null;

    $scope.config = {
        dataLoaded: true,
        event: [{
            onClick: function(event, treeId, treeNode) {
                $scope.treeNode = treeNode;
                $scope.$apply();
            },
            beforeRename: function(treeId, treeNode, newName, isCancel) { // 按下ESC可取消编辑
                var backName = treeNode.name;
                var param = angular.copy(treeNode);
                param.name = newName;
                param.open = param.open ? 1 : 0;
                IHttp.post('basedata/updateAnaesKndgbase', param).then(function(data) {
                    data = data.data;
                    if (data.resultCode === '1') {
                    	treeNode.id = data.id;
                    	return;
                    }
                    toastr.error('数据保存失败');
                    if (!treeNode.isAdd) {
                        treeNode.name = backName;
                        ztree.updateNode(treeNode);
                    } else {
                    	var parentNode = treeNode.getParentNode();
                    	ztree.removeNode(treeNode);
                    	parentNode.isParent = true;
                    	ztree.updateNode(parentNode);
                    }
                    
                });
                return true;
            },
            beforeRemove: function(treeId, treeNode) {
                if (!treeNode) return;
                confirm.tips().show('你是否要删除该记录？').then(function() {
                    IHttp.post('basedata/deleteAnaesKndgbaseById', { id: treeNode.id }).then(function(data) {
                        data = data.data;
                        if (data.resultCode === '1') {
                            var parentNode = treeNode.getParentNode();
                            // 删除节点
                            ztree.removeNode(treeNode);
                            // 防止被删除的节点的父节点变为词条
                            parentNode.isParent = true;
                            // 更新节点
                            ztree.updateNode(parentNode);
                        } else {
                            toastr.error('数据删除失败');
                        }
                    });
                });
                return false;
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
                showRemoveBtn: function(treeId, treeNode) {
                    return !treeNode.isParent;
                }
            },
            view: {
                addHoverDom: function(treeId, treeNode) {
                	if (!treeNode.isParent) return;
                    var aObj = $("#" + treeNode.tId + "_a");
                    if ($('#addFolder_' + treeNode.tId).length === 0) {
                    	var addFolder = $("<span class='button add' id='addFolder_" + treeNode.tId + "' title='添加文件夹'></span>");
	                    addFolder.appendTo(aObj).click(function() {
	                    	newFolder(treeNode);
	                    });	
                    }
                    if ($('#addEntry_' + treeNode.tId).length === 0) {
	                    var addEntry = $("<span class='button add' id='addEntry_" + treeNode.tId + "' title='添加词条'></span>");
	                    addEntry.appendTo(aObj).click(function() {
	                    	newEntry(treeNode);
	                    });
	                }
                },
                removeHoverDom: function(treeId, treeNode) {
                    $("#addFolder_" + treeNode.tId).unbind().remove();
                    $("#addEntry_" + treeNode.tId).unbind().remove();
                }
            }
        }
    };

    IHttp.post('basedata/queryAnaesKndgbaseList', {}).then(function(data) {
        data = data.data;
        // folder为1，则转换为文件夹
        data.anaesKndgbaseList.forEach(function(item) {
            if (item.folder === 1) {
                item.isParent = true;
            }
        });
        $scope.option = data.anaesKndgbaseList;
        // 默认选择第一个节点
        $timeout(function() {
            ztree = $scope.ztree;
            // 展开所有节点
            ztree.expandAll(true);
            ztree.selectNode(ztree.getNodeByParam('id', 1));
            $scope.treeNode = ztree.getNodeByParam('id', 1);
        }, 100);
    });

    var newFolder = function(node) {
        var param = {
            name: '新建文件夹',
            pId: node.id,
            folder: 1,
            createUser: currentUser.userName,
            isParent: true,
            content: '',
            beid: currentUser.beid,
            isAdd: true
        }
        // 在第一个位置添加节点
        var folder = ztree.addNodes(node, 0, param, true)[0];
        // 添加后自动编辑
        ztree.editName(folder);
    };

    var newEntry = function(node) {
        var param = {
            name: '新建词条',
            pId: node.id,
            folder: 0,
            createUser: currentUser.userName,
            isParent: false,
            content: '',
            beid: currentUser.beid,
            isAdd: true
        }
        var entry = ztree.addNodes(node, 0, param, true)[0];
        ztree.editName(entry);
    };

    $scope.query = function() {
        if (!$scope.anaesKndgName || $scope.anaesKndgName == '') {
        	$('.select-ztree-color').removeClass('select-ztree-color');
        	return;
        }
        IHttp.post('basedata/queryAnaesKndgbaseList', { name: $scope.anaesKndgName }).then(function(data) {
            data = data.data;
            if (data.resultCode !== '1') {
                return;
            }
            var nodeList = []
            data.anaesKndgbaseList.forEach(function(item) {
                var node = ztree.getNodesByParam('name', item.name);
                node.forEach(function(n) {
	                $('#' + n.tId + '_a').addClass('select-ztree-color');
	                var parentNode = n.getParentNode();
	                if (parentNode && !parentNode.open) {
	                    ztree.expandNode(parentNode);
	                }
                });
            });
        });
    }

    $scope.saveContent = function() {
    	var param = angular.copy($scope.treeNode);
    	param.open = param.open ? 1 : 0; 
        IHttp.post('basedata/updateAnaesKndgbase', param).than(function(data) {
            data = data.data;
        });
    }
}