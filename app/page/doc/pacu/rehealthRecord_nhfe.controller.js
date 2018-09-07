RehealthRecordCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$q', '$filter', '$uibModal', 'select', 'toastr', 'auth', '$timeout'];

module.exports = RehealthRecordCtrl;

function RehealthRecordCtrl($rootScope, $scope, IHttp, $q, $filter, $uibModal, select, toastr, auth, $timeout) {
    let vm = this,
        id = $rootScope.$stateParams.pacuId,
        regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();
    let beCode = $scope.docInfo.beCode;
    $scope.pageS = [1];
    $scope.printDone = true;
    vm.outterList = [];
    vm.valueList1 = [{code: '', label: ''}, {code: '0', label: 0}, {code: '1', label: 1}];
    vm.valueList2 = [{code: '', label: ''}, {code: '1', label: 1}, {code: '2', label: 2}];
    vm.valueList3 = [{code: '', label: ''}, {code: '0', label: 0}, {code: '1', label: 1}, {code: '2', label: 2}];
    vm.valueList4 = [{code: '', label: ''}, {code: '1', label: 1}, {code: '2', label: 2}, {code: '3', label: 3}, {code: '4', label: 4}];
    vm.valueLista = [{code: '', label: ''}, {code: 'a', label: 'a'}, {code: 'b', label: 'b'}, {code: 'c', label: 'c'}, {code: 'd', label: 'd'}, {code: 'e', label: 'e'}];
    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesthetistList = rs.data.userItem;
    });

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    })
    //随身管道
    $scope.portablePipe_ = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    //随身物品
    $scope.portableRes_ = ['0', '0', '0', '0', '0'];
    $timeout(function (){
        $scope.$watch('vm.rSheet.anaesPacuRec.docSign', function(n, o) {
            $scope.hasSig1 = false;
            $scope.eSignatureAnesthetist = [];
            angular.forEach($scope.anaesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig1 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true);
        $scope.$watch('vm.rSheet.anaesPacuRec.nurseSign', function(n, o) {
            $scope.hasSig2 = false;
            $scope.eSignatureNurseList = [];
            angular.forEach($scope.nurseList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig2 = item.picPath ? true : false;
                    $scope.eSignatureNurseList.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true);
    }, 1000);

    //修改随身物品;
    $scope.changeResAndPipe = function (){
        var param = angular.copy(vm.rSheet.anaesPacuRec);
        param = appendResAndPipe(param, '');
        IHttp.post("document/saveAnaesPacuRec", param).then((rs) => {});
    }

    function appendResAndPipe(param, leaveTo) {
        param.leaveTo = leaveTo;
        param.enterTime = new Date(vm.rSheet.anaesPacuRec.enterTime).getTime();
        param.exitTime = new Date(vm.rSheet.anaesPacuRec.exitTime).getTime();
        param.portableRes = portableResStr();
        param.portableResList = $scope.portableRes_;
        param.portablePipe = portablePipeStr();
        param.portablePipeList = $scope.portablePipe_;
        return param;
    }
    //随身物品
    function portableResStr() {
        var portableResStr = "";
        for (var item in $scope.portableRes_) {
            if ($scope.portableRes_[item] == "")
                $scope.portableRes_[item] = "0";
            if (portableResStr === "") {
                portableResStr = $scope.portableRes_[item];
            } else {
                portableResStr += "," + $scope.portableRes_[item];
            }
        }
        return portableResStr;
    }
    //随身管道
    function portablePipeStr() {
        var portablePipeStr = "";
        for (var item in $scope.portablePipe_) {
            if ($scope.portablePipe_[item] == "")
                $scope.portablePipe_[item] = "0";
            if (portablePipeStr === "") {
                portablePipeStr = $scope.portablePipe_[item];
            } else {
                portablePipeStr += "," + $scope.portablePipe_[item];
            }
        }
        return portablePipeStr;
    }

    //获取患者复苏室观察记录数据selectByPacuRecId
    selectByPacuRecId();

    function selectByPacuRecId() {
        $scope.verify = false;
        IHttp.post('document/selectByPacuRecId', { filters: [{ field: 'regOptId', value: regOptId }, { field: 'inTime', value: new Date().getTime() }] }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            vm.rSheet = rs.data;

            if(vm.rSheet.anaesPacuRec.enterTime)
                vm.rSheet.anaesPacuRec.enterTime = $filter('date')(vm.rSheet.anaesPacuRec.enterTime, 'yyyy-MM-dd HH:mm');
            if (vm.rSheet.anaesPacuRec.exitTime)
                vm.rSheet.anaesPacuRec.exitTime = $filter('date')(vm.rSheet.anaesPacuRec.exitTime, 'yyyy-MM-dd HH:mm');

            regOptId = vm.rSheet.anaesPacuRec.regOptId;
            id = vm.rSheet.anaesPacuRec.id;
            vm.pacuRecList = vm.rSheet.resultList;
            //随身管道
            var portablePipeCode = vm.rSheet.anaesPacuRec.portablePipe.split(",");
            for (var item in portablePipeCode) {
                $scope.portablePipe_[item] = portablePipeCode[item];
            }
            //随身物品
            var portableResCode = vm.rSheet.anaesPacuRec.portableRes.split(",");
            for (var item in portableResCode) {
                $scope.portableRes_[item] = portableResCode[item];
            }
            for (var i = 0; i < vm.pacuRecList.length; i++) {
                vm.pacuRecList[i].recordTime = $filter('date')(vm.pacuRecList[i].recordTime, 'yyyy-MM-dd HH:mm');
                vm.pacuRecList[i].medNameFlow = getmedNameFlow(vm.pacuRecList[i].medList, false);
                vm.pacuRecList[i].medNameFlow += getmedNameFlow(vm.pacuRecList[i].ioList, true);
                vm.pacuRecList[i].consLev = vm.pacuRecList[i].consLev + '';
                vm.pacuRecList[i].extubation = vm.pacuRecList[i].extubation + '';
                vm.pacuRecList[i].airwayPatency = vm.pacuRecList[i].airwayPatency + '';
                vm.pacuRecList[i].physicalActivity = vm.pacuRecList[i].physicalActivity + '';
                vm.pacuRecList[i].fluidInfusion = vm.pacuRecList[i].fluidInfusion + '';
                vm.pacuRecList[i].catheter = vm.pacuRecList[i].catheter + '';
                vm.pacuRecList[i].cryingDegree = vm.pacuRecList[i].cryingDegree + '';
                vm.pacuRecList[i].nauseaVomit = vm.pacuRecList[i].nauseaVomit + '';
                vm.pacuRecList[i].shivering = vm.pacuRecList[i].shivering + '';
                vm.pacuRecList[i].oxInhalMeth = vm.pacuRecList[i].oxInhalMeth + '';
                vm.pacuRecList[i].painScore = vm.pacuRecList[i].painScore + '';
            }
            vm.pacuRecList.push({ recordTime: '' });
            if (vm.rSheet.anaesPacuRec.leaveTo) {
                $scope.finish = 'ok';
                $scope.processState = 'END';
                $scope.$emit('processState', 'END');
            }
            if (!vm.rSheet.anaesPacuRec.bedId && vm.rSheet.anaesPacuRec.processState === 'NO_END')
                $scope.finish = 'ok';
            if (($scope.docInfo.module === 'ctrlcent' && vm.rSheet.anaesPacuRec.processState === 'NO_END') || ($scope.docInfo.roleType !== 'ANAES_DIRECTOR' && vm.rSheet.anaesPacuRec.processState === 'END')) {
                $scope.finish = 'ok';
                $scope.readonly = true;
            }
        });
    }

    $scope.getTemplateList = function(query) {
        return getTemplateList_(query);
    }

    $scope.toOperRoom = function() {
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('./modal/againStartOper.html'),
            controller: require('./modal/againStartOper.controller.js'),
        }).result.then(function(rs){
            toastr.info("已转入到手术室！")
        });
    }

    function getTemplateList_(query) {
        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        let params = {
            timestamp: $scope.date,
            username: "",
            password: "",
            pageNo: 1,
            pageSize: 200,
            createUser: $scope.docInfo.userName,
            sort: '',
            orderBy: '',
            filters: []
        };
        var deferred = $q.defer();
        if (query === '') {
            return [];
        }else{
            params.filters=[{field: "pinyin",value: query},{field: "tempType",value: 1}];
        }
        IHttp.post('basedata/queryPacuLiquidTempList', params).then((rs) => {
            if (rs.data.pacuLiquidTempList.length > 0)
                deferred.resolve(rs.data.pacuLiquidTempList);
            else
                deferred.resolve([]);
        })
        return deferred.promise;
    }

    $scope.seeTemp = function(event){
        let scope = $rootScope.$new();
        scope.tempType = 1;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./modal/addLiquidTemp.html'),
            controller: require('./modal/addLiquidTemp.controller.js'),
            controllerAs: 'vm',
            backdrop: 'static',
            resolve: { items: { tempType: 1 } }
        }).result.then(function() {
            
        });
    }

    vm.saveTemp = function(item){
        if(!item.obserRec){
            toastr.error("对不起，模板内容不能为空。");
            return;
        }
        let liquidTemp = {
            "tempName": "",      
            "tempContent": item.obserRec,
            "createUser": $scope.docInfo.userName,
            "createName": $scope.docInfo.name,
            "type": 1,
            "remark": "",
            "tempType": 1,
            "createTime": new Date().getTime()
        };
        item.patopt_open = false;
        IHttp.post('basedata/updateLiquidTemp', liquidTemp).then(function(rs) {
            var data = rs.data; 
            if (data.resultCode === '1')
                toastr.success(data.resultMessage);
        });
    }

    vm.setObserRecVal = function(item, obj) {
        item.obserRec = obj.tempContent;
    }

    vm.showOtherinfo = function(item){
        item.patopt_open = true;
    }

    vm.focusMe = function(item){
        item.patopt_open=false;
    }

    function constructOutterList(list) {
        vm.outterList = [];
        let copyList = angular.copy(list);

        if (angular.isArray(copyList)) {
            while (copyList.length > 10) {
                vm.outterList.push(copyList.splice(0, 10));
            }
            vm.outterList.push(copyList);
        }
    }

    //根据药品list得到显示字符串
    function getmedNameFlow(meditem, isIo) {
        var medstr = "";
        for (var i = 0; i < meditem.length; i++) {
            medstr += meditem[i].name + (meditem[i].dosage || meditem[i].dosageAmount) + meditem[i].dosageUnit + (isIo && meditem[i].passage ? ('(' + meditem[i].passage + ')') : '');
            if (i == meditem.length - 1) {
                medstr += "。";
            } else {
                medstr += "；";
            }
        }
        return medstr;
    }

    vm.setaddNode = function(index, item) {
        if (hasSameTime(item)) {
            toastr.warning('已经存在相同时间的数据，请直接修改。');
            vm.pacuRecList.splice(index, 1, { recordTime: '' });
            return;
        }

        if (vm.rSheet && vm.rSheet.anaesPacuRec && item.recordTime && new Date(item.recordTime) < vm.rSheet.anaesPacuRec.enterTime) {
            toastr.warning('选择的时间应在入室时间之后。');
            vm.pacuRecList.splice(index, 1, { recordTime: '' });
            return;
        }

        if (item.recordTime) {
            let postData = angular.copy(item);
            postData.recordTime = new Date(item.recordTime);
            postData.pacuRecId = id;
            //保存数据
            IHttp.post("document/addPacuAnaesObserve", postData).then((rs) => {
                if (rs.data.resultCode === '1') {
                    if (!item.id) {
                        vm.pacuRecList.push({ recordTime: '' });
                    }
                    vm.pacuRecList[index] = rs.data.pacuObsData;
                    vm.pacuRecList[index].recordTime = $filter('date')(vm.pacuRecList[index].recordTime, 'yyyy-MM-dd HH:mm');
                    vm.pacuRecList[index].id = rs.data.pacuObsId;
                    constructOutterList(vm.pacuRecList);
                }
            });
        }

    }

    vm.setreNode = function(item, hide) {
        let postData = angular.copy(item);
        postData.recordTime = new Date(item.recordTime);
        if (!item.recordTime) {
            return false;
        }
        if (hide)
            item.patopt_open = false;
        //保存数据
        IHttp.post("document/savePacuAnaesObserve", postData).then((rs) => {});
    }

    function hasSameTime(item) {
        if (vm.pacuRecList.length > 1) {
            for (var i = 0; i < vm.pacuRecList.length; i++) {
                if (new Date(vm.pacuRecList[i].recordTime).getTime() === new Date(item.recordTime).getTime() && vm.pacuRecList[i].id != item.id) {
                    return true;
                }
            }
        }
        return false;
    }

    vm.setreNodeinfo = function() {
        var param = angular.copy(vm.rSheet.anaesPacuRec);
        if (param.id) {
            param = appendResAndPipe(param, '');
            IHttp.post("document/saveAnaesPacuRec", param).then((rs) => {});
        }
    }

    $scope.delete = function(id, index) {
        IHttp.post("document/deletePacuAnaesObserve", { id: id }).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            vm.pacuRecList.splice(index, 1);
            constructOutterList(vm.pacuRecList);
        });
    }

    $scope.outRoom = function(event) {
        $scope.verify = true;
        if(!vm.rSheet.anaesPacuRec.enterTime || !vm.rSheet.anaesPacuRec.enterTemp || !vm.rSheet.anaesPacuRec.docSign || !vm.rSheet.anaesPacuRec.nurseSign || !vm.rSheet.anaesPacuRec.leaveTo) {
            toastr.warning('请输入必填项信息');
            return;
        } else if ((beCode == 'syzxyy' || beCode == 'cshtyy'||beCode=='llzyyy') && !vm.rSheet.anaesPacuRec.exitTime) {
            toastr.warning('请输入必填项信息');
            return;
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'ua',
            template: require('../../tpl/userModal/userModal.html'),
            controller: require('../../tpl/userModal/userModal.controller.js')
        }).result.then(function() {
            let postData = angular.copy(vm.rSheet.anaesPacuRec);
            postData.exitTime = vm.rSheet.anaesPacuRec.exitTime ? new Date(vm.rSheet.anaesPacuRec.exitTime) : new Date();
            postData.enterTime = new Date(vm.rSheet.anaesPacuRec.enterTime);
            postData = appendResAndPipe(postData, vm.rSheet.anaesPacuRec.leaveTo);
            postData.processState = 'END';
            IHttp.post('document/saveAnaesPacuRec', postData).then((rs) => {
                if (rs.data.resultCode !== '1')
                    return;
                toastr.info('出室成功！');
                $scope.finish = 'ok';                
                selectByPacuRecId();
            });
        });
    }

    $scope.print = function(ev) {
        $scope.verify = true;
        if ($scope.finish === 'ok') {
            window.open($rootScope.$state.href('print'));
        } else {
            toastr.warning('未出室，无法打印！');
        }
    }

    vm.showmedNameFlow = function(item, ev) {
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./modal/loadTemp.html'),
            controller: require('./modal/loadTemp.controller.js'),
            resolve: { items: { id: item.id, docId: vm.rSheet.anaesPacuRec.id } }
        }).result.then((rs) => {
            selectByPacuRecId();
        }, () => selectByPacuRecId());
    }

    $scope.anesEvent = function(ev) {
        $scope.verify = false;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal/anesEvent.html'),
            controller: require('./modal/anesEvent.controller.js'),
            resolve: {
                items: {
                    docId: vm.rSheet.anaesPacuRec.id
                }
            }
        })
    }

    function getUrl(str) {
        var arr = $filter('filter')($scope.btnsMenu, function(item) {
            return item.url == str;
        })
        if (arr.length > 0)
            return arr;
        else
            return [{}];
    }
}
