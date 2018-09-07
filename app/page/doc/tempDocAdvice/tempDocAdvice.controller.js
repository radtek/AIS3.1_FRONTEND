TempDocAdviceCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'toastr', 'select', '$q', 'auth', 'confirm', '$filter'];

module.exports = TempDocAdviceCtrl;

function TempDocAdviceCtrl($rootScope, $scope, IHttp, $uibModal, toastr, select, $q, auth, confirm, $filter) {
    var vm = this,
        promise;
    let regOptId = $rootScope.$state.params.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.processState = 'NO_END';
    $scope.$emit('readonly', $scope.setting);
    $scope.$emit('changeBtnText', { id: 'syncHisBtn', text: '同步到HIS'});
    $scope.docInfo = auth.loginUser();

    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
    });

    $scope.gridOptions = {
        enableFiltering: false, //  表格过滤栏
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false, // 过滤的搜索
        useExternalPagination: false, // 分页
        useExternalSorting: true,
        columnDefs: [{
                field: 'doctorTime',
                displayName: '开始时间',
                width: 90,
                cellFilter: 'date:"MM-dd HH:mm"',
                cellTooltip: function(row, col) {
                    return $filter('date')(row.entity.doctorTime,'yyyy-MM-dd HH:mm');
                }
            }, {
                field: 'name',
                displayName: '医嘱项目',
                cellTooltip: function(row, col) {
                    return row.entity.name;
                },
                cellTemplate: '<div style="text-align:left !important;line-height:30px;padding-left:3px;">{{row.entity.name}}</div>'
            }, {
                field: 'dosageUnit',
                displayName: '剂量',
                cellTooltip: function(row, col) {
                    return row.entity.dosage + row.entity.unit;
                },
                width: 60
            }, {
                field: 'number1',
                displayName: '数量',
                cellTooltip: function(row, col) {
                    return row.entity.number1;
                },
                width: 60
            }, {
                field: 'freq',
                displayName: '用法',
                width: 55,
                cellTooltip: function(row, col) {
                    return row.entity.freq;
                }
            }, {
                field: 'method',
                displayName: '途径',
                cellTooltip: function(row, col) {
                    return row.entity.method;
                },
                width: 55
            }, {
                field: 'doctor',
                displayName: '医师签名',
                cellTooltip: function(row, col) {
                    return row.entity.doctor;
                },
                width:85
            }, {
                field: 'checkor',
                displayName: '护士签名',
                cellTooltip: function(row, col) {
                    return row.entity.checkor;
                },
                width:85
            }, {
                field: 'excutor',
                displayName: '执行人',
                enableCellEdit: true,
                cellTemplate: '<md-autocomplete ng-if="row.entity.$$treeLevel===0" md-selected-item="row.entity.excutor" md-search-text="circunur" md-items="item in grid.appScope.getExcutorList(circunur)" md-item-text="item.name" md-autoselect="true" md-no-cache="true"><md-item-template><span md-highlight-text="row.entity.excutor">{{item.name}}</span></md-item-template><md-not-found>没有结果</md-not-found></md-autocomplete>',
                cellTooltip: function(row, col) {
                    return row.entity.excutor;
                },
                width: 70
            }, {
                field: 'excuteTime',
                displayName: '执行时间',
                enableCellEdit: true,
                cellTemplate: '<input ng-if="row.entity.$$treeLevel===0" h-type="datetime-local" ng-model="row.entity.excuteTime"></input>',
                cellTooltip: function(row, col) {
                    return row.entity.excuteTime;
                },
                width: 105
            }]
    };
    
    function save() {
        let content = '确定将数据同步到HIS？<br>选择"是"将数据同步到HIS，选择"否"取消同步';
        confirm.show(content).then(function(data) {
            var postData = [];
            angular.forEach($scope.gridOptions.data, function(item) {
                if (item.$$treeLevel === 0) {
                    postData.push(
                        {
                            zyhm: item.zyhm, 
                            groupId: item.groupId, 
                            excutorId: item.excutor ? item.excutor.loginName : '', 
                            excutor: item.excutor ? item.excutor.name : '', 
                            excuteTime: $filter('date')(item.excuteTime,'yyyy-MM-dd HH:mm') + ':00'
                        }
                    );
                }
            });
            IHttp.post("interfacedata/sendDoctorExcuteList", postData).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                }
            });
        });
    }

    $scope.getExcutorList = function(query) {
        var deferred = $q.defer();
        if (query === '') {
            return [];
        }
        user.query({
            filters: [
                { field: 'delFlag', value: '1' },
                { field: 'userType', value: 'NURSE' },
                { field: 'pinyin', value: query }
            ]
        }).then(function(rs) {
            return deferred.resolve(rs.data.userItem);
        });
        return deferred.promise;
    }

    initData();

    function initData() {
        IHttp.post("interfacedata/queryDoctorOrderList", { regOptId: regOptId}).then(function(rs) {
            if (rs.data.resultCode !== '1')
                return;
            $scope.$emit('processState', 'NO_END');
            $scope.gridOptions.data = rs.data.resultList;
            // $scope.gridOptions.totalItems = rs.data.total;
            if(!$scope.gridOptions.data) {
                $scope.gridOptions.data = [];
                return;
            }
            var currGroupId = '';
            $scope.gridOptions.data.forEach(function(item) {
                item.doctortime = $filter('date')(item.doctortime, 'yyyy-MM-dd HH:mm');
                item.dosageUnit = item.dosage + item.unit;
                if (currGroupId !== item.groupId) {
                    currGroupId = item.groupId;
                    item.$$treeLevel = 0;
                } else {
                    item.$$treeLevel = 1;
                }
            });
        });
    }


    $scope.$on('syncHis', () => {
        save();
    });

    $scope.$on('print', () => {
        $scope.$emit('doc-print');
    });
}