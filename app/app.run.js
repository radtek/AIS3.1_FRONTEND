module.exports = run;

run.$inject = ['$rootScope', '$state', '$stateParams', 'auth', 'menu', 'i18nService', '$location'];

function run($rootScope, $state, $stateParams, auth, menu, i18nService, $location) {
    
    let tabs = [],
        ipConfig = JSON.parse(sessionStorage.getItem('ipConfig'));

    // button按钮的初始状态
    i18nService.setCurrentLang('zh-cn');
    $rootScope.btnActive = true;
    $rootScope.selectBeid = selectBeid;
    $rootScope.NODE_ENV = process.env.NODE_ENV;

     if (!ipConfig) {
        if (process.env.NODE_ENV == 'development')
            var ipUrl = 'ipConfig.json';
        else
            var ipUrl = 'app/ipConfig.json';
        $.get(ipUrl).then(function(res) {
            ipConfig = res;
            sessionStorage.setItem('ipConfig', JSON.stringify(res));
            $rootScope.baseUrl = 'http://' + ipConfig.ipPort;
        })
    } else
        $rootScope.baseUrl = 'http://' + ipConfig.ipPort;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        // 获取当前状态，绑定到根作用域上
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        if(toState.name == 'operroom') {
            $rootScope.$broadcast('banSelectRoom', true)
        } else {
            $rootScope.$broadcast('banSelectRoom', false)
        }
        if (toState.name == 'login' || toState.name == 'pacu') {
            auth.logout();
            return;
        } else if (toState.name == 'inScreen') {
            event.preventDefault();
            sessionStorage.setItem('screenPort', ipConfig.screenPort);
            window.location = $rootScope.baseUrl + '/app/big/OperateInfoByInsideScreen.html';
            return;
        } else if (toState.name == 'outScreen') {
            event.preventDefault();
            sessionStorage.setItem('screenPort', ipConfig.screenPort);
            window.location = $rootScope.baseUrl + '/app/big/OperateInfoByOutsideScreen.html';
            return;
        } else if (toState.name == 'centerScreen') {
            event.preventDefault();
            sessionStorage.setItem('screenPort', ipConfig.screenPort);
            window.location = $rootScope.baseUrl + '/app/big/centralMonitoring.html';
            return;
        }
        if (!auth.isAuthenticated()) {
            event.preventDefault();
            auth.logout();
            if (toState.name == 'pacu')
                $state.go('pacu');
            else
                $state.go('login');
            return;
        } else {
            var menuArr = auth.userPermission();
            var opt = menu.opt(toState.name, menuArr);
            console.log(opt)
            // 面包屑
            $rootScope.crumbs = opt.crumbs;

            // tab菜单
            $rootScope.tabsMenu = opt.tabsMenu;
            // if (tabs.length === 0) {
            //     $rootScope.tabsMenu = opt.tabsMenu;
            // }
            // tabs = opt.tabsMenu;
            // if (opt.tabsMenu.length > 0) {
            //     if (tabs.length > 0) {
            //         if ($rootScope.tabsMenu[0].id != tabs[0].id) {
            //             $rootScope.tabsMenu = opt.tabsMenu;
            //         }
            //     }
            // }

            // button菜单按钮
            $rootScope.btnsMenu = opt.btnsMenu;
            // 操作权限
            $rootScope.permission = opt.permission;
            //关联文书id
            $rootScope.docTableId = opt.docTableId;
            $rootScope.currMenuId = opt.currMenuId;

            if (auth.loginUser().userType === 'NURSE') {
                for (let btn of $rootScope.btnsMenu) {
                    if (btn.name === '开始手术') {
                        // btn.url = 'nursRecordLog3';
                        btn.url = 'midCheckRecordLog_qnz';
                        break;
                    }
                }
            }

            // 排程卡片视图
            // if ($rootScope.crumbs[0].url == 'operRoomSchedule') {
            //     for (var i = $rootScope.tabsMenu.length - 1; i >= 0; i--) {
            //         if ($rootScope.crumbs[1].url == 'cardSchedule' && $rootScope.tabsMenu[i].url != 'cardSchedule')
            //             $rootScope.tabsMenu.splice(i, 1);
            //         else if ($rootScope.crumbs[1].url != 'cardSchedule' && $rootScope.tabsMenu[i].url == 'cardSchedule')
            //             $rootScope.tabsMenu.splice(i, 1);
            //     }
            // }
        }
    })
};