module.exports = ModalCtrl;

ModalCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'select', '$q'];

function ModalCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, select, $q) {
    var isModify = false,
        opt = $scope.opt;
    $scope.list = [];
    $scope.obj = {};

    // 选择模板
    if (opt.jsonName === 'selt_tpl') {
        getSciTempList();

    } else if (opt.jsonName === 'com_tpl') {
        $scope.obj.array = opt.obj;

    } else if (opt.jsonName != 'save_tpl') {
        $scope.obj = angular.copy(opt.obj[opt.jsonName]);
        opt.tit = '设置' + $scope.obj.remark;
    }

    if (opt.jsonName === 'age') {
        $scope.obj.year1 = $scope.obj.year2 = $scope.obj.month1 = $scope.obj.month2 = $scope.obj.day1 = $scope.obj.day2 = '';
        if (typeof($scope.obj.bt1) === 'number') {
            $scope.obj.year1 = parseInt($scope.obj.bt1 / 365);
            $scope.obj.month1 = parseInt($scope.obj.bt1 % 365 / 30);
            $scope.obj.day1 = parseInt($scope.obj.bt1 % 365 % 30);
        }
        if (typeof($scope.obj.bt2) === 'number') {
            $scope.obj.year2 = parseInt($scope.obj.bt2 / 365);
            $scope.obj.month2 = parseInt($scope.obj.bt2 % 365 / 30);
            $scope.obj.day2 = parseInt($scope.obj.bt2 % 365 % 30);
        }
    } else if (opt.jsonName === 'anaesEvent')
        anaesEvList();

    else if (opt.jsonName === 'ioEvent')
        getIOList('I');

    else if (opt.jsonName === 'egressEvent')
        getIOList('O');

    // else if (opt.jsonName === 'instrument')
        // getInstrumentList();

    else if (opt.jsonName === 'lifeSign')
        getLifeSignList();

    else if (opt.jsonName === 'optBody') {
        $scope.list = $scope.obj.array;
        getSysCode('optBody');
        $scope.$watch('list', function(n) {
            $scope.opt_ck = false;
            for (var a in n) {
                if (n[a].checked) {
                    $scope.opt_ck = true;
                }
            }
        }, true);
    } else if (opt.jsonName === 'asaLevel')
        getSysCode('asaLevel');
    else if (opt.jsonName == 'designedOptCode' || opt.jsonName === 'implOper') {
        select.getOperdefList({}).then((rs) => {
            $scope.queryList = rs;
        });
    }else if (opt.jsonName == 'diagnosisCode') {
        select.getDiagnosedefList({}).then((rs) => {
            $scope.diagnosedefList = rs;
        });
    }else if (opt.jsonName == 'designedAnaesMethodCode' || opt.jsonName === 'implAnaesMethod') {
        select.getAnaesMethodList().then((rs) => {
            $scope.anaesMethodList = rs.data.resultList;
        });
    }else if (opt.jsonName == 'medEvent') {
        IHttp.post("basedata/getMedicineList", {}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            $scope.medEventList = rs.data.resultList;
        });
    }

    // 添加到Table List
    $scope.add = function() {
        // if (!$scope.obj.bt1)
        //     return;
        var curItem = {
            field: opt.fieldName,
            max: $scope.obj.bt2,
            min: $scope.obj.bt1,
            name: $scope.obj.sel.name,
            value: ''
        };
        if (opt.jsonName === 'designedOptCode' || opt.jsonName === 'implOper')
            curItem.value = $scope.obj.sel.operDefId;

        else if (opt.jsonName === 'diagnosisCode' || opt.jsonName === 'implDiag')
            curItem.value = $scope.obj.sel.diagDefId;

        else if (opt.jsonName === 'designedAnaesMethodCode' || opt.jsonName === 'implAnaesMethod')
            curItem.value = $scope.obj.sel.anaMedId;

        else if (opt.jsonName === 'anaesEvent') {
            curItem.name = $scope.obj.sel.codeName;
            curItem.value = $scope.obj.sel.codeValue;

        } else if (opt.jsonName === 'medEvent')
            curItem.value = $scope.obj.sel.medicineId;

        else if (opt.jsonName === 'ioEvent' || opt.jsonName === 'egressEvent')
            curItem.value = $scope.obj.sel.ioDefId;

        else if (opt.jsonName === 'instrument')
            curItem.value = $scope.obj.sel.instrumentId;

        else if (opt.jsonName === 'lifeSign') {
            curItem.name = $scope.obj.sel.eventDesc;
            curItem.value = $scope.obj.sel.observeId;
        }

        $scope.obj.array.push(curItem);
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.obj.bt1 = '';
        $scope.obj.bt2 = '';
    }

    // 对比项
    $scope.comp = function() {
        var id = [];
        for (var a in $scope.obj.array) {
            id.push($scope.obj.array[a].regOptId);
        }
        $uibModalInstance.close();
        $rootScope.$state.go('contrast', { id: id });
    }

    // 删除
    $scope.delItem = function(key) {
        $scope.obj.array.splice(key, 1);
        isModify = true;
    }

    $scope.itemChange = function(item) {
        var arr = $filter('filter')($scope.obj.array, function(v) {
            return item === v.name;
        });
        if (arr.length > 0) {
            $scope.selectedItem = null;
            $scope.searchText = null;
        }
    }

    // 麻醉事件
    function anaesEvList() {
        IHttp.post('/basedata/searchSysCodeByGroupId', {
            groupId: "anaesEventType"
        }).then(function(rs) {
            if (rs.data.resultCode != '1'){
                toastr.info(rs.resultMessage);
                return;
            }
            $scope.list = rs.data.resultList;
        });
    }

    // 出入量 'O'代表出量，'I'代表入量
    function getIOList(type) {
        IHttp.post('/basedata/getIoDefinationList', {
            type: type
        }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.list = rs.data.resultList;
        });
    }

    // 出入量 'O'代表出量，'I'代表入量
    // function getInstrumentList(type) {
    //     IHttp.post('/basedata/searchInstrument', {}).then(function(rs) {
    //         if (rs.data.resultCode != '1')
    //             return;
    //         $scope.list = rs.data.resultList;
    //     });
    // }

    $scope.getInstrumentList = function(query) {
        var deferred = $q.defer(),
        param = {pinyin: query, pageNo: 1, pageSize: 200};
        IHttp.post('/basedata/searchInstrument', param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve([{ name: query }]);
        })
        return deferred.promise;
    }

    // 体征
    function getLifeSignList() {
        IHttp.post('/sci/getLifeSignList', {}).then(function(rs) {
            if (rs.data.resultCode != '1') {
                toastr.info(rs.data.resultMessage);
                return;
            }
            $scope.list = rs.data.lifeSignList;
        });
    }

    // asa评分【asaLevel】、手术体位【optBody】
    function getSysCode(type) {
        IHttp.post("/basedata/searchSysCodeByGroupId", { groupId: type }).then(function(rs) {
            if (rs.data.resultCode != '1') {
                toastr.info(rs.data.resultMessage);
                return;
            }
            if (type === 'optBody') {
                for (var a in $scope.list) {
                    var aItem = $scope.list[a];
                    for (var b in rs.sysCode) {
                        var bItem = rs.data.sysCode[b];
                        if (aItem.name === bItem.codeName) {
                            bItem.checked = true;
                        }
                    }
                }
            }
            $scope.list = rs.data.resultList;
        });
    }

    // 取消
    $scope.cancel = function() {
        if (isModify)
            $uibModalInstance.close(opt.obj);
        else
            $uibModalInstance.dismiss();
    };

    // 保存
    $scope.ok = function() {
        // 保存模板到数据库
        if (opt.jsonName === 'save_tpl') {
            IHttp.post('sci/handleSciTemp', $scope.opt.obj).then(function(rs) {
                if (rs.data.resultCode != '1')
                    return;
                opt.obj.id = rs.data.id;
                toastr.info('当前模板已保存成功！');
                $uibModalInstance.close();
            });
        } else {
            // 本地缓存
            if ($scope.obj.type === 'andor') {
                if (opt.jsonName != 'optBody' && $scope.obj.array.length <= 0) {
                    toastr.info('先添加项，然后保存');
                    return;
                } else {
                    opt.obj[opt.jsonName].array = [];
                    if (opt.jsonName === 'optBody') {
                        for (var a in $scope.list) {
                            var aItem = $scope.list[a];
                            if (aItem.checked) {
                                opt.obj[opt.jsonName].array.push({
                                    field: opt.fieldName,
                                    value: aItem.codeValue,
                                    name: aItem.codeName,
                                    max: '',
                                    min: ''
                                });
                            }
                        }
                    } else
                        opt.obj[opt.jsonName].array = $scope.obj.array;
                    opt.obj[opt.jsonName].andor = $scope.obj.andor;
                }
            } else {
                if (opt.jsonName === 'age') {
                    opt.obj[opt.jsonName].bt1 = Number($scope.obj.year1) * 365 + Number($scope.obj.month1) * 30 + Number($scope.obj.day1);
                    opt.obj[opt.jsonName].bt2 = Number($scope.obj.year2) * 365 + Number($scope.obj.month2) * 30 + Number($scope.obj.day2);
                    if (opt.obj[opt.jsonName].bt2 === 0)
                        opt.obj[opt.jsonName].bt2 = 200 * 365;
                } else if (opt.jsonName === 'operaDate') {
                    opt.obj[opt.jsonName].bt1 = $scope.obj.bt1;
                    opt.obj[opt.jsonName].bt2 = $scope.obj.bt2;
                } else
                    opt.obj[opt.jsonName] = $scope.obj;
            }
            $uibModalInstance.close(opt.obj);
        }
    };

    // 拼音搜索
    $scope.selectedItem = null;
    $scope.searchText = null;
    // $scope.querySearch = querySearch();

    function querySearch() {
        var api;
        // 拟施、实施手术方式
        if (opt.jsonName === 'designedOptCode' || opt.jsonName === 'implOper')
            api = operdef;
        // 拟施、实施诊断
        else if (opt.jsonName === 'diagnosisCode' || opt.jsonName === 'implDiag')
            api = diagnosis;
        // 拟施、实施麻醉方法
        else if (opt.jsonName === 'designedAnaesMethodCode' || opt.jsonName === 'implAnaesMethod')
            api = anaesMethod;
        // 用药事件
        else if (opt.jsonName === 'medEvent')
            api = medication;
        // 器械
        else if (opt.jsonName === 'instrument')
            api = instrsuit.get;

        return function(query) {
            var deferred = $q.defer();
            if (query === '') {
                return [];
            }
            api(query).then(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }

    // 选择模板
    function getSciTempList() {
        IHttp.post('sci/getSciTempList', {}).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.obj.array = rs.data.tempList;
        })
    }

    // 删除模板
    $scope.delTpl = function(key, item) {
        if (item.createUser != opt.uid) {
            toastr.info('只能删除自己创建的模板！');
            return;
        }
        IHttp.post('sci/delSciTemp', { sciId: item.id, userId: item.createUser }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.obj.array.splice(key, 1);
            toastr.info(rs.data.resultMessage);
        });
    }

    // 选择模板 》查看模板
    $scope.toList = function(item) {
        $uibModalInstance.close(item.tmpJson);
    }
}
