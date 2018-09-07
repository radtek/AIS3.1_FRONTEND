remarkInfo.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', '$filter', '$timeout', '$q', 'auth', 'toastr'];

module.exports = remarkInfo;

function remarkInfo($scope, IHttp, $uibModalInstance, items, $filter, $timeout, $q, auth, toastr) {
    /*
        查询模板信息其他事件模板信息：basedata/queryOthereventTempList
        参数：{"sort":"","orderBy":"","filters":[],"beid":""}

        新增模板接口：basedata/saveOthereventTemp
        参数：{"createUser":"","tmpName":"","type":"","remark":"","beid":""}

        删除其他事件模板接口：basedata/delOthereventTmp
        参数：{"id":"","createUser",""}
    */
    var promise,
        user = auth.loginUser(),
        params = {
            sort: '',
            orderBy: '',
            filters: [],
            state: '',
            createUser: ''
        }

    initData();

    $scope.getTitleList = function(query) {
        params.filters = [{ tempName: query }];
        var deferred = $q.defer();
        IHttp.post('basedata/queryOthereventTempList', params).then((rs) => {
            deferred.resolve(rs.data.resultList);
        })
        return deferred.promise;
    }

    $scope.save = function() {
        if (!$scope.evItem.tmpName) {
            toastr.warning("请输入事件名称");
            return;
        }
        $scope.param.startTime = new Date($scope.param.startTime_);
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            $scope.param.title = $scope.evItem.tmpName;
            IHttp.post("operation/saveOtherevent", $scope.param).then(function(result) {
                if (result.data.resultCode !== '1') return;
                initData();
                $scope.cancel = function() {
                    $uibModalInstance.close();
                };
            });
        }, 500);
    }

    $scope.saveAsTpl = function(row) {
        var flag = true;
        $scope.param.startTime = new Date($scope.param.startTime_);
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            params.filters = [{ tempName: row.title }];
            IHttp.post("basedata/queryOthereventTempList", params).then(function(result) {
                if (result.data.resultCode == 1) {
                    for (var i = 0; i < result.data.resultList.length; i++) {
                        if (row.title == result.data.resultList[i].tmpName) {
                            toastr.warning("该模板已存在！");
                            flag = false;
                            return;
                        }
                    }
                }
                if (flag) {
                    IHttp.post("basedata/saveOthereventTemp", { "createUser": user.userName, "tmpName": row.title, "type": 1, "remark": "", "beid": user.beid }).then(function(result) {
                        if (result.data.resultCode != 1) return;
                        toastr.info(result.data.resultMessage);
                        initData();
                        $scope.cancel = function() {
                            $uibModalInstance.close();
                        };
                    });
                }
            });
        }, 500);
    }

    $scope.edit = function(row) {
        row.startTime_ = $filter('date')(row.startTime, 'yyyy-MM-dd HH:mm');
        $scope.evItem = { eventDefId: row.eventDefId, tmpName: row.title };
        $scope.param = angular.copy(row);
    }

    $scope.add = initParam;

    $scope.delete = function(id) {
        IHttp.post("operation/deleteOtherevent", { otherEventId: id }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            initData();
            $scope.cancel = function() {
                $uibModalInstance.close();
            };
        });
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    function initData() {
        initParam();
        IHttp.post("operation/searchOthereventList", { docId: items.docId }).then(function(result) {
            $scope.list = result.data.resultList;
        });
    }

    function initParam() {
        $scope.evItem = { eventDefId: '', tmpName: '' };
        $scope.param = {
            startTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm'),
            docId: items.docId,
            othereventId: '',
            docType: 1,
            isTpl: 0
        };
    }
}