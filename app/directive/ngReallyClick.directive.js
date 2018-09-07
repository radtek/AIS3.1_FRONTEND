function ngReallyClick($uibModal,$timeout) { 
         function ModalInstanceCtrl($scope, $uibModalInstance) {
           $scope.ok = function() {
             $uibModalInstance.close();
           };

           $scope.cancel = function() {
             $uibModalInstance.dismiss('cancel');
           };
        };
        ModalInstanceCtrl.$inject = ['$scope','$uibModalInstance'];

        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
             element.bind('click', function() {
               var message = attrs.ngReallyMessage || "是否确定此操作？";

               /*
               //This works
               if (message && confirm(message)) {
                 scope.$apply(attrs.ngReallyClick);
               }
               //*/

               //*This doesn't works
                var modalHtml = '<div class="modal-header">警告</div><div class="modal-body">' + message + '</div>';
                modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">确定</button><button class="btn" ng-click="cancel()">取消</button></div>';

               var modalInstance = $uibModal.open({
                 template: modalHtml,
                 size: 'sm',
                 controller: ModalInstanceCtrl
               });

               modalInstance.result.then(function() {

               $timeout(function(){
                 scope.$apply(attrs.ngReallyClick);
                }); 
               }, function() {
                 //Modal dismissed
               });
               //*/
               
             });

           }
        }
}
ngReallyClick.$inject = ['$uibModal','$timeout'];

module.exports = ngReallyClick;



  