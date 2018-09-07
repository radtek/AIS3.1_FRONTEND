announcementDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', 'confirm', 'toastr', '$timeout'];

module.exports = announcementDictionary;

function announcementDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, confirm, toastr, $timeout) {
	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;

    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getPage();
            });
            //过滤
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach($scope.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params.filters = filterArr;
                    getPage();
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'title',
            displayName: '标题',
            cellTooltip: function(row, col) {
                return row.entity.title;
            }
        }, {
            field: 'content',
            displayName: '公告内容',
            cellTooltip: function(row, col) {
                return row.entity.content;
            }
        }, {
            field: 'createUserName',
            displayName: '创建者',
            cellTooltip: function(row, col) {
                return row.entity.createUserName;
            }
        }, {
            field: 'timeStr',
            displayName: '创建时间',
            cellTooltip: function(row, col) {
                return row.entity.timeStr;
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="" ng-click=grid.appScope.delAnnouncement(row)>删除</a><span></div>',
        }],
        data: []
    };

    $scope.editAnnouncement = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.id = 0;
        } else {
            scope.id = row.entity.id;
        }
        $uibModal.open({
            animation: true,
            template: require('./editAnnouncementDictionary.html'),
            controller: require('./editAnnouncementDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getPage();
        });
    }

    $scope.delAnnouncement = function(row){
		confirm.show('你是否要删除该公告信息？').then(function () {
	        IHttp.post('basedata/deleteAnnouncement', {id : row.entity.id}).then(function(rs) {
	            if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
            		getPage();
	            }
	        });
		}, function() {
			return;
		});
    }

    $scope.refresh = function() {
        getPage();
    }

    var getPage = function() {
        IHttp.post("basedata/searchAllAnnouncement", $scope.params).then(function(data) {
        	data = data.data;
            $scope.gridOptions.totalItems = data.total;
            $scope.gridOptions.data = data.resultList;
        });
    }
    getPage();
}
