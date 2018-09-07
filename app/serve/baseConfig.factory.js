module.exports = baseConfig;

baseConfig.$inject = ['IHttp', '$timeout', 'toastr'];

function baseConfig(IHttp, $timeout, toastr) {
    var promise,
        self = this;
    return {
        // 初始化
        init: function() {
            return IHttp.post('basedata/searchBasCustomConfigureList', {}).then(function(rs) {
                if (rs.data.resultCode == 1) {
                    var rsList = rs.data.resultList;
                    for (var a = 0; a < rsList.length; a++) {
                        // 手术流程
                        if (rsList[a].modularType == 1)
                            sessionStorage.setItem('basSurgProc', rsList[a].configureValue);
                        // 手术排程
                        else if (rsList[a].modularType == 2)
                            sessionStorage.setItem('basSurgSchedule', rsList[a].configureValue);
                        // 数据同步
                        else if (rsList[a].modularType == 3)
                            sessionStorage.setItem('basDS', rsList[a].configureValue);
                        // 用药配置
                        else if (rsList[a].modularType == 4)
                            sessionStorage.setItem('basMed', rsList[a].configureValue);
                        // 入量配置
                        else if (rsList[a].modularType == 5)
                            sessionStorage.setItem('basI', rsList[a].configureValue);
                        // 其它配置
                        else if (rsList[a].modularType == 6) {
                            sessionStorage.setItem('basOther', rsList[a].configureValue);
                        }
                    }
                }
                return rs;
            });
        },
        // 保存
        save: function(para) {
            if (angular.equals({}, para.configureValue))
                para.configureValue = '';
            else
                para.configureValue = JSON.stringify(para.configureValue);
            if (promise)
                $timeout.cancel(promise);
            promise = $timeout(function() {
                IHttp.post('basedata/saveBasCustomConfigure', para).then(function(rs) {
                    if (rs.data.resultCode != 1)
                        return;
                    toastr.success(rs.data.resultMessage);
                });
            });
        },
        // 显示位置
        position: ['显示在名称前面', '显示在名称后面', '显示在描点区域'],
        // 手术流程
        getSurgProc: function() {
            return stringify('basSurgProc');
        },
        // 手术排程
        getSurgSchedule: function() {
            return stringify('basSurgSchedule');
        },
        // 数据同步
        getDS: function() {
            return stringify('basDS');
        },
        // 用药配置
        getMed: function() {
            return stringify('basMed');
        },
        // 入量配置
        getI: function() {
            return stringify('basI');
        },
        // 其它配置
        getOther: function() {
            return stringify('basOther');
        }
    };

    function stringify(item) {
        var str = sessionStorage.getItem(item);
        if (str)
            return JSON.parse(str);
        else
            return {};
    }
}