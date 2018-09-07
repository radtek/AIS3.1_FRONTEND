 PostVisitSyzxyyLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$state', '$timeout', 'confirm', 'select', 'toastr', 'auth', '$filter'];

module.exports = PostVisitSyzxyyLogCtrl;

function PostVisitSyzxyyLogCtrl($rootScope, $scope, IHttp, $state, $timeout, confirm, select, toastr, auth, $filter) {
    var promise,
        regOptId = $rootScope.$stateParams.regOptId,
        rows = 3,
        rows1 = 3;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);

    $scope.saveActive = auth.getDocAuth();
    if ($scope.docInfo.beCode == 'syzxyy'||$scope.docInfo.beCode=='llzyyy') {
        rows = 1;
        rows1 = 2;
    }
    select.sysCodeBy('awareness').then((rs) => {
        $scope.awarenessList = rs.data.resultList;
    })
    select.sysCodeBy('feel').then((rs) => {
        $scope.feelList = rs.data.resultList;
    })
    select.sysCodeBy('sports').then((rs) => {
        $scope.sportsList = rs.data.resultList;
    })
    $scope.lv = [{ key: 0, val: 0 }, { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 }, { key: 4, val: 4 }, { key: 5, val: 5 }, { key: 6, val: 6 }, { key: 7, val: 7 }, { key: 8, val: 8 }, { key: 9, val: 9 }, { key: 10, val: 10 }];

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('docPostFollowYxrm.anesthetistIdList', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                for (var sign of n) {
                    if (item.userName == sign) {
                        if (!$scope.hasSig)
                            $scope.hasSig = item.picPath ? true : false;
                        $scope.eSignatureAnaestheitist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                    }
                }
            })

        }, true)
    }, 1000);

    // 查询 searchAnaesPostopByRegOptId  getPostFollowRecord
    IHttp.post('document/searchAnaesPostopByRegOptId', { regOptId: regOptId }).then(function(rs) {
        var rs = rs.data
        if (rs.resultCode != 1)
            return;
        $scope.rs = rs;

        // $scope.postFollowRecord = rs.postFollowRecord.postFollowRecord;
        $scope.postFollowRecord = rs.anaesPostopItem;
        $scope.rs.regOpt=rs.searchRegOptByIdFormBean;
        $scope.docPostFollowYxrm = {};
        
        // if(!!rs.anaesPostopItem.beforeBloodPre)
        //     rs.anaesPostopItem.beforeBloodPre -= 0;
        if(!!rs.anaesPostopItem.beforeHeartrate)
            rs.anaesPostopItem.beforeHeartrate -= 0;
        if(!!rs.anaesPostopItem.beforeBreath)
            rs.anaesPostopItem.beforeBreath -= 0;
        if(!!rs.anaesPostopItem.spo2)
            rs.anaesPostopItem.spo2 -= 0;
        // if(!!rs.anaesPostopItem.afterBloodPre)
        //     rs.anaesPostopItem.afterBloodPre -= 0;
        if(!!rs.anaesPostopItem.afterHeartrate)
            rs.anaesPostopItem.afterHeartrate -= 0;
        if(!!rs.anaesPostopItem.afterBreath)
            rs.anaesPostopItem.afterBreath -= 0;

        $scope.docPostFollowYxrm = rs.anaesPostopItem;
        $scope.processState = $scope.postFollowRecord.processState;
        $scope.$emit('processState', $scope.postFollowRecord.processState);
        if ($scope.docPostFollowYxrm.beforeRemovalTime)
            $scope.docPostFollowYxrm.beforeRemovalTime = $filter('date')(new Date($scope.docPostFollowYxrm.beforeRemovalTime), 'yyyy-MM-dd HH:mm')
        if ($scope.docPostFollowYxrm.signTime)
            $scope.docPostFollowYxrm.signTime = $filter('date')(new Date($scope.docPostFollowYxrm.signTime), 'yyyy-MM-dd')
    });

    function save(type, isPrint) {
        $scope.verify = type == 'END';
        // $scope.isprint = false;

        if (type == 'END') {
            if (!$scope.docPostFollowYxrm.anesthetistIdList) {
                toastr.warning('请输入必填项信息');
                return;
            }
            if (isPrint && $scope.postFollowRecord.processState == 'END')
                $scope.$emit('doc-print');
            else if (isPrint)
                confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type); });
            else
                confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
        } else
            submit(type, isPrint)
    }

    function submit(type, isPrint) {
        $scope.postFollowRecord.processState = type;
        var postFollowRecord = angular.copy($scope.postFollowRecord);

        // $scope.postFollowRecord.bloodPressure = $scope.postFollowRecord.bloodPressureL + '/' + $scope.postFollowRecord.bloodPressureR;
        var docPostFollowYxrm = angular.copy($scope.docPostFollowYxrm);

        if (docPostFollowYxrm.signTime)
            docPostFollowYxrm.signTime = new Date(docPostFollowYxrm.signTime);
        if (docPostFollowYxrm.beforeRemovalTime)
            docPostFollowYxrm.beforeRemovalTime = new Date(docPostFollowYxrm.beforeRemovalTime);

        if (docPostFollowYxrm.beforeAnaesPipe) {
            docPostFollowYxrm.beforeAnaesPipe = docPostFollowYxrm.beforeAnaesPipe.codeName;
        }
        if (docPostFollowYxrm.afterAnaesPipe) {
            docPostFollowYxrm.afterAnaesPipe = docPostFollowYxrm.afterAnaesPipe.codeName;
        }
// $scope.postFollowRecord = rs.anaesPostopItem;
        // $scope.rs.regOpt=rs.searchRegOptByIdFormBean;
        var para = $scope.docPostFollowYxrm;
//   savePostFollowRecord
        IHttp.post("document/updateAnaesPostop", para).then(function(res) {
            $scope.processState = type
            if (res.data.resultCode != 1) {
                $scope.postFollowRecord.processState = "END";
                return;
            }
            toastr.success(res.data.resultMessage);
            if (isPrint)
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', $scope.postFollowRecord.processState);
        });
    }

    $scope.clearItem = function(item) {
        if (!item.observeTime)
            return;
        item.vistorId = angular.copy($scope.rs.anesthetistId);
    }

    $scope.ck = function(type, item) {
        switch (type) {
            case 'limbsFeelImp':
                item.leftLimbsFeelImp = item.rightLimbsFeelImp = '';
                break;
            case 'leftLimbsFeelImp':
                item.limbsFeelImp = '';
                break;
            case 'limbsMoveImp':
                item.leftMoveFeelImp = item.rightMoveFeelImp = '';
                break;
            case 'leftMoveFeelImp':
                item.limbsMoveImp = '';
                break;
        }
    }

    $scope.changeVistor = function(item) {
        if (!item.observeTime)
            return;
        item.vistorId = angular.copy($scope.rs.anesthetistId);
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            submit('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'PRINT');
    });

    $scope.$on('submit', () => {
        save('END');
    })
}