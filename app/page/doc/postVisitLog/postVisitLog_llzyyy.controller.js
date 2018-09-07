PostVisitLogyxrmCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$state', '$timeout', 'confirm', 'select', 'toastr', 'auth', '$filter'];

module.exports = PostVisitLogyxrmCtrl;

function PostVisitLogyxrmCtrl($rootScope, $scope, IHttp, $window, $q, $state, $timeout, confirm, select, toastr, auth, $filter) {
    var promise,
        regOptId = $rootScope.$stateParams.regOptId,
        rows = 3, rows1 = 3;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);

    $scope.saveActive = auth.getDocAuth();
     
    // 查询
    IHttp.post('document/getPostFollowRecord', { regOptId: regOptId }).then(function(rs) {
        var rs = rs.data
        if (rs.resultCode != 1)
            return;
        $scope.rs = rs;       
        // 主表
        //$scope.postFollowRecord = {};//rs.postFollowRecord.postFollowRecord;
        $scope.postFollowRecord = rs.postFollowRecord.postFollowRecord;
        $scope.docPostFollowYxrm ={};
        if(rs.postFollowRecord.docPostFollowYxrm)
        $scope.docPostFollowYxrm = rs.postFollowRecord.docPostFollowYxrm;
        $scope.processState = $scope.postFollowRecord.processState;
        $scope.$emit('processState', $scope.postFollowRecord.processState);

        if ($scope.docPostFollowYxrm.beforeRemovalTime)
            $scope.docPostFollowYxrm.beforeRemovalTime = $filter('date')(new Date($scope.docPostFollowYxrm.beforeRemovalTime), 'yyyy-MM-dd HH:mm')
        if ($scope.docPostFollowYxrm.signTime)
            $scope.docPostFollowYxrm.signTime = $filter('date')(new Date($scope.docPostFollowYxrm.signTime), 'yyyy-MM-dd')
          
       
    });

    select.sysCodeBy('insertPipe').then((rs) => {
        $scope.pipeList = rs.data.resultList;        
    })
    select.sysCodeBy('feel').then((rs) => {
        $scope.feelList = rs.data.resultList;        
    })
    select.sysCodeBy('sports').then((rs) => {
        $scope.sportsList = rs.data.resultList;        
    })

    select.getAnaesthetists().then((rs) => {
        $scope.anesthetistList = rs.data.userItem;
    });

    $timeout(function() {
        if($scope.docPostFollowYxrm.beforeMotorFunction || $scope.docPostFollowYxrm.afterMotorFunction){
            for (var i = 0; i < $scope.sportsList.length; i++) {
                if($scope.sportsList[i].codeName == $scope.docPostFollowYxrm.beforeMotorFunction){
                    $scope.docPostFollowYxrm.beforeMotorFunction=$scope.sportsList[i];
                }
                if($scope.sportsList[i].codeName == $scope.docPostFollowYxrm.afterMotorFunction){
                    $scope.docPostFollowYxrm.afterMotorFunction=$scope.sportsList[i];
                }
            }
        }
        if($scope.docPostFollowYxrm.beforeFeel || $scope.docPostFollowYxrm.afterFeel){
            for (var i = 0; i < $scope.feelList.length; i++) {
                if($scope.feelList[i].codeName == $scope.docPostFollowYxrm.beforeFeel){
                    $scope.docPostFollowYxrm.beforeFeel=$scope.feelList[i];
                }
                if($scope.feelList[i].codeName == $scope.docPostFollowYxrm.afterFeel){
                    $scope.docPostFollowYxrm.afterFeel=$scope.feelList[i];
                }
            }
        }
        if($scope.docPostFollowYxrm.beforeAnaesPipe || $scope.docPostFollowYxrm.afterAnaesPipe){
            for (var i = 0; i < $scope.pipeList.length; i++) {
                if($scope.pipeList[i].codeName == $scope.docPostFollowYxrm.beforeAnaesPipe){
                    $scope.docPostFollowYxrm.beforeAnaesPipe=$scope.pipeList[i];
                }
                if($scope.pipeList[i].codeName == $scope.docPostFollowYxrm.afterAnaesPipe){
                    $scope.docPostFollowYxrm.afterAnaesPipe=$scope.pipeList[i];
                }
            }
        }
       

        if($scope.docPostFollowYxrm.beforeAnaesPipe &&  typeof $scope.docPostFollowYxrm.beforeAnaesPipe ==="string"){
            $scope.pipeList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.beforeAnaesPipe ={codeName: $scope.docPostFollowYxrm.beforeAnaesPipe};
        }
        if($scope.docPostFollowYxrm.afterAnaesPipe &&  typeof $scope.docPostFollowYxrm.afterAnaesPipe ==="string"){
            $scope.pipeList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.afterAnaesPipe = {codeName:$scope.docPostFollowYxrm.afterAnaesPipe};
        }
        if($scope.docPostFollowYxrm.beforeMotorFunction &&  typeof $scope.docPostFollowYxrm.beforeMotorFunction ==="string"){
            $scope.sportsList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.beforeMotorFunction = {codeName:$scope.docPostFollowYxrm.beforeMotorFunction};
        }
        if($scope.docPostFollowYxrm.afterMotorFunction &&  typeof $scope.docPostFollowYxrm.afterMotorFunction ==="string"){
            $scope.sportsList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.afterMotorFunction ={codeName: $scope.docPostFollowYxrm.afterMotorFunction};
        }
        if($scope.docPostFollowYxrm.beforeFeel &&  typeof $scope.docPostFollowYxrm.beforeFeel ==="string"){
            $scope.feelList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.beforeFeel ={codeName:$scope.docPostFollowYxrm.beforeFeel};
        }
        if($scope.docPostFollowYxrm.afterFeel &&  typeof $scope.docPostFollowYxrm.afterFeel ==="string"){
            $scope.feelList.push({codeName: $scope.docPostFollowYxrm.beforeAnaesPipe});
            $scope.docPostFollowYxrm.afterFeel = {codeName:$scope.docPostFollowYxrm.afterFeel};
        }
        


    }, 1000);



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

   

    function save(type, isPrint) {
        // $scope.verify = type == 'END';
        // $scope.isprint = false;
        if (type == 'END') {
            if (isPrint && $scope.postFollowRecord.processState == 'END')
                $scope.$emit('doc-print');
            else if (isPrint)
                confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type); });
            else
                confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
        } else
            submit(type, isPrint)
    }
    function verifyfun(){
        if(!($scope.docPostFollowYxrm.beforeBloodPre && $scope.docPostFollowYxrm.beforeHeartrate  &&  $scope.docPostFollowYxrm.beforeBreath  &&  $scope.docPostFollowYxrm.beforeSpo2)){
            toastr.warning('请输入患者麻醉后离开手术室时的基本情况的完整信息。');
            return true;
        }
        if(!($scope.docPostFollowYxrm.beforeMentalState && $scope.docPostFollowYxrm.beforeFeel  &&  $scope.docPostFollowYxrm.beforeMotorFunction )){
            toastr.warning('请输入患者麻醉后离开手术室时的神经系统的完整信息。');
            return true;
        }
        if(!($scope.docPostFollowYxrm.afterBloodPre && $scope.docPostFollowYxrm.afterHeartrate  &&  $scope.docPostFollowYxrm.afterBreath &&  $scope.docPostFollowYxrm.afterSpo2)){
            toastr.warning('请输入麻醉后访视时的基本情况的完整信息。');
            return true;
        }
        if(!($scope.docPostFollowYxrm.afterMentalState && $scope.docPostFollowYxrm.afterFeel  &&  $scope.docPostFollowYxrm.afterMotorFunction )){
            toastr.warning('请输入患者麻醉后访视时的神经系统的完整信息。');
            return true;
        }
        return false;
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

        if(docPostFollowYxrm.beforeAnaesPipe){
            docPostFollowYxrm.beforeAnaesPipe = docPostFollowYxrm.beforeAnaesPipe.codeName;
        }
        if(docPostFollowYxrm.beforeMotorFunction){
            docPostFollowYxrm.beforeMotorFunction = docPostFollowYxrm.beforeMotorFunction.codeName;
        }
        if(docPostFollowYxrm.beforeFeel){
            docPostFollowYxrm.beforeFeel = docPostFollowYxrm.beforeFeel.codeName;
        }
        if(docPostFollowYxrm.afterFeel){
            docPostFollowYxrm.afterFeel = docPostFollowYxrm.afterFeel.codeName;
        }
        if(docPostFollowYxrm.afterMotorFunction){
            docPostFollowYxrm.afterMotorFunction = docPostFollowYxrm.afterMotorFunction.codeName;
        }
        if(docPostFollowYxrm.afterAnaesPipe){
            docPostFollowYxrm.afterAnaesPipe = docPostFollowYxrm.afterAnaesPipe.codeName;
        }

        var para = {
            postFollowRecord: postFollowRecord,
            docPostFollowYxrm : docPostFollowYxrm       
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