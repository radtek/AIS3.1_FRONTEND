operDictionaryEditCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr','select', '$uibModalInstance', '$timeout', '$q', '$filter', 'auth'];

module.exports = operDictionaryEditCtrl;

function operDictionaryEditCtrl($rootScope, $scope, IHttp, toastr,select, $uibModalInstance, $timeout, $q, $filter, auth) {
    vm = this;
    vm.title=""; 
    $scope.medicalParams={};   
    if ($scope.data) {
    	vm.title="新增耗材";
    	$scope.medicalParams =angular.copy( $scope.data);    	
    }else{
        vm.title="新增耗材";
    }
    $scope.medicalParams.operator= auth.loginUser().name;

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

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
        var params={"pageNo":1,"pageSize":15,"orderBy":"","sort":"","filters":[{"field":'pinyin',"value":query}]}
        IHttp.post("basedata/queryConsumablesList", params).then(function(result) {
            if (result.data.resultCode !== '1') return;   
            for (var i = 0; i < result.data.resultList.length; i++) {
                result.data.resultList[i].name=result.data.resultList[i].instrumentName;
            }         
            callback(result.data.resultList);
        });
    }

    var medWatch = $scope.$watch('medicine', function(n) {
        if (angular.equals({}, n)||!n) return;      
        $scope.medicalParams.spec = n.spec;
        $scope.medicalParams.firm = n.firm;   
        // $scope.medicalParams.medicineName=n.medicineName;
        $scope.medicalParams.instrumentName=n.instrumentName;

        $scope.medicalParams.name=n.medicineName;
        // $scope.medicalParams.medicineCode=n.medicineCode;
        $scope.medicalParams.instrumentId=n.instrumentId;


        $scope.medicalParams.batch=n.batch;
        $scope.medicalParams.number=n.number;
        $scope.medicalParams.storageId=n.id;
        $scope.medicalParams.effectiveTime=n.effectiveTime;
        $scope.medicalParams.unit=n.unit?n.unit:$scope.medicalParams.unit;
    });
    

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        $scope.medicalParam = angular.copy($scope.medicalParams);
        $scope.medicalParam.operator = auth.loginUser().userName;
        $scope.medicalParam.outType = type;     
        $scope.medicalParam.id=undefined;
        

        IHttp.post('basedata/addConsumablesOutRecord', $scope.medicalParam)
            .then((rs) => {
                $rootScope.btnActive = true;
            	if (rs.status === 200 && rs.data.resultCode === '1') {
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
