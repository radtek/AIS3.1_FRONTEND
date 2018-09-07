DocPrintCtrl.$inject = ['$rootScope', '$scope', '$window', '$timeout', 'IHttp'];

module.exports = DocPrintCtrl;

function DocPrintCtrl($rootScope, $scope, $window, $timeout, IHttp) {
    var doc = $rootScope.$stateParams.docStr;
    //麻醉手术室术前宣教
    if (doc.indexOf('doc_pre_publicity') >= 0)
        $scope.doc_pre_publicity = true;
   // 麻醉科自费耗材知情同意书 临澧
    if (doc.indexOf('doc_self_pay_accede_llzyy') >= 0)
        $scope.doc_self_pay_accede_llzyy = true;
   // 手术病人术前术后访问记录单
    if (doc.indexOf('doc_pre_post_visit') >= 0)
        $scope.doc_pre_post_visit = true;

    // 手术患者接送交接单
    if (doc.indexOf('doc_pat_shuttle_transfer') >= 0)
        $scope.doc_pat_shuttle_transfer = true;

    // 手术风险评估表
    if (doc.indexOf('doc_opt_risk_evaluation') >= 0)
        $scope.doc_opt_risk_evaluation = true;

    // 麻醉计划
    if (doc.indexOf('doc_anaes_plan') >= 0)
        $scope.doc_anaes_plan = true;

    // 麻醉术前访视单
    if (doc.indexOf('doc_pre_oper_visit') >= 0)
        $scope.doc_pre_oper_visit = true;

    // 麻醉知情同意书
    if (doc.indexOf('doc_accede') >= 0)
        $scope.doc_accede = true;

    // 医疗保险病人超范围用药
    if (doc.indexOf('doc_pat_out_range_agree') >= 0)
        $scope.doc_pat_out_range_agree = true;

    // 麻醉总结
    if (doc.indexOf('doc_anaes_summary') >= 0)
        $scope.doc_anaes_summary = true;

    // 手术护理记录单
    if (doc.indexOf('doc_opt_care_record') >= 0)
        $scope.doc_opt_care_record = true;

    // 手术清点记录
    if (doc.indexOf('doc_opt_nurse') >= 0)
        $scope.doc_opt_nurse = true;

    // 手术安全核查
    if (doc.indexOf('doc_safe_check') >= 0)
        $scope.doc_safe_check = true;

    // 麻醉后访视记录单
    if (doc.indexOf('doc_post_follow_record') >= 0)
        $scope.doc_post_follow_record = true;

    if (doc.indexOf('doc_analgesic_informed_consent') >= 0)
        $scope.doc_analgesic_informed_consent = true;   

    // 胎盘处置知情同意书 | 沈阳本溪
    if (doc.indexOf('doc_placenta_handle_agree') >= 0)
        $scope.doc_placenta_handle_agree = true;

    // 参保患者特殊用药、卫材知情单 | 沈阳本溪
    if (doc.indexOf('doc_insured_pat_agree') >= 0)
        $scope.doc_insured_pat_agree = true;
    
    // 术后回视 | 南华附二
    if (doc.indexOf('doc_post_oper_regard') >= 0)
        $scope.doc_post_oper_regard = true;

    // 手术室护理工作访视记录 | 南华附二
    if (doc.indexOf('doc_nurse_interview_record') >= 0)
        $scope.doc_nurse_interview_record = true;

    // 麻醉术前访视与评估记录单 | 南华附二
    if (doc.indexOf('doc_pre_visit') >= 0)
        $scope.doc_pre_visit = true;

    // 麻醉后访视记录单 | 南华附二  邵阳中心东院 麻醉后访视记录单
    if (doc.indexOf('doc_anaes_postop') >= 0)
        $scope.doc_anaes_postop = true;

    // 分娩镇痛同意书  邵阳东院
    if (doc.indexOf('doc_labor_analgesia_accede') >= 0)
        $scope.doc_labor_analgesia_accede = true;
    
    // 术后镇痛 | 南华附二
    if (doc.indexOf('doc_analgesic_record') >= 0)
        $scope.doc_analgesic_record = true;

    // 手术麻醉使用药品知情同意书 | 黔南州
    if (doc.indexOf('doc_anaes_medicine_accede') >= 0)
        $scope.doc_anaes_medicine_accede = true;

    // 手术麻醉使用自费及高价耗材知情同意书 | 黔南州
    if (doc.indexOf('doc_self_pay_instrument_accede') >= 0)
        $scope.doc_self_pay_instrument_accede = true;

    // 静脉麻醉知情同意书 | 葛洲坝
    if (doc.indexOf('doc_vein_accede') >= 0)
        $scope.doc_vein_accede = true;

    // 手术病人术前风险评估及预防护理记录单 | 葛洲坝
    if (doc.indexOf('doc_risk_evaluat_prevent_care') >= 0)
        $scope.doc_risk_evaluat_prevent_care = true;
    
    // 手术患者接送交接单 | 本溪
    if (doc.indexOf('doc_transfer_connect_record') >= 0)
        $scope.doc_transfer_connect_record = true;

    // 麻醉方法变更记录 | 邵阳中心医院
    if (doc.indexOf('doc_anaes_method_change_record') >= 0)
        $scope.doc_anaes_method_change_record = true;

    // 麻醉记录单
    if (doc.indexOf('doc_anaes_record') >= 0) {
        $scope.doc_anaes_record = true;
        $scope.$on('printDone', function(ev, param) {
            ev.stopPropagation();
            $timeout(function() {
                $scope.done = true;
                $window.print();
                $window.close();
            }, 3000);
        });
    } else {
        $timeout(function() {
            $scope.done = true;
            $window.print();
            $window.close();
        }, 6000);
    }
}
