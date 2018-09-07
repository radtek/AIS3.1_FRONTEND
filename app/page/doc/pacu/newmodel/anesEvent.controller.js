anesEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$q', '$timeout', 'items', '$filter', 'toastr', 'auth', 'anesRecordInter'];

module.exports = anesEvent;

function anesEvent($scope, IHttp, $uibModalInstance, $q, $timeout, items, $filter, toastr, auth, anesRecordInter) {
    var promise,
        returnParams = {},
        url,
        param,
        primaryId = '';
    $scope.loginUser = auth.loginUser();
    // $scope.list =items.list;
    initParam();
    $scope.saved = true;
    $scope.btnActive = false;
    $scope.getAnaesEventList = function(query) {
        var deferred = $q.defer();
        queryAnaesEventList(query, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }

    function queryAnaesEventList(query, callback) {
        IHttp.post("basedata/selectALlAnaesEvent", { filters: [{ field: "pinyin", value: query }, { field: "enable", value: "1" }], docType: 2 }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            callback(rs.data.resultList);
        });
    }

    function initParam() {
        $scope.param = {
            anaEventId: '',
            docType: 2,
            docId: items.docId,
            code: '',
            occurTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm')
        }
        primaryId = '';
        $scope.anaesEvent = {
            id: '',
            eventValue: '',
            name: '',
            pinyin: '',
            enable: '',
            beid: ''
        }
    }
    anesRecordInter.searchAllEventListPlus("", { docId: items.docId, medEventNum: 0, infusionNum: 0, egressNum: 0, docType: 2 }).then(function(rs) {
        $scope.list = [];
        for (var item of rs.data.anaesevent) {
            if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                returnParams.list = $scope.list.push(item);
            }
        }

    })
    url = 'basedata/selectALlAnaesEvent';
    param = { filters: [{ field: "enable", value: "1" }], docType: 2 }

    IHttp.post(url, param).then(function(rs) {
        if (rs.data.resultCode != '1') return;
        $scope.evList = rs.data.resultList;
    });

    $scope.save = function() {
        $scope.saved = false;
        $scope.btnActive = true;
        var addOutTime = false,
            inRoomTime = 0,
            outRoomTime = 0,
            inputTime = new Date($filter('date')(new Date($scope.param.occurTime_), 'yyyy-MM-dd HH:mm')).getTime(),
            startOper = false,
            zgD = false; //置管    
        $scope.param.anaEventId = primaryId;
        $scope.param.code = $scope.anaesEvent.eventValue;
        if ($scope.param.code == 9) { //处室
            for (var data of $scope.list) {
                if (data.code == 9) {
                    addOutTime = true;
                    outRoomTime = data.occurTime;
                }
            }
            if (!addOutTime) {
                toastr.warning("还未出室，不能新增该事件");
                $scope.saved = true;
                $scope.btnActive = false;
                return;
            }
            if (Math.abs(inputTime - outRoomTime) > 86400000) {
                toastr.warning('出室时间的修改不能大于24小时');
                $scope.saved = true;
                $scope.btnActive = false;
                return;
            }
            var params = {
                regOptId: items.regOptId,
                docType: 2,
                anaesevent: {
                    anaEventId: $scope.param.anaEventId,
                    docId: items.docId,
                    state: items.state,
                    occurTime: new Date($scope.param.occurTime_).getTime(),
                    code: $scope.param.code
                }
            }
            IHttp.post("operCtl/updateOuterTime", params).then(function(rs) {
                if (rs.data.resultCode == '1') {
                    $scope.list = [];
                    for (var item of rs.data.resultList) {
                        if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            returnParams.list = $scope.list.push(item);
                        }
                    }
                    returnParams.outTime = new Date($scope.param.occurTime_).getTime();
                }
                $scope.saved = true;
                $scope.finish = true;
                $scope.btnActive = false;
                initParam();
                $scope.cancel = function() {
                    $uibModalInstance.close(returnParams);
                }
            });
        } else {
            $scope.param.occurTime = new Date($scope.param.occurTime_).getTime();
            var nowTime = $scope.loginUser.beCode === 'yxyy' ? new Date().getTime() + 7200000 : new Date().getTime();
            if ($scope.param.occurTime > nowTime) {
                if ($scope.loginUser.beCode === 'yxyy')
                    toastr.warning('选择的时间不能远超当前时间');
                else
                    toastr.warning('选择的时间不能大于当前时间');
                $scope.saved = true;
                $scope.btnActive = false;
                return;
            }
            for (anaesEvent of $scope.list) {
                if (anaesEvent.code == 4)
                    startOper = true; //手术开始
                if (anaesEvent.code == 3)
                    zgD = true;
                if ($scope.param.code == 1 && anaesEvent.code != 1) {
                    if ($scope.param.occurTime > anaesEvent.occurTime) {
                        toastr.warning('入室时间不能大于其他麻醉事件时间');
                        $scope.saved = true;
                        $scope.btnActive = false;
                        return;
                    }
                }
                if (anaesEvent.code == 1)
                    inRoomTime = anaesEvent.occurTime;
            }
            if ($scope.param.code == 5 && !startOper) {
                toastr.warning('手术开始时间不能为空');
                $scope.saved = true;
                $scope.btnActive = false;
                return;
            } else if ($scope.param.code == 6 && !zgD) {
                toastr.warning('请先进行置管');
                $scope.saved = true;
                $scope.btnActive = false;
                return;
            } else if ($scope.param.code == 1) {
                if (Math.abs(inRoomTime - inputTime) > 86400000) {
                    toastr.warning('入室时间的修改不能大于24小时');
                    $scope.saved = true;
                    $scope.btnActive = false;
                    return;
                }
            }
            if ($scope.param.code == 1 && $scope.param.anaEventId) {
                items.callback($scope.param.occurTime, $scope.param.anaEventId, function(rs) {
                    $scope.list = [];
                    for (var item of rs.data.resultList) {
                        if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            returnParams.list = $scope.list.push(item);
                        }
                    }
                    initParam();
                    $scope.btnActive = false;
                });
                $scope.cancel = function() {
                    $uibModalInstance.dismiss();
                }
                return;
            }
            if (promise) {
                $timeout.cancel(promise);
            }
            promise = $timeout(function() {
                IHttp.post('operation/saveAnaesevent', $scope.param).then(function(rs) {
                    $scope.btnActive = false;
                    $scope.saved = true;
                    if (rs.data.resultCode != '1') return;
                    $scope.list = [];
                    for (var item of rs.data.resultList) {
                        if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            returnParams.list = $scope.list.push(item);
                        }
                    }

                    initParam();
                    $scope.cancel = function() {
                        $uibModalInstance.close(returnParams);
                    }
                });
            }, 500);
        }
    }

    $scope.edit = function(row) {
        for (var item of $scope.evList) {
            if (item.eventValue == row.code) {
                $scope.anaesEvent = item;
            }
        }
        primaryId = row.anaEventId;
        $scope.saved = true;
        row.code = row.code + '';
        row.occurTime_ = $filter('date')(row.occurTime, 'yyyy-MM-dd HH:mm');
        $scope.param = angular.copy(row);
    }

    $scope.add = initParam;

    $scope.delete = function(row) {
        if (row.code == 1 || row.code == 9) {
            toastr.error((row.code == 1 ? '入室' : '出室') + '事件不能删除');
        } else {
            IHttp.post('operation/deleteByCodeAndDocId', { anaEventId: row.anaEventId, code: row.code, docId: items.docId }).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                $scope.list = [];
                for (var item of rs.data.resultList) {
                    if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                        returnParams.list = $scope.list.push(item);
                    }
                }
                initParam();
                $scope.cancel = function() {
                    $uibModalInstance.close(returnParams);
                }
            });
        }
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}