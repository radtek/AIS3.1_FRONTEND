ShutTranLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$timeout', '$filter', 'toastr', 'select', 'confirm', 'dateFilter', 'auth'];

module.exports = ShutTranLogCtrl;

function ShutTranLogCtrl($rootScope, $scope, IHttp, $window, $q, $timeout, $filter, toastr, select, confirm, dateFilter, auth) {
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    var vm = this;
    $scope.docInfo = auth.loginUser();
    let beCode = $scope.docInfo.beCode;

    select.getNurses().then((rs) => {
        $scope.preVisitorItem = rs.data.userItem;
    });

    IHttp.post('document/searchTransferConnectRecord', { 'regOptId': $rootScope.$stateParams.regOptId }).then(function(rs) {
        if (rs.data.resultCode !== '1') return;
        $scope.regOptItem = rs.data.searchRegOptByIdFormBean;
        $scope.transferConnectRecord = rs.data.transferConnectRecord;
        $scope.transferConnectType1 = rs.data.transferConnectTypeList[0] ? rs.data.transferConnectTypeList[0] : {};
        $scope.transferConnectType2 = rs.data.transferConnectTypeList[1] ? rs.data.transferConnectTypeList[1] : {};
        if (beCode === 'sybx') {
            if ($scope.transferConnectRecord.inRoomTime)
                $scope.transferConnectRecord.inRoomTime = dateFilter(new Date($scope.transferConnectRecord.inRoomTime), 'yyyy-MM-dd HH:mm');
            if ($scope.transferConnectRecord.joinTime)
                $scope.transferConnectRecord.joinTime = dateFilter(new Date($scope.transferConnectRecord.joinTime), 'yyyy-MM-dd HH:mm');
            if ($scope.transferConnectType1.joinTime)
                $scope.transferConnectType1.joinTime = dateFilter(new Date($scope.transferConnectType1.joinTime), 'yyyy-MM-dd HH:mm');
            if ($scope.transferConnectType2.joinTime)
                $scope.transferConnectType2.joinTime = dateFilter(new Date($scope.transferConnectType2.joinTime), 'yyyy-MM-dd HH:mm');
        }
        //初始化时发送文书状态
        $scope.processState = $scope.transferConnectRecord.processState;
        $scope.$emit('processState', $scope.transferConnectRecord.processState);
    });

    vm.save = save;
    vm.print = print;
    vm.submit = submit;

    select.getNurses().then((rs) => {
        $scope.singUserItem = rs.data.userItem;
    });

   
     function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState == 'END') {
            if (type && $scope.transferConnectRecord.processState == 'END')
                $scope.$emit('doc-print');
            else if (type)
                confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(processState); });
            else if ($scope.transferConnectRecord.processState)
                submit(processState, type);
            else
                confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(processState); });
        } else
            submit(processState, type)
    }
    function submit(processState, state) {
        $rootScope.btnActive = false;
        var patShuttleTransfer1 = angular.copy($scope.transferConnectRecord);
        patShuttleTransfer1.joinTime = new Date($filter('date')(new Date($scope.transferConnectRecord.joinTime), 'yyyy-MM-dd HH:mm')).getTime();
        patShuttleTransfer1.inRoomTime = new Date($filter('date')(new Date($scope.transferConnectRecord.inRoomTime), 'yyyy-MM-dd HH:mm')).getTime();
        var transferList = [];
        var transferConnectType1 = angular.copy($scope.transferConnectType1);
        var transferConnectType2 = angular.copy($scope.transferConnectType2);
        transferConnectType1.type = "1";  //病人去向
        transferConnectType2.type = "2";  //pacu转出病人去向
        transferConnectType1.joinTime = new Date($filter('date')(new Date($scope.transferConnectType1.joinTime), 'yyyy-MM-dd HH:mm')).getTime();
        transferConnectType2.joinTime = new Date($filter('date')(new Date($scope.transferConnectType2.joinTime), 'yyyy-MM-dd HH:mm')).getTime();
        transferList.push(transferConnectType1);
        transferList.push(transferConnectType2);
        patShuttleTransfer1.processState = processState;

        $rootScope.btnActive = true;
        //保存----------------------------begin;
        IHttp.post('document/updateTransferConnectRecord', {
            transferConnectRecord: patShuttleTransfer1,
            transferConnectTypeList: transferList
        }).then(function(rs) {
            $rootScope.btnActive = true;
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                $scope.transferConnectRecord.processState = processState;
                $scope.processState = $scope.transferConnectRecord.processState;
                if (state === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', $scope.transferConnectRecord.processState);
                }
            } else {
                toastr.error(rs.data.resultMessage);
            }
        });
    }

    $scope.$watch('processState', function(n) {
        if (n == undefined)
            return;
        $scope.$emit('processState', n);
    }, true);
    $scope.$on('save', function() {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');

    });

    $scope.$on('submit', function() {
        save('END');
    });

    $scope.$on('print', function() {
        save('END', 'print');
    });
     $timeout(function() {
        $scope.$watch('transferConnectRecord.joinNurse1', function(n, o) {//1
            $scope.hasSig_1 = false;
            $scope.eSignatureAnesthetist_1 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_1 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_1.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)

        $scope.$watch('transferConnectRecord.joinNurse2', function(n, o) {//2
            $scope.hasSig_2 = false;
            $scope.eSignatureAnesthetist_2 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_2 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_2.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
        $scope.$watch('transferConnectType1.joinNurse1', function(n, o) {//3
            $scope.hasSig_3 = false;
            $scope.eSignatureAnesthetist_3 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_3 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_3.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, true)

        $scope.$watch('transferConnectType1.joinNurse2', function(n, o) {//4
            $scope.hasSig_4 = false;
            $scope.eSignatureAnesthetist_4 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_4 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_4.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
        $scope.$watch('transferConnectType2.joinNurse1', function(n, o) {//5
            $scope.hasSig_5 = false;
            $scope.eSignatureAnesthetist_5 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_5 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_5.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
        $scope.$watch('transferConnectType2.joinNurse2', function(n, o) {//6
            $scope.hasSig_6 = false;
            $scope.eSignatureAnesthetist_6 = [];
            angular.forEach($scope.preVisitorItem, function(item) {
                if (item.userName == n) {
                    $scope.hasSig_6 = item.picPath ? true : false;
                    $scope.eSignatureAnesthetist_6.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                }
            })
        }, 1000);
    }, 1000);
}