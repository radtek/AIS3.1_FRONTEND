StatQueryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', '$timeout', 'select', 'toastr'];

module.exports = StatQueryCtrl;

function StatQueryCtrl($rootScope, $scope, IHttp, $filter, $timeout, select, toastr) {
	$scope.switchTab = function(tabIndex) {
		$scope.tabIndex = tabIndex;
		$scope.$broadcast('switchTab',tabIndex);
		// $scope.queryObj.timeType = '1';
		// $timeout(function() {
		// 	$scope.query();
		// }, 500);
	}

	$scope.query = function() {
		let stD = $filter('date')($scope.queryObj.startTime, 'yyyy-MM-dd');
		let enD = $filter('date')($scope.queryObj.endTime, 'yyyy-MM-dd');

		let queryParam = {
			"timeType":$scope.queryObj.timeType,
			"timeRang":$scope.queryObj["timeRange"+$scope.queryObj.timeType],
			"operRoomId":($scope.queryObj.operRoomId==='null')?'':$scope.queryObj.operRoomId,
			"operatorId":($scope.queryObj.operatorId==='null')?'':$scope.queryObj.operatorId,
			"startTime":stD,
			"endTime":enD,
			"deptId":($scope.queryObj.deptId==='null')?'':$scope.queryObj.deptId,
			"anesthetistId" : ($scope.queryObj.anesthetistId==='null')?'':$scope.queryObj.anesthetistId,
			"countType":($scope.queryObj.countType==='null')?'':$scope.queryObj.countType,
			"nurseId" : ($scope.queryObj.nurseId==='null')?'':$scope.queryObj.nurseId
		}
		$scope.$broadcast('query',queryParam);
		
	}

	initQueryObj();
	watchChange();

	$scope.export = function() {
		$scope.$broadcast('export');
	}

	$scope.$on('childInited',() => {
		initQueryObj();
		$scope.query();
	})

	function initQueryObj() {
		$scope.tabIndex = 0;
		let endD = $filter('date')(new Date(), 'yyyy-MM-dd');
		let startD = new Date(endD);
		$scope.queryObj = {
		    startTime:$filter('date')(startD.setMonth(startD.getMonth() - 1), 'yyyy-MM-dd'),
		    endTime:endD,
		    timeType:'3',
		    timeRange1:'0',
		    timeRange2:'0',
		    timeRange3:'0',
		    operRoomId:'',
		    deptId: '',
		    countType: '1',
		    operatorId: '',
		    anesthetistId: '',
		    nurseId: ''
		};
		changeTimeRange($scope.queryObj);
	}

	/**
	 * 根据当前的查询条件设置好查询的时间范围
	 * @param  {Object} queryObj 当前tab页的查询条件对象
	 * @return {void}          无返回
	 */
	function changeTimeRange(queryObj) {
	    let times = 1;//根据timeType算出倍数
	    let range = queryObj['timeRange' + queryObj.timeType];
	    let startTime = new Date();
	    let endTime = new Date();
	    endTime = new Date();
	    switch(queryObj.timeType){
	        case '1':
	            times = 1;
	            if (range === '0') {
	                startTime.setDate(1);
	            } else {
	            	startTime.setDate(1);//先修改日期再修改月份，不然在大月份的31号无法设置月份
	                startTime.setMonth(startTime.getMonth() - times * parseInt(queryObj['timeRange' + queryObj.timeType]));
	                
	                endTime.setDate(0);
	            }
	            break;
	        case '2':
	            times = 3;
	            var timeNow = new Date();
	            var season = Math.floor(timeNow.getMonth()/3);
	            var leftMonInSeason = timeNow.getMonth()%3;
	            if (range === '0') {
	                startTime.setMonth(3 * season);
	                startTime.setDate(1);

	            } else {
	                startTime.setMonth(3 * (season - range));
	                
	                
	                startTime.setDate(1);

	                endTime.setMonth(3 * season);
	                endTime.setDate(0);
	            }
	            break;
	        case '3':
	            times = 12;
	            if (range === '0') {
	                startTime.setMonth(0);
	                startTime.setDate(1);
	            } else {
	                startTime.setMonth(startTime.getMonth() - times * parseInt(queryObj['timeRange' + queryObj.timeType]));
	                startTime.setMonth(0);
	                startTime.setDate(1);
	                endTime.setMonth(0);
	                endTime.setDate(0);


	            }
	            
	            break;
	        default:
	            startTime.setDate(1);
	            break;

	    };
	    queryObj.startTime = $filter('date')(startTime, 'yyyy-MM-dd');
	    queryObj.endTime = $filter('date')(endTime, 'yyyy-MM-dd');

	}

	/**
	 * 监视各个页面搜索元素的变化
	 * @param  {Object} queryObj 查询元素对象
	 * @return {void}          无返回
	 */
	function watchChange() {
	    // var queryObj = eval('$scope.' + queryObjStr);
	    $scope.$watch('queryObj.timeType',function(newVal,oldVal){
	        changeTimeRange($scope.queryObj);
	    });

	    $scope.$watch('queryObj.timeRange1',function(newVal,oldVal){
	        if ($scope.queryObj.timeType == '1') {
	            changeTimeRange($scope.queryObj);
	        }

	    });

	    $scope.$watch('queryObj.timeRange2',function(newVal,oldVal){
	        if ($scope.queryObj.timeType == '2') {
	            changeTimeRange($scope.queryObj);
	        }

	    });

	    $scope.$watch('queryObj.timeRange3',function(newVal,oldVal){
	        if ($scope.queryObj.timeType == '3') {
	            changeTimeRange($scope.queryObj);
	        }

	    });
	}

	select.dept().then((rs) => {
		if(rs.data.resultCode != 1)
			return;
		$scope.deptList = rs.data.resultList;
	});

	select.operroom().then((rs) => {
		if(rs.data.resultCode != 1)
			return;
		$scope.operroomList = rs.data.resultList;
	})

	select.getAnaesthetists().then((rs) => {
		if(rs.data.resultCode != 1)
			return;
		$scope.anaesthetistList = rs.data.userItem;
	})

	select.getNurses().then((rs) => {
		if(rs.data.resultCode != 1)
			return;
		$scope.nurseList = rs.data.userItem;
	})


	select.getOperators().then((rs) => {
		if(rs.length <= 0)
            return;
        $scope.operatorList = rs;
	})
}
