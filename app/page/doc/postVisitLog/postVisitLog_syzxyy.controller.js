PostVisitSyzxyyLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$state', '$timeout', 'confirm', 'select', 'toastr', 'auth', '$filter'];

module.exports = PostVisitSyzxyyLogCtrl;

function PostVisitSyzxyyLogCtrl($rootScope, $scope, IHttp, $window, $q, $state, $timeout, confirm, select, toastr, auth, $filter) {
    var promise,
        regOptId = $rootScope.$stateParams.regOptId,
        rows = 3, rows1 = 3;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);

    $scope.saveActive = auth.getDocAuth();
    if ($scope.docInfo.beCode == 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'||$scope.docInfo.beCode=='llzyyy') {
        rows = 1;
        rows1 = 2;
    }

    $scope.lv = [{ key: 0, val: 0 }, { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 }, { key: 4, val: 4 }, { key: 5, val: 5 }, { key: 6, val: 6 }, { key: 7, val: 7 }, { key: 8, val: 8 }, { key: 9, val: 9 }, { key: 10, val: 10 }];

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        $scope.$watch('postFollowRecord.anesthetistId', function(n, o) {
            $scope.hasSig = false;
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.hasSig = item.picPath ? true : false;
                    $scope.eSignatureAnaestheitist.push({hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime()});
                }
            })
        }, true)
    }, 1000);

    // 查询
    IHttp.post('document/getPostFollowRecord', { regOptId: regOptId }).then(function(rs) {
        var rs = rs.data
        if (rs.resultCode != 1)
            return;
        $scope.rs = rs;

        var analType;

            if (rs.analgesicType)
                analType = JSON.parse(rs.analgesicType);

            if (typeof(analType) == 'object') {
                if (analType.check == '1')
                    $scope.analType = '有';
                else
                    $scope.analType = '无';

                if (analType.value == '1')
                    $scope.analType = '静脉';
                else if (analType.value == '2')
                    $scope.analType = '椎管内';
                else if (analType.value == '3')
                    $scope.analType = '局部';
            }

        // 主表
        $scope.postFollowRecord = rs.postFollowRecord.postFollowRecord;
        // $scope.postFollowRecord.pulse -= 0;
        // $scope.postFollowRecord.breath -= 0;
        // $scope.postFollowRecord.spo2 -= 0;

        $scope.processState = $scope.postFollowRecord.processState;
        $scope.$emit('processState', $scope.postFollowRecord.processState);

        if ($scope.postFollowRecord.deathTime)
            $scope.postFollowRecord.deathTime = $filter('date')(new Date($scope.postFollowRecord.deathTime), 'yyyy-MM-dd HH:mm')
        if ($scope.postFollowRecord.intubatTime)
            $scope.postFollowRecord.intubatTime = $filter('date')(new Date($scope.postFollowRecord.intubatTime), 'yyyy-MM-dd HH:mm')

        // 脉搏
        // if ($scope.postFollowRecord.bloodPressure) {
        //     var bloodPressure = $scope.postFollowRecord.bloodPressure.split('/');
        //     $scope.postFollowRecord.bloodPressureL = bloodPressure[0] - 0;
        //     $scope.postFollowRecord.bloodPressureR = bloodPressure[1] - 0;
        // }
        if ($scope.postFollowRecord.breath)
            $scope.postFollowRecord.breath = $scope.postFollowRecord.breath - 0;
        if ($scope.postFollowRecord.spo2)
            $scope.postFollowRecord.spo2 = $scope.postFollowRecord.spo2 - 0;
        if ($scope.postFollowRecord.pulse)
            $scope.postFollowRecord.pulse = $scope.postFollowRecord.pulse - 0;


        $scope.$watch('postFollowRecord.isDeath', function(n, o) {
            if (n != 2)
                $scope.postFollowRecord.deathTime = '';
        })

        $scope.$watch('postFollowRecord.secondIntubat', function(n, o) {
            if (n != 2)
                $scope.postFollowRecord.intubatTime = '';
        })
    });

    function save(type, isPrint) {
        $scope.verify = type == 'END';
        // $scope.isprint = false;

        if (type == 'END') {
            // if (!$scope.rs.anesthetistId) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
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
        // $scope.postFollowRecord.bloodPressure = $scope.postFollowRecord.bloodPressureL + '/' + $scope.postFollowRecord.bloodPressureR;
        var postFollowRecord = angular.copy($scope.postFollowRecord);

        if (postFollowRecord.deathTime)
            postFollowRecord.deathTime = new Date(postFollowRecord.deathTime).getTime();
        if (postFollowRecord.intubatTime)
            postFollowRecord.intubatTime = new Date(postFollowRecord.intubatTime).getTime();

        var para = {
            postFollowRecord: postFollowRecord
            // ,
            // postFollowGeneralInfo: angular.copy($scope.postFollowGeneralInfo).map(function(item) {
            //     if (item.observeTime)
            //         item.observeTime = new Date(item.observeTime).getTime();
            //     return item;
            // }),
            // postFollowSpinalInfo: angular.copy($scope.postFollowSpinalInfo).map(function(item) {
            //     if (item.observeTime)
            //         item.observeTime = new Date(item.observeTime).getTime();
            //     return item;
            // }),
            // postFollowAnalgesicInfo: angular.copy($scope.postFollowAnalgesicInfo).map(function(item) {
            //     if (item.observeTime)
            //         item.observeTime = new Date(item.observeTime).getTime();
            //     return item;
            // })
        };

        IHttp.post("document/savePostFollowRecord", para).then(function(res) {
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