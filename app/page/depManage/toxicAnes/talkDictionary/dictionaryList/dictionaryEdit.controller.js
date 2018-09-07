dictionaryEditCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', 'select', 'dateFilter', '$filter', 'auth'];

module.exports = dictionaryEditCtrl;

function dictionaryEditCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, select, dateFilter, $filter, auth) {
    vm = this;
    vm.title="取药"; 
    $scope.medicalParams={};   

    if ($scope.data.row) {
    	vm.title="取药";
    	 $scope.medicalParams = angular.copy($scope.data.row.entity);    	
    }
    $scope.medicalParams.operator= auth.loginUser().name;
    $scope.medicalParams.outTime= dateFilter(new Date(), 'yyyy-MM-dd HH:mm');

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
    

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        $scope.medicalParam = angular.copy($scope.medicalParams);
        $scope.medicalParam.outType = type;
       // $scope.medicalParam.effectiveTime=$scope.medicalParam.effectiveTime;
        $scope.medicalParam.outTime = new Date($filter('date')(new Date($scope.medicalParam.outTime), 'yyyy-MM-dd HH:mm')).getTime();
        $scope.medicalParam.operator= auth.loginUser().userName;
        $scope.medicalParam.storageId=$scope.medicalParam.id;
        $scope.medicalParam.operator= auth.loginUser().userName;
        $scope.medicalParam.id=undefined;

        IHttp.post('basedata/addMedicineOutRecord', $scope.medicalParam)
            .then((rs) => {
                $rootScope.btnActive = true;
            	if (rs.status === 200 && rs.data.resultCode === '1') {
                     toastr.info("取药成功");
            		$uibModalInstance.close('success');
            	} else {
            		$uibModalInstance.dismiss('faild');
            	}
            },(err) => {
            	$uibModalInstance.dismiss(err);                
            });    
    }

    select.getAllUser().then((rs) => {
        $scope.operaList = rs.data.userItem;
    });
    
    // 验证
    function verify() {
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.outNumber && $scope.medicalParams.receiveName)
    }
}
