anesEvent.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModalInstance', '$timeout', 'items', '$filter', 'toastr'];

module.exports = anesEvent;

function anesEvent($rootScope, $scope, IHttp, $uibModalInstance, $timeout, items, $filter, toastr) {
    $scope.param = {
        anaEventId: '',
        docId: items.docId
    }

    IHttp.post('operation/searchAnaesEventType', { enable: '1' }).then(function(rs) {
        if (rs.data.resultCode != '1')
            return;
        $scope.evList = rs.data.resultList;
    });

    $scope.save = function() {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        if (new Date($scope.param.occurTime).getTime() > new Date().getTime()) {
            toastr.warning('选择的时间不能大于当前时间');
            $scope.param.occurTime = '';
            $rootScope.btnActive = true;
            return;
        }

        let postData = angular.copy($scope.param);
        postData.occurTime = new Date($scope.param.occurTime).getTime();
        IHttp.post('operation/saveAnaeseventPacu', postData).then(function(rs) {
            $rootScope.btnActive = true;
            if (rs.data.resultCode != 1)
                return;
            if (postData.code == '1') {
                updateEnterTime(postData.docId, postData.occurTime);
            }
            init();
            $scope.replay();
            toastr.success(rs.data.resultMessage);
        });
    }

    function updateEnterTime(docId, enterTime) {
        IHttp.post('document/updatePacuRecEnterRoomTime', { id: docId, enterTime: enterTime }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
        });
    }
    $scope.edit = function(obj) {
        obj.code = obj.code + '';
        $scope.param = angular.copy(obj);
        $scope.param.occurTime = $filter('date')(obj.occurTime, 'yyyy-MM-dd HH:mm');
    }

    $scope.replay = function() {
        $scope.param.anaEventId = '';
        $scope.param.code = '';
        $scope.param.occurTime = '';
    }

    $scope.delete = function(obj) {
        if (obj.code == 1 || obj.code == 9) {
            toastr.error((obj.code == 1 ? '入室' : '出室') + '事件不能删除');
        }else {
            IHttp.post('operation/deleteAnaeseventPacu', { anaEventId: obj.anaEventId }).then(function(rs) {
                if (rs.data.resultCode != '1')
                    return;
                init();
                $scope.replay();
                toastr.success(rs.data.resultMessage);
            });
        }
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

    function init() {
        IHttp.post('operation/searchAnaesEventPacuList', { docId: items.docId, docType: 2 }).then(function(rs) {
            if (rs.data.resultCode != '1') return;
            $scope.list = rs.data.resultList;
        });
    }
    init();

    // 验证
    function verify() {
        return $scope.anaesEventForm.$valid && !!($scope.param.code || $scope.param.occurTime)
    }
}
