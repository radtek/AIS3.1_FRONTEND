const zTree = require('./zTree/zTree.js');
const datetimePicker = require('./datetimePicker/datetimePicker.js');
const eChart = require('./eChart.js');
const eChartOld = require('./eChartOld.js');
const scrollUp = require('./scrollUp.js');
const whenScrolled = require('./whenScrolled.js');
const digiTabs = require('./tabs/tabs.directive.js');
const confirm = require('./confirm.js');
const iconSelect = require('./iconSelect/iconSelect.js');
const repeatFinish = require('./repeatFinish.js');
const checkbox = require('./checkbox/checkbox.directive.js');
const progressbar = require('./progressbar.js');
const coverup = require('./coverup.js');
const transform = require('./inputVerify.directive.js');
const imgUpload = require('./imgUpload.directive.js');
const focus = require('./setFocus.directive.js');
const digidragover = require('./digidragover.directive.js');
const digidragstart = require('./digidragstart.directive.js');
const digidrop = require('./digidrop.directive.js');
const ngReallyClick=require('./ngReallyClick.directive.js');
const ngClick=require('./ngClick.directive.js');

module.exports = angular.module('directive', [])
    .directive('ngReallyClick',ngReallyClick)
    .directive('zTree', zTree)
    .directive('datetimePicker', datetimePicker)
    .directive('eChart', eChart)
    .directive('eChartOld', eChartOld)
    .directive('scrollUp', scrollUp)
    .directive('whenScrolled', whenScrolled)
    .directive('digiTabs', digiTabs)
    .directive('confirm', confirm)
    .directive('checkbox', checkbox)
    .directive('iconSelect', iconSelect)
    .directive('repeatFinish', repeatFinish)
    .directive('progressbar', progressbar)
    .directive('coverup', coverup)
    .directive('transform', transform)
    .directive('imgUpload', imgUpload)
    .directive('focus', focus)
    .directive('digidragover', digidragover)
    .directive('digidragstart', digidragstart)
    .directive('digidrop', digidrop)
    .directive('ngClick', ngClick)
    .name;
