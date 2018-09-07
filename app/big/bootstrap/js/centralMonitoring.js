angular.module("centralMonitoring", []).controller("centralMonitoringCtrl", ["$scope","$http","$interval", function ($scope,$http,$interval) {
	var screenPort = ipPort?ipPort:sessionStorage.getItem('screenPort');
	var baseUrl ="";
	if(screenPort){
		baseUrl = 'http://' + screenPort;//ajax服务器地址 
	}else{
		baseUrl = 'http://192.168.5.5:8189/' //ajax服务器地址
	}
	
	$scope.nowdate= new Date();
	$scope.pageNo=1;//默认当前页
	$scope.pageCount=1;//默认总页数
	$scope.pageSize=pageSize?pageSize:24;//默认一页有多少条	
	$scope.miao = ['5','10','20','30','40','50','60','120','180','240','300'];//翻页时间下拉值
	$scope.showFree = '1';
	$scope.flipTime = '120';
	$scope.resultList = [];

	getData();

	
	$scope.changeNullBed = function(e){
		$http({
		    method: 'POST',
		    url: baseUrl + 'sys/upDictItem',
		    data:{"groupId":"show_free_bed","codeName":"显示空床(1是0否)","codeValue":$scope.showFree}		    
		}).then(function(rs) {
		    //console.log(rs);
		    if (rs.data.resultCode != '1')
		    	console.log(rs.data.resultMessage);	
		    	getData();	    
		}, function(err) {
		    console.log(new Date().toLocaleString(), err);
		});	
	}

	 

	$scope.changePageTime= function(e){
		
		$http({
		    method: 'POST',
		    url: baseUrl + 'sys/upDictItem',
		    data:{"groupId":"screen_flip_time","codeName":"翻页时间(秒)","codeValue":$scope.flipTime}		    
		}).then(function(rs) {
		    //console.log(rs);
		    if (rs.data.resultCode != '1')
		    	console.log(rs.data.resultMessage);		    		    
		    getData();	  
		}, function(err) {
		    console.log(new Date().toLocaleString(), err);
		});	
		
	}

	function getData(){
		$http({
		    method: 'POST',
		    url: baseUrl + 'operCtl/queryCentralBigScreenData',		    
		}).then(function(rs) {
		    //console.log(rs);
		    if (rs.data.resultCode != '1'){
		    	console.log(rs.data.resultMessage);
		    }else{
		    	var data = rs.data.resultList;		    	
		    	//添加50条假数据测试分页
		    	// for (var i = 0; i < 50; i++) {
		    	// 	var obj = angular.copy(data[0]);
		    	// 	obj.abpSysValue=i;
		    	// 	obj.operRoomId=i+2;
		    	// 	data.push(obj);
		    	// }
		    	$scope.resultList = data;

	        		setPageData();  			    		    	
		    		
		    		$scope.flipTime = rs.data.flipTime;
		    		$scope.showFree = rs.data.showFree;
		    		$scope.pageCount = Math.ceil(data.length/$scope.pageSize);

		    		
		    	
		    }		    
		}, function(err) {
		    console.log(new Date().toLocaleString(), err);
		});		
	}	



	// 定时刷新数据，病人生命体征定时获取
    if(!!interVits){
        clearInterval(interVits);
    }
    
    var interVits= $interval(function() {
        var getpatvitsigtime=sessionStorage.getItem("getbigtvData");
        var nowTime=new Date().getTime();
        if(!getpatvitsigtime){
            sessionStorage.setItem("getbigtvData",nowTime);
            getpatvitsigtime=0;
        }
        //每秒更新一次生命体征数据        
        if(nowTime-getpatvitsigtime>1000){
            getData(); 
        }
        //定时翻页
        var patlen=$scope.resultList.length;
        if(patlen>$scope.pageSize){
        	var getchangepagetime=sessionStorage.getItem("changepagetime");
        	if(!getchangepagetime){
        	    sessionStorage.setItem("changepagetime",nowTime); 
        	    getchangepagetime=0;       	    
        	}
        	nowTime=new Date().getTime();
        	if(nowTime-getchangepagetime>$scope.flipTime*1000){
        		sessionStorage.setItem("changepagetime",nowTime);         	             
        	        if($scope.pageNo >= $scope.pageCount){
        	          $scope.pageNo=1;
        	          getData();  
        	        }else{
        	          $scope.pageNo=$scope.pageNo+1;
        	        }
        	     setPageData();     	                      
        	    
        	}

        }
    },1000);

    function setPageData(){
    	var start = $scope.pageNo*$scope.pageSize-$scope.pageSize;
    	var to = $scope.pageNo*$scope.pageSize-1;
    	var patlen=$scope.resultList.length;
    	if(to>=patlen){
    	  to=patlen-1;
    	}
    	for (var j = 0; j<patlen; j++) {
    		if(j>=start && j<=to)
    			$scope.resultList[j].notshow=false;
    		else        	        	 
    	    	$scope.resultList[j].notshow=true;
    	}      
    }

}]);