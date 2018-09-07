PlantWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param'];

module.exports = PlantWinCtrl;

function PlantWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param) {
    $scope.plants = new Array(16);
    let plantStr = param.plant;
    if (plantStr) {
        if (plantStr.indexOf('DJ管') !== -1) {
            $scope.plants[0] = 'DJ管'
        }
        if (plantStr.indexOf('人工晶体') !== -1) {
            $scope.plants[1] = '人工晶体'
        }
        if (plantStr.indexOf('螺钉') !== -1) {
            $scope.plants[2] = '螺钉'
        }
        if (plantStr.indexOf('钢板') !== -1) {
            $scope.plants[3] = '钢板'
        }
        if (plantStr.indexOf('克氏针') !== -1) {
            $scope.plants[4] = '克氏针'
        }
        if (plantStr.indexOf('人工骨') !== -1) {
            $scope.plants[5] = '人工骨'
        }
        if (plantStr.indexOf('钛网') !== -1) {
            $scope.plants[6] = '钛网'
        }
        if (plantStr.indexOf('接骨片') !== -1) {
            $scope.plants[7] = '接骨片'
        }
        if (plantStr.indexOf('人工硬脑膜') !== -1) {
            $scope.plants[8] = '人工硬脑膜'
        }
        if (plantStr.indexOf('人工血管') !== -1) {
            $scope.plants[9] = '人工血管'
        }
        if (plantStr.indexOf('动脉瘤夹') !== -1) {
            $scope.plants[10] = '动脉瘤夹'
        }
        if (plantStr.indexOf('补片') !== -1) {
            $scope.plants[11] = '补片'
        }
        if (plantStr.indexOf('支架') !== -1) {
            $scope.plants[12] = '支架'
        }
        if (plantStr.indexOf('假体') !== -1) {
            $scope.plants[13] = '假体'
        }
        if (plantStr.indexOf('钉棒') !== -1) {
            $scope.plants[14] = '钉棒'
        }
        if (plantStr.indexOf('硅油') !== -1) {
            $scope.plants[15] = '硅油'
        }
    }

    $scope.save = function() {
        var plantStr = '';
        $scope.plants.forEach(function(item, index) {
            if (item) {
                plantStr += item + '、';
            }
        })
        plantStr = plantStr.substr(0, plantStr.length-1);
        $uibModalInstance.close(plantStr);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
