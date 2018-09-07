TemplateCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', 'confirm', 'toastr', '$timeout', 'uiGridServe', 'auth'];

module.exports = TemplateCtrl;

function TemplateCtrl($rootScope, $scope, IHttp, uiGridConstants, $uibModal, confirm, toastr, $timeout, uiGridServe, auth) {
    var promise,
        params = uiGridServe.params({ createUser: auth.loginUser().userName });

    initPage();
    // 科室
    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'medTempName',
            displayName: '模板名称',
            cellTooltip: function(row, col) {
                return row.entity.medTempName;
            }
        }, {
            field: 'docType',
            displayName: '文书类型',
            cellTooltip: function(row, col) {
                return row.entity.docType;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "2",
                    label: '麻醉记录单(一)'
                }, {
                    value: "4",
                    label: '麻醉记录单(二)'
                }, {
                    value: "3",
                    label: '麻醉术前访视与评估记录单'
                }, {
                    value: "5",
                    label: '手术安全核查表'
                }]
            }
        }, {
            field: 'createUser',
            displayName: '创建人',
            cellTooltip: function(row, col) {
                return row.entity.createUser;
            }
        }, {
            field: 'createTime',
            displayName: '创建时间',
            cellTooltip: function(row, col) {
                return row.entity.createTime;
            }
        }, {
            field: 'type',
            displayName: '应用级别',
            cellTooltip: function(row, col) {
                return row.entity.type;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '个人'
                }, {
                    value: "2",
                    label: '科室'
                }]
            }
        }, {
            field: 'regOptId',
            displayName: '操作',
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.delTemp(row)>删除</a><span></div>'
        }]
    }, function() {
        initPage();
    });

    $scope.refresh = function() {
        initPage();
    }

    $scope.delTemp = function(row) {
        alert(1);
        confirm.show('你是否要删除该模板？').then(function() {
            IHttp.post('basedata/delAnaesDoctemp', { id: row.entity.id }).then((rs) => {
                if (rs.status === 200 && rs.data.resultCode === '1') {
                    toastr.success("删除成功！");
                    initPage();
                }
            });
        });
    }

    function initPage() {
        IHttp.post("basedata/queryAnaesDoctempList", params).then(function(data) {
            data = data.data;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].docType === 2) {
                    data.resultList[i].docType = '麻醉记录单(一)';
                } else if (data.resultList[i].docType === 3) {
                    data.resultList[i].docType = '麻醉术前访视与评估记录单';
                } else if (data.resultList[i].docType === 4) {
                    data.resultList[i].docType = '麻醉记录单(二)';
                } else if (data.resultList[i].docType === 5) {
                    data.resultList[i].docType = '手术安全核查表';
                }
                if (data.resultList[i].type === 1) {
                    data.resultList[i].type = '个人';
                } else if (data.resultList[i].type === 2) {
                    data.resultList[i].type = '科室';
                }
            }
            $scope.gridOptions.data = data.resultList;
            $scope.gridOptions.totalItems = data.total;
        });
    }
}