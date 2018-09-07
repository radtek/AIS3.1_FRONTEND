loadTemp.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$timeout', 'dateFilter', 'items', 'toastr', 'auth', '$q', '$filter'];

module.exports = loadTemp;

function loadTemp($scope, IHttp, $uibModalInstance, $timeout, dateFilter, items, toastr, auth, $q, $filter) {
    $scope.tabIndex = 0;
    $scope.tab = function(i) {
        $scope.tabIndex = i;
    }

    // $scope.edit = function(row) {
    //     if ($scope.tabIndex === 0) {
    //         $scope.medicine = {
    //             name: row.name,
    //             priceId: row.priceId,
    //             medicineId: row.medicineId
    //         }
    //         $scope.mz = angular.copy(row);
    //     } else {
    //         $scope.ioSelected = {
    //             ioDefId: row.ioDefId,
    //             name: row.name,
    //             priceId: row.priceId,
    //             blood: row.blood ? 1 : 0
    //         }
    //         $scope.sy = angular.copy(row);
    //     }
    // }

    $scope.getItem = function(query) {
        if (!query) return;
        var deferred = $q.defer();
        queryItem(query, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }

    function queryItem(query, callback) {
        IHttp.post("basedata/getMedicineList", { pinyin: query, pageNo: 1, pageSize: 200 }).then(function(result) {
            if (result.data.resultCode !== '1') return;
            callback(result.data.resultList);
        });
    }

    // $scope.saveMZ = function() {
    //     $scope.dcl.forEach(function(item) {
    //         item.type = '01';
    //         delete item.medEventId;
    //     });
    //     IHttp.post('operation/batchSaveMedicalevent', $scope.dcl).then(function(rs) {
    //         if (rs.data.resultCode !== '1') return;
    //         var fail = (rs.data.fail instanceof Array) && rs.data.fail.length > 0 ? rs.data.fail.toString() + '保存失败 ' : '';
    //         var success = (rs.data.success instanceof Array) && rs.data.success.length > 0 ? rs.data.success.toString() + '保存成功 ' : '';
    //         if (fail || success) {
    //             toastr.warning(fail + success);
    //         }
    //         if (rs.data.success.length > 0) {
    //             resultList.push({
    //                 url: 'searchMedicaleventGroupByCodeList',
    //                 param: { docId: items.docId, type: items.type },
    //                 key: 'treatMedEvtList',
    //                 canve: 'mz'
    //             });
    //             $scope.cancel = function() {
    //                 $uibModalInstance.close(resultList);
    //             }
    //         }
    //     });
    // }

    // $scope.saveSY = function() {
    //     $scope.list.forEach(function(item) {
    //         delete item.ioeventId;
    //     });
    //     IHttp.post('operation/batchSaveIoevent', $scope.list).then(function(rs) {
    //         if (rs.data.resultCode !== '1') return;
    //         var fail = (rs.data.fail instanceof Array) && rs.data.fail.length > 0 ? rs.data.fail.toString() + '保存失败 ' : '';
    //         var success = (rs.data.success instanceof Array) && rs.data.success.length > 0 ? rs.data.success.toString() + '保存成功 ' : '';
    //         if (fail || success) {
    //             toastr.warning(fail + success);
    //         }
    //         if (rs.data.success.length > 0) {
    //             $scope.cancel = function() {
    //                 resultList.concat([{
    //                     url: 'searchIoeventGroupByDefIdList',
    //                     param: { docId: items.docId, type: "I", subType: items.type },
    //                     key: 'transfusioninIoeventList',
    //                     canve: 'sy'
    //                 }, {
    //                     url: 'searchIoeventGroupByDefIdList',
    //                     param: { docId: items.docId, type: "I", subType: items.type },
    //                     key: 'bloodinIoeventList',
    //                     canve: 'sx'
    //                 }]);
    //                 $uibModalInstance.close(resultList);
    //             }
    //         }
    //     });
    // }

    // $scope.delete = function(index, key) {
    //     $scope[key].splice(index, 1);
    // }

    IHttp.post("basedata/getIoDefinationList", { type: "I", subType: items.type }).then(function(result) {
        $scope.getIoList = result.data.resultList;
    });
    // IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'blood_type' }).then(function(result) {
    //     $scope.bloodList = result.data.resultList;
    // });

    IHttp.post('basedata/queryMedicalTakeReasonList', {}).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.reasonList = rs.data.resultList;
    });
    // IHttp.post('basedata/getMedicalTakeWayList', {}).then(function(rs) {
    //     if (rs.data.resultCode !== '1') return;
    //     $scope.medTakeWayList = rs.data.resultList;
    // });

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    var refurbish = false,
        editItem, gytjArray = [];

    //$scope.finish = true;
    $scope.obs = { replay: true };
    $scope.isTemp = false;

    // 查询用药列表
    initData();

    // 用药理由
    IHttp.post('basedata/queryMedicalTakeReasonList', {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    }).then(function(res) {
        $scope.reasons = res.data.resultList;
    });

    // 麻醉医生
    // $http.post($rootScope.baseUrl + '/operation/queryOperPersonListByDocId', {
    //     docId: items.docId,
    //     role: 'A'
    // }).success(function(rs) {
    //     $scope.mzysArray = rs;
    // });

    $scope.$watch('obs.durable', function(newValue) {
        if (newValue) {
            if (isNaN(new Date($scope.obs.starttime).getTime())) {
                var time = new Date();
                $scope.obs.starttime = $filter('date')(time, 'yyyy-MM-dd HH:mm');
            }

            if (isNaN(new Date($scope.obs.endtime).getTime())) {
                var time = new Date($scope.obs.starttime).getTime() + 1800000;
                $scope.obs.endtime = $filter('date')(time, 'yyyy-MM-dd HH:mm');
            }
            getGytj(1);
        } else {
            getGytj(0);
        }
    });

    $scope.replay = function() {
        clearItem();
    }

    $scope.save = function() {
        if (!$scope.ypmcItem) {
            toastr.warning('请输入药品名称！');
            return;
        }
        if (!$scope.obs.dosage) {
            toastr.warning('请输入剂量！');
            return;
        }
        if ($scope.obs.durable) {
            if (isNaN(new Date($scope.obs.endtime).getTime())) {
                toastr.warning('请输入结束时间！');
                return;
            } else if (new Date($scope.obs.starttime).getTime() >= new Date($scope.obs.endtime).getTime()) {
                toastr.warning('结束时间必须大于开始时间！');
                return;
            }

            if (!$scope.obs.flow) {
                toastr.warning('请输入流速！');
                return;
            }
            if (!$scope.obs.flowUnit) {
                toastr.warning('请输入单位！');
                return;
            }
        }
        $scope.finish = false;

        var baseParam = {
            medEventId: $scope.ypmcItem.medEventId,
            medicineId: $scope.ypmcItem.medicineId,
            priceId: $scope.ypmcItem.priceId,
            durable: $scope.obs.durable ? 1 : 0,
            spec: $scope.ypmcItem.spec,
            firm: $scope.ypmcItem.firm,
            dosage: $scope.obs.dosage,
            thickness: $scope.obs.thickness,
            thicknessUnit: $scope.obs.thicknessUnit,
            flow: $scope.obs.flow,
            flowUnit: $scope.obs.flowUnit,
            medTakeWayId: $scope.obs.medTakeWayId,
            reason: $scope.obs.reason,
            startTime: new Date($filter('date')(new Date($scope.obs.starttime), 'yyyy-MM-dd HH:mm')).getTime(),
            endTime: new Date($filter('date')(new Date($scope.obs.endtime), 'yyyy-MM-dd HH:mm')).getTime(),
            state: items.state,
            type: items.type,
            flag: 2,
            docId: items.id, //items.docId
            pacuObsId: items.id,
            createuser: $scope.obs.userLoginName
        };

        IHttp.post('operation/saveMedicalevent', baseParam).then((rs) => {
            $scope.finish = true;
            if (rs.data.resultCode === '1') {
                refurbish = true;
                initData();
            }
            clearItem();
        });
    }

    // $scope.querySearch = function(query, code) {
    //     var deferred = $q.defer();
    //     if (!query || query === '')
    //         return [];
    //     $http.post($rootScope.baseUrl + '/basedata/getMedicineList', {
    //         pinyin: query,
    //         // type: items.type
    //     }).success(function(rs) {
    //         deferred.resolve(rs);
    //     });
    //     return deferred.promise;
    // }

    // $scope.searchTextChange = function(query, code) {
    //     if (!query) {
    //         clearItem();
    //     }
    // }

    // $scope.selectedItemChange = function(item, code) {
    //     if (code === 'ypmc' && item) {
    //         $scope.ypmcItem = item;

    //         if (!$scope.obs)
    //             $scope.obs = {};

    //         if (!$scope.obs.medTakeWayId)
    //             $scope.obs.medTakeWayId = $scope.gytjArray[0].medTakeWayId;

    //         if (!$scope.obs.reason)
    //             $scope.obs.reason = $scope.reasons[0].medTakeReasonId;

    //         if (!$scope.obs.userLoginName)
    //            // console.log(session.get().user);
    //             $scope.obs.userLoginName =session.get().user.id;//这里传用户名

    //         if (isNaN(new Date($scope.obs.starttime).getTime())) {
    //             var time = new Date();
    //             $scope.obs.starttime = new Date($filter('date')(time, 'yyyy-MM-dd HH:mm'));
    //         }
    //     }
    // }

    $scope.flowUnit = ('l/min 滴/min ml/h μg/kg/min mg/kg/min μg/kg/h mg/kg/h').split(' ').map(function(rs) {
        return {
            unit: rs
        };
    })

    $scope.thicknessUnit = ('摩尔 % mg/ml ng/ml μg/ml').split(' ').map(function(rs) {
        return {
            unit: rs
        };
    })

    $scope.delItem = function(key, id) {
        IHttp.post('operation/deleteMedicalevent', {
            medEventId: id
        }).then(function(rs) {
            if (rs.data.resultCode === "1") {
                $scope.list.splice(key, 1);
                refurbish = true;
            }
            clearItem();
        });
    }

    $scope.editInfo = function(key) {
        editItem = $scope.list[key];
        $scope.ypmcItem = {
            medEventId: editItem.medEventId,
            medicineId: editItem.medicineId,
            name: editItem.name,
            spec: editItem.spec,
            firm: editItem.firm,
            priceId: editItem.priceId,
            dosageUnit: editItem.dosageUnit
        };
        $scope.obs = {
            replay: false,
            thickness: editItem.thickness,
            thicknessUnit: editItem.thicknessUnit,
            dosage: editItem.dosage,
            flow: editItem.flow,
            durable: editItem.durable === '1' ? true : false,
            flowUnit: editItem.flowUnit,
            reason: editItem.reason,
            starttime: dateFilter(new Date(editItem.startTime), 'yyyy-MM-dd HH:mm'),
            endtime: dateFilter(new Date(editItem.endTime), 'yyyy-MM-dd HH:mm'),
            medTakeWayId: editItem.medTakeWayId,
            userLoginName: editItem.userLoginName
        };
    }

    function initData() {
        // 查询用药列表
        IHttp.post('operation/serarchMedicaleventList', {
            docId: items.id, //items.docId
            pacuObsId: items.id
        }).then(function(rs) {
            $scope.list = rs.data.resultList;
            for(var entity of $scope.list) {
                if (entity.startTime)
                    entity.startTime_ = dateFilter(new Date(entity.startTime), 'yyyy-MM-dd HH:mm');
                if (entity.endTime)
                    entity.endTime_ = dateFilter(new Date(entity.endTime), 'yyyy-MM-dd HH:mm');
            }
        });
    }

    function getGytj(durable) {
        // 给药途径
        // $http.post($rootScope.baseUrl + "/basedata/getMedicalTakeWayList", { type: durable }).success(function(rs) {
        //     $scope.gytjArray = rs;
        //     if (!$scope.ypmcItem) return;
        //     var flag = $scope.obs.durable ? 1 : 0;
        //     if (editItem && flag === editItem.durable - 0) {
        //         $scope.obs.medTakeWayId = editItem.medTakeWayId;
        //     } else
        //         $scope.obs.medTakeWayId = $scope.gytjArray[0].medTakeWayId;
        // });
        IHttp.post('basedata/getMedicalTakeWayList', {}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.medTakeWayList = rs.data.resultList;
            $scope.gytjArray = rs.data.resultList;
            if (!$scope.ypmcItem) return;
            var flag = $scope.obs.durable ? 1 : 0;
            if (editItem && flag === editItem.durable - 0) {
                $scope.obs.medTakeWayId = editItem.medTakeWayId;
            } else
                $scope.obs.medTakeWayId = $scope.gytjArray[0].medTakeWayId;
        });
    }

    function clearItem() {
        $scope.ypmcItem = null;
        $scope.ypmc = null;
        $scope.obs = { replay: true };
        editItem = null;
    }

    /////////////////////////////////////////////液体////////////////////////////////////////////////////////////
    // 查询液体列表
    var refurbish2 = false;

    $scope.finish2 = true;
    $scope.obs2 = { replay: true };

    // 查询液体列表
    initData2();

    $scope.replay2 = function() {
        clearItem2();
    }

    $scope.save2 = function() {
        if (!$scope.ytmcItem) {
            toastr.warning('请输入液体名称！');
            return;
        }
        if (!$scope.obs2.dosageAmount) {
            toastr.warning('请输入容量！');
            return;
        }
        //加验证 ng-disabled="form.$invalid || !ytmcItem || !finish2" 
        if ($scope.obs2.endtime != undefined && new Date($scope.obs2.starttime).getTime() >= new Date($scope.obs2.endtime).getTime()) {
            toastr.warning('结束时间必须大于开始时间！');
            return;
        }

        $scope.finish2 = false;
        var baseParams = {
            inEventId: $scope.ytmcItem.ioeventId,
            docId: items.id, //items.docId
            pacuObsId: items.id,
            state: items.state,
            flag: 2,
            spec: $scope.ytmcItem.spec,
            ioDefId: $scope.ytmcItem.ioDefId,
            dosageAmount: $scope.obs2.dosageAmount,
            priceId: $scope.ytmcItem.priceId,
            startTime: new Date($filter('date')(new Date($scope.obs2.starttime), 'yyyy-MM-dd HH:mm')).getTime(),
            endTime: new Date($filter('date')(new Date($scope.obs2.endtime), 'yyyy-MM-dd HH:mm')).getTime(),
            createuser: $scope.obs2.userLoginName,
            passage: $scope.obs2.passage
        };

        IHttp.post('operation/saveIoevent', baseParams).then((rs) => {
            $scope.finish2 = true;
            if (rs.data.resultCode === '1') {
                refurbish2 = true;
                initData2();
                // $mdDialog.hide(refurbish2);
            }
            clearItem2();
        });
    }

    // $scope.querySearch2 = function(query) {
    //     var deferred = $q.defer();

    //     $http.post($rootScope.baseUrl + '/basedata/getIoDefinationList', {
    //         pinyin: query,
    //         type: "I"
    //     }).success(function(rs) {
    //         deferred.resolve(rs);
    //     });
    //     return deferred.promise;
    // }

    // $scope.searchTextChange2 = function(query) {
    //     if(!query){
    //         clearItem2();
    //     }
    // }

    // $scope.selectedItemChange2 = function(item) {
    //     if (item) {
    //         $scope.ytmcItem = item;

    //         if(!$scope.obs2) $scope.obs2 = {};

    //         if(!$scope.obs2.userLoginName)
    //             //console.log(session.get().user);
    //             $scope.obs2.userLoginName =session.get().user.id;

    //         if (isNaN(new Date($scope.obs2.starttime).getTime())) {
    //             var time = new Date();
    //             $scope.obs2.starttime = new Date($filter('date')(time, 'yyyy-MM-dd HH:mm'));
    //         }

    //         if (isNaN(new Date($scope.obs2.endtime).getTime())) {
    //             var time = new Date($scope.obs2.starttime).getTime() + 1800000;
    //             $scope.obs2.endtime = new Date($filter('date')(time, 'yyyy-MM-dd HH:mm'));
    //         }
    //     }
    // }

    $scope.delItem2 = function(key, id) {
        IHttp.post('operation/deleteIoevent', {
            inEventId: id
        }).then(function(rs) {
            if (rs.data.resultCode === "1") {
                $scope.list2.splice(key, 1);
                refurbish2 = true;
            }
            clearItem2();
        });
    }

    $scope.editInfo2 = function(key) {
        var item = $scope.list2[key];
        $scope.ytmcItem = {
            ioeventId: item.inEventId,
            name: item.name,
            spec: item.spec,
            ioDefId: item.ioDefId
        };
        $scope.obs2 = {
            replay: false,
            dosageAmount: item.dosageAmount,
            starttime: dateFilter(new Date(item.startTime), 'yyyy-MM-dd HH:mm'),
            endtime: dateFilter(new Date(item.endTime), 'yyyy-MM-dd HH:mm'),
            userLoginName: item.userLoginName,
            passage: item.passage
        };
    }

    function initData2() {
        IHttp.post('operation/searchIoeventList', {
            docId: items.id, //items.docId
            pacuObsId: items.id,
            type: 'I'
        }).then(function(rs) {
            $scope.list2 = rs.data.resultList;
            for(var entity of $scope.list2) {
                if (entity.startTime)
                    entity.startTime_ = dateFilter(new Date(entity.startTime), 'yyyy-MM-dd HH:mm');
                if (entity.endTime)
                    entity.endTime_ = dateFilter(new Date(entity.endTime), 'yyyy-MM-dd HH:mm');
            }
        });
    }

    function clearItem2() {
        $scope.ytmcItem = null;
        $scope.ytmc = null;
        $scope.obs2 = { replay: true };
    }
}
