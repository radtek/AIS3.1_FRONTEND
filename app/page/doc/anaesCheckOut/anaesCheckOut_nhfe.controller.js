AnaesCheckOutCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'anaesCheckOutServe', '$uibModal', '$timeout', '$filter', 'toastr', 'select', 'confirm', 'dateFilter', 'auth'];

module.exports = AnaesCheckOutCtrl;

function AnaesCheckOutCtrl($rootScope, $scope, IHttp, anaesCheckOutServe, $uibModal, $timeout, $filter, toastr, select, confirm, dateFilter, auth) {
    var vm = this;
    $scope.setting = $rootScope.$state.current.data;
    $scope.processState = 'NO_END';
    let regOptId = $rootScope.$stateParams.regOptId;
    let isDelBat = false;
    $scope.$emit('readonly', $scope.setting);
    $scope.$emit('changeBtnText', { id: 'saveBtn', text: '保存' });
    $scope.docInfo = auth.loginUser();
    $scope.isQnz = false;
    var beCode = $scope.docInfo.beCode;
    if (beCode === 'qnzzyyy') {
        $scope.isQnz = true;
    }

    $scope.selectedItems = [];

    function initData(costType) {
        vm.selectAllCharge = false;
        vm.selectAllMed = false;
        vm.selectAllMaterial = false;
        IHttp.post('statistics/searchMedIoCharge', {
            filters: [{
                field: 'costType',
                value: costType
            }, {
                field: 'regOptId',
                value: regOptId
            }]
        }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            vm.regOptItem = rs.data.regOpt;
            vm.data = rs.data;

            if (vm.data.shouldCostTotal)
                vm.data.shouldCostTotal = vm.data.shouldCostTotal.toFixed(2);
            
            vm.data.anaesChargeList.total = 0;
            for (var a = 0; a < vm.data.anaesChargeList.length; a++) {
                vm.data.anaesChargeList[a]._type = 'ss';
                vm.data.anaesChargeList.total += Number(vm.data.anaesChargeList[a].shouldSum);
            }
            vm.data.anaesChargeList.total = vm.data.anaesChargeList.total.toFixed(2);

            vm.data.materialList.total = 0;
            for (var a = 0; a < vm.data.materialList.length; a++) {
                vm.data.materialList[a]._type = 'cl';
                vm.data.materialList.total += Number(vm.data.materialList[a].shouldSum);
            }
            vm.data.materialList.total = vm.data.materialList.total.toFixed(2);

            // vm.data.anaesList.total = 0;
            // for (var a = 0; a < vm.data.anaesList.length; a++) {
            //     vm.data.anaesList[a]._type = 'mz';
            //     vm.data.anaesList.total += Number(vm.data.anaesList[a].shouldSum);
            // }
            // vm.data.anaesList.total = vm.data.anaesList.total.toFixed(2);

            vm.data.medList.total = 0;
            for (var a = 0; a < vm.data.medList.length; a++) {
                vm.data.medList[a]._type = 'yp';
                vm.data.medList.total += Number(vm.data.medList[a].shouldCost);
            }
            vm.data.medList.total = vm.data.medList.total.toFixed(2);

            $scope.$emit('processState', 'NO_END');
            selectAllCheckbox();
        });

    }
    initData('2');

    vm.sortdown = function(index, type, direction, entity) {
        if (type == 'anaesChargeList') {
            vm.data.anaesChargeList = sort(index, vm.data.anaesChargeList, direction, entity);
        }else if(type == 'materialList') {
            var materialListTotal = angular.copy(vm.data.materialList.total);
            vm.data.materialList = sort(index, vm.data.materialList, direction, entity);
            vm.data.materialList.total = materialListTotal;
        }else if(type == 'medList') {
            var medListTotal = angular.copy(vm.data.medList.total);
            vm.data.medList = sort(index, vm.data.medList, direction, entity);
            vm.data.medList.total = medListTotal;
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

    $scope.countItemsToDel = function() {
        $scope.selectedItems = [];
        angular.forEach(vm.data.anaesChargeList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '2'
                })
            }
        });

        angular.forEach(vm.data.materialList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '2'
                })
            }
        });

        angular.forEach(vm.data.anaesOptList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '2'
                })
            }
        });

        angular.forEach(vm.data.medList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.ebId,
                    operCostType: '1'
                })
            }
        });
        if ($scope.selectedItems.length > 0)
            isDelBat = true;
        else
            isDelBat = false;
        $scope.$emit('isDelBat', isDelBat);
    }

    function selectAllCheckbox() {
        $scope.$watch('vm.selectAllCharge', function(n, o) {
            angular.forEach(vm.data.anaesChargeList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });

        $scope.$watch('vm.selectAllMed', function(n, o) {
            angular.forEach(vm.data.medList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });

        $scope.$watch('vm.selectAllMaterial', function(n, o) {
            angular.forEach(vm.data.materialList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });

        $scope.$watch('vm.selectAllAnaes', function(n, o) {
            angular.forEach(vm.data.anaesOptList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });
    }

    function save() {
        anaesCheckOutServe.save(vm.data, '1').then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                initData('2');
            }
        });
    }

    $scope.add = function($event, type) {
        $scope.$emit('processState', 'NO_END');
        let scope = $rootScope.$new();
        let url = 'optFinance';
        if (type === 'yp') {
            url = 'medFinance';
        }
        scope.type = type;
        $uibModal.open({
            animation: true,
            template: require('./modal/' + url + '.html'),
            controller: require('./modal/' + url + '.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData('2');
        }, (err) => {

        })
    }

    $scope.update = function(item, type) {
        var param = {};
        if (type === 'anaesChargeList' || type === 'materialList' || type === 'anaesList') {
            if (item.chargeAmount == undefined)
                item.chargeAmount = 0;
            item.shouldSum = (item.chargeAmount * item.priceMinPackage).toFixed(2);
            param[type] = [item];
        } else if (type === 'medList' || type === 'ioList') {
            if (item.packageTotalAmount == undefined)
                item.packageTotalAmount = 0;
            item.shouldCost = (item.packageTotalAmount * item.priceMinPackage).toFixed(2);
            param[type] = [item];
        }
        anaesCheckOutServe.save(param, '0').then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                initData('2');
            }
        });
    }

    $scope.del = function(item, type) {
        if (type == 'charge' || type == 'materialList' || type == 'anaesList') {
            anaesCheckOutServe.delPack(item.pkItId).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success('删除成功!');
                    initData('2');
                }
            });
        } else {
            anaesCheckOutServe.delEte(item.ebId).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success('删除成功!');
                    initData('2');
                }
            });
        }
    }

    function appTemplat() {
        var scope = $rootScope.$new();
        scope.mark = '核算单';
        scope.tempType = '2';
        scope.userType = 'N';
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./modal/applyPackDialog.html'),
            controller: require('./modal/applyPackDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData('2');
        }, (err) => {

        })
    }

    function searchMed(type) {
        var scope = $rootScope.$new();
        scope.type = type;
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./modal/medDialog.html'),
            controller: require('./modal/medDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {

        }, (err) => {

        });
    }

    $scope.tb = function() {
        IHttp.post('document/synMedicTakeInfoList', {
            regOptId: regOptId,
            userType: $scope.docInfo.userType,
            costType: '2'
        }).then(function(rs) {
            toastr.info(rs.data.resultMessage);
            if (rs.data.resultCode === '1') {
                IHttp.post('statistics/searchMedIoCharge', {
                    filters: [{
                        field: 'regOptId',
                        value: regOptId
                    }, {
                        field: 'costType',
                        value: '2'
                    }]
                }).then(function(rs) {
                    if (rs.data.resultCode === '1') {
                        toastr.success(rs.data.resultMessage);
                        initData('2');
                    }
                });
            }
        });
    }

    function delBatch() {
        IHttp.post('document/batchDeleteCostDetail', $scope.selectedItems)
            .then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success(rs.data.resultMessage);
                    initData('2');
                }
            });
    }

    function saveAs() {
        if (!vm.data)
            toastr.warning('请先添加数据');
        var scope = $rootScope.$new();
        scope.list = [];
        scope.mark = '核算单';
        if (vm.data.medList.length > 0)
            scope.list = scope.list.concat(vm.data.medList);
        if (vm.data.anaesChargeList.length > 0)
            scope.list = scope.list.concat(vm.data.anaesChargeList);
        if (vm.data.materialList.length > 0)
            scope.list = scope.list.concat(vm.data.materialList);
        if (scope.list.length <= 0) {
            toastr.warning('请先添加数据');
            return;
        }
        scope.userType = 'N';
        $uibModal.open({
            animation: true,
            template: require('./modal/saveAsTemp.html'),
            controller: require('./modal/saveAsTemp.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData('2');
        }, (err) => {

        })
    }

    function hisFin() {
        confirm.show('确定将数据同步到HIS？<br>选择"是"将数据同步到HIS，选择"否"取消同步').then(function(data) {
            IHttp.post('interfacedata/sendOperCostDataToHis', {
                regOptId: regOptId,
                costType: '2',
                createUser: $scope.docInfo.userName
            }).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    if (rs.data.failList.length == 0) {
                        toastr.success("操作成功");
                    }else {
                        toastr.error(rs.data.failList);
                    }
                    initData('2');
                }
            });
        });
    }

    function sameMed() {
            confirm.show('确定将同步术中药品？<br>选择"是"将同步术中药品，选择"否"取消同步').then(function(data) {
                IHttp.post('interfacedata/sameOperMedData', {
                    regOptId: regOptId,
                    costType: '这个接口待开发',
                    createUser: $scope.docInfo.userName
                }).then(function(rs) {
                    if (rs.data.resultCode != 1) {
                        return;
                    } else {
                        if (rs.data.failList.length == 0) {
                            toastr.success("操作成功");
                        }else {
                            toastr.error(rs.data.failList);
                        }
                    }
                    toastr.success(rs.data.resultMessage);
                    initData('2');
                });
            });
    }

    $scope.$on('save', () => {
        save();
    });

    $scope.$on('appTemplat', () => {
        appTemplat();
    })

    $scope.$on('searchMed', () => {
        searchMed('N');
    })

    $scope.$on('saveAs', () => {
        saveAs();
    })

    $scope.$on('delBatch', () => {
        delBatch();
    })

    $scope.$on('hisFin', () => {
        hisFin();
    })

    $scope.$on('sameMed', () => {
        sameMed();
    })

    $scope.$on('print', () => {
        initData('2', 'FINISH');
        $timeout(function(){
            $scope.$emit('doc-print');
            initData('2');
        }, 500)
    })
}