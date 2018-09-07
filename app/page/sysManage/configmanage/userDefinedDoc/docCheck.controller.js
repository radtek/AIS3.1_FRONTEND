docConfig.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout','auth'];

module.exports = docConfig;

function docConfig($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout,auth) {
    var promise;
    
    $scope.roleList = [];
    $scope.catalogList = [];
    $scope.doc={};
    var user = auth.loginUser();

    $scope.lable = '审核自定义文书';  
    $scope.doc = angular.copy($scope.item);

    init();
    function init(){
        IHttp.post("document/seachDocThemeById",{'docThemeId' : $scope.doc.docThemeId}).then(function(rs) {
            if (rs.data.resultCode === '1') {
                var parseHtml = rs.data.docTheme.parseHtml;
                $("#dochtml").html(parseHtml);
            }
        });           
    }
    
    //点击科室的保存按钮
    $scope.saveDocSet = function(state) {       
        $scope.doc.themeState=state;    
        $scope.doc.originalHtml=undefined;
        $scope.doc.parseHtml=undefined;          
        $rootScope.btnActive = false;
        var url="document/saveDocTheme";
        if(state=='3'){
            url="document/docThemeExaminationPassed";
        }
        promise = $timeout(function() {
            IHttp.post(url, $scope.doc).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    //toastr.success(rs.data.resultMessage);
                    toastr.success("审核成功，重新登录后即可在查看患者文书时操作该文书。");
                }
            });
        }, 500);
    }

  
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

}
