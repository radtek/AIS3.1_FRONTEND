module.exports = confirmServe;

confirmServe.$inject = ['$uibModal'];

function confirmServe($uibModal) {
    var self = this;
    return {
        warn: function() {
            self.title = "警告";
            return this;
        },
        tips: function() {
            self.title = "提示";
            return this;
        },
        show: function(msg, title) {
            if(title)
                self.title = title;
            if(!self.title)
                self.title = '确认'
            self.message = msg || "是否确定此操作？";
            var modalHtml = '<h4 class="modal-header" style="color: #fff; margin-top: 0; margin-bottom: 0;">' + self.title + '</h4><div class="modal-body">' + self.message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">确定</button><button class="btn" ng-click="cancel()">取消</button></div>';
            return $uibModal.open({
                template: modalHtml,
                size: 'sm',
                controller: ['$scope', '$uibModalInstance', ModalInstanceCtrl]
            }).result;
        },
        showLoading: function() {
            $("#loadingModal").modal('show');
            $("#loadingModal").unbind();
        },
        hideLoading: function() {
            $("#loadingModal").modal('hide');
        }
    }

    function ModalInstanceCtrl($scope, $uibModalInstance) {
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    };
}
