PipeWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param'];

module.exports = PipeWinCtrl;

function PipeWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param) {
    $scope.pipes = new Array(20);
    let pipeStr = param.pipe;
    let hasOtherPipe = pipeStr;

    if (pipeStr.indexOf('导尿管') !== -1) {
        $scope.pipes[0] = '导尿管';
        hasOtherPipe = hasOtherPipe.replace('导尿管','');
    }
    if (pipeStr.indexOf('气管插管') !== -1) {
        $scope.pipes[1] = '气管插管';
        hasOtherPipe = hasOtherPipe.replace('气管插管','');
    }
    if (pipeStr.indexOf('动脉导管') !== -1) {
        $scope.pipes[2] = '动脉导管';
        hasOtherPipe = hasOtherPipe.replace('动脉导管','');
    }
    if (pipeStr.indexOf('胃管') !== -1) {
        $scope.pipes[3] = '胃管';
        hasOtherPipe = hasOtherPipe.replace('胃管','');
    }
    if (pipeStr.indexOf('鼻肠管') !== -1) {
        $scope.pipes[4] = '鼻肠管';
        hasOtherPipe = hasOtherPipe.replace('鼻肠管','');
    }
    if (pipeStr.indexOf('鼻胆管') !== -1) {
        $scope.pipes[5] = '鼻胆管';
        hasOtherPipe = hasOtherPipe.replace('鼻胆管','');
    }
    if (pipeStr.indexOf('伤口引流管') !== -1) {
        $scope.pipes[6] = '伤口引流管';
        hasOtherPipe = hasOtherPipe.replace('伤口引流管','');
    }
    if (pipeStr.indexOf('腹腔引流管') !== -1) {
        $scope.pipes[7] = '腹腔引流管';
        hasOtherPipe = hasOtherPipe.replace('腹腔引流管','');
    }
    if (pipeStr.indexOf('腹膜后引流管') !== -1) {
        $scope.pipes[8] = '腹膜后引流管';
        hasOtherPipe = hasOtherPipe.replace('腹膜后引流管','');
    }
    if (pipeStr.indexOf('盆腔引流管') !== -1) {
        $scope.pipes[9] = '盆腔引流管';
        hasOtherPipe = hasOtherPipe.replace('盆腔引流管','');
    }
    if (pipeStr.indexOf('T管引流管') !== -1) {
        $scope.pipes[10] = 'T管引流管';
        hasOtherPipe = hasOtherPipe.replace('T管引流管','');
    }
    if (pipeStr.indexOf('肝周引流管') !== -1) {
        $scope.pipes[11] = '肝周引流管';
        hasOtherPipe = hasOtherPipe.replace('肝周引流管','');
    }
    if (pipeStr.indexOf('文氏孔引流管') !== -1) {
        $scope.pipes[12] = '文氏孔引流管';
        hasOtherPipe = hasOtherPipe.replace('文氏孔引流管','');
    }
    if (pipeStr.indexOf('肾造瘘管') !== -1) {
        $scope.pipes[13] = '肾造瘘管';
        hasOtherPipe = hasOtherPipe.replace('肾造瘘管','');
    }
    if (pipeStr.indexOf('膀胱造瘘管') !== -1) {
        $scope.pipes[14] = '膀胱造瘘管';
        hasOtherPipe = hasOtherPipe.replace('膀胱造瘘管','');
    }
    if (pipeStr.indexOf('胃造瘘管') !== -1) {
        $scope.pipes[15] = '胃造瘘管';
        hasOtherPipe = hasOtherPipe.replace('胃造瘘管','');
    }
    if (pipeStr.indexOf('腹膜透析管') !== -1) {
        $scope.pipes[16] = '腹膜透析管';
        hasOtherPipe = hasOtherPipe.replace('腹膜透析管','');
    }
    if (pipeStr.indexOf('VSD引流管') !== -1) {
        $scope.pipes[17] = 'VSD引流管';
        hasOtherPipe = hasOtherPipe.replace('VSD引流管','');
    }
    if (pipeStr.indexOf('脑室引流管') !== -1) {
        $scope.pipes[18] = '脑室引流管';
        hasOtherPipe = hasOtherPipe.replace('脑室引流管','');
    }
    hasOtherPipe = hasOtherPipe.replace(/、/g,'');
    if(hasOtherPipe.length>0){
        $scope.pipes[19] = hasOtherPipe;
        $scope.otherPostPipes = '1';
    }

    $scope.setOtherPipe = function(){
        if($scope.otherPostPipes === '1'){
            $scope.pipes[19] = "";
        }
    }

    $scope.save = function() {
        var pipeStr = '';
        $scope.pipes.forEach(function(item, index) {
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
