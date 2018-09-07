DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'IHttp', 'toastr', 'auth'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, IHttp, toastr, auth) {
    var row = $scope.row,
        user = $scope.user;
    var url = "docPrint";
    $scope.docInfo = auth.loginUser();
    if ($scope.docInfo.beCode == 'sybx') {
        url = "docPrintSybx";
    }else if ($scope.docInfo.beCode == 'nhfe') {
        url = "docPrintNhfe";
    }else if ($scope.docInfo.beCode == 'qnzrmyy') {
        url = "docPrintQnz";
    }else if ($scope.docInfo.beCode == 'syzxyy' || $scope.docInfo.beCode == 'cshtyy') {
        url = "docPrintSyzxyy";
    }else if ($scope.docInfo.beCode == 'yxyy') {
        url = "docPrintYxrm";
    }else if ($scope.docInfo.beCode == 'llzyyy') {
        url = "docPrintLlzyyy";
    }
    IHttp.post('operation/getAnesDucumentStateByRegOptId', { loginName: user.userName, regOptId: row.regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        let printDoc = [];
        $scope.list = rs.data.resultList;
        if ($scope.docInfo.beCode == 'qnzzyyy') {
            for (var a = 0; a < $scope.list.length; a++) {
                if ($scope.list[a].tabName == 'doc_anaes_pacu_rec') {
                    $scope.list.splice(a, 1);
                }
            }
        } else if ($scope.docInfo.beCode == 'syzxyy' || $scope.docInfo.beCode == 'cshtyy'|| $scope.docInfo.beCode == 'llzyyy') {
            for (var a = 0; a < $scope.list.length; a++) {
                var doc_anaes_record = true;
                if ((user.roleType === 'HEAD_NURSE' || user.roleType === 'NURSE') && $scope.list[a].tabName === 'doc_anaes_record') {
                    doc_anaes_record = false;
                }
                if (doc_anaes_record && $scope.list[a].tabName !== 'doc_anaes_pre_discuss_record' && $scope.list[a].tabName !== 'doc_anaes_pacu_rec' && $scope.list[a].tabName !== 'doc_labor_analgesia_accede' && $scope.list[a].name !== '手术核算单' && $scope.list[a].name !== '麻醉费用结账单') {
                    printDoc.push($scope.list[a]);
                }
                if ($scope.list[a].tabName === 'doc_labor_analgesia_accede' && row.sex === '女')
                    printDoc.push($scope.list[a]);
            }
            $scope.list = [];
            $scope.list = printDoc;
        }
    });

    $scope.ok = function(list) {
        var temp = [];
        for (var a = 0; a < list.length; a++) {
            if (list[a].checked)
                temp.push(list[a].tabName);
        }
        if (temp.length <= 0) {
            toastr.info('请选择一项文书打印');
            return;
        }
        window.open($rootScope.$state.href(url, { regOptId: row.regOptId, docStr: temp }));
        $uibModalInstance.close(temp);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
