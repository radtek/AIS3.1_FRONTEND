TabsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$timeout', '$state', 'auth', 'resultRegOpt', 'select', 'anesRecordServe'];

module.exports = TabsCtrl;

function TabsCtrl($rootScope, $scope, IHttp, $timeout, $state, auth, resultRegOpt, select, anesRecordServe) {
    $rootScope.timer_point = null;
    let regOptId = $rootScope.$stateParams.regOptId;
    let user = auth.loginUser();
    let regOpt = resultRegOpt.data.resultRegOpt;
    let operSource = regOpt.operSource == 1 ? true : false; // 1/true手术来源是门诊
    let hasAnaesPacuRec = regOpt.pacuId == '' || !regOpt.pacuId ? false : true;
    let showPlacentaAgree = regOpt.sex == '男' ? false : true;
    let showRiskAsseLog = regOpt.isLocalAnaes == '1' ? false : true;
    $scope.$watch('$state.current.name', function(n, o) {
        if ($rootScope.tabsMenu.length > 0 && $rootScope.tabsMenu[0].name !== '基本信息' && $rootScope.tabsMenu[0].name !== '麻醉记录单'&& $rootScope.tabsMenu[0].name !== '麻醉记录单一'&& $rootScope.tabsMenu[0].name !== '麻醉记录单（一）') { //列表切换更新 ，文书不更新
            $scope.tabsMenu = $rootScope.tabsMenu;
        }
        let tabsMenu = angular.copy($scope.tabsMenu);
        $scope.tabsMenu = [];
        angular.forEach(tabsMenu, function(tab) {
            if(user.beCode == 'qnzzyyy') {
                if(operSource && (tab.name == '检验报告' || tab.name == 'B超' || tab.name == '内窥镜' || tab.name == '麻醉前访视记录单' || tab.name == '麻醉知情同意书' || tab.name == '手术麻醉使用药品知情同意书' || tab.name == '手术麻醉使用自费及高价耗材知情同意书'  || tab.name == '麻醉总结' ||  tab.name == '麻醉后访视记录单' || tab.name == 'PACU观察记录单' || tab.name == '手术核算单'))
                    return;
                else if(!operSource && tab.name == '麻醉前访视和谈话记录')
                    return;
            } else if (user.beCode == 'cshtyy') {
                if(regOpt.emergency == 1 && tab.name == '手术患者访视单' && tab.url == 'surgicalVisitList')
                    return;
                else if(regOpt.emergency == 0 && tab.name == '术前评估、术后访视单' && tab.url == 'asseVisitForm')
                    return;
            }

            // if (tab.url.indexOf('preVisitLog_qnzzyyy') >= 0 && (tab.name == '手术风险评估表' || tab.name == 'PACU观察记录单' || tab.name == '胎盘处置知情同意书' || tab.name == '分娩镇痛同意书'))
            //     return;

            if (!hasAnaesPacuRec && tab.name == 'PACU观察记录单')
                return;
            else if (!showPlacentaAgree && (tab.name == '胎盘处置知情同意书' || tab.name == '分娩镇痛同意书'))
                return;
            else if (!showRiskAsseLog && tab.name == '手术风险评估表')
                return;

            $scope.tabsMenu.push(tab);

            // 给 url 添加 参数
            if (tab.url.indexOf(n) >= 0)
                tab.activeTab = true;
            else
                tab.activeTab = false;
            if (tab.url.indexOf('(') !== -1) {
                tab.url = tab.url.substr(0, tab.url.indexOf('('));
            }
            if (tab.url == $state.current.name && !!tab.required) {
                $rootScope.currentRequired = tab.required;
                setDomRequired(tab.required);
            }
            if (Object.keys($rootScope.$stateParams).length > 0) {
                tab.url += '(' + JSON.stringify($rootScope.$stateParams) + ')';
            }
        });
        if (regOptId) {
            select.getDocState(regOptId).then(function(rs) {
                if (rs.data.resultCode != 1)
                    return;
                var list = rs.data.resultList,
                    tabs = $scope.tabsMenu;
                for (var a = 0; a < tabs.length; a++) {
                    for (var b = 0; b < list.length; b++) {
                        if (tabs[a].name == list[b].name) {
                            tabs[a].state = list[b].state;
                            tabs[a].required = list[b].required;
                            break;
                        }
                    }
                }
            })
        }
    })

    // 文书完成状态
    $scope.$on('processState1', function(data, state) {
        $scope.processState = state;
        let currentName = $scope.$state.current.name;
        for(var a = 0; a < $scope.tabsMenu.length; a++) {
            let tab = $scope.tabsMenu[a];
            if (tab.url.substr(0, tab.url.indexOf('(')) === currentName) {
                if (tab.name != '基本信息' && state == 'END') {
                    tab.state = true;
                    break;
                }
            }
        }
    });

    $scope.checkTab = function(item) {
        var hid = '';
        if (user.beCode !== 'syzxyy' && user.beCode != 'cshtyy' && user.beCode != 'llzyyy') return;
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            hid = rs.data.resultRegOpt.hid;
        });
        $timeout(function() {
            if (item.name === '检验报告') {
                window.open('http://172.20.13.41/ZhiFang.ReportFormQueryPrint/ui/ReportPrint/?patno=' + hid);
            } else if (item.name === '影像报告') {
                window.open('http://172.20.13.50/techreportweb/frame/patreportlist.aspx?blh=' + hid);
            }
        }, 300);
    }

    //必填项前面标红*
    function setDomRequired(requireds) {
        var requiredArray = requireds.split(',');
        for (var i = 0; i < requiredArray.length; i++) {
            var requiredDoc = jQuery("[ng-model='" + requiredArray[i] + "']:first");
            requiredDoc.parent().addClass("requiredParentDom");
            requiredDoc.parent().prepend("<em>*</em>")
        }
    }
}