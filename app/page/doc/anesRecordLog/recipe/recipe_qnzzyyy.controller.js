module.exports = recipeCtrl;

recipeCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$timeout', '$window'];

function recipeCtrl($rootScope, $scope, IHttp, toastr, $timeout, $window) {
    var regOptId = sessionStorage.getItem('regOptId');
    var recipe = JSON.parse(localStorage.getItem('recipe-' + regOptId));
    $scope.rType = $rootScope.$state.current.data.recipeType;
    $scope.currDay = new Date().getTime();
    $scope.user = recipe.user;
    $scope.regOpt = recipe.regOpt;
    var rList = recipe.list,
        pageS = [];
        
    for (var a = 0; a < rList.length; a++) {
        var detailList = [];
        if (a % 2 == 0) {
            detailList.push({
                isAddTo: false,
                name: rList[a].name,
                spec: rList[a].spec,
                quantity: rList[a].quantity,
                unit: rList[a].unit
            });
            detailList.push({
                isAddTo: true,
                name: 'Sig:',
                dosage: rList[a + 1].dosage,
                dosageUnit: rList[a].dosageUnit,
                medWay: rList[a].medWay,
                medWayExp: rList[a + 1].medWayExp
            });
            pageS.push({detailList: detailList});
        }
    }
    $scope.pageS = pageS;

    $timeout(function() {
        $window.print();
        $window.close();
    }, 3000)
}