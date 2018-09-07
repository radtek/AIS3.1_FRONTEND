OtherWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param'];

module.exports = OtherWinCtrl;

function OtherWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param) {
    $scope.pipe = new Array(15);
    let other2 = param.other2;
    if (other2.indexOf('鼻肠管') !== -1) {
        $scope.pipe[0] = '鼻肠管'
    }
    if (other2.indexOf('胃管') !== -1) {
        $scope.pipe[1] = '胃管'
    }
    if (other2.indexOf('鼻胆管') !== -1) {
        $scope.pipe[2] = '鼻胆管'
    }
    if (other2.indexOf('胃造瘘管') !== -1) {
        $scope.pipe[3] = '胃造瘘管'
    }
    if (other2.indexOf('膀胱造瘘管') !== -1) {
        $scope.pipe[4] = '膀胱造瘘管'
    }
    if (other2.indexOf('T管引流管') !== -1) {
        $scope.pipe[5] = 'T管引流管'
    }
    if (other2.indexOf('文氏孔引流管') !== -1) {
        $scope.pipe[6] = '文氏孔引流管'
    }
    if (other2.indexOf('肾造瘘管') !== -1) {
        $scope.pipe[7] = '肾造瘘管'
    }
    if (other2.indexOf('肝周引流管') !== -1) {
        $scope.pipe[8] = '肝周引流管'
    }
    if (other2.indexOf('VSD引流管') !== -1) {
        $scope.pipe[9] = 'VSD引流管'
    }
    if (other2.indexOf('腹膜透析管') !== -1) {
        $scope.pipe[10] = '腹膜透析管'
    }
    if (other2.indexOf('腹膜后引流管') !== -1) {
        $scope.pipe[11] = '腹膜后引流管'
    }
    if (other2.indexOf('盆腔引流管') !== -1) {
        $scope.pipe[12] = '盆腔引流管'
    }
    if (other2.indexOf('腹腔引流管') !== -1) {
        $scope.pipe[13] = '腹腔引流管'
    }
    if (other2.indexOf('脑室引流管') !== -1) {
        $scope.pipe[14] = '脑室引流管'
    }

    $scope.save = function() {
        var pipeStr = '';
        $scope.pipe.forEach(function(item, index) {
            if (item) {
                pipeStr += item + '、';
            }
        })
        pipeStr = pipeStr.substr(0, pipeStr.length-1);
        $uibModalInstance.close(pipeStr);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
