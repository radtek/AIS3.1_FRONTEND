operRoomSchedulesCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout','$filter', 'select','toastr', '$uibModal', 'auth'];
module.exports = operRoomSchedulesCtrl;
function operRoomSchedulesCtrl($rootScope, $scope, IHttp, uiGridConstants, $timeout,$filter,select, toastr, $uibModal, auth) {
    var page = $rootScope.$state.current.name,
        tempHtml = '',
        operBtn = '',
        pcsIndex=0,
        promise,
        selectOptions = [{ value: '02', label: '未排班' }, { value: '08', label: '取消' }],
        user = auth.loginUser();
    var beCode = user.beCode;
        
    $scope.dispatch={};
    let tomorrow = new Date($filter('date')(new Date(), 'yyyy-MM-dd')).getTime() + 86400000;
    $scope.operDate = $filter('date')(tomorrow, 'yyyy-MM-dd');
        
    $scope.params = {
        "loginName":"",
        "state":"01,02",
        "operRoomId":"",
        // "pageNo": 1,
        // "pageSize": 15,
        "sort": "",
        "orderBy": "",
        "filters": [{"field":"operaDate","value":$scope.operDate}],                    
     };
     $scope.recall = false;
    
    select.operroom().then((rs) => {
        $scope.operRoomList = rs.data.resultList;
    });

    select.sysCodeBy('pacType').then((rs) => {
        $scope.pacList = rs.data.resultList;
        $scope.pacList2 = angular.copy(rs.data.resultList);
        $scope.pacList2.unshift({'codeName':'自动','codeValue':'0'});
        $scope.dispatch.pcs = '0';
    });

    $scope.updateDay = function(code) {
        var curDate = $scope.operDate;
        var operDate = '';
        if(!curDate){
            curDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        if (code === 'add')
            operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() + 86400000;
        else if (code === 'sub')
            operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() - 86400000;
        else
            operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime();
        $scope.operDate = $filter('date')(operDate, 'yyyy-MM-dd');
        $scope.params.filters=[
            {field: "operaDate", value: $scope.operDate}
        ];
        $scope.params.state = '01,02';
        if ($scope.grid) {
            angular.forEach($scope.grid.columns, function(column) {
                var fieldName = column.field;
                var value = column.filters[0].term;
                if (fieldName === 'state') {
                    $scope.params.state = value;
                    if (!value) {
                        $scope.params.state = '01,02';
                    }
                    if(value === '08') {
                        $scope.recall = true;
                    }else {
                        $scope.recall = false;
                    }
                }
            });
        }
        getPage();
    }
    $scope.changeOperRoomId = function(){
        pcsIndex=0;
    }    

    $scope.btnsMenu.forEach(function(item) {
        operBtn += '<a ng-if="row.entity.state != \'08\'" ng-click="grid.appScope.query(row.entity, \'' + item.url + '\')">' + item.name + '</a><span ng-if="row.entity.state != \'08\'">&nbsp;|&nbsp;</span>';
    });    
    operBtn += '<a ng-click="grid.appScope.cancel(row.entity)" ng-if="row.entity.state != \'08\'">取消手术</a><a ng-click="grid.appScope.activOper(row.entity)" ng-if="row.entity.state == \'08\'">撤回手术</a>';
    tempHtml = '<div class="ui-grid-cell-contents">' + operBtn + '</div>';
    
    $scope.gridOptions = {
        enableFiltering: true,     // 过滤栏显示
        enableGridMenu: true,       // 配置按钮显示
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,   // 使用外部过滤        
        enableFooterTotalSelected: false,
        showGridFooter: true, // 显示页脚
        useExternalPagination: true, // 使用外部分页
        useExternalSorting: true,     // 使用外部排序
        paginationPageSizes: [ 15, 30, 50],   // 配置每页行数可选参数
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,     // 每页默认显示行数
        enableCellEditOnFocus: true
    };

    $scope.gridOptions.columnDefs = [ 
        {
            field: 'emergency',
            name: '类型',
            width: 65,
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
        },{
            field: 'deptName',
            name: '科室',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            }
        }, {
            field: 'bed',
            name: '床号',
            width: 65,
            cellTooltip: function(row, col) {
                return row.entity.bed;
            }
        }, {
            field: 'hid',
            name: '住院号',
            width: 95,
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'name',
            name: '姓名',
            width: 85,
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'sex',
            name: '性别',
            width: 60,
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
            width: 60,
            name: '年龄'
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            width: 110,
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            }
        },{
            field: 'operatorName',
            name: '手术医生',
            width: 85,
            cellTooltip: function(row, col) {
                return row.entity.operatorName;
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
        },  {
            field: 'diagnosisName',
            name: '术前诊断',
            visible: false,
            cellTooltip: function(row, col) {
                return row.entity.diagnosisName;
            }
        },  {
            field: 'state',
            name: '状态',
            width: 70,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: selectOptions
            },
            cellFilter: 'state',            
        },{
            field: 'createTime',
            name: '接收时间',
            width: 150,
            cellTooltip: function(row, col) {
                return row.entity.createTime;
            }
        },{
            field: 'operaDate',
            name: '手术日期',
            width: 100,
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            }
        }, {
            field: 'startTime',
            name: '时间',
            cellTemplate: '<div class="dtdiv div-bg-80" ng-mouseover="grid.appScope.showtime(row.entity)" ng-if="!row.entity.showtimediv">{{row.entity.startTime}}</div><datetime-picker ng-if="row.entity.showtimediv" flex ng-model="row.entity.startTime" datepicker="false" timepicker="true" format="H:i">',
            cellClass: 'nurse-startTime',
            width: 73
        }, {
            field: 'operRoomId',
            name: '手术室',
            cellClass: 'nurse-operRoomName',
            cellTemplate: '<div class="dtdiv div-bg-100" ng-mouseover="grid.appScope.showoperRoomName(row.entity)" ng-if="!row.entity.showoperRoomNamediv">{{row.entity.operRoomName}}</div><oi-select style="width:93px" ng-if="row.entity.showoperRoomNamediv" oi-options="item.operRoomId as item.name for item in grid.appScope.operRoomList track by item.operRoomId" ng-model="row.entity.operRoomId" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 93
        }, {
            field: 'pcs',
            name: '手术台次',
            cellClass: 'nurse-pcs',
            cellTemplate: '<div class="dtdiv div-bg-100" ng-mouseover="grid.appScope.showpcs(row.entity)" ng-if="!row.entity.showpcsdiv">{{row.entity.pcsName}}</div><oi-select ng-if="row.entity.showpcsdiv" ng-mouseover="grid.appScope.excludePcs1(row.entity)" ng-click="grid.appScope.excludePcs(row.entity)" oi-options="item.codeValue as item.codeName for item in grid.appScope.pacList track by item.codeValue" ng-model="row.entity.pcs" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 93
        },{
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 130,
            cellTemplate: tempHtml
        }
    ];
    
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
        $scope.gridApi = gridApi;
        //最前列复选框值改变事件
        $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, evt){
            if(row.isSelected){
                if(!$scope.dispatch.operRoomId && row.entity.state=="02"){
                    toastr.warning('批量排班请先选择上面的手术室！');
                    row.isSelected=false;
                    return;
                }
                row.entity.showoperRoomNamediv=true;
                row.entity.operRoomId=$scope.dispatch.operRoomId;
                if(!!$scope.dispatch.pcs){
                    if($scope.dispatch.pcs==='0'){
                        //自动
                        row.entity.showpcsdiv=true;
                        row.entity.pcs=$scope.pacList[pcsIndex].codeValue;
                        pcsIndex++;
                        if($scope.pacList.length==pcsIndex){
                            pcsIndex=0;
                        }
                    }else{
                        row.entity.showpcsdiv=true;
                        row.entity.pcs=$scope.dispatch.pcs;
                    }
                }
            }else{
            }
        });

        $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows, evt){
            if(!$scope.dispatch.operRoomId){
                toastr.warning('批量排班请先选择上面的手术室！');
                for(var i=0; i<rows.length; i++) {
                    rows[i].isSelected=false;
                }
                return;
            }
            for(var i=0; i<rows.length; i++) {
                rows[i].entity.showoperRoomNamediv=true;
                rows[i].entity.operRoomId=$scope.dispatch.operRoomId;
                if(!!$scope.dispatch.pcs){
                    if($scope.dispatch.pcs==='0'){
                        //自动
                        rows[i].entity.showpcsdiv=true;
                        rows[i].entity.pcs=$scope.pacList[pcsIndex].codeValue;
                        pcsIndex++;
                        if($scope.pacList.length==pcsIndex){
                            pcsIndex=0;
                        }
                    }else{
                        rows[i].entity.showpcsdiv=true;
                        rows[i].entity.pcs=$scope.dispatch.pcs;
                    }
                }
            }
        });
        //排序
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
            if (sortColumns.length === 0) {
                $scope.params.orderBy = '';
            } else {
                $scope.params.orderBy = sortColumns[0].sort.direction;
                $scope.params.sort = sortColumns[0].colDef.field;
            }
            getPage();
        });
        //分页        
        // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        //     $scope.params.pageNo = newPage;
        //     $scope.params.pageSize = pageSize;
        //     getPage();
        // });       
        //过滤
        $scope.gridApi.core.on.filterChanged($scope, function() {
            $scope.grid = this.grid;
            if (promise) {
                $timeout.cancel(promise);
            }
            promise = $timeout(function() {
                var filterArr = [];
                angular.forEach($scope.grid.columns, function(column) {
                    var fieldName = column.field;
                    var value = column.filters[0].term;
                    if (!!value && fieldName !== 'operRoomId') {
                        filterArr.push({
                            field: fieldName,
                            value: value
                        });
                    }
                    if (fieldName === 'state') {
                        $scope.params.state = value;
                        if (!value) {
                            $scope.params.state = '01,02';
                        }
                        if(value === '08') {
                            $scope.recall = true;
                        }else {
                            $scope.recall = false;
                        }
                        if ($scope.operDate) {
                            filterArr.push({
                                field: 'operaDate',
                                value: $scope.operDate
                            });
                        }
                    }
                    if (fieldName === 'operRoomId' && !!value) {
                        filterArr.push({
                            field: "operRoomName",
                            value: value
                        });
                    }
                });
                $scope.params.filters = filterArr;
                getPage();
            }, 1000)
        });
    };

    var currPac = '';
    $scope.excludePcs = function(row) {
        var dataList = $scope.gridOptions.data,
            residuePac = [],
            existPac = '';
        for(var i=0; i<dataList.length; i++) {
            if (row.operRoomId === dataList[i].operRoomId && dataList[i].pcs) {
                if (row.pcs !== dataList[i].pcs)
                    existPac += dataList[i].pcs + '-;';
            }
        }
        for(var i=0; i<$scope.pacList2.length; i++) {
            if (existPac.indexOf($scope.pacList2[i].codeValue + '-') < 0 && $scope.pacList2[i].codeValue !== '0') {
                residuePac.push($scope.pacList2[i]);
            }
        }
        $scope.pacList = residuePac;
    }

    $scope.excludePcs1 = function(row) {
        currPac = row.pcs;
    }

    $scope.cancelList = function(row) {
        $scope.params.state = '08';
        $scope.operDate = '';
        $scope.params.filters = [{field: "state", value: "08"}];
        $scope.recall = true;
        getPage();
    }

    getPage();

    function getPage(type) {
        var url = 'operation/getRegOptByState';        
        IHttp.post(url, $scope.params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            if (type == 'refresh')
                toastr.success('数据已刷新');
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
        });
    } 

      // 查看
    $scope.query = function(row, url) {
        if ($scope.isArch)
            $scope.params.pageNo = 1;
        sessionStorage.setItem('regOptId',row.regOptId);
        sessionStorage.setItem('hasAnaesPacuRec', row.pacuId === '' ? false : true);
        sessionStorage.setItem('showPlacentaAgree', row.sex === '男' ? false : true);
        sessionStorage.setItem('showRiskAsseLog', row.isLocalAnaes == '1' ? false : true);
        sessionStorage.setItem('pageOption', JSON.stringify($scope.params));

        $rootScope.$state.go(url, {
            regOptId: row.regOptId
        });
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

    $scope.save = function(){
        var dispatchList = [];
        for (var a in $scope.gridOptions.data) {
            var item = $scope.gridOptions.data[a - 0];
            if (item.isLocalAnaes == '1')
                item.isHold = '0';
            if (item.state=="02" && item.operRoomId) {                
                dispatchList.push(item)
            }
        }

        if (dispatchList.length <= 0 && !$scope.dispatch.operRoomId ) {
            toastr.warning('请给患者安排手术室！');
            return;
        }

        if(!!$scope.dispatch.operRoomId && dispatchList.length <= 0){
            toastr.warning('请勾选需安排此手术室的状态为未排班的患者！');
            return;
        }

        IHttp.post('basedata/dispatchOperation', {
            dispatchList: dispatchList,
            roleType: auth.loginUser().roleType
        }).then((rs) => {
            $scope.$emit('childRefresh');
            if (rs.data.resultCode != 1)
                return
            toastr.info(rs.data.resultMessage);
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

    // 刷新
    $scope.refresh = function() {
        $scope.params = {
            "loginName":"",
            "state":"01, 02, 08",
            "operRoomId":"",
            // "pageNo": 1,
            // "pageSize": 15,
            "sort": "",
            "orderBy": "",
            "filters": [],                    
        };
        $scope.operDate ="";
        getPage();
    }

    $scope.showoperRoomName = function(row){
        if(row.state=="02"){
            row.showoperRoomNamediv=true;
        }else{
            row.showoperRoomNamediv=false;
        }
    }

    $scope.showpcs = function(row){
        if(row.state=="02"){
            row.showpcsdiv=true;
        }else{
            row.showpcsdiv=false;
        }
    }

    $scope.showtime = function(row){
        if(row.state=="02"){
            row.showtimediv=true;
        }else{
            row.showtimediv=false;
        }
    }

    // 激活手术
    $scope.activOper = function(row) {
        IHttp.post('operation/activeRegOpt', { regOptId: row.regOptId, reasons: '' }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            toastr.success('操作成功!');
            getPage();
        });
    }

    // 批量撤回
    $scope.activOpers = function(row) {
        var rowArr = $scope.gridApi.selection.getSelectedRows();
        if (rowArr.length === 0) {
            toastr.info('请选择需要撤回的手术申请记录！');
            return;
        }
        var regOptIds = [];
        for(var i=0; i<rowArr.length; i++) {
            regOptIds.push(rowArr[i].regOptId);
        }
        IHttp.post('operation/batchActiveRegOpt', { regOptIdList: regOptIds, reasons: '' }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            if (rs.data.failList) {
                toastr.info(rs.data.failList);
            }else {
                toastr.success('操作成功!');
            }
            getPage();
        });
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
            template: require('../../oper/modal' + url + '.html'),
            controller: require('../../oper/modal' + url + '.controller.js'),
            scope: scope
        }).result.then(function(rs) {
            if (rs === 'success') {
                toastr.info('取消手术成功!');
                getPage();
            }
        }, function() {});
    }   

    function btnActive(saved, btn) {
        $scope.saved = saved;
        $scope.btnActive = btn;
    }
}