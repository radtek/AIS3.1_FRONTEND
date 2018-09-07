module.exports = recipeCtrl;

recipeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$timeout', '$window', '$uibModalInstance'];

function recipeCtrl($rootScope, $scope, IHttp, toastr, $timeout, $window, $uibModalInstance) {
    var params,
        recipe = localStorage.getItem('recipe-' + $scope.regOptId);
    $scope.currDay = new Date().getTime();
    if(typeof(recipe) == 'string') {
        recipe = JSON.parse(recipe);

        $scope.user = recipe.user;
    } else {
        recipe = {};
        var toDay = new Date();
        $scope.user = {
            recipeYear: toDay.getFullYear(),
            recipeMonth: toDay.getMonth() + 1,
            recipeDay: toDay.getDate()
        };
    }
    if ($scope.recipeType == 'redPrescription')
        params = { regOptId: $scope.regOptId, redPrescription: 1, docId: $scope.docId };
    else if ($scope.recipeType == 'whitePrescription')
        params = { regOptId: $scope.regOptId, whitePrescription: 1, docId: $scope.docId };
    else if ($scope.recipeType == 'jingyi')
        params = { regOptId: $scope.regOptId, jingyi: 1, docId: $scope.docId };

    // 获取患者信息
    IHttp.post('operation/getRegOptApplicationById', { regOptId: $scope.regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.regOpt = rs.data.resultList;

        // if (rs.data.resultList.length > 0) {

        //     $scope.user.idCard = rs.data.resultList[0].identityNo;
        // }
        if (rs.data.resultList.identityNo) {
            $scope.user.idCard = rs.data.resultList.identityNo;
        }
    });

    // 获取处方数据
    IHttp.post('operation/searchMedicaleventGroupByCodeList', params).then(function(rs) {
        if (rs.data.resultCode != 1) return;
        $scope.list = rs.data.resultList;
        if ($scope.list.length) {
            var tempList = angular.copy($scope.list);
            $scope.list = [];
            for (var a = 0; a < tempList.length; a++) {
                $scope.list.push(tempList[a]);
                $scope.list.push({
                    isAddTo: true,
                    name: 'Sig:',
                    dosage: tempList[a].dosage,
                    dosageUnit: tempList[a].dosageUnit,
                    medWay: tempList[a].medWay
                });
            }
        }
    });

    $scope.print = function() {
        recipe.user = $scope.user;
        recipe.regOpt = $scope.regOpt;
        recipe.list = $scope.list ? $scope.list : [];

        sessionStorage.setItem('regOptId', $scope.regOptId);
        localStorage.setItem('recipe-' + $scope.regOptId, JSON.stringify(recipe));

        if ($scope.recipeType == 'whitePrescription')
            window.open($rootScope.$state.href('wRecipe_qnzzyyy'));
        else if ($scope.recipeType == 'redPrescription')
            window.open($rootScope.$state.href('rRecipe_qnzzyyy'));
        else if ($scope.recipeType == 'jingyi')
            window.open($rootScope.$state.href('yRecipe_qnzzyyy'));
        $uibModalInstance.close();
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    $scope.save = function() {
        recipe.user = $scope.user;
        recipe.regOpt = $scope.regOpt;
        recipe.list = $scope.list ? $scope.list : [];
        
        localStorage.setItem('recipe-' + $scope.regOptId, JSON.stringify(recipe));
        $uibModalInstance.dismiss();
    }
}