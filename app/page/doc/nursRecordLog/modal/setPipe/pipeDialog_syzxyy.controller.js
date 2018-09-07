PipeSyzxyyWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param'];

module.exports = PipeSyzxyyWinCtrl;

function PipeSyzxyyWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param) {
    $scope.pipes = new Array(19);
    let pipeStr = param.pipe;
    $scope.other = param.other;

    if (pipeStr.indexOf('导尿管') !== -1) {
        $scope.pipes[0] = '导尿管'
    }
    if (pipeStr.indexOf('气管插管') !== -1) {
        $scope.pipes[1] = '气管插管'
    }
    if (pipeStr.indexOf('动脉导管') !== -1) {
        $scope.pipes[2] = '动脉导管'
    }
    if (pipeStr.indexOf('胃管') !== -1) {
        $scope.pipes[3] = '胃管'
    }
    if (pipeStr.indexOf('鼻肠管') !== -1) {
        $scope.pipes[4] = '鼻肠管'
    }
    if (pipeStr.indexOf('鼻胆管') !== -1) {
        $scope.pipes[5] = '鼻胆管'
    }
    if (pipeStr.indexOf('伤口引流管') !== -1) {
        $scope.pipes[6] = '伤口引流管'
    }
    if (pipeStr.indexOf('腹腔引流管') !== -1) {
        $scope.pipes[7] = '腹腔引流管'
    }
    if (pipeStr.indexOf('腹膜后引流管') !== -1) {
        $scope.pipes[8] = '腹膜后引流管'
    }
    if (pipeStr.indexOf('盆腔引流管') !== -1) {
        $scope.pipes[9] = '盆腔引流管'
    }
    if (pipeStr.indexOf('T管引流管') !== -1) {
        $scope.pipes[10] = 'T管引流管'
    }
    if (pipeStr.indexOf('肝周引流管') !== -1) {
        $scope.pipes[11] = '肝周引流管'
    }
    if (pipeStr.indexOf('文氏孔引流管') !== -1) {
        $scope.pipes[12] = '文氏孔引流管'
    }
    if (pipeStr.indexOf('肾造瘘管') !== -1) {
        $scope.pipes[13] = '肾造瘘管'
    }
    if (pipeStr.indexOf('膀胱造瘘管') !== -1) {
        $scope.pipes[14] = '膀胱造瘘管'
    }
    if (pipeStr.indexOf('胃造瘘管') !== -1) {
        $scope.pipes[15] = '胃造瘘管'
    }
    if (pipeStr.indexOf('腹膜透析管') !== -1) {
        $scope.pipes[16] = '腹膜透析管'
    }
    if (pipeStr.indexOf('VSD引流管') !== -1) {
        $scope.pipes[17] = 'VSD引流管'
    }
    if (pipeStr.indexOf('脑室引流管') !== -1) {
        $scope.pipes[18] = '脑室引流管'
    }
    $scope.save = function() {
        var pipeStr = '',
            params = {};
        $scope.pipes.forEach(function(item, index) {
            if (item) {
                pipeStr += item + '、';
            }
        })
        pipeStr = pipeStr.substr(0, pipeStr.length-1);
        params.pipeStr = pipeStr;
        params.other = $scope.other;
        $uibModalInstance.close(params);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
