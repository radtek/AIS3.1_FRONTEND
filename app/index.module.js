const login = require('./page/login/index.route');
const frame = require('./page/frame/frame.route');
const home = require('./page/home/home.route');
const oper = require('./page/oper/oper.route');
const schedule = require('./page/schedule/schedule.route');
const inOper = require('./page/inOper/inOper.route');
// 用户设置
const modifyPwd = require('./page/userSettings/modifyPwd/modifyPwd.route');
const template = require('./page/userSettings/template/template.route');
const scieRese = require('./page/scieRese/scieRese.route');
// const diysearch=require('./page/scieRese/diysearch/diysearch.route');
// 科室管理
const consumptive = require('./page/depManage/consumptive/consumptive.route');
const statQuery = require('./page/depManage/statQuery/statQuery.route');
const consultation = require('./page/depManage/consultation/consultation.route');
const paperwork = require('./page/depManage/paperwork/paperwork.route');
const qualControl = require('./page/depManage/qualControl/qualControl.route');
const operStat = require('./page/depManage/operStat/operStat.route');
const toxicAnes = require('./page/depManage/toxicAnes/toxicAnes.route');
const consumable = require('./page/depManage/consumable/consumable.route');
// 系统管理
const personnel = require('./page/sysManage/personnel/personnel.route');
const operRoomConfig = require('./page/sysManage/operRoomConfig/operRoomConfig.route');
const dictionary = require('./page/sysManage/dictionary/dictionary.route');
const enumeratemanage= require('./page/sysManage/configmanage/enumeratemanage/enumeratemanage.route');
const dataBackup = require('./page/sysManage/dataBackup/dataBackup.route');
const oprmconfig = require('./page/sysManage/configmanage/oprmconfig/oprmconfig.route');
// 信息查询
const infoSearch = require('./page/infoSearch/infoSearch/infoSearch.route');
const anesRegist = require('./page/infoSearch/anesRegist/anesRegist.route');
const analRegist = require('./page/infoSearch/analRegist/analRegist.route');
// 知识库
const kb = require('./page/kb/kb.route');
// 模板
const tabs = require('./page/tpl/tabs/tabs.route');
const view = require('./page/tpl/views/views.route');
// 文书
const doc = require('./page/doc/doc.route');
//手术病人术前术后访问记录单
const accessLog = require('./page/doc/accessLog/accessLog.route');
//分娩镇痛同意书
const laborAnalgesia = require('./page/doc/laborAnalgesia/laborAnalgesia.route');
//手术核算单
const checkout = require('./page/doc/anaesCheckOut/anaesCheckOut.route');
//麻醉费用结账单
const anaesBillLog = require('./page/doc/anaesBillLog/anaesBillLog.route');
//手术患者接送交接单
const shutTranLog = require('./page/doc/shutTranLog/shutTranLog.route');
//回收自体输血治疗知情同意书
const recycleAutoBlood = require('./page/doc/recycleAutoBlood/recycleAutoBlood.route');
//麻醉术前访视单
const preVisitLog = require('./page/doc/preVisitLog/preVisitLog.route');
//麻醉方法变更记录
const anaesMethodChange = require('./page/doc/anaesMethodChange/anaesMethodChange.route');
//麻醉计划operoperOP
// const anesProgram = require('./page/doc/anesProgram/anesProgram.route');
//麻醉知情同意书
const infoCons = require('./page/doc/infoCons/infoCons.route');
//医疗保险病人超范围用药（或材料、项目）同意书
const overMediLog = require('./page/doc/overMediLog/overMediLog.route');
//手术护理记录
const nursRecordLog = require('./page/doc/nursRecordLog/nursRecordLog.route');
//手术清点记录
const checkRecordLog = require('./page/doc/checkRecordLog/checkRecordLog.route');
//手术安全核查单
const safetyVerifLog = require('./page/doc/safetyVerifLog/safetyVerifLog.route');
//麻醉记录单
const anesRecordLog = require('./page/doc/anesRecordLog/anesRecordLog.route');
//手术麻醉使用药品知情同意书
const anaesMedicine = require('./page/doc/anaesMedicine/anaesMedicine.route');
//麻醉后访视记录单
const postVisitLog = require('./page/doc/postVisitLog/postVisitLog.route');
//术后回视
const postLookBack = require('./page/doc/postLookBack/postLookBack.route');
//麻醉术前宣教
const preOperEducation = require('./page/doc/preOperEducation/preOperEducation.route');
//麻醉恢复室(PACU)观察记录单
const pacu = require('./page/doc/pacu/pacu.route');
//麻醉总结
const anesthesiaSummary = require('./page/doc/anesthesiaSummary/anesthesiaSummary.route');
//病理检验申请单
// const medicalRecord = require('./page/doc/medicalRecord/medicalRecord.route');
//临床输血申请单
// const clinicalTransfusion = require('./page/doc/clinicalTransfusion/clinicalTransfusion.route');
//临床输血核对、护理记录单
// const transfusionCheck = require('./page/doc/transfusionCheck/transfusionCheck.route');
//患者输血不良反应回报单
// const transfusionAdverse = require('./page/doc/transfusionAdverse/transfusionAdverse.route');
//手术室护理工作访视记录
const operRoomNur = require('./page/doc/operRoomNur/operRoomNur.route');
//转科患者交接卡
// const tranCardLog = require('./page/doc/tranCardLog/tranCardLog.route');
//检验报告
const inspReport = require('./page/doc/inspReport/inspReport.route');
// 电子病历
const EMRecord = require('./page/doc/EMRecord/EMRecord.controller');
//B超
const typeB = require('./page/doc/typeB/typeB.route');
//手术麻醉使用自费及高价耗材知情同意书
const selfPayInstrument = require('./page/doc/selfPayInstrument/selfPayInstrument.route');
//内窥镜
const typeNkj = require('./page/doc/typeNkj/typeNkj.route');
//麻醉术前访视与评估记录单
const visitEstLog = require('./page/doc/visitEstLog/visitEstLog.route');
//镇痛知情同意书
const easePainAgree = require('./page/doc/easePainAgree/easePainAgree.route');
//静脉麻醉知情同意书
// const veinAccede = require('./page/doc/veinAccede/veinAccede.route');
//胎盘处置知情同意书
const placentaAgreeLog = require('./page/doc/placentaAgreeLog/placentaAgreeLog.route');
// 手术风险评估表
const riskAsseLog = require('./page/doc/riskAsseLog/riskAsseLog.route');
//麻醉质控文书
const anaesQualityControl = require('./page/doc/anaesQualityControl/anaesQualityControl.route');
//自定义文书
const customize = require('./page/doc/customize/customize.route');
// 手术患者访视单、术前评估、术后访视单
const asseVisitForm = require('./page/doc/asseVisitForm/asseVisitForm.route');
//数据管理
const menu = require('./page/admin/datamanage/menu/menu.route');
const dictionary1 = require('./page/admin/datamanage/dictionary1/dictionary1.route');
const doctorType = require('./page/admin/datamanage/doctorType/doctorType.route');
const operName = require('./page/admin/datamanage/operName/operName.route');
const shiftInfo = require('./page/admin/datamanage/shiftInfo/shiftInfo.route');
const unitConv = require('./page/admin/datamanage/unitConv/unitConv.route');
const collectionConfig = require('./page/admin/datamanage/collectionConfig/collectionConfig.route');
const scoreComp = require('./page/admin/datamanage/scoreComp/scoreComp.route');
//局点管理
const hospital = require('./page/admin/operate/hospital/hospital.route');
const rolemanage = require('./page/admin/operate/rolemanage/rolemanage.route');
const usermanage = require('./page/admin/operate/usermanage/usermanage.route');
const oprmdevicesconfig = require('./page/admin/operate/oprmdevicesconfig/oprmdevicesconfig.route');
const devicesspecification = require('./page/admin/operate/devicesspecification/devicesspecification.route');
const monitorconfig = require('./page/admin/operate/monitorconfig/monitorconfig.route');

