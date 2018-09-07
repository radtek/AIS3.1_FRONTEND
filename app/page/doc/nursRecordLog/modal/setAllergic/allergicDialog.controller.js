AllergicWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param'];

module.exports = AllergicWinCtrl;

function AllergicWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param) {
    $scope.allergics = new Array(9);
    let allergic = param.allergic;

    var otherStr = allergic.replace(new RegExp(/\、/g), '');
    if (allergic.indexOf('青霉素类') !== -1) {
        $scope.allergics[0] = '青霉素类';
        otherStr = otherStr.replace('青霉素类','');
    }
    if (allergic.indexOf('头孢类') !== -1) {
        $scope.allergics[1] = '头孢类';
        otherStr = otherStr.replace('头孢类','');
    }
    if (allergic.indexOf('喹诺酮类') !== -1) {
        $scope.allergics[2] = '喹诺酮类';
        otherStr = otherStr.replace('喹诺酮类','');
    }
    if (allergic.indexOf('磺胺类') !== -1) {
        $scope.allergics[3] = '磺胺类';
        otherStr = otherStr.replace('磺胺类','');
    }
    if (allergic.indexOf('破伤风') !== -1) {
        $scope.allergics[4] = '破伤风';
        otherStr = otherStr.replace('破伤风','');
    }
    if (allergic.indexOf('氨基甙类') !== -1) {
        $scope.allergics[5] = '氨基甙类';
        otherStr = otherStr.replace('氨基甙类','');
    }
    if (allergic.indexOf('碘剂') !== -1) {
        $scope.allergics[6] = '碘剂';
        otherStr = otherStr.replace('碘剂','');
    }
    if (allergic.indexOf('泛影葡胺') !== -1) {
        $scope.allergics[7] = '泛影葡胺';
        otherStr = otherStr.replace('泛影葡胺','');
    }
    $scope.allergics[8] = otherStr;

    $scope.save = function() {
        var allergicStr = '';
        $scope.allergics.forEach(function(item, index) {
            if (item) {
                allergicStr += item + '、';
            }
        })
        allergicStr = allergicStr.substr(0, allergicStr.length-1);
        $uibModalInstance.close(allergicStr);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
