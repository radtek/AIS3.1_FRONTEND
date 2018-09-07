HomeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', 'toastr', '$uibModal', '$filter', 'confirm'];

module.exports = HomeCtrl;

function HomeCtrl($rootScope, $scope, IHttp, auth, toastr, $uibModal, $filter, confirm) {
    var user = auth.loginUser();

    $scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
    $scope.eConfig2 = {
        dataLoaded: true,
        resize: true
    };
    $scope.beid=user.beid;
    // 手术时长
    IHttp.post('statistics/searchWorkingTime', { loginName: user.userName }).then(function(rs) {
        var data = rs.data,
            opt = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '0',
                    right: '0',
                    bottom: '0',
                    containLabel: true
                },
                yAxis: {
                    type: 'value'
                }
            }
        if (data.resultCode != '1')
            return;
        opt.xAxis = data.xAxis;
        opt.series = data.series;
        $scope.duraStat = opt;
        $scope.eConfig.dataLoaded = false;
    });

    // 手术台次统计
    IHttp.post('statistics/searchHomeOperTimes', { loginName: user.userName }).then(function(rs) {
        var data = rs.data,
            opt = {
                color: ['#6699CC', '#3399CC', '#DDBBBB', '#934A4A', '#99CCFF', '#0099CC', '#949405', '#BBEF98', '#6DDD22', '#418514', '#DCB0F9', '#9611EE'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left'
                }
            }
        if (data.resultCode != '1')
            return;
        opt.legend.data = data.legend.data;
        opt.series = data.series;
        opt.series.forEach(function(i) {
            i.radius = ["50%", "70%"];
            i.avoidLabelOverlap = false;
            i.label = {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: 30,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                }
            }
        });
        $scope.tcsStat = opt;
        $scope.eConfig2.dataLoaded = false;
    });

    // 待补事项
    IHttp.post('research/searchIncompleteThing', { loginName: user.userName }).then(function(rs) {
        var data = rs.data;
        if (data.resultCode != '1')
            return;
        // 待补文书
        $scope.doc = data.noEndPreVisit;
        // 今日手术
        $scope.todayOpt = data.todayOperation;
        // 我的手术
        $scope.myOpt = data.myOperation;
        // 待排班病人
        $scope.pat = data.noScheduling;
    });

    // 查询手术包中无效的收费项目、药品明细
    $scope._active = 1;
    initPack();

    function initPack() {
        IHttp.post('basedata/queryInvalidListByChargeTemp').then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            $scope.medicineList = rs.data.medicineList;
            $scope.chargeItemList = rs.data.chargeItemList;
        })
    }

    // 删除包
    $scope.del = function(ev, type, item) {
        var name = type == 1 ? item.name : item.chargeItemName;
        confirm.show('是否删除所有收费包中的' + name + '?').then(function(rs) {
            IHttp.post('basedata/batchDelChargeTempDetaiInvalidData', {
                "costType": type, //1代表药品  2代表收费项目
                "medicineId": type == 1 ? item.medicineId : undefined, //costType = 1时传入
                "firmId": type == 1 ? item.firmId : undefined, //costType = 1时传入
                "chargeItemId": type == 2 ? item.chargeItemId : undefined //costType =2时传入
            }).then(function(rs) {
                if (type == 1) {
                    $filter('filter')($scope.medicineList, function(row, index) {
                        if (row.medicineId == item.medicineId)
                            $scope.medicineList.splice(index, 1);
                    })
                } else if (type == 2) {
                    $filter('filter')($scope.chargeItemList, function(row, index) {
                        if (row.chargeItemId == item.chargeItemId)
                            $scope.chargeItemList.splice(index, 1);
                    })
                }
            })
        });
    }

    // 替换
    $scope.replace = function(ev, costType, item) {
        var scope = $rootScope.$new();
        scope.costType = costType;
        scope.item = item;
        $uibModal.open({
            animation: true,
            size: 'mg',
            template: require('./modal/packDialog.html'),
            controller: require('./modal/packDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            $scope._active = costType;
            initPack();
        }, (err) => {});
    }

    // // 自由替换
    $scope.autoReplace = function(ev, costType) {
        var scope = $rootScope.$new();
        $uibModal.open({
            animation: true,
            size: 'mg',
            template: require('./modal/allPackDialog.html'),
            controller: require('./modal/allPackDialog.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            $scope._active = costType;
            initPack();
        }, (err) => {});
    }

    // 弹出框
    $scope.showModal = function(type) {
        var scope = $rootScope.$new(),
            size = 'lg';
        scope.tit = type;

        if (type == '待补文书')
            scope.data = $scope.doc.resultList;

        else if (type == '今日手术') {
            scope.data = $scope.todayOpt.resultList;
            size = '1200';
        } else if (type == '我的手术') {
            scope.data = $scope.myOpt.resultList;
            size = '1200';
        } else if (type == '待排班病人') {
            scope.data = $scope.pat.resultList;
            size = '1200';
        }

        if (scope.data.length <= 0) return;

        var uibModal = $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: size,
            template: require('./modal/docModal.html'),
            controller: require('./modal/docModal.controller.js'),
            scope: scope
        }).result.then(function(rs) {

        });
    }

    //公告信息
    function getAllAnnouncement() {
        IHttp.post('basedata/searchAllAnnouncement', {}).then(function(rs) {
            var data = rs.data;
            if (data.resultCode != '1')
                return;
            $scope.notice = rs.data.resultList;
        });
    }

    getAllAnnouncement();

    $scope.editAnnouncement = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.id = 0;
        } else {
            scope.id = row.entity.id;
        }
        $uibModal.open({
            animation: true,
            template: require('../sysManage/dictionary/announcementDictionary/editAnnouncementDictionary.html'),
            controller: require('../sysManage/dictionary/announcementDictionary/editAnnouncementDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getAllAnnouncement();
        });
    }
}