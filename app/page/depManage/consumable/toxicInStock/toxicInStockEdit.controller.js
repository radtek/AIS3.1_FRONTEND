toxicInStockEditCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', '$timeout','select','$q', '$filter', 'auth'];

module.exports = toxicInStockEditCtrl;

function toxicInStockEditCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance,$timeout, select,$q, $filter, auth) {
    vm = this;
    vm.title="添加入库";
    $scope.medicine = {};
    var user= auth.loginUser(),
        oldNumber = 0;
    if ($scope.data.row) {
        if($scope.data.tag==='0'){
            vm.title="编辑入库信息";
            $scope.medicalParams = angular.copy($scope.data.row.entity);
            oldNumber = angular.copy($scope.data.row.entity.number);
        }else if($scope.data.tag==='1'){
            vm.title="核对入库信息";
            $scope.medicalParams = angular.copy($scope.data.row.entity);   
            $scope.medicalParams.checkName= user.name;
            $scope.checkTime= $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
            oldNumber = angular.copy($scope.data.row.entity.number);
        }   	

        $scope.medicine={
            instrumentName: $scope.medicalParams.name,
            name:$scope.medicalParams.instrumentName,
            instrumentId: $scope.medicalParams.instrumentId,
            spec: $scope.medicalParams.spec,           
            firm:$scope.medicalParams.firm,             
            minPackageUnit:$scope.medicalParams.minPackageUnit,
            minPackageUnit:$scope.medicalParams.unit,
            unit:$scope.medicalParams.unit?$scope.medicalParams.unit:$scope.medicine.unit
        } 	
        
    } else {
    	$scope.medicalParams = {    	    
    	    operator: user.name,	   
    	    effectiveTime: $filter('date')(new Date(), 'yyyy-MM-dd'),
    	    productionTime: $filter('date')(new Date(), 'yyyy-MM-dd'),
            status:0,
            beid:user.beid,
            minPackageUnit:'支'
    	};
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
        var params = {
            pageNo: 1,
            pageSize: 200,
            filters: [{field: 'pinYin', value: query}, {field: 'enable', value: 1}]
        }
        IHttp.post("basedata/queryChargeItem", params).then(function(result) {
            if (result.data.resultCode !== '1') return;            
            callback(result.data.resultList);
        });
    }

    var medWatch = $scope.$watch('medicine', function(n) {
        if (angular.equals({}, n)) return;        
        $scope.medicalParams.spec = n.spec;
        $scope.medicalParams.firm = n.firm;   
        $scope.medicalParams.medicineName=n.name;
        $scope.medicalParams.medicineCode=n.medicineId;        
        $scope.medicalParams.minPackageUnit=n.minPackageUnit;
        $scope.medicalParams.beid=user.beid;
        $scope.medicalParams.unit=n.unit;

    });

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }

    // select.getChargeItemList()
    // 	.then((rs) => {
    // 		if (rs.status === 200 && rs.data.resultCode === '1') {
    // 			vm.chargeItemList = rs.data.resultList;
    // 		}
    // 	})

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        if(!$scope.medicalParams.medicineCode){
            $scope.medicalParams.medicineName= undefined;
            $scope.medicalParams.instrumentName= $scope.medicine.name;
            $scope.medicalParams.instrumentId= $scope.medicine.chargeItemId;
            $scope.medicalParams.spec= $scope.medicine.spec;     
            $scope.medicalParams.firm= $scope.medicine.firm;
            $scope.medicalParams.minPackageUnit=$scope.medicine.minPackageUnit;
        }
        if ($scope.data.row)
            $scope.medicalParams.instrumentId = $scope.medicine.instrumentId;
        $scope.medicalParams.oldNumber = oldNumber;
        $scope.medicalParams.operateTime=undefined;
        IHttp.post('basedata/saveConsumablesInRecord', $scope.medicalParams).then((rs) => {
            $rootScope.btnActive = true;
            if (rs.status === 200 && rs.data.resultCode === '1') {
                toastr.info("保存成功");
                $uibModalInstance.close('success');
            } else {
                $uibModalInstance.dismiss('faild');
            }
        },(err) => {
            $uibModalInstance.dismiss(err);
        });
    }

    $scope.check= function(type) {
       
        $rootScope.btnActive = false;

        var medical={};
        medical.id=$scope.medicalParams.id;
        medical.checkName=$scope.medicalParams.checkName;

        IHttp.post('basedata/checkConsumablesInRecord', medical)
            .then((rs) => {
                $rootScope.btnActive = true;
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    toastr.info("核对成功");
                    $uibModalInstance.close('success');
                } else {
                    $uibModalInstance.dismiss('faild');
                }
            },(err) => {
                $uibModalInstance.dismiss(err);
            });    
    }
    // select.getAllUser().then((rs) => {
    //     $scope.operaList = rs.data.userItem;
    // });

    // 验证
    function verify() {
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.medicineName || $scope.medicalParams.batch || $scope.medicalParams.productionTime || $scope.medicalParams.effectiveTime || $scope.medicalParams.number )
    }
}
