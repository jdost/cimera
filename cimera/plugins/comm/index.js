var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  _ = require('underscore'),
  util = require('util');

global.EVENTS = _.extend({
  SAMPLECOMMMSG: 'SAMPLECOMMMSG'
}, global.EVENTS);

var EVENTS = global.EVENTS,
  pipe;

function bind_events() {
  pipe.on(EVENTS.VCS.COMMIT, function (commit) {
    pipe.emit(EVENTS.LOG, {
      level: 5,
      message: util.format("Commit(%s): %s", commit.id, commit.message)
    });
  });
  pipe.on(EVENTS.BUILD.STARTED, function (build) {
    pipe.emit(EVENTS.LOG, {
      level: 5,
      message: util.format("Build %s started...", build.name)
    });
  });
  pipe.on(EVENTS.BUILD.SUCCESS, function (build) {
    pipe.emit(EVENTS.LOG, {
      level: 5,
      message: util.format("Build %s suceeded", build.name)
    });
  });
  pipe.on(EVENTS.BUILD.FAILURE, function (build) {
    pipe.emit(EVENTS.LOG, {
      level: 5,
      message: util.format("Build %s failed: %s", build.name, build.reason)
    });
  });
}

function plugin_setup(pipe_, settings) {
  pipe = pipe_;
  bind_events();

  pipe.emit(EVENTS.PLUGIN.LOADED, {
    name: __name__,
    version: __version__
  });
  return;
}
module.exports = plugin_setup;
