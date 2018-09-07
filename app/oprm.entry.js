const angular = require('angular');
const config = require('./app.config');
const run = require('./app.run');

const plug = require('./plug.module');
const serve = require('./serve/serve.module');
const directive = require('./directive/directive.module');
const oprm = require('./oprm.module');

angular.module('app', [
    plug,
    serve,
    directive,
    oprm
]).config(config).run(run);
