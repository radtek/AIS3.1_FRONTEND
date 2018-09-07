DocCtrl.$inject = ['$rootScope', '$scope', 'select', '$timeout', 'auth', 'anesRecordServe'];

module.exports = DocCtrl;

function DocCtrl($rootScope, $scope, select, $timeout, auth, anesRecordServe) {
    var regOptId = $rootScope.$stateParams.regOptId;
    var currUser = auth.loginUser();
    $scope.beCode = currUser.beCode;
    $scope.btnHide = false;
    $scope.isDelBat = false;
    $scope.page = $rootScope.$state.current.name;
    $scope.docRequired = "";

    $scope.saveActive = auth.getDocAuth();
    $scope.$on('readonly', function(event, data) {
        if (data && data.readonly == true) {
            $scope.btnHide = data.readonly;
        } else {
            $scope.btnHide = false;
        }
    });

    $scope.$on('isLocalAnaes', function(event, data) {
        if (data) {
            if (data !== '0')
                $rootScope.$root.permission = $rootScope.$root.permission.replace(',REF', '');
        }
    });

    $scope.$on('changeBtnText', function(event, data) {
        $timeout(function() {
            $('#' + data.id).text(data.text);
        }, 100)
    });

    $scope.$on('isDelBat', function(event, data) {
        $scope.isDelBat = data;
    });

    // 打印
    $scope.print = function() {
        $scope.$broadcast('print');
    }

    // 打印指示卡
    $scope.printCard = function() {
        $scope.$broadcast('printCard');
    }

    // 新增
    $scope.add = function() {
        $scope.$broadcast('add');
    }

    // 保存
    $scope.save = function() {
        $scope.$broadcast('save');
    }

    // 提交
    $scope.submit = function() {
        $scope.$broadcast('submit');
    }

    // 一键打印
    $scope.onAKeyPrint = function() {
        $scope.$broadcast('onAKeyPrint');
    }

    // 添加器械[包]
    $scope.addInst = function(type) {
        $scope.$broadcast('addInst', type);
    }

    // 添加敷料[包]
    $scope.addInsf = function(type) {
        $scope.$broadcast('addInsf', type);
    }

    $scope.addInsOpr = function(type) {
        $scope.$broadcast('addInsOpr', type);
    }

    $scope.appTemplat = function() {
        $scope.$broadcast('appTemplat');
    }

    $scope.searchMed = function() {
        $scope.$broadcast('searchMed');
    }

    $scope.sameMed = function() {
        $scope.$broadcast('sameMed');
    }

    $scope.delBatch = function() {
        $scope.$broadcast('delBatch');
    }

    $scope.saveAs = function() {
        $scope.$broadcast('saveAs');
    }

    $scope.hisFin = function() {
        $scope.$broadcast('hisFin');
    }

    $scope.syncHis = function() {
        $scope.$broadcast('syncHis');
    }

    //数据同步
    $scope.refresh = function() {
        $scope.$broadcast('refresh');
    }

    //设置必填项
    $scope.set = function() {
        $scope.$broadcast('set');
    }
    //清空
    $scope.clear = function() {
        $scope.$broadcast('clear');
    }
    // 返回上级
    $scope.back = function() {
        window.history.back();
        // window.location.reload();
    }

    // 监听打印的文书
    $scope.$on('doc-print', () => {
        window.print();
        // window.open($rootScope.$state.href('print'));
    })

    $scope.$on('end-print', (event, state) => {
        $scope.processState = event.targetScope.processState;
        let tabs = $scope.tabsMenu;
        let currentName = $scope.$state.current.name;
        for (let tab of tabs) {
            if (tab.url.substr(0, tab.url.indexOf('(')) === currentName) {
                if (event.targetScope.processState === 'END' && tab.name != '基本信息') {
                    tab.state = true;
                    break;
                }
            }
        }
        window.print();
        // window.open($rootScope.$state.href('print'));
    })

    // 文书完成状态
    $scope.$on('processState', function(data, state) {
        $scope.$emit('processState1', state);
        // $scope.processState = state;
        // let currentName = $scope.$state.current.name;
        // for(var a = 0; a < $scope.tabsMenu.length; a++) {
        //     let tab = $scope.tabsMenu[a];
        //     if (tab.url.substr(0, tab.url.indexOf('(')) === currentName) {
        //         if (data.targetScope.processState == 'END' && tab.name != '基本信息') {
        //             tab.state = true;
        //             break;
        //         }
        //     }
        // }
        // $scope.tabsMenu[22].state = true;
        // $rootScope.tabsMenu[22].state = true;
    });

    $scope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        var isAnaes = false;
        if (currUser.module == 'oprm')
            anesRecordServe.stopTimerRt();
        if (!regOptId || $rootScope.tabsMenu.length < 1) return;
        select.getDocState(regOptId).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            var list = rs.data.resultList,
                tabs = $rootScope.tabsMenu;
            for (var a = 0; a < tabs.length; a++) {
                if (currUser.module == 'oprm' && !tabs[a].state && (tabs[a].name == '麻醉记录单（一）' || tabs[a].name == '麻醉记录单一')) {
                    anesRecordServe.startTimerRt(regOptId);
                }
            }
        })
    })
}