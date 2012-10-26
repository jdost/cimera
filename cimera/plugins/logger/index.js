var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  defaults = require('./_settings.json');

var _ = require('underscore'),
  util = require('util');

var EVENTS = global.EVENTS,
  LEVELS = {
    "CRITICAL": 5,
    "ERROR": 4,
    "WARN": 3
    "INFO": 2,
    "DEBUG": 1
  },
  pipe,
  log_threshold;

global.LEVELS = LEVELS;

var output = console.log,
  print = function () {
    var str = util.format.apply(this, arguments);
    if (output) { output(str); }
  };

function attach_events(settings) {
  pipe.on(EVENTS.PLUGIN.LOADED, function (plugin) {
    print("Plugin loaded: %s v%s", plugin.name, plugin.version);
  });
  pipe.on(EVENTS.LOG, function (msg) {
    if (msg.level >= log_threshold) { print(msg.message); }
  });

  if (settings.debug && settings.debug.commands) {
    pipe.on(EVENTS.RAWCMD, function (raw) {
      print("Command: %s", raw.join(' '));
    });
  }
}

function setup_input() {
  var interactive = require('./interactive');
  interactive(pipe);
  output = interactive.output;
}

function plugin_setup(pipe_, settings) {
  pipe = pipe_;
  settings = _.defaults(settings, defaults);

  if (typeof settings.threshold === 'string' && LEVELS[settings.threshold]) {
    log_threshold = LEVELS[settings.threshold];
  } else {
    log_threshold = settings.threshold;
  }

  attach_events(settings);
  if (settings.debug && settings.debug.interactive) { setup_input(); }

  pipe.emit(EVENTS.PLUGIN.LOADED, {
    name: __name__,
    version: __version__,
    description: __pkg__.description
  });
  return;
}
module.exports = plugin_setup;
