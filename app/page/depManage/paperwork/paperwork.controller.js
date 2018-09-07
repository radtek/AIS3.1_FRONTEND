PaperworkCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'i18nService', '$state', '$timeout'];

module.exports = PaperworkCtrl;

function PaperworkCtrl($rootScope, $scope, IHttp, $filter, i18nService, $state, $timeout) {
	i18nService.setCurrentLang('zh-cn');
	var promise;
	$scope.params = {
	    pageSize: 15,
	    filters:[]
	};

	$scope.queryObj = {
		startTime: '',
		endTime: ''
	}

	$scope.gridOptions = {
	    enableFiltering: true, //  表格过滤栏
	    enableGridMenu: true, //表格配置按钮
	    paginationPageSizes: [ 15, 30, 50],
	    paginationPageSize: $scope.params.pageSize,
	    enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 过滤的搜索
	    useExternalPagination: true, // 分页
	    useExternalSorting: true,
	    rowHeight: 40,
	    onRegisterApi: function(gridApi) {
	       
	        gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	            if (sortColumns.length === 0) {
	                $scope.params.orderBy = '';
	            } else {
	                $scope.params.orderBy = sortColumns[0].sort.direction;
	                $scope.params.sort = sortColumns[0].colDef.field;
	            }
	            $scope.getPage();
	        });
	        gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
	            $scope.params.pageNo = newPage;
	            $scope.params.pageSize = pageSize;
	            $scope.getPage();
	        });
	        gridApi.core.on.filterChanged($scope, function() {
	            if (promise) {
	                $timeout.cancel(promise);
	            }
	            promise = $timeout(function() {
	                var filterArr = [];
	                angular.forEach($scope.grid.columns, function(column) {
	                    var fieldName = column.field;
	                    var value = column.filters[0].term;
	                    if (value === null) {
	                        value = "";
	                    }
	                    if (value !== undefined) {
	                        filterArr.push({
	                            field: fieldName,
	                            value: value
	                        });
	                    }
	                });
	                $scope.params.filters = filterArr;
	                $scope.getPage();
	            }, 200)
	        });
	    },
	    columnDefs: [{
	        field: 'name',
	        displayName: '麻醉医生',
	        cellTooltip: function(row, col) {
	            return row.entity.name;
	        }
	    }
	    // ,{
	    //     field: 'sqfs',
	    //     displayName: '术前访视',
	    //     cellTemplate: '<div class="ui-grid-cell-contents" style="text-align: left !important;margin-left:20px;"><a href="">[</a><a href=""  ng-bind="row.entity.sqfswcs"></a><a href="">]</a>&nbsp;超时未完成<br/><a href="">[</a><a href="" ng-click="grid.appScope.detailRow(row)" ng-bind="row.entity.sqfscs"></a><a href="">]</a>&nbsp;超时完成</div>',
	    //     cellTooltip: function(row, col) {
	    //         return row.entity.sqfs;
	    //     }
	    // }
	    ]
	};

	$scope.getwcsRow = function(row,docname){
	       
	     return row.entity["'"+docname+"'"].split(',')[1];
	           
	        
	    };
	$scope.getcsRow = function(row,docname){                
	      return row.entity["'"+docname+"'"].split(',')[0];
	        
	    };
	
	$scope.getPage = function() {
	   IHttp.post('statistics/countAnaesDocDocumentCondition', $scope.queryObj).then((rs) => {
	                let columns = [];
	                let columnArr = rs.data.rslist;
	                let datalist=[];                       
	                if (columnArr.length > 0 ) {
	                    datalist=columnArr[0].docStateList;
	                    columns[0]={
	                        field: 'name',
	                        displayName: '麻醉医生'
	                    }
	                }
	                for (let i = 0; i < datalist.length; i++) {
	                    let column = {
	                        field:"'"+ datalist[i].docName+"'",
	                        displayName:datalist[i].docName,
	                        cellTemplate: '<div class="ui-grid-cell-contents">[<a href="" ng-bind="grid.appScope.getwcsRow(row,'+'\''+datalist[i].docName+'\''+')"></a>]超时未完成<br/>[<a href="" ng-bind="grid.appScope.getcsRow(row,'+'\''+datalist[i].docName+'\''+')"></a>]超时完成</div>'
	                    };
	                    columns[i + 1] = column;
	                }

	                for(let j=0;j<columnArr.length;j++){
	                    for(let k=0;k<columnArr[j].docStateList.length;k++)
	                    {
	                        columnArr[j]["'"+columnArr[j].docStateList[k].docName+"'"]=columnArr[j].docStateList[k].endTotal+","+columnArr[j].docStateList[k].unfinishedTotal;//"["+columnArr[j].docStateList[k].endTotal+"]超时完成["+columnArr[j].docStateList[k].unfinishedTotal+"]超时未完成";
	                    }
	                }

	                $scope.gridOptions.columnDefs = columns;
	                $scope.gridOptions.data = columnArr;

	            });
	}

	$scope.getPage();

	initQueryObj();

	function initQueryObj() {
		let endD = $filter('date')(new Date(), 'yyyy-MM-dd');
		let startD = new Date(endD);
		$scope.queryObj = {
		    startTime:$filter('date')(startD.setMonth(startD.getMonth() - 6), 'yyyy-MM-dd'),
		    endTime:endD
		};
	}

}
