const encrypt = require('./encrypt.factory');
const IHttp = require('./IHttp.factory');
const auth = require('./auth.factory');
const menu = require('./menu.factory');
const confirm = require('./confirm.factory');
const select = require('./select.factory');
const uiGridServe = require('./uiGridServe.factory');
const anesRecordServe_yxrm = require('../page/doc/anesRecordLog/anesRecordLog_yxrm.serve');
const anesRecordServe_sybx = require('./anesRecordLogOld_sybx.serve');
const anaesCheckOutServe = require('../page/doc/anaesCheckOut/anaesCheckOut_nhfe.serve');
const baseConfig = require('./baseConfig.factory')
const anesRecordInter = require('./anesRecordLog.factory');
const anesRecordServe = require('./anesRecordLog.service');
const anesRecordServeOld = require('./anesRecordLogOld.service');
const eCharts = require('./eCharts.service');
const eChartsOld = require('./eChartsOld.service');

const dropdownAddRow = require('./dropdownAddRow.filter');
const dropdownMedRow = require('./dropdownMedRow.filter');
const nameString = require('./nameString.filter');

module.exports = angular.module('serve', [])
    .factory('encrypt', encrypt)
    .factory('IHttp', IHttp)
    .factory('auth', auth)
    .factory('menu', menu)
    .factory('confirm', confirm)
    .factory('select', select)
    .factory('uiGridServe', uiGridServe)
    .factory('anaesCheckOutServe', anaesCheckOutServe)
    .factory('baseConfig', baseConfig)
    .factory('anesRecordInter', anesRecordInter)
    .factory('anesRecordServe_yxrm', anesRecordServe_yxrm)
    .factory('anesRecordServe_sybx', anesRecordServe_sybx)
    .service('anesRecordServe', anesRecordServe)
    .service('anesRecordServeOld', anesRecordServeOld)
    .service('eCharts', eCharts)
    .service('eChartsOld', eChartsOld)

    .filter('dropdownAddRow', dropdownAddRow)
    .filter('dropdownMedRow', dropdownMedRow)
    .filter('nameString', nameString)
    .name;