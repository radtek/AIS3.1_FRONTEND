module.exports = ScieReseCtrl;

ScieReseCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', '$uibModal', 'uiGridConstants', 'toastr', '$timeout', '$filter'];

function ScieReseCtrl($rootScope, $scope, IHttp, auth, $uibModal, uiGridConstants, toastr, $timeout, $filter) {
    var user = auth.loginUser(),
        htmlStr = '';

    $scope.btnsMenu.forEach(function(item, key) {
        if (item.url)
            htmlStr += '<a ng-click="grid.appScope.toView(row.entity, \'' + item.url + '\')">' + item.name + '</a>';
        else
            htmlStr += '<a ng-click="grid.appScope.addCom(row.entity)">' + item.name + '</a>';
        if (key < $scope.btnsMenu.length - 1)
            htmlStr += '<span>&nbsp;|&nbsp;</span>';
    });

    $scope.opt = {
        "sex": {
            "name": "sex",
            "value": "",
            "type": "equal",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "性别",
            "pid": "regOptFilters"
        },
        "age": {
            "name": "age",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "年龄(天)",
            "pid": "regOptFilters"
        },
        "height": {
            "name": "height",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "身高(cm)",
            "pid": "regOptFilters"
        },
        "weight": {
            "name": "weight",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "体重(kg)",
            "pid": "regOptFilters"
        },
        "operaDate": {
            "name": "operaDate",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "手术日期",
            "pid": "regOptFilters"
        },
        "emergency": {
            "name": "emergency",
            "value": "",
            "type": "equal",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "手术类型",
            "pid": "regOptFilters"
        },
        "designedOptCode": {
            "name": "designedOptCode",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "拟施手术方法",
            "pid": "regOptFilters"
        },
        "diagnosisCode": {
            "name": "diagnosisCode",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "拟施诊断",
            "pid": "regOptFilters"
        },
        "designedAnaesMethodCode": {
            "name": "designedAnaesMethodCode",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "拟施麻醉方法"
        },
        "anaesEvent": {
            "name": "anaesEvent",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "麻醉事件",
            "pid": "anaesEventFilter"
        },
        "medEvent": {
            "name": "medEvent",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "用药事件",
            "pid": "useMedEventFilter"
        },
        "ioEvent": {
            "name": "ioEvent",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "入量",
            "pid": "ioEventFilter"
        },
        "egressEvent": {
            "name": "egressEvent",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "出量",
            "pid": "egressEvent"
        },
        "analgesic": {
            "name": "analgesic",
            "value": "",
            "type": "equal",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "镇痛方式",
            "pid": "analgesicFilter"
        },
        "implOper": {
            "name": "implOper",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "实施手术方法",
            "pid": "implOperFilter"
        },
        "implDiag": {
            "name": "implDiag",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "实施诊断",
            "pid": "implDiagFilter"
        },
        "implAnaesMethod": {
            "name": "implAnaesMethod",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "实施麻醉方法",
            "pid": "implAnaesMethodFilter"
        },
        "operTimeLength": {
            "name": "operTimeLength",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "手术时长(分钟)",
            "pid": "anaesRecordFilters"
        },
        "anaesTimeLength": {
            "name": "anaesTimeLength",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "麻醉时长(分钟)",
            "pid": "anaesRecordFilters"
        },
        "asaLevel": {
            "name": "asaLevel",
            "value": "",
            "type": "between",
            "bt1": "",
            "bt2": "",
            "array": [],
            "remark": "手术等级",
            "pid": "anaesRecordFilters"
        },
        "optBody": {
            "name": "optBody",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "手术体位",
            "pid": "anaesRecordFilters"
        },
        "instrument": {
            "name": "instrument",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "器械",
            "pid": "instrumentFilter"
        },
        "lifeSign": {
            "name": "lifeSign",
            "value": "",
            "type": "andor",
            "bt1": "",
            "bt2": "",
            "array": [],
            "andor": "and",
            "remark": "体征",
            "pid": "lifeSignFilter"
        },
        "id": "",
        "type": "",
        "remark": "",
        "tmpName": "",
        "createUser": user.userName,
        "createTime": ""
    }

    getPage($scope.opt)

    // 查询所有的条件
    IHttp.post('sci/getAllField').then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.units = rs.data.fields;
    });

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        useExternalPagination: true, // 使用外部分页
        showGridFooter: true, // 显示页脚
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        //useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        // useExternalSorting: true,   // 使用外部排序
        // paginationPageSize: params.pageSize,
        // paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        exporterCsvFilename: '科研数据.csv',
        exporterOlderExcelCompatibility: true, //为true时不使用utf-16编码
        onRegisterApi: function(gridApi) {
            $scope.gridApiOptions = gridApi;
        },
        columnDefs: [{
            field: 'operaDate',
            name: '手术日期'
        }, {
            field: 'name',
            name: '姓名'
        }, {
            field: 'age',
            name: '年龄'
        }, {
            field: 'hid',
            name: '住院号',
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'regionName',
            name: '病区',
            cellTooltip: function(row, col) {
                return row.entity.regionName;
            }
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        }, {
            field: 'bed',
            name: '床号'
        }, {
            field: 'designedOptName',
            name: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            }
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents">' + htmlStr + '</div>',
        }]
    };

    // $scope.zoom = function() {
    //     $scope.narrow = !$scope.narrow;
    // }

    $scope.delItem = function(key, item) {
        $scope.condition.splice(key, 1);
        $scope.opt[item.name].array = [];
        $scope.opt[item.name].bt1 = "";
        $scope.opt[item.name].bt2 = "";
        $scope.opt[item.name].value = "";
        getPage($scope.opt);
    }

    // 查看对比
    $scope.compare = function() {
        if ($scope.comNums.length < 2) {
            toastr.info("对比列表项最少要添加 2 项");
            return;
        }
        var opt = { tit: '对比', jsonName: 'com_tpl', obj: $scope.comNums };
        showDialog(opt).then(function() {}, function() {});
    }

    // 保存模板
    $scope.save_tpl = function() {
        var opt = { tit: '保存模板', jsonName: 'save_tpl', obj: $scope.opt };
        showDialog(opt).then(function(rs) {}, function(rs) {});
    }

    // 选择模板
    $scope.selt_tpl = function() {
        var opt = { tit: '查看模板', jsonName: 'selt_tpl', uid: user.userName, size: 'lg' };
        showDialog(opt).then(function(rs) {
            getCondition(rs);
            getPage($scope.opt);
        }, function() {});
    }

    //导出excel  
    $scope.export = function() {
        $scope.gridApiOptions.exporter.csvExport('visible', 'visible');
    };

    // 查看信息
    $scope.toView = function(item, url) {
        let hasAnaesPacuRec = false;
        let showPlacentaAgree = false;
        var showRiskAsseLog = true;
        IHttp.post('document/hasAnaesPacuRec', {
            regOptId: item.regOptId
        }).then(function(rs) {
            if (rs.data.resultCode == 1) {
                hasAnaesPacuRec = rs.data.flag;
                sessionStorage.setItem('hasAnaesPacuRec', hasAnaesPacuRec);
            }
        });
        if (item.sex === '女') {
            showPlacentaAgree = true;
        }
        if (item.isLocalAnaes == '1') {
            showRiskAsseLog = false;
        }
        sessionStorage.setItem('anaesType', item.isLocalAnaes);
        sessionStorage.setItem('fromAnaesType', '科研管理');
        sessionStorage.setItem('showPlacentaAgree', showPlacentaAgree);
        sessionStorage.setItem('showRiskAsseLog', showRiskAsseLog);
        $rootScope.$state.go(url, { regOptId: item.regOptId });
    }

    // 加入对比
    $scope.comNums = [];
    $scope.addCom = function(item) {
        if ($scope.comNums.length >= 3) {
            toastr.info("对比列表项最多只能添加 3 项");
            return;
        }

        var arr = $filter('filter')($scope.comNums, function(v) {
            return v.regOptId === item.regOptId && v.name === item.name;
        });

        if (arr.length <= 0)
            $scope.comNums.push({ regOptId: item.regOptId, name: item.name });
        else
            toastr.info(item.name + ' 已添加到对比列表中');
    }

    // 条件事件
    $scope.evDialog = function(ev, jsonName, fieldName) {
        var opt = { jsonName: jsonName, fieldName: fieldName, obj: $scope.opt, style: true };
        showDialog(opt).then(function(rs) {
            getCondition(rs);
            getPage(rs);
        }, function(rs) {
            if (rs) {
                getCondition(rs);
                getPage(rs);
            }
        });
    }

    // 弹出框
    function showDialog(opt) {
        var scope = $rootScope.$new();
        scope.opt = opt;
        return $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: opt.size,
            template: require('./modal/modal.html'),
            controller: require('./modal/modal.controller.js'),
            scope: scope
        }).result;
    }

    function getPage(para) {
        if (!para) para = {};
        IHttp.post('sci/getDataByField', para).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.gridOptions.totalItems = rs.data.resultList.length;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    function getCondition(rs) {
        if (typeof(rs) === 'string')
            rs = JSON.parse(rs);
        $scope.opt = rs;
        $scope.condition = [];
        var str1 = '',
            str2 = '';
        for (var a in rs) {
            if (rs[a].type === 'equal' && rs[a].value.length > 0) {
                str1 = rs[a].value;
                if (rs[a].name === 'emergency')
                    str1 = str1 === '0' ? '择期' : (str1 === '1' ? '急诊' : '');
                else if (rs[a].name === 'analgesic')
                    str1 = str1 === '0' ? '静脉' : (str1 === '1' ? '硬膜外' : '');
                $scope.condition.push({ name: rs[a].name, remark: rs[a].remark, str: str1 });
            } else if (rs[a].type === 'between') {
                if ((typeof(rs[a].bt1) === 'string' && rs[a].bt1.length <= 0) || (typeof(rs[a].bt2) === 'string' && rs[a].bt2.length <= 0))
                    continue;
                str1 = rs[a].bt1;
                str2 = rs[a].bt2;
                if (rs[a].name === 'operaDate') {
                    str1 = $filter('date')(str1, 'yyyy-MM-dd');
                    str2 = $filter('date')(str2, 'yyyy-MM-dd');
                } else if (rs[a].name === 'asaLevel') {
                    str1 = getASA(str1);
                    str2 = getASA(str2);
                }
                $scope.condition.push({ name: rs[a].name, remark: rs[a].remark, str: str1 + '~' + str2 });

            } else if (rs[a].type === 'andor' && rs[a].array.length > 0) {
                str1 = '';
                for (var b = 0; b < rs[a].array.length; b++) {
                    if (b === 0)
                        str1 += rs[a].array[b].name;
                    else
                        str1 += '、' + rs[a].array[b].name;
                }
                if (str1.length > 0)
                    $scope.condition.push({ name: rs[a].name, remark: rs[a].remark, str: str1 });
            }
        }
    }

    function getASA(code) {
        if (code === '1')
            return 'Ⅰ';
        if (code === '2')
            return 'Ⅱ';
        if (code === '3')
            return 'Ⅲ';
        if (code === '4')
            return 'Ⅳ';
        if (code === '5')
            return 'Ⅴ';
    }

    function setListHeight() {
        if ($scope.condition) {
            $document[0].getElementById('gridOptions').style.height = clientH - 295 + 'px';
        } else
            $document[0].getElementById('gridOptions').style.height = clientH - 245 + 'px';
    }
}