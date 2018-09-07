modelIntrMong.$inject = ['$scope', 'IHttp', '$uibModalInstance', 'items', 'toastr', '$timeout'];

module.exports = modelIntrMong;

function modelIntrMong($scope, IHttp, $uibModalInstance, items, toastr, $timeout) {
    var promise;
    $scope.saved = true;
    $scope.btnActive = false;
    $scope.regOptId = items.regOptId;
    IHttp.post("basedata/searchSysCodeByGroupId", { groupId: 'imgPath' }).then(function(result) {
        $scope.iConfig = result.data.resultList;
    });

    IHttp.post("basedata/getAnaesRecordShowListByRegOptId", { position: 0, regOptId: items.regOptId }).then(function(result) {
        if (result.data.resultCode !== '1') return;
        $scope.list = result.data.showList;
        $timeout(function() {
            for(var event of $scope.list) {
                event.color_ = event.color;
                if (event.color == '#000000')
                    $('#' + event.eventId).css('background-color', '#ffffff');
                else
                    $('#' + event.eventId).css('background-color', event.color);
                if (!event.checked || event.eventId == '31009')
                    $('#' + event.eventId).css('pointer-events', 'none');
            }
        }, 500);
    });

    $scope.change = function(li, devEventIdList) {
        devEventIdList.forEach(function(e) {
            if (e.eventId == li.eventId) {
                li.deviceId = e.deviceId;
            }
        });
    }

    $scope.check = function(li) {
        if (li.checked && !li.eventId && li.devEventIdList.length > 0) {
            li.eventId = li.devEventIdList[0].eventId;
        }
        if (li.checked) {
            $('#' + li.eventId).css('pointer-events', 'auto');
        }else {
            $('#' + li.eventId).css('pointer-events', 'none');
            $('#' + li.eventId).css('background-color', '#ffffff');
        }
    }

    $scope.save = function() {
        if (promise) {
            $timeout.cancel(promise);
        }
        $scope.saved = false;
        $scope.btnActive = true;
        promise = $timeout(function() {
            var param = $scope.list.filter(function(item) {
                return item.checked;
            });
            IHttp.post("basedata/saveAnaesMonitorConfig", param).then(function(result) {
                $scope.saved = true;
                $scope.btnActive = false;
                if (result.data.resultCode !== '1') return;
                IHttp.post("basedata/getAnaesRecordShowListByRegOptId", { position: 0, regOptId: items.regOptId, enable: '1' }).then(function(rs) {
                    if (rs.data.resultCode !== '1') return;
                    $uibModalInstance.close(rs.data.showList);
                });
            });
        }, 500);
    }

    $scope.checkWidth = function(li) {
        if ((li.widthAndHeight < 5 &&　li.widthAndHeight >18) || li.widthAndHeight == undefined) {
            toastr.warning('图片宽高请设置在5~18之间');
            li.widthAndHeight = 12;
        }
    }

    $scope.setBgColor = function(li) {
        $('#' + li.eventId).css('background-color', li.color_);
        li.color = li.color_;
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }

}
