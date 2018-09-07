PostPipeWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'auth', 'param'];

module.exports = PostPipeWinCtrl;

function PostPipeWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, auth, param) {
    $scope.postPipes = new Array(20);
    $scope.beCode = auth.loginUser().beCode;
    let postPipesStr = param.postPipe;
    let hasOtherPipe = postPipesStr;

    if (postPipesStr) {
        if (postPipesStr.indexOf('导尿管') !== -1) {
            $scope.postPipes[0] = '导尿管';
            hasOtherPipe = hasOtherPipe.replace('导尿管','');
        }
        if (postPipesStr.indexOf('胃管') !== -1) {
            $scope.postPipes[1] = '胃管';
            hasOtherPipe = hasOtherPipe.replace('胃管','');
        }
        if (postPipesStr.indexOf('鼻肠管') !== -1) {
            $scope.postPipes[2] = '鼻肠管';
            hasOtherPipe = hasOtherPipe.replace('鼻肠管','');
        }
        if (postPipesStr.indexOf('鼻胆管') !== -1) {
            $scope.postPipes[3] = '鼻胆管';
            hasOtherPipe = hasOtherPipe.replace('鼻胆管','');
        }
        if (postPipesStr.indexOf('伤口引流管') !== -1) {
            $scope.postPipes[4] = '伤口引流管';
            hasOtherPipe = hasOtherPipe.replace('伤口引流管','');
        }
        if (postPipesStr.indexOf('腹腔引流管') !== -1) {
            $scope.postPipes[5] = '腹腔引流管';
            hasOtherPipe = hasOtherPipe.replace('腹腔引流管','');
        }
        if (postPipesStr.indexOf('腹膜后引流管') !== -1) {
            $scope.postPipes[6] = '腹膜后引流管';
            hasOtherPipe = hasOtherPipe.replace('腹膜后引流管','');
        }
        if (postPipesStr.indexOf('盆腔引流管') !== -1) {
            $scope.postPipes[7] = '盆腔引流管';
            hasOtherPipe = hasOtherPipe.replace('盆腔引流管','');
        }
        if (postPipesStr.indexOf('T管引流管') !== -1) {
            $scope.postPipes[8] = 'T管引流管';
            hasOtherPipe = hasOtherPipe.replace('T管引流管','');
        }
        if (postPipesStr.indexOf('肝周引流管') !== -1) {
            $scope.postPipes[9] = '肝周引流管';
            hasOtherPipe = hasOtherPipe.replace('肝周引流管','');
        }
        if (postPipesStr.indexOf('文氏孔引流管') !== -1) {
            $scope.postPipes[10] = '文氏孔引流管';
            hasOtherPipe = hasOtherPipe.replace('文氏孔引流管','');
        }
        if (postPipesStr.indexOf('肾造瘘管') !== -1) {
            $scope.postPipes[11] = '肾造瘘管';
            hasOtherPipe = hasOtherPipe.replace('肾造瘘管','');
        }
        if (postPipesStr.indexOf('膀胱造瘘管') !== -1) {
            $scope.postPipes[12] = '膀胱造瘘管';
            hasOtherPipe = hasOtherPipe.replace('膀胱造瘘管','');
        }
        if (postPipesStr.indexOf('胃造瘘管') !== -1) {
            $scope.postPipes[13] = '胃造瘘管';
            hasOtherPipe = hasOtherPipe.replace('胃造瘘管','');
        }
        if (postPipesStr.indexOf('腹膜透析管') !== -1) {
            $scope.postPipes[14] = '腹膜透析管';
            hasOtherPipe = hasOtherPipe.replace('腹膜透析管','');
        }
        if (postPipesStr.indexOf('VSD引流管') !== -1) {
            $scope.postPipes[15] = 'VSD引流管';
            hasOtherPipe = hasOtherPipe.replace('VSD引流管','');
        }
        if (postPipesStr.indexOf('脑室引流管') !== -1) {
            $scope.postPipes[16] = '脑室引流管';
            hasOtherPipe = hasOtherPipe.replace('脑室引流管','');
        }
        if (postPipesStr.indexOf('胸腔引流管') !== -1) {
            $scope.postPipes[18] = '胸腔引流管';
            hasOtherPipe = hasOtherPipe.replace('胸腔引流管','');
        }
        if (postPipesStr.indexOf('脾窝引流管') !== -1) {
            $scope.postPipes[19] = '脾窝引流管';
            hasOtherPipe = hasOtherPipe.replace('脾窝引流管','');
        }
        hasOtherPipe = hasOtherPipe.replace(/、/g,'');
        if(hasOtherPipe.length>0){
            $scope.postPipes[17] = hasOtherPipe;
            $scope.otherPostPipes = '1';
        }
    }

    $scope.setOtherPipe = function(){
        if($scope.otherPostPipes === '1'){
            $scope.postPipes[17] = "";
        }
    }

    $scope.save = function() {
        var postPipeStr = '';
        $scope.postPipes.forEach(function(item, index) {
            if (item) {
                postPipeStr += item + '、';
            }
        })
        postPipeStr = postPipeStr.substr(0, postPipeStr.length-1);
        $uibModalInstance.close(postPipeStr);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
