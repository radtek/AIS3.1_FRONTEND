docConfig.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', 'select', 'confirm', 'toastr', '$timeout','auth'];

module.exports = docConfig;

function docConfig($rootScope, $scope, IHttp, $uibModalInstance, select, confirm, toastr, $timeout,auth) {
    var promise;
    
    $scope.roleList = [];
    $scope.catalogList = [];
    $scope.doc={};
    var user = auth.loginUser();

    if ($scope.item == undefined) {
        $scope.lable = "新增自定义文书";
    } else {
        $scope.lable = '设置自定义文书';  
        $scope.doc = angular.copy($scope.item);     
    }
    //seachDocThemeById 查询一条数据

    init();
    function init(){
        IHttp.post("document/findDocMenuPartIdByBeid", {}).then(function(data) {
            if (data.data.resultCode !== '1') return;
            $scope.roleList = data.data.roleList;
            $scope.catalogList = data.data.catalogList;
            if($scope.item && !!$scope.doc.roleIds){
                for (var i = 0; i < $scope.roleList.length; i++) {
                    if($scope.doc.roleIds.indexOf(","+$scope.roleList[i].roleId+",")>-1){
                        $scope.roleList[i].checked=true;
                    }else{
                        $scope.roleList[i].checked=false;
                    } 
                }
            }

            if($scope.item && !!$scope.doc.menuParentId){
                for (var j = 0; j < $scope.catalogList.length; j++) {
                    if($scope.doc.menuParentId.indexOf(","+$scope.catalogList[j].catalogId+",")>-1){
                        $scope.catalogList[j].checked=true;
                    }else{
                        $scope.catalogList[j].checked=false;
                    } 
                }
            }
            
        });


        // IHttp.post("document/seachDocThemeById",{'docThemeId' : $scope.doc.docThemeId}).then(function(data) {
        // });    
    }
    
    //点击科室的保存按钮
    $scope.saveDocSet = function() {       
        if (!$scope.doc.docThemeName) {
            toastr.error("文书名称不能为空！");
            return;
        }

        $scope.doc.roleIds= getRoleIds();
        $scope.doc.menuParentId=getCatalogList();
        if(!$scope.doc.themeState)
            $scope.doc.themeState=1;
        $scope.doc.isDelete=0;
        $scope.doc.originalHtml=undefined;
        $scope.doc.parseHtml=undefined;
        $scope.doc.beid = user.beid;
        if(!$scope.doc.createTime)
           $scope.doc.createTime = new Date();        
        
        console.log($scope.doc);
        $rootScope.btnActive = false;
        promise = $timeout(function() {
            IHttp.post("document/saveDocTheme", $scope.doc).then(function(rs) {
                $rootScope.btnActive = true;
                if (rs.data.resultCode === '1') {
                    $uibModalInstance.close();
                    toastr.success(rs.data.resultMessage);
                }
            });
        }, 500);
    }

    function getCatalogList(){
        var catalogid=",";
        for (var i = 0; i < $scope.catalogList.length; i++) {
           if(!!$scope.catalogList[i].checked)
             catalogid+=$scope.catalogList[i].catalogId+",";
        } 
        return catalogid;
    }

    function getRoleIds(){
        var roleId=",";
        for (var i = 0; i < $scope.roleList.length; i++) {
           if(!!$scope.roleList[i].checked)
             roleId+=$scope.roleList[i].roleId+",";
        } 
        return roleId;
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

}
