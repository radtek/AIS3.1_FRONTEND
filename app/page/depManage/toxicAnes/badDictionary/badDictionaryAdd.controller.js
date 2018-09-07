talkDictionaryAddCtrl.$inject = ['$rootScope', '$scope', '$q','IHttp','i18nService','uiGridConstants','$timeout','toastr', '$uibModalInstance', 'select', '$filter', 'auth'];

module.exports = talkDictionaryAddCtrl;

function talkDictionaryAddCtrl($rootScope, $scope,$q, IHttp,i18nService,uiGridConstants,$timeout,   toastr, $uibModalInstance, select, $filter, auth) {
    vm = this;
    vm.title="报损";
 
    var user=auth.loginUser();
    i18nService.setCurrentLang('zh-cn');

    var promise;   

    $scope.medicalParams = {}; 
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
        IHttp.post("basedata/queryAnaesMedicineList", { pinyin: query }).then(function(result) {
            if (result.data.resultCode !== '1') return;   
            for (var i = 0; i < result.data.resultList.length; i++) {
                result.data.resultList[i].name=result.data.resultList[i].medicineName;
            }         
            callback(result.data.resultList);
        });
    }

    var medWatch = $scope.$watch('medicine', function(n) {
        if (angular.equals({}, n)) return;        
        $scope.medicalParams.spec = n.spec;
        $scope.medicalParams.firm = n.firm;   
        $scope.medicalParams.medicineName=n.medicineName;
        $scope.medicalParams.name=n.medicineName;
        $scope.medicalParams.medicineCode=n.medicineCode;
        $scope.medicalParams.batch=n.batch;
        $scope.medicalParams.number=n.number;
        $scope.medicalParams.storageId=n.id;
        $scope.medicalParams.effectiveTime=n.effectiveTime;
        $scope.medicalParams.minPackageUnit=n.minPackageUnit;
    });

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        $scope.medicalParams.loseType  = type;
        //$scope.medicalParams.storageId=$scope.medicalParams.id;
        $scope.medicalParams.id=undefined; 
        $scope.medicalParams.beid=user.beid;
       

        IHttp.post('basedata/addMedicineLoseRecord', $scope.medicalParams)
            .then((rs) => {
                $rootScope.btnActive = true;
                if (rs.status === 200 && rs.data.resultCode === '1') {
                     toastr.info("报损成功");
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
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.medicineName &&$scope.medicalParams.loseReason && $scope.medicalParams.loseNumber && $scope.medicalParams.loseName);
        
        
    }
}
