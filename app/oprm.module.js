// const login = require('./page/login/oprm.route');
// const frame = require('./page/frame/frame.route');
// const oper = require('./page/oper/oper.route');
// 模板
// const tabs = require('./page/tpl/tabs/tabs.route');
// const view = require('./page/tpl/views/views.route');
// 文书
// const doc = require('./page/doc/doc.route');
//手术病人术前术后访问记录单
// const accessLog = require('./page/doc/accessLog/accessLog.route');
//手术患者接送交接单
// const shutTranLog = require('./page/doc/shutTranLog/shutTranLog.route');
//手术风险评估表
// const riskAsseLog = require('./page/doc/riskAsseLog/riskAsseLog.route');
//麻醉术前访视单
// const preVisitLog = require('./page/doc/preVisitLog/preVisitLog.route');
//麻醉计划
// const anesProgram = require('./page/doc/anesProgram/anesProgram.route');
//麻醉知情同意书
// const infoCons = require('./page/doc/infoCons/infoCons.route');
//医疗保险病人超范围用药（或材料、项目）同意书
// const overMediLog = require('./page/doc/overMediLog/overMediLog.route');
//手术护理记录
// const nursRecordLog = require('./page/doc/nursRecordLog/nursRecordLog.route');
//手术清点记录
// const checkRecordLog = require('./page/doc/checkRecordLog/checkRecordLog.route');
//手术安全核查单
// const safetyVerifLog = require('./page/doc/safetyVerifLog/safetyVerifLog.route');
//麻醉记录单
// const anesRecordLog = require('./page/doc/anesRecordLog/anesRecordLog.route');
//麻醉后访视记录单
// const postVisitLog = require('./page/doc/postVisitLog/postVisitLog.route');
//麻醉恢复室(PACU)观察记录单
// const pacu = require('./page/doc/pacu/pacu.route');
//麻醉总结
// const anesthesiaSummary = require('./page/doc/anesthesiaSummary/anesthesiaSummary.route');
//病理检验申请单
// const medicalRecord = require('./page/doc/medicalRecord/medicalRecord.route');
//临床输血申请单
// const clinicalTransfusion = require('./page/doc/clinicalTransfusion/clinicalTransfusion.route');
//临床输血核对、护理记录单
// const transfusionCheck = require('./page/doc/transfusionCheck/transfusionCheck.route');
//患者输血不良反应回报单
// const transfusionAdverse = require('./page/doc/transfusionAdverse/transfusionAdverse.route');
//手术室护理工作访视记录
// const operRoomNur = require('./page/doc/operRoomNur/operRoomNur.route');
//转科患者交接卡
// const tranCardLog = require('./page/doc/tranCardLog/tranCardLog.route');
//检验报告
// const inspReport = require('./page/doc/inspReport/inspReport.route');
//
// const veinAccede = require('./page/doc/veinAccede/veinAccede.route');
//B超
// const typeB = require('./page/doc/typeB/typeB.route');
//内窥镜
// const typeNkj = require('./page/doc/typeNkj/typeNkj.route');
//病理查询
const typePatly = require('./page/doc/typePatly/typePatly.route');
//临时医嘱
// const tempDocAdvice = require('./page/doc/tempDocAdvice/tempDocAdvice.route');
//输血申请
const midBloodApply = require('./page/doc/bloodApply/bloodApply.route');

const print = require('./page/print/print.route');

// 手术间 login, frame,oper,tabs, view,doc,
const operRoom = require('./page/operRoom/operRoom.route');

module.exports = angular.module('page', [
    
    
    
    
    
    accessLog, shutTranLog, riskAsseLog, preVisitLog, anesProgram, infoCons, overMediLog, nursRecordLog,
    checkRecordLog, safetyVerifLog, anesRecordLog, postVisitLog, pacu, anesthesiaSummary, medicalRecord,
    clinicalTransfusion, transfusionCheck, transfusionAdverse, operRoomNur, tranCardLog,
    inspReport,veinAccede,typeB,typeNkj,typePatly,
    midBloodApply,print,
    operRoom
]).name;
