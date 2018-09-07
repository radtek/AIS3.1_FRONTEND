AnaesCheckOutCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'anaesCheckOutServe', '$uibModal', 'toastr', 'confirm', 'auth'];

module.exports = AnaesCheckOutCtrl;

function AnaesCheckOutCtrl($rootScope, $scope, IHttp, anaesCheckOutServe, $uibModal, toastr, confirm, auth) {
    var vm = this;
    $scope.processState = 'NO_END';
    let regOptId = $rootScope.$stateParams.regOptId;
    let isDelBat = false;
    $scope.docInfo = auth.loginUser();
    
    $scope.selectedItems = [];
    function initData() {
        vm.selectAllCharge = false;
        vm.selectAllMed = false;
        vm.selectAllIo = false;
        vm.selectAllMzfy = false;
        IHttp.post('statistics/searchMedIoCharge', { filters: [{ field: 'costType', value: '1' }, { field: 'regOptId', value: regOptId }]}).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            vm.regOptItem = rs.data.regOpt;
            vm.data = rs.data;

            if(vm.data.shouldCostTotal)
                vm.data.shouldCostTotal = vm.data.shouldCostTotal.toFixed(2);
            // vm.data.charge.total = 0;
            // for (var a = 0; a < vm.data.charge.length; a++) {
            //     vm.data.charge[a]._type = 'ss';
            //     vm.data.charge.total += Number(vm.data.charge[a].shouldSum);
            // }
            // vm.data.charge.total = vm.data.charge.total.toFixed(2);

            vm.data.ioList.total = 0;
            for (var a = 0; a < vm.data.ioList.length; a++) {
                vm.data.ioList[a]._type = 'yt';
                vm.data.ioList.total += Number(vm.data.ioList[a].shouldCost);
            }
            vm.data.ioList.total = vm.data.ioList.total.toFixed(2);

            vm.data.materialList.total = 0;
            for (var a = 0; a < vm.data.materialList.length; a++) {
                vm.data.materialList[a]._type = 'cl';
                vm.data.materialList.total += Number(vm.data.materialList[a].shouldSum);
            }
            vm.data.materialList.total = vm.data.materialList.total.toFixed(2);

            vm.data.medList.total = 0;
            for (var a = 0; a < vm.data.medList.length; a++) {
                vm.data.medList[a]._type = 'yp';
                vm.data.medList.total += Number(vm.data.medList[a].shouldCost);
            }
            vm.data.medList.total = vm.data.medList.total.toFixed(2);

            //麻醉费用统计
            vm.data.anaesChargeList.total = 0;
            for (var a = 0; a < vm.data.anaesChargeList.length; a++) {
                vm.data.anaesChargeList[a]._type = 'mzfy';
                vm.data.anaesChargeList.total += Number(vm.data.anaesChargeList[a].shouldSum);
            }
            vm.data.anaesChargeList.total = vm.data.anaesChargeList.total.toFixed(2);
            //麻醉操作费用统计
            vm.data.anaesOptList.total = 0;
            for (var a = 0; a < vm.data.anaesOptList.length; a++) {
                vm.data.anaesOptList[a]._type = 'mzcz';
                vm.data.anaesOptList.total += Number(vm.data.anaesOptList[a].shouldSum);
            }
            vm.data.anaesOptList.total = vm.data.anaesOptList.total.toFixed(2);
            $scope.$emit('processState', 'NO_END');
            selectAllCheckbox();
        });
    }
    initData();

    vm.sortdown = function(index, type, direction, entity) {
        if (type == 'medList') {
            var medListTotal = angular.copy(vm.data.medList.total);
            vm.data.medList = sort(index, vm.data.medList, direction, entity);
            vm.data.medList.total = medListTotal;
        }else if(type == 'ioList') {
            var ioListTotal = angular.copy(vm.data.ioList.total);
            vm.data.ioList = sort(index, vm.data.ioList, direction, entity);
            vm.data.ioList.total = ioListTotal;
        }else if(type == 'anaesChargeList') {
            var anaesChargeListTotal = angular.copy(vm.data.anaesChargeList.total);
            vm.data.anaesChargeList = sort(index, vm.data.anaesChargeList, direction, entity);
            vm.data.anaesChargeList.total = anaesChargeListTotal;
        }else if(type == 'anaesOptList') {
            var anaesOptListTotal = angular.copy(vm.data.anaesOptList.total);
            vm.data.anaesOptList = sort(index, vm.data.anaesOptList, direction, entity);
            vm.data.anaesOptList.total = anaesOptListTotal;
        }else if(type == 'materialList') {
            var materialListTotal = vm.data.materialList.total;
            vm.data.materialList = sort(index, vm.data.materialList, direction, entity);
            vm.data.materialList.total = materialListTotal;
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
        angular.forEach(vm.data.materialList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '2'
                })
            }
        });

        angular.forEach(vm.data.anaesChargeList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '2'
                })
            }
        });

        angular.forEach(vm.data.ioList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.ebId,
                    operCostType: '1'
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

        angular.forEach(vm.data.anaesOptList, function(item, index) {
            if (item.isSelected) {
                $scope.selectedItems.push({
                    primaryKeyId: item.pkItId,
                    operCostType: '3'
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
            angular.forEach(vm.data.materialList, function(item, index) {
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

        $scope.$watch('vm.selectAllIo', function(n, o) {
            angular.forEach(vm.data.ioList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });
        $scope.$watch('vm.selectAllMzfy', function(n, o) {
            angular.forEach(vm.data.anaesChargeList, function(item, index) {
                if (item.state !== 'FINISH') {
                    item.isSelected = n;
                }
            });
            $scope.countItemsToDel();
        });
        $scope.$watch('vm.selectAllAnaesOpt', function(n, o) {
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
                initData();
            }
        });
    }

    $scope.add = function($event, type) {
        $scope.$emit('processState', 'NO_END');
        let scope = $rootScope.$new();
        let url = 'optFinance';
        if (type==='yp' || type==='yt') {
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
            initData();
        }, (err) => {
            
        })
    }

    $scope.update = function(item, type) {
        var param = {};
        if (type === 'anaesChargeList' || type === 'materialList' || type === 'anaesOptList') {
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
                initData();
            }
        });
    }

    $scope.del = function(item, type) {
        if (type == 'charge' || type == 'materialList' || type == 'anaesOptList' || type == 'anaesChargeList') {
            anaesCheckOutServe.delPack(item.pkItId).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success('删除成功!');
                    initData();
                }
            });
        } else {
            anaesCheckOutServe.delEte(item.ebId).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    toastr.success('删除成功!');
                    initData();
                }
            });
        }
    }

    $scope.tb = function() {
        IHttp.post('document/synMedicTakeInfoList', {
            regOptId: regOptId,
            userType: $scope.docInfo.userType,
            costType: '1'
        }).then(function(rs) {
            toastr.info(rs.data.resultMessage);
            if (rs.data.resultCode === '1') {
                IHttp.post('statistics/searchMedIoCharge', {
                    filters: [{
                        field: 'regOptId',
                        value: regOptId
                    }, {
                        field: 'costType',
                        value: '1'
                    }]
                }).then(function(rs) {
                    if (rs.data.resultCode === '1') {
                        // toastr.success(rs.data.resultMessage);
                        initData();
                    }
                });
            }
        });
    }

    function appTemplat() {
        var scope = $rootScope.$new();
        scope.mark = '核算单';
        scope.tempType = '1';
        scope.userType = 'D';
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
            initData();
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

    function delBatch() {
        IHttp.post('document/batchDeleteCostDetail', $scope.selectedItems)
        .then(function(rs) {
            if (rs.data.resultCode === '1') {
                toastr.success(rs.data.resultMessage);
                initData();
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
        if (vm.data.ioList.length > 0)
            scope.list = scope.list.concat(vm.data.ioList);
        if (vm.data.anaesOptList.length > 0)
            scope.list = scope.list.concat(vm.data.anaesOptList);
        if (vm.data.anaesChargeList.length > 0)
            scope.list = scope.list.concat(vm.data.anaesChargeList);
        if (vm.data.materialList.length > 0)
            scope.list = scope.list.concat(vm.data.materialList);
        if (scope.list.length <= 0) {
            toastr.warning('请先添加数据');
            return;
        }
        scope.userType = 'D';
        $uibModal.open({
            animation: true,
            template: require('./modal/saveAsTemp.html'),
            controller: require('./modal/saveAsTemp.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            initData();
        }, (err) => {
            
        })
    }

    function hisFin() {
        confirm.show('确定将数据同步到HIS？<br>选择"是"将数据同步到HIS，选择"否"取消同步').then(function(data) {
            IHttp.post('interfacedata/sendOperCostDataToHis', {
                regOptId: regOptId,
                costType: '1',
                createUser: $scope.docInfo.userName
            }).then(function(rs) {
                if (rs.data.resultCode == 1) {
                    if (rs.data.failList.length == 0) {
                        toastr.success("操作成功");
                    }else {
                        toastr.error(rs.data.failList);
                    }
                    initData();
                }
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

    $scope.$on('syncHis', () => {
        hisFin();
    });
}