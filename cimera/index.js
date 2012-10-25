var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  PLUGIN_DIR = "./plugins/",

  EventEmitter = require('events').EventEmitter,
  _ = require('underscore'),
  util = require('util');

global.EVENTS = require('./lib/events.js');

var pipe = (function (base) {
  return base;
}(new EventEmitter()));
module.exports = pipe;

var loadPlugin = module.exports.loadPlugin = function (properties, name) {
  var plugin, temp;

  if (!name) {
    _.each(properties, loadPlugin);
    return;
  }

  if (typeof properties === 'string') {
    temp = properties;
    properties = name;
    name = temp;
  }

  plugin = require(PLUGIN_DIR + name);
  plugin(pipe, properties);
};
