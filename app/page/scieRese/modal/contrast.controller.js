module.exports = ContrastCtrl;

ContrastCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'uiGridConstants', '$document', '$timeout', 'toastr'];

function ContrastCtrl($rootScope, $scope, IHttp, $uibModal, uiGridConstants, $document, $timeout, toastr) {
    var promise;
    $rootScope.siteTitle = '科研管理';

    $scope.eConfig = { 
        dataLoaded: false,
        resize: true
    };
    $scope.eOption = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
        xAxis : [],
        yAxis : [],
        series : []
    };

    var strId = $rootScope.$state.params.id;
    var arrId = strId.split(',');

    $scope.back = function() {
        $rootScope.$state.go('patientdatacompare');
    }

    // 对比接口
    IHttp.post('sci/compareAllRegOpt', arrId).then(function(rs) {
        if(rs.data.resultCode != '1') return;

        $scope.list = rs.data.resultList;
        var xLen = 0;
        var legend = { data: [] };
        var xAxis = {};
        var series = [];
        for(var a in $scope.list){
            var a_item = $scope.list[a];

            // 计算x的最大值
            if(a_item.series[0].data.length > xLen)
                xLen = a_item.series[0].data.length;

            // 合并 legend, series
            for(var b in a_item.series){
                var b_item = a_item.series[b];
                legend.data.push(a_item.name + '-' + b_item.name);
                b_item.name = a_item.name + '-' + b_item.name;
                b_item.smooth = true;
                series.push(b_item);
            }
        }

        $scope.eOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: legend,
            dataZoom: [{ show: true, start: 0, end: 100 }, { type: 'inside', start: 0, end: 100 }],
            series: series,
            xAxis: (function(){
                var a = 0;
                var res = {
                    data: []
                };
                while(a < xLen){
                    res.data.push('');
                    a++;
                }
                return res;
            })(),
            yAxis: {
                type: 'value'
            },
            grid: { right: '40px', bottom: '70px', left: '40px' },
        };
    });
}
