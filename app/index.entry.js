require('../node_modules/jquery/dist/jquery.min.js');
const angular = require('angular');
const config = require('./app.config');
const run = require('./app.run');

const plug = require('./plug.module');
const serve = require('./serve/serve.module');
const directive = require('./directive/directive.module');
const index = require('./index.module');

angular.module('app', [
    plug,
    serve,
    directive,
    index
]).config(config).run(run);