const print = require('./page/print/print.route');
// 复苏室
const pacuRoom = require('./page/pacuRoom/pacuRoom.route');
///+++++oprm
// const typePatly = require('./page/doc/typePatly/typePatly.route');
//临时医嘱
// const tempDocAdvice = require('./page/doc/tempDocAdvice/tempDocAdvice.route');
//输血申请
// const midBloodApply = require('./page/doc/bloodApply/bloodApply.route');
const operRoom = require('./page/operRoom/operRoom.route');

module.exports = angular.module('page', [
    laborAnalgesia,
    oprmconfig,
    login,
    frame,
    home,
    oper,
    schedule,
    overMediLog,
    inOper,
    modifyPwd, template, scieRese,
    consumptive, statQuery, consultation, paperwork, qualControl, operStat, toxicAnes,consumable,
    personnel,operRoomConfig, dictionary, dataBackup,
    infoSearch, anesRegist, analRegist,
    kb,
    tabs, view,
    doc,accessLog,preOperEducation,
    checkout, preVisitLog, infoCons, nursRecordLog,recycleAutoBlood,shutTranLog,anaesMethodChange,
    anaesBillLog,visitEstLog,operRoomNur,easePainAgree,placentaAgreeLog,
    checkRecordLog, safetyVerifLog, anesRecordLog,anaesMedicine, postVisitLog,postLookBack, pacu, anesthesiaSummary, 
    inspReport,EMRecord,typeB,selfPayInstrument,typeNkj,customize,riskAsseLog,anaesQualityControl, asseVisitForm,
    menu,
    dictionary1,
    doctorType,
    operName,
    shiftInfo,
    unitConv,
    collectionConfig,
    scoreComp,
    hospital,
    monitorconfig,
    rolemanage,
    usermanage,
    oprmdevicesconfig,
    devicesspecification,
    print,
    pacuRoom,
    operRoom
]).name;
