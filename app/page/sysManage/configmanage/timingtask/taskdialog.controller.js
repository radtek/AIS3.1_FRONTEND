editOperRoomConfig.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout'];

module.exports = editOperRoomConfig;

function editOperRoomConfig($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout) {
    var vm=this;
    var promise;
    var id = $scope.id;
    var oldParams;
    if (id=== 0) {
        $scope.lable = '新增定时任务';
    } else {
        $scope.lable = '编辑定时任务';
        IHttp.post("sys/searchTaskScheduleById", {id:id}).then(function(data) {
            if (data.data.resultCode !== '1') return;

            $scope.taskParams = data.data.taskSchedule;
            oldParams=angular.copy($scope.taskParams);
            
        });
    }
    $scope.flaglist=[{
        name:"启用",
        value:1
    },{
        name:"禁用",
        value:0
    }];
    $scope.saveOperationRoom = function() {
        var params={};
        if(angular.equals(oldParams,$scope.taskParams)){
            toastr.error("未进行任何编辑");
            return;
        }
        for(var i in oldParams){
            if(oldParams[i]!=$scope.taskParams[i]){
                params[i]=$scope.taskParams[i];
            }
        }
        params.id=id;
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("sys/updateTaskSchedule",params).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

    // 验证
    function verify() {
        return $scope.formName.$valid && !!($scope.taskParams.taskName || $scope.taskParams.taskGroup || $scope.taskParams.taskStatus || $scope.taskParams.cronExpression);
    }
}

