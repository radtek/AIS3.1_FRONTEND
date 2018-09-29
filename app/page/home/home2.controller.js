HomeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', 'auth', 'toastr', '$uibModal', '$filter', 'confirm'];

module.exports = HomeCtrl;

function HomeCtrl($rootScope, $scope, IHttp, uiGridConstants, auth, toastr, $uibModal, $filter, confirm) {
    var user = auth.loginUser();
    $scope.tabIndex = 0;
    $scope.tabIndex1 = 0;
    $scope.tabIndex2 = 0;

    $scope.eConfig = {
        dataLoaded: true,
        resize: true
    };
    $scope.eConfig2 = {
        dataLoaded: true,
        resize: true
    };
    $scope.beid = user.beid;
    $scope.currentPage = 1;
    $scope.prev = false;
    $scope.prev1 = false;
    $scope.prev2 = false;
    $scope.next = false;
    $scope.next1 = false;
    $scope.next2 = false;

    $scope.showpager = false;
    $scope.showpager1 = false;
    $scope.showpager2 = false;
    $scope.statestr = "全部";
    $scope.operRoomstr = '手术室';
    var pageNo = 1;
    var state = '03,04,06';
    var operRoomId = "";
    let tomorrow = $filter('date')(new Date().getTime() + 86400000, 'yyyy-MM-dd');
    let thisweek = $filter('date')(new Date().getTime() - 86400000 * 7, 'yyyy-MM-dd');
    let today = $filter('date')(new Date(), 'yyyy-MM-dd');
    var params = { pageNo: 1, pageSize: 10, state: '03,04,06', loginName: user.userName, "operRoomId": "", "startTime": "", "endTime": "" };
    var params1 = { pageNo: 1, pageSize: 10, state: '03', loginName: user.userName, "operRoomId": "", "startTime": tomorrow, "endTime": tomorrow };
    var params2 = { pageNo: 1, pageSize: 10, state: '06', loginName: user.userName, "operRoomId": "", "startTime": thisweek, "endTime": today };


    $scope.switchTab = function(num, tabIndex) {
        $scope.tabdaynum = num;
        pageNo = 1;
        if (num == 0) {
            $scope.tabIndex = tabIndex;
            if (tabIndex === 1) { //今日某状态手术
                //状态下拉值展示
                $scope.tabMenu1 = true;
                $scope.tabMenu2 = false;
            } else if (tabIndex === 2) { //今日某手术室手术
                //所有手术室数据展示
                $scope.tabMenu1 = false;
                $scope.tabMenu2 = true;
            } else if (tabIndex === 0) { //今日本人手术
                $scope.tabMenu1 = false;
                $scope.tabMenu2 = false;
                state = '03,04,06';
                params = { pageNo: pageNo, pageSize: 10, state: state, loginName: user.userName, "operRoomId": "", "startTime": "", "endTime": "" };
                getPage();
            }
        } else if (num == 1) {
            $scope.tabIndex1 = tabIndex;
            if (tabIndex === 2) { //明天某手术室手术
                //所有手术室数据展示                
                $scope.tabMenu4 = true;
            } else if (tabIndex === 1) { //明天全部               
                $scope.tabMenu4 = false;
                params1 = { pageNo: pageNo, pageSize: 10, state: '03', loginName: "", "operRoomId": "", "startTime": tomorrow, "endTime": tomorrow };
                getPage1();
            } else if (tabIndex === 0) {
                $scope.tabMenu4 = false;
                params1 = { pageNo: pageNo, pageSize: 10, state: '03', loginName: user.userName, "operRoomId": "", "startTime": tomorrow, "endTime": tomorrow };
                getPage1();
            }
        } else if (num == 2) {
            $scope.tabIndex2 = tabIndex;
            if (tabIndex === 2) {
                //所有手术室数据展示                
                $scope.tabMenu6 = true;
            } else if (tabIndex === 1) { //本周全部               
                $scope.tabMenu6 = false;
                params2 = { pageNo: pageNo, pageSize: 10, state: '06', loginName: "", "operRoomId": "", "startTime": thisweek, "endTime": today };
                getPage2();
            } else if (tabIndex === 0) {
                $scope.tabMenu6 = false;
                params2 = { pageNo: pageNo, pageSize: 10, state: '06', loginName: user.userName, "operRoomId": "", "startTime": thisweek, "endTime": today };
                getPage2();
            }
        }
    }

    $scope.setState = function(_state, _pageNo) {
        pageNo = _pageNo ? _pageNo : pageNo;
        state = _state ? _state : state;
        $scope.operRoomstr = '手术室';
        if (state == '03')
            $scope.statestr = "术前";
        else if (state == '04')
            $scope.statestr = "术中";
        else if (state == '06')
            $scope.statestr = "术后";
        else if (state == '03,04,06') {
            $scope.statestr = "全部";
        }
        params = { pageNo: pageNo, pageSize: 10, state: state, loginName: "", "operRoomId": "", "startTime": "", "endTime": "" };
        getPage();
    }

    $scope.setOperRoom = function(num, _operRoomId, _pageNo) {
        pageNo = _pageNo ? _pageNo : pageNo;
        operRoomId = _operRoomId ? _operRoomId : operRoomId;
        if (num == 0) {
            $scope.statestr = "全部";
            params = { pageNo: pageNo, pageSize: 10, state: '03,04,06', loginName: "", "operRoomId": operRoomId, "startTime": "", "endTime": "" };
            getPage();
        } else if (num == 1) {
            params1 = { pageNo: pageNo, pageSize: 10, state: '03', loginName: "", "operRoomId": operRoomId, "startTime": tomorrow, "endTime": tomorrow };
            getPage1();
        } else if (num == 2) {
            params2 = { pageNo: pageNo, pageSize: 10, state: '06', loginName: "", "operRoomId": operRoomId, "startTime": thisweek, "endTime": today };
            getPage2();
        }
    }

    $scope.prevPage = function(num) {
        pageNo = pageNo - 1;
        if (num == 0) {
            params = { pageNo: pageNo, pageSize: 10, state: state, loginName: ($scope.tabIndex == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": "", "endTime": "" };
            getPage();
        } else if (num == 1) {
            params1 = { pageNo: pageNo, pageSize: 10, state: '03', loginName: ($scope.tabIndex1 == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": tomorrow, "endTime": tomorrow };
            getPage1();
        } else if (num == 2) {
            params2 = { pageNo: pageNo, pageSize: 10, state: '06', loginName: ($scope.tabIndex2 == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": thisweek, "endTime": today };
            getPage2();
        }
    }
    $scope.nextPage = function(num) {
        pageNo = pageNo + 1;
        if (num == 0) {
            params = { pageNo: pageNo, pageSize: 10, state: state, loginName: ($scope.tabIndex == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": "", "endTime": "" };
            getPage();
        } else if (num == 1) {
            params1 = { pageNo: pageNo, pageSize: 10, state: '03', loginName: ($scope.tabIndex1 == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": tomorrow, "endTime": tomorrow };
            getPage1();
        } else if (num == 2) {
            params2 = { pageNo: pageNo, pageSize: 10, state: '06', loginName: ($scope.tabIndex2 == 0 ? user.userName : ""), "operRoomId": operRoomId, "startTime": thisweek, "endTime": today };
            getPage2();
        }
    }

    getPage();
    getPage1();
    getPage2();

    function getPage() {
        IHttp.post('operation/getRegOpt', params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.grid_data = rs.data.resultList;
            $scope.grid_totalItems = rs.data.total;
            if (10 < $scope.grid_totalItems) {
                $scope.showpager = true;
                $scope.next = true;
                if (pageNo >= Math.ceil($scope.grid_totalItems / 10)) {
                    $scope.next = false;
                    $scope.prev = true;
                }
                if (pageNo == 1) {
                    $scope.prev = false;
                }
            } else {
                $scope.showpager = false;
                $scope.next = false;
            }

        });
    }




    function getPage1() {
        IHttp.post('operation/getRegOpt', params1).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.grid1_data = rs.data.resultList;
            $scope.grid1_totalItems = rs.data.total;
            if (10 < $scope.grid1_totalItems) {
                $scope.showpager1 = true;
                $scope.next1 = true;
                if (pageNo >= Math.ceil($scope.grid1_totalItems / 10)) {
                    $scope.next1 = false;
                    $scope.prev1 = true;
                }
                if (pageNo == 1) {
                    $scope.prev1 = false;
                }
            } else {
                $scope.showpager1 = false;
                $scope.next1 = false;
            }
        });
    }

    function getPage2() {
        IHttp.post('operation/getRegOpt', params2).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            $scope.grid2_data = rs.data.resultList;
            $scope.grid2_totalItems = rs.data.total;
            if (10 < $scope.grid2_totalItems) {
                $scope.showpager2 = true;
                $scope.next2 = true;
                if (pageNo >= Math.ceil($scope.grid2_totalItems / 10)) {
                    $scope.next2 = false;
                    $scope.prev2 = true;
                }
                if (pageNo == 1) {
                    $scope.prev2 = false;
                }

            } else {
                $scope.showpager2 = false;
                $scope.next2 = false;
            }

        });
    }

    // 查看
    $scope.query = function(row, url) {
        sessionStorage.setItem('hasAnaesPacuRec', row.pacuId === '' ? false : true);
        sessionStorage.setItem('regOptId', row.regOptId);
        sessionStorage.setItem('showPlacentaAgree', row.sex === '男' ? false : true);
        if (user.beCode == 'sybx') {
            switch (row.state) {
                case '03':
                    $rootScope.$state.go('preOperDateil', {
                        regOptId: row.regOptId
                    });
                    break;
                default:
                    $rootScope.$state.go('queryOperDateil', {
                        regOptId: row.regOptId
                    });
            }

        } else if (user.beCode == 'llzyyy') {
            $rootScope.$state.go('preOperDateil', {
                regOptId: row.regOptId
            });
        } else {
            $rootScope.$state.go('queryOperDateil', {
                regOptId: row.regOptId
            });
        }

    }

    // 手动录入
    $scope.add = function() {
        $rootScope.$state.go('anaeEmergency');
    }

    IHttp.post('basedata/queryRoomList', { "pageNo": 1, "pageSize": 100, "sort": "", "orderBy": "", "filters": [{ field: 'enable', value: 1 }] }).then(function(rs) {
        if (rs.data.resultCode == '1') {
            $scope.roomList = rs.data.resultList;
        }
    });

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
        console.log(item);
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