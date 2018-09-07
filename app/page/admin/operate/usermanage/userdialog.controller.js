userdialogCtrl.$inject = ['$rootScope','$scope','$filter','$uibModal','$uibModalInstance','$timeout','toastr','IHttp'];
module.exports = userdialogCtrl;
function userdialogCtrl($rootScope,$scope,$filter,$uibModal,$uibModalInstance,$timeout,toastr,IHttp) {
	var vm = this;
  var promise;
  vm.bus=[];
   var beid;

  // 获取系统时间
  vm.date = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
  if($scope.item != undefined){
      vm.title = "编辑用户信息";
      vm.user =$scope.item;
      beid=vm.user.beid;
      vm.user.locked = $scope.item.locked=="正常"?"0":"1";
      vm.user.enable = $scope.item.enable=="启用"?"1":"0"; 
      vm.user.roleId = vm.user.roleId+"";
      //console.log(vm.user);
      // 获取用户类型
      getimformation("userType");
      // 获取职称
      getimformation("professionalTitle");
      // 获取行政级别
      getimformation("executiveLevel");
      getrole();
      vm.state = "edit"
  }else{
      vm.title = "新增用户";
      vm.state = "add"
  }
  $scope.busparams = {
    timestamp:$scope.date,
    pageNo: 1,
    pageSize: 10000,
    sort: '',
    orderBy: '',
    filters: []
  };
  var getList = function() {
      IHttp.post('sys/selectBusEntityList', $scope.busparams)
        .then(
            function(rs) {
                var data=rs.data;             
              if(data.resultCode==="1"){
                    vm.bus = data.sysBusEntityList;
              }
            }
        );
    }
    getList();

     vm.changebeid = function(){
    beid=vm.user.beid;
    // 获取用户类型
    getimformation("userType");
    // 获取职称
    getimformation("professionalTitle");
    // 获取行政级别
    getimformation("executiveLevel");
    getrole();
  }

  // // 获取用户类型
  // getimformation("userType");
  // // 获取职称
  // getimformation("professionalTitle");
  // // 获取行政级别
  // getimformation("executiveLevel");


  function getimformation(value){

    IHttp.post('sys/getDictItemList',{
      groupId:value,
      beid:beid
    })
    .then(
        function(rs) {
                var data=rs.data;
                if(data.resultCode==="1"){
                  if(value=="userType"){
                    vm.userType = data.dictItemList;
                  }else if(value=="professionalTitle"){
                     vm.professionalTitle =data.dictItemList;
                  }else if(value=="executiveLevel"){
                    vm.executiveLevel =data.dictItemList;
                  }
            }
            }
    );
  }
  //getrole();

  function getrole(){

    IHttp.post('sys/getrolelist',{
      pageNo:'',
      pageSize:'',
      sort:"",
      orderBy:"",
      beid:beid,
      filters:[{
      field:"enable",
      value:1
      },{
      field:"beid",
      value:beid
      }]
      })
    .then(
        function(rs) {
                var data=rs.data;
                if(data.resultCode==="1"){
                  vm.role=data.sysMngRole;
        }
        }
    );
  }
  
  vm.save = function(type){
    var username=vm.user.username;
    var regEx = /^[a-zA-Z0-9_]{1,20}$/;
    if(!regEx.test(username)){
      //toastr.error("用户名必须是4-20位的英文数字或下划线。");
      vm.errorinfo="用户名必须是英文或数字";
      return false;
    }   

    if(vm.state==="edit"){
        if (promise) {
          $timeout.cancel(promise);
        }
        promise = $timeout(function() {
          IHttp.post('sys/updateUser',vm.user)
            .then(
                function(rs) {
                var data=rs.data;
                  if(data.resultCode==="1"){
                      $uibModalInstance.close();
                  }
                }
            );
        }, 500);
    }else{
        if (promise) {
          $timeout.cancel(promise);
        }
        promise = $timeout(function() {
          IHttp.post('sys/createUser',vm.user)
            .then(
                function(rs) {
                var data=rs.data;
                  if(data.resultCode==="1"){
                      $uibModalInstance.close();
                  }
                }
            );
        }, 500);
    }
  }

  vm.close = function(){
    $uibModalInstance.dismiss('cancel');
  }

}

