FeePackDictionary.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$uibModal', '$q', '$timeout', '$filter', 'confirm', 'auth', 'toastr'];

module.exports = FeePackDictionary;

function FeePackDictionary($rootScope, $scope, IHttp, uiGridConstants, $uibModal, $q, $timeout, $filter, confirm, auth, toastr) {
    let vm = this;
    let user = auth.loginUser();
    let params = {
        timestamp: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        createUser: user.userName,
        roleType: user.roleType,
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [
            { field: 'tempName', value: "" },
            { field: "remark", value: "" },
            { field: "pinyin", value: "" },
            { field: "createName", value: "" },
            { field: "createTime", value: "" },
            { field: "tempType", value: "" }
        ]
    };
    let chargeMedTempId = '';
    var promise;

    vm.ypList = [];
    vm.ytList = [];
    vm.mzczList = []; //麻醉操作项目
    vm.ssList = [];
    vm.clList = [];
    vm.mzList = [];

    vm.tempUserTypes = [{ code: 1, name: '医生' }, { code: 2, name: '护士' }];
    $scope.getMedicineList = function(query) {
        return getMedicineList_(query);
    }

    function getMedicineList_(query) {
        var deferred = $q.defer(),
            param = {
                pinyin: query,
                pageNo: 1,
                pageSize: 200,
                filters: [{field: "enable",value: "1"}]
            }
        IHttp.post('basedata/getMedicineList', param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve(param);
        })
        return deferred.promise;
    }

    $scope.getChargeItemList = function(query) {
        return getChargeItemList_(query);
    }

    function getChargeItemList_(query) {
        var deferred = $q.defer(),
            param = {
                pageNo: 1,
                pageSize: 200,
                filters: [{
                    "field": "pinYin",
                    "value": "" + query + ""
                }, {
                    "field": "enable",
                    "value": "1"
                }]
            }
        IHttp.post('basedata/queryChargeItem', param).then((rs) => {
            if (rs.data.resultList.length > 0)
                deferred.resolve(rs.data.resultList);
            else
                deferred.resolve(param);
        })
        return deferred.promise;
    }

    vm.add = function(item, type) {
        if ((type === 'yp' || type === 'yt') && !item.medicineId) return;
        if ((type === 'cl' || type === 'ss' || type === 'mz' || type === 'mzcz') && !item.chargeItemId) return;
        item._type = type;
        if (type == 'yp') {
            item.chargedType = 1;
            if (item.medicineId)
                item.code = item.medicineId;
            vm.ypList.push(item);
            $scope.selectItemYP = [];
            $scope.ypName = '';
        } else if (type == 'yt') {
            item.chargedType = 2;
            if (item.medicineId)
                item.code = item.medicineId;
            vm.ytList.push(item);
            vm.selectItemYT = [];
            $scope.ytName = '';
        } else if (type == 'mzcz') {
            item.chargedType = 3;
            item.name = item.chargeItemName;
            item.priceMinPackage = item.price;
            vm.mzczList.push(item);
            vm.selectItemMZCZ = [];
            // $scope.ytName = '';
        } else if (type == 'ss') {
            item.chargedType = 1;
            item.name = item.chargeItemName;
            item.priceMinPackage = item.price;
            vm.ssList.push(item);
            vm.selectItemSS = [];
            $scope.ssName = '';
        } else if (type == 'cl') {
            item.chargedType = 2;
            item.name = item.chargeItemName;
            item.priceMinPackage = item.price;
            item.spec = item.spec;
            vm.clList.push(item);
            vm.selectItemCL = [];
            // vm.clList = [];
            $scope.clName = '';
        } else if (type == 'mz') {
            item.chargedType = 1;
            if ($scope.tempUserType == 2) {
                item.chargedType = 3;
            }
            item.name = item.chargeItemName;
            item.priceMinPackage = item.price;
            vm.mzList.push(item);
            vm.selectItemMZ = [];
            $scope.mzName = '';
        }
        item = null;
    }

    vm.del = function($index, type, item) {
        if (item.medChargeId > 0 && (type == 'yp' || type == 'yt')) {
            IHttp.post('basedata/deleteByMedChargeId', { medChargeId: item.medChargeId }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                    initPage();
                }
            });
        } else if (item.chargePayId > 0 && (type == 'ss' || type == 'cl' || type == 'mz')) {
            IHttp.post('basedata/deleteByChargePayId', { chargePayId: item.chargePayId }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                    initPage();
                }
            });
        } else
            delRow($index, type);
    }

    function delRow($index, type) {
        if (type == 'yp')
            vm.ypList.splice($index, 1);
        else if (type == 'yt')
            vm.ytList.splice($index, 1);
        else if (type == 'mzcz')
            vm.mzczList.splice($index, 1);
        else if (type == 'ss')
            vm.ssList.splice($index, 1);
        else if (type == 'cl')
            vm.clList.splice($index, 1);
        else if (type == 'mz')
            vm.mzList.splice($index, 1);
    }

    vm.sortdown = function(index, type, entity) {
        if (type == 'ypList') {
            vm.ypList = sort(index, vm.ypList, 'down', entity);
        }else if(type == 'mzList') {
            vm.mzList = sort(index, vm.mzList, 'down', entity);
        }else if(type == 'ssList') {
            vm.ssList = sort(index, vm.ssList, 'down', entity);
        }else if(type == 'ytList') {
            vm.ytList = sort(index, vm.ytList, 'down', entity);
        }else if(type == 'mzczList') {
            vm.mzczList = sort(index, vm.mzczList, 'down', entity);
        }else if(type == 'clList') {
            vm.clList = sort(index, vm.clList, 'down', entity);
        }
    }

    vm.sortup = function(index, type, entity) {
        if (type == 'ypList') {
            vm.ypList = sort(index, vm.ypList, 'up', entity);
        }else if(type == 'mzList') {
            vm.mzList = sort(index, vm.mzList, 'up', entity);
        }else if(type == 'ssList') {
            vm.ssList = sort(index, vm.ssList, 'up', entity);
        }else if(type == 'ytList') {
            vm.ytList = sort(index, vm.ytList, 'up', entity);
        }else if(type == 'mzczList') {
            vm.mzczList = sort(index, vm.mzczList, 'up', entity);
        }else if(type == 'clList') {
            vm.clList = sort(index, vm.clList, 'up', entity);
        }
    }

    function sort(index, list, type, entity) {
        var sortlist = angular.copy(list);
        if (index == list.length - 1 && type == 'down') 
            return sortlist;
        else if (index == 0 && type == 'up')
            return sortlist;
        for(var i=0; i<list.length; i++) {
            if (index == i && type == 'down') {
                sortlist[i] = list[i + 1];
                sortlist[i + 1] = entity;
            }else if (index == i && type == 'up') {
                sortlist[i] = list[i - 1];
                sortlist[i - 1] = entity;
            }
        }
        return sortlist;
    }
    //科室
    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
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
                    params.filters = filterArr;
                    getPage();
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'tempName',
            displayName: '模板名称',
            cellTooltip: function(row, col) {
                return row.entity.tempName;
            }
        }, {
            field: 'remark',
            displayName: '描述',
            cellTooltip: function(row, col) {
                return row.entity.remark;
            }
        }, {
            field: 'pinyin',
            displayName: '拼音',
            cellTooltip: function(row, col) {
                return row.entity.pinyin;
            }
        }, {
            field: 'createName',
            displayName: '创建人',
            cellTooltip: function(row, col) {
                return row.entity.createName;
            }
        }, {
            field: 'createTime',
            displayName: '时间',
            cellTooltip: function(row, col) {
                return $filter('date')(row.entity.createTime, 'yyyy-MM-dd');
            }
        }, {
            field: 'tempType',
            displayName: '用户类型',
            cellTooltip: function(row, col) {
                return row.entity.tempType;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: 2,
                    label: '护士'
                }, {
                    value: 1,
                    label: '医生'
                }],
                term: params.filters[5].value
            }
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click=grid.appScope.edit(row.entity)>编辑</a>&nbsp;|&nbsp;<a ng-click=grid.appScope.delEntity(row.entity)>删除</a></div>',
        }],
        data: []
    };

    $scope.edit = function(row) {
        if (!row.chargeMedTempId) return;
        $scope.check = true;
        chargeMedTempId = row.chargeMedTempId;
        vm.chargeMedTempId = chargeMedTempId;
        IHttp.post('basedata/searchTempInfoByTempId', {
            chargeTempId: chargeMedTempId
        }).then(function(rs) {
            if (rs.data.resultCode == '1') {
                $scope.tempUserType = rs.data.chargeMedTemp.tempType;
                vm.ypList = rs.data.medList;
                vm.ytList = rs.data.ioList;
                vm.mzczList = rs.data.anaesOptList;  //麻醉操作项目;
                if ($scope.tempUserType == 2) {
                    vm.ssList = rs.data.anaesChargeList;
                }
                vm.clList = rs.data.materialList;
                if ($scope.tempUserType == 2) {
                    vm.mzList = rs.data.anaesOptList;
                }else {
                    vm.mzList = rs.data.anaesChargeList;
                }
                vm.tempInfo = rs.data.chargeMedTemp;
            }
        });
    }

    $scope.delEntity = function(row) {
        IHttp.post('basedata/deleteChargeMedTempById', { chargeMedTempId: row.chargeMedTempId }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                getPage();
            }
        });
    }

    $scope.gridchargePkg = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,

        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                initPrice();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                initPrice();
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
                    params.filters = filterArr;
                    initPrice();
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'chargeItemName',
            displayName: '收费名称',
            cellTooltip: function(row, col) {
                return row.entity.chargeItemName;
            }
        }, {
            field: 'spec',
            displayName: '规格',
            cellTooltip: function(row, col) {
                return row.entity.spec;
            }
        }, {
            field: 'pinYin',
            displayName: '拼音码',
            cellTooltip: function(row, col) {
                return row.entity.pinYin;
            }
        }, {
            field: 'price',
            displayName: '价格',
            cellTooltip: function(row, col) {
                return row.entity.price;
            }
        }, {
            field: 'type',
            displayName: '类型',
            cellTooltip: function(row, col) {
                return row.entity.type;
            }
        }, {
            field: 'enable',
            displayName: '状态',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                }, ]
            },
        }, {
            field: 'chgItemAmount',
            displayName: '数量',
            cellTooltip: function(row, col) {
                return row.entity.chgItemAmount;
            }
        }, {
            field: 'unit',
            displayName: '单位',
            cellTooltip: function(row, col) {
                return row.entity.unit;
            }
        }, {
            field: 'chargeItemId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.deleteChargePkg(row)>删除</a><span></div>',
        }]
    };

    $scope.del = function(row) {
        IHttp.post('basedata/deleteChargeMedTempById', { chargeTempId: row.chargeTempId }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $filter('filter')($scope.gridOptions.data, function(e, k) {
                    if (e.chargeTempId == row.chargeTempId)
                        $scope.gridOptions.data.splice(k, 1);
                })
                toastr.success(rs.data.resultMessage);
            }
        });
    }

    $scope.deleteChargePkg = function(row) {
        confirm.show('你是否要删除该收费项目？').then(function() {
            var index;
            for (var i = 0; i < $scope.gridchargePkg.data.length; i++) {
                if ($scope.gridchargePkg.data[i].chargeItemId === row.entity.chargeItemId) {
                    index = i;
                }
            }
            $scope.gridchargePkg.data.splice(index, 1);
        }, function() {
            return;
        });
    }

    $scope.editChargePackages = function(row) {
        $scope.lable = '新增';
        $scope.chargePkg = {};
        $scope.gridchargePkg.data = [];
        $scope.check = true;
        if (row) {
            $scope.dataSourse = row.entity;
            $scope.lable = '编辑';
            initPrice();
        }
    }

    function initPrice() {
        var filterArr = [];
        filterArr.push({
            field: 'chargePkgId',
            value: $scope.dataSourse.chargePkgId
        });

        if ($scope.grid) {
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
        }
        params.filters = filterArr;
        IHttp.post("basedata/queryChargePackagesById", params).then(function(rs) {
            data = rs.data;
            $scope.chargePkg = data.chargePackages;
            $scope.chargePkg.enable = $scope.chargePkg.enable + '';
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
            }
            $scope.gridchargePkg.data = data.resultList;
            params.filters = [];
        });
    }

    $scope.refresh = function() {
        getPage();
    }

    var getPage = function() {
        IHttp.post("basedata/queryChargeMedTempList", params).then(function(rs) {
            data = rs.data;
            for (var i = 0; i < data.tempList.length; i++) {
                if (data.tempList[i].tempType === 1) {
                    data.tempList[i].tempType = '医生';
                } else {
                    data.tempList[i].tempType = '护士';
                }
                data.tempList[i].createTime = $filter('date')(data.tempList[i].createTime, 'yyyy-MM-dd');
            }
            $scope.gridOptions.data = data.tempList;
            $scope.gridOptions.totalItems = data.total;
        });
    }
    getPage();

    vm.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        var param = {
                tempName: vm.tempInfo.tempName,
                createUser: user.userName,
                createName: user.name,
                createTime: new Date().getTime(),
                type: 2,
                remark: vm.tempInfo.remark,
                tempType: $scope.tempUserType,
                chargeMedTempId: chargeMedTempId
            },
            chargePayList = [],
            medChargeList = [];

        // 药品
        for (var a = 0; a < vm.ypList.length; a++) {
            medChargeList.push({
                medicineId: vm.ypList[a].code,
                valamt: vm.ypList[a].packageTotalAmount,
                firmId: vm.ypList[a].firmId,
                chargedType: vm.ypList[a].chargedType
            });
        }

        // 液体
        for (var a = 0; a < vm.ytList.length; a++) {
            medChargeList.push({
                medicineId: vm.ytList[a].code,
                valamt: vm.ytList[a].packageTotalAmount,
                firmId: vm.ytList[a].firmId,
                chargedType: vm.ytList[a].chargedType
            });
        }

        // 麻醉操作项目
        if (vm.mzczList && $scope.tempUserType == 1) {
            for (var a = 0; a < vm.mzczList.length; a++) {
                chargePayList.push({
                    chargeItemId: vm.mzczList[a].chargeItemId,
                    valamt: vm.mzczList[a].chargeAmount,
                    chargedType: vm.mzczList[a].chargedType
                });
            }
        }
        // 单项手术收费
        for (var a = 0; a < vm.ssList.length; a++) {
            chargePayList.push({
                chargeItemId: vm.ssList[a].chargeItemId,
                valamt: vm.ssList[a].chargeAmount,
                chargedType: vm.ssList[a].chargedType
            });
        }

        // 材料收费
        for (var a = 0; a < vm.clList.length; a++) {
            chargePayList.push({
                chargeItemId: vm.clList[a].chargeItemId,
                valamt: vm.clList[a].chargeAmount,
                chargedType: vm.clList[a].chargedType
            });
        }

        // 麻醉用药
        for (var a = 0; a < vm.mzList.length; a++) {
            chargePayList.push({
                chargeItemId: vm.mzList[a].chargeItemId,
                valamt: vm.mzList[a].chargeAmount,
                chargedType: vm.mzList[a].chargedType
            });
        }
        var params = { tmpPriChargeMedTemp: param, tmpChargePayTempList: chargePayList, tmpMedPayTempList: medChargeList };
        IHttp.post('basedata/saveChargeMedTemp', params).then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
            }
            $rootScope.btnActive = true;
        });
    }

    vm.saveAs = function() {
        var scope = $rootScope.$new();
        scope.list = [];
        scope.mark = '收费包';
        if (vm.ypList.length > 0)
            scope.list = scope.list.concat(vm.ypList);
        if (vm.ytList.length > 0)
            scope.list = scope.list.concat(vm.ytList);
        if (vm.mzczList.length > 0)
            scope.list = scope.list.concat(vm.mzczList);
        if (vm.ssList.length > 0)
            scope.list = scope.list.concat(vm.ssList);
        if (vm.clList.length > 0)
            scope.list = scope.list.concat(vm.clList);
        if (vm.mzList.length > 0)
            scope.list = scope.list.concat(vm.mzList);
        if (scope.list.length <= 0) {
            toastr.warning('请先添加数据');
            return;
        }
        scope.userType = $scope.tempUserType == 2 ? 'N' : 'D';
        $uibModal.open({
            animation: true,
            template: require('./modal/saveAsTemp.html'),
            controller: require('./modal/saveAsTemp.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs == 'success') {
                clearData();
                getPage();
            }
        }, (err) => {});
    }

    $scope.cancel = function() {
        clearData();
    }

    function clearData() {
        $scope.tempUserType = null;
        vm.chargeMedTempId = null;
        vm.tempInfo = null;
        vm.ypList = [];
        vm.ytList = [];
        vm.mzczList = [];
        vm.ssList = [];
        vm.clList = [];
        vm.mzList = [];
        $scope.check = false;
    }

    // 验证
    function verify() {
        return $scope.feePackForm.$valid && !!($scope.tempUserType || vm.tempInfo.tempName)
    }
}