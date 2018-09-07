OperListCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', '$uibModal', 'auth', 'uiGridServe', '$filter'];

module.exports = OperListCtrl;

function OperListCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout, toastr, $uibModal, auth, uiGridServe, $filter) {
    var page = $rootScope.$state.current.name,
        tempHtml = '',
        operBtn = '',
        promise,
        selectOptions = [{ value: '01', label: '未审核' }, { value: '02', label: '未排班' }, { value: '08', label: '取消' }],
        user = auth.loginUser();
    var beCode = user.beCode,
        pageOption = JSON.parse(sessionStorage.getItem('pageOption')),
        params = uiGridServe.params({ loginName: user.userName });

    $scope.beCode = user.beCode;
    $scope.page=page;
    if (pageOption) {
        if (pageOption.crumbs == '1') {
            params = uiGridServe.params(pageOption);
            sessionStorage.setItem('pageOption', null);
        }
    }
    $scope.isArch = false;
    $scope.queryObj = {
        startTime: (beCode == 'syzxyy'|| beCode == 'base'||beCode == 'llzyyy'|| beCode == 'cshtyy') ? $filter('date')(new Date().getTime(), 'yyyy-MM-dd') : '',
        endTime: (beCode == 'syzxyy'|| beCode == 'base'||beCode == 'llzyyy'|| beCode == 'cshtyy') ? $filter('date')(new Date().getTime(), 'yyyy-MM-dd') : '',
        state: '',
    }
    if (pageOption && pageOption.crumbs == '1') {
        $scope.queryObj.startTime = params.startTime;
        $scope.queryObj.endTime = params.endTime;
        $scope.queryObj.state = params.state;
    }

    var sepa = '<span ng-if="row.entity.state != \'04\' && row.entity.state != \'05\' && row.entity.state != \'06\' && row.entity.state != \'08\'"  >&nbsp;|&nbsp;</span>'
    $scope.btnsMenu.forEach(function(item) {
        if (page == 'operQuery') {
            if (beCode == 'syzxyy' || beCode == 'base'||beCode == 'llzyyy'|| beCode == 'cshtyy')
                operBtn += '<a ng-click="grid.appScope.query(row.entity, \'' + item.url + '\')">' + item.name + '</a><span>&nbsp;|&nbsp;</span>';
            else
                operBtn += '<a ng-click="grid.appScope.query(row.entity, \'' + item.url + '\')" ng-if="row.entity.state != \'04\' && row.entity.state != \'05\' && row.entity.state != \'06\' && row.entity.state != \'08\'">' + item.name + '</a>' + sepa;
        } else
            operBtn += '<a ng-click="grid.appScope.query(row.entity, \'' + item.url + '\')">' + item.name + '</a><span ng-hide="grid.appScope.beCode== \'qnzzyyy\'&&row.entity.operSource==1&&grid.appScope.page !=\'oper\'" >&nbsp;|&nbsp;</span>';
    });

    if (page == 'oper') {
        operBtn += '<a ng-click="grid.appScope.cancel(row.entity)">取消</a>';
        params.state = '01, 02, 08';
    } else if (page == 'operQuery') {
        operBtn += '<a ng-click="grid.appScope.cancel(row.entity)" ng-if="row.entity.state != \'04\' && row.entity.state != \'05\' && row.entity.state != \'06\' && row.entity.state != \'08\'">取消</a>';
        if (beCode == 'syzxyy'|| beCode == 'base'||beCode == 'llzyyy'||beCode == 'cshtyy') {

            operBtn += sepa + '<a ng-if="row.entity.state != \'08\'" ng-click="grid.appScope.print(row.entity)" >打印</a>';
            selectOptions = [{ value: '03', label: '术前' }, { value: '04', label: '术中' }, { value: '05', label: '复苏中' }, { value: '06', label: '术后' }, { value: '07', label: '中止' }, { value: '08', label: '取消' }];
            params.state = '03,04,05,06,07,08';
        } else {
            selectOptions = [{ value: '01', label: '未审核' }, { value: '02', label: '未排班' }, { value: '03', label: '术前' }, { value: '04', label: '术中' }, { value: '05', label: '复苏中' }, { value: '06', label: '术后' }, { value: '07', label: '中止' }, { value: '08', label: '取消' }];
            params.state = '02,03,04,05,06,07,08';
        }
        operBtn += '<a ng-click="grid.appScope.activOper(row.entity)" ng-if="row.entity.state == \'08\'">激活手术</a>';
        if (beCode == 'qnzrmyy')
            params.state = '01,02,03,04,05,06,07,08';
    } else {
        operBtn += '<a ng-hide="grid.appScope.beCode== \'qnzzyyy\'&&row.entity.operSource==1" ng-click="grid.appScope.print(row.entity)">打印</a>';
        if (page == 'preOper') {
            params.state = '03';
        } else if (page == 'postOper') {
            if (beCode === 'yxyy' || beCode == 'qnzzyyy')
                params.state = '05,06,07';
            else
                params.state = '06,07';
        }
    }
    tempHtml = '<div class="ui-grid-cell-contents">' + operBtn + '</div>';

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'operateNumber',
            name: '手术申请序号',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.operateNumber;
            },
            visible: (beCode == 'sybx' && page == 'oper') ? true : false
        }, {
            field: 'emergency',
            name: '类型',
            width: 60,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '0',
                    label: '择期'
                }, {
                    value: '1',
                    label: '急诊'
                }]
            },
            cellFilter: 'emergency',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row, col) == 1) {
                    return 'md-red';
                }
            }
        }, {
            field: 'operRoomId',
            name: '手术室',
            width: 90,
            cellTemplate: '<div class="ui-grid-cell-contents"><span ng-bind="row.entity.operRoomName"></span></div>',
            cellTooltip: function(row, col) {
                return row.entity.operRoomName;
            },
            visible: page == 'oper' ? false : true
        }, {
            field: 'operaDate',
            name: '日期',
            width: 100,
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            }
        }, {
            field: 'hid',
            name: '住院号',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'name',
            name: '姓名',
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'sex',
            name: '性别',
            width: 55,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '男',
                    label: '男'
                }, {
                    value: '女',
                    label: '女'
                }]
            }
        }, {
            field: 'age',
            width: 55,
            name: '年龄'
        }, {
            field: 'deptName',
            name: '科室',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        }, {
            field: 'medicalType',
            name: '费用类型',
            visible: false,
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.medicalType;
            }
        }, {
            field: 'optLevel',
            name: '手术等级',
            visible: false,
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.optLevel;
            }
        }, {
            field: 'anesthetistName',
            name: '麻醉医生',
            enableSorting: false,
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.anesthetistName;
            },
            visible: page == 'oper' ? false : true
        }, {
            field: 'circunurseName1',
            name: '巡回护士',
            enableSorting: false,
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.circunurseName1;
            },
            visible: page == 'oper' ? false : true
        }, {
            field: 'diagnosisName',
            name: '术前诊断',
            cellTooltip: function(row, col) {
                return row.entity.diagnosisName;
            }
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            }
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 80,
            cellTooltip: function(row, col) {
                return row.entity.operatorName;
            }
        }, {
            field: 'inOperRoomTime',
            name: '入室时间',
            width: 155,
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.inOperRoomTime;
            }
        }, {
            field: 'outOperRoomTime',
            name: '离室时间',
            width: 155,
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.outOperRoomTime;
            }
        }, {
            field: 'documentState',
            name: '文书情况',
            width: 80,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-if="!(grid.appScope.beCode== \'qnzzyyy\'&&row.entity.operSource==1)" ng-click=grid.appScope.isComplete(row.entity) ng-bind="row.entity.documentState"></a><a ng-if="grid.appScope.beCode== \'qnzzyyy\'&&row.entity.operSource==1" >完成</a></div>',
            visible: !(page == 'oper' || (page == 'operQuery' && beCode != 'syzxyy' && beCode != 'base'&& beCode != 'llzyyy'&& beCode != 'cshtyy'))
        }, {
            field: 'state',
            name: '状态',
            width: 65,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: selectOptions
            },
            cellFilter: 'state',
            visible: page == 'oper' || page == 'operQuery'
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 125,
            cellTemplate: tempHtml
        }]
    }, function() {
        getPage();
    });
    function getPage(type) {
        var url = 'operation/getRegOptByState';
        if (page == 'oper') {
            params.loginName = '';
        } else if (page == 'operQuery') {
            if(beCode == 'syzxyy' || beCode == 'base'||beCode == 'llzyyy'|| beCode == 'cshtyy')
                url = 'operation/getRegOptByRoleTypeAndState'
            if(beCode != 'syzxyy' && beCode != 'base'&& beCode != 'llzyyy'&&beCode != 'cshtyy') {
                params.queryMethod = 1;
            }
        } else if (page == 'preOper') {
            if (beCode == 'sybx' && (user.roleType === 'ANAES_DIRECTOR' || user.roleType === 'ANAES_DOCTOR'))
                params.state = '02,03';
            if (beCode == 'sybx')
                params.queryMethod = 2;
        }
        //查询归档数据;
        if ($scope.isArch) {
            url = 'operation/getRegOptByArchstate';
        }
        IHttp.post(url, params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            if (type == 'refresh')
                toastr.success('数据已刷新');
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    }

    $scope.search = function() {
        var queryObj = $scope.queryObj;
        if ((pageOption && pageOption.crumbs !== '1') || !pageOption) {
            params.startTime = queryObj.startTime;
            params.endTime = queryObj.endTime;
        }
        if(pageOption && pageOption.crumbs == '1') {
            params.state = queryObj.state;
            params.startTime = queryObj.startTime;
            params.endTime = queryObj.endTime;
            if (!$scope.queryObj.state)
                params.state = '03,04,05,06,07,08';
        }
        getPage();
    }

    $scope.search();

    $scope.stateChange = function(o) {
        if (beCode != 'syzxyy' && beCode != 'base'&& beCode != 'llzyyy'&& beCode != 'cshtyy')
            return;
        if (o.state)
            params.state = o.state;
        else
            params.state = '03,04,05,06,07,08';
        $scope.search();
    }

    // 批准手术
    $scope.ratify = function() {
        var rowArr = $scope.gridApi.selection.getSelectedRows(),
            promise;
        btnActive(false, true);
        if (rowArr.length === 0) {
            toastr.info('请选择需要批准的手术申请记录！');
            btnActive(true, false);
            return;
        }
        var ids = "";
        for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i].state !== "01") {
                var content = rowArr[i].name + "的状态为" + rowArr[i].stateName + ",请重新选择！";
                toastr.info(content);
                btnActive(true, false);
                return;
            }
            if (!rowArr[i].designedAnaesMethodName) {
                var content = rowArr[i].name + "的麻醉方法为空,不能批准手术,请重新选择！";
                toastr.info(content);
                btnActive(true, false);
                return;
            }
            ids += rowArr[i].regOptId + ",";
        }
        if (ids !== "") {
            ids = ids.substr(0, ids.length - 1);
        }
        IHttp.post('operation/checkOperation', { regOptIds: ids }).then(function(rs) {
            btnActive(true, false);
            if (rs.data.resultCode != '1')
                return;
            toastr.success(rs.data.resultMessage);
            getPage();
        });
    }

    // 手动录入
    $scope.add = function() {
        $rootScope.$state.go('editOperDateil');
    }

    // his导入
    $scope.hisImport = function() {
        // IHttp.post('interfacedata/hisToRegOpt', {}).then(function(rs) {
        //     if(rs.data.resultCode != '1')
        //         return;
        //     getPage();
        // });
    }

    // 归档
    $scope.placeOnFile = function(isFile) {
        var rowArr = $scope.gridApi.selection.getSelectedRows();
        if (rowArr.length === 0) {
            toastr.info('请选择需要操作的手术记录！');
            return;
        }
        var ids = "",
            dstate = true,
            names = "";
        for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i].documentState === '未完成') {
                dstate = false;
                names += rowArr[i].name + ",";
            }
            if (dstate)
                ids += rowArr[i].regOptId + ",";
        }
        if (!dstate && names) {
            toastr.info(names.substr(0, names.length - 1) + "患者的文书未完成");
            return;
        }
        if (ids !== "") {
            ids = ids.substr(0, ids.length - 1);
        } else {
            return;
        }
        var url, param = { regOptIds: ids };
        if (user.roleType === 'ANAES_DIRECTOR' || user.roleType === 'ANAES_DOCTOR') {
            url = 'operation/updateArchstate';
            param.archstate = isFile ? 'AR' : '';
        } else if (user.roleType === 'HEAD_NURSE' || user.roleType === 'NURSE') {
            url = 'operation/updateNurseArchstate';
            param.nurseArchstate = isFile ? 'AR' : '';
        } else if (user.roleType === 'ADMIN') {
            param.archstate = isFile ? 'AR' : '';
            IHttp.post('operation/updateArchstate', param).then(function(rs) {
                if (rs.data.resultCode != 1)
                    return;
                param.archstate = undefined;
                param.nurseArchstate = isFile ? 'AR' : '';
                IHttp.post('operation/updateNurseArchstate', param).then(function(rs) {
                    if (rs.data.resultCode != 1)
                        return;
                    toastr.info(rs.data.resultMessage);
                    getPage();
                });
            });
            return;
        }
        IHttp.post(url, param).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            toastr.info(rs.data.resultMessage);
            getPage();
        });
    }

    // 已归档
    $scope.archived = function(flag) {
        $scope.isArch = flag;
        if(beCode == 'qnzzyyy') {
            if(flag)
                params.state = '03,04,05,06,07';
            else
                params.state = '05,06,07';
        }
        if (flag) {
            IHttp.post('operation/getRegOptByArchstate', params).then(function(rs) {
                if (rs.data.resultCode != 1)
                    return;
                $scope.gridOptions.data = rs.data.resultList;
                $scope.gridOptions.totalItems = rs.data.total;
            });
        } else {
            getPage();
        }
    }

    // 刷新
    $scope.refresh = function() {
        getPage('refresh');
    }

    // 查看
    $scope.query = function(row, url) {
        if ($scope.isArch)
            params.pageNo = 1;
        sessionStorage.setItem('regOptId',row.regOptId);
        sessionStorage.setItem('hasAnaesPacuRec', row.pacuId === '' ? false : true);
        sessionStorage.setItem('showPlacentaAgree', row.sex === '男' ? false : true);
        sessionStorage.setItem('showRiskAsseLog', row.isLocalAnaes == '1' ? false : true);
        sessionStorage.setItem('pageOption', JSON.stringify(params));
        $rootScope.$state.go(url, {
            regOptId: row.regOptId
        });
    }

    // 打印
    $scope.print = function(row) {
        var scope = $rootScope.$new();
        scope.row = row;
        scope.user = user;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal/print.html'),
            controller: require('./modal/print.controller.js'),
            scope: scope
        }).result.then(function() {}, function() {});
    }

    // 激活手术
    $scope.activOper = function(row) {
        var scope = $rootScope.$new();
        scope.regOptId = row.regOptId;
        scope.tit = '激活';
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal/modal.html'),
            controller: require('./modal/modal.controller.js'),
            scope: scope
        }).result.then(function(rs) {
            if (rs === 'success') {
                toastr.info('激活手术成功!');
                getPage();
            }
        }, function() {});
    }

    // 取消
    $scope.cancel = function(row) {
        var state = row.state;
        var url = '/modal';
        if (beCode == 'nhfe') {
            url = '/nhfe/modal';
        }
        if (state === "04") {
            toastr.info('手术已经开始，不能取消该手术！');
            return;
        } else if (state === "06") {
            toastr.info('手术已经完成，不能取消该手术！');
            return;
        } else if (state === "08") {
            toastr.info('不能重复取消该手术！');
            return;
        }
        var scope = $rootScope.$new();
        scope.regOptId = row.regOptId;
        scope.tit = '取消';
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./modal' + url + '.html'),
            controller: require('./modal' + url + '.controller.js'),
            scope: scope
        }).result.then(function(rs) {
            if (rs === 'success') {
                toastr.info('取消手术成功!');
                getPage();
            }
        }, function() {});
    }

    // 文书完成状况
    $scope.isComplete = function(row) {
        if (row.documentState == '完成')
            toastr.info('文书已完成！');
        else {
            var scope = $rootScope.$new();
            scope.row = row;
            var uibModal = $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./modal/docModal.html'),
                controller: require('./modal/docModal.controller.js'),
                scope: scope
            }).result.then(function() {}, function() {});
        }
    }

    function btnActive(saved, btn) {
        $scope.saved = saved;
        $scope.btnActive = btn;
    }
}
