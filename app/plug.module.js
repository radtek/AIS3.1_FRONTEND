require('babel-polyfill');

require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../node_modules/bootstrap/dist/js/bootstrap.min.js');

require('../node_modules/angular-ui-grid/ui-grid.min.css');
require('angular-ui-grid/ui-grid');

require('../node_modules/oi.select/dist/select.min.css');
require('oi.select');

require('../node_modules/angular-toastr/dist/angular-toastr.min.css');
require('../node_modules/angular-toastr/dist/angular-toastr.tpls.min.js');

require('../node_modules/angular-bootstrap-colorpicker/css/colorpicker.css');
require('../node_modules/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js');

require('./style/layout.attr.css');
require('./style/base-print.less');
require('./style/uibModal.less');
require('./directive/checkbox/checkbox.less');
require('./style/base.less');

require('./serve/moveableModal.provide.js');

const uiBootstrap = require('angular-ui-bootstrap');
const router = require('angular-ui-router');
const animate = require('angular-animate');

module.exports = angular.module('plug', [
    router,
    animate,
    uiBootstrap,
    'ui.grid',
    'ui.grid.autoResize',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.pagination',
    'ui.grid.edit',
    'ui.grid.treeView',
    'ui.grid.expandable',
    'ui.grid.grouping',
    'ui.grid.exporter',
    'ui.grid.pinning',
    'moveable-modal',
    'oi.select',
    'toastr',
    'colorpicker.module'
]).name;
