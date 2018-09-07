CollectionConfigCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'i18nService', 'uiGridConstants', 'toastr', '$uibModal', '$timeout'];

module.exports = CollectionConfigCtrl;

function CollectionConfigCtrl($rootScope, $scope, IHttp, i18nService, uiGridConstants, toastr, $uibModal, $timeout) {
    i18nService.setCurrentLang('zh-cn');

    var promise;
    var params = {
        "pageNo": 1,
        "pageSize": 15,
        "sort": "",
        "orderBy": "",
        "filters": []
    }

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 使用外部过滤
        useExternalPagination: true, // 使用外部分页
        paginationPageSizes: [ 15, 30, 50], // 配置每页行数可选参数
        rowHeight: 40,
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                init();
            });
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
                        if (!!value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    init();
                }, 2000)
            });
        },
        columnDefs: [{
                field: 'beid',
                name: '局点编码'
            }, {
                field: 'beName',
                name: '局点名称',
                enableSorting: false,
                enableFiltering: false
            }, {
                field: 'eventId',
                name: '指标ID'
            }, {
                field: 'eventName',
                name: '指标代码'
            }, {
                field: 'precision',
                name: '采样精度'
            }, {
                field: 'frequency',
                name: '采样频率'
            }, {
                field: 'max',
                name: '阀值上限'
            }, {
                field: 'min',
                name: '阀值下限'
            },
            /*{
                       field: 'amendFlag',
                       name: '修正缺失',
                       filter: {
                           type: uiGridConstants.filter.SELECT,
                           selectOptions: [{ value: 1, label: '修正' }, { value: 0, label: '缺失' }]
                       },
                       cellFilter: 'amendFlag',
                       visible: true
                   },*/
            {
                field: 'color',
                name: '颜色',
                enableSorting: false,
                enableFiltering: false
            }, {
                field: 'icon',
                name: '图标',
                enableSorting: false,
                enableFiltering: false
            }, {
                field: 'units',
                name: '单位'
            }, {
                field: 'limitMax',
                name: '最大值'
            }, {
                field: 'limitMin',
                name: '最小值'
            }, {
                field: 'eventDesc',
                name: '指标描述'
            }, {
                name: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.edit(row.entity)>编辑</a><span>|</span><a ng-really-message="是否确定删除?" confirm=grid.appScope.del(row.entity)>删除</a></div>'
            }
        ]
    };

    $scope.btnImport = function() {

    }

    $scope.btnAdd = function() {
        showModule();
    }

    $scope.edit = function(entity) {
        showModule(entity);
    }

    $scope.del = function(entity) {
        IHttp.post('bas/delMonitorConfig', { beid: entity.beid, eventId: entity.eventId }).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var list = $scope.gridOptions.data;
            for (var a = 0; a < list.length; a++) {
                if (list[a].id == entity.id) {
                    list.splice(a, 1);
                }
            }
        });
    }

    function showModule(entity) {
        var scope = $rootScope.$new();
        scope.item = {
            opt: entity
        };
        var modalInstance = $uibModal.open({ 
            animation: true,
            template: require('./modal.html'),
            controller: require('./modal.controller'),
            backdrop: 'static',
            scope: scope
        });
        modalInstance.result.then(function(data) {
            init();
        }, function(data) {
            console.log(data)
        });
    }

    init();

    function init() {
        IHttp.post('bas/selectMonitorConfig', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
            var data = rs.data;
            $scope.gridOptions.data = data.resultList;
            $scope.gridOptions.totalItems = data.total;
        });
    }
}
