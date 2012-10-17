var _ = require('underscore'),
    PP = require('./string'),
    irc = require('irc'),
    fs = require('fs');

var __pkg__,
    __name__,
    __version__;
fs.readFile('./package.json'), function (err, contents) {
  if (err) {
    __name__ = 'IRC';
    __version__ = '?';
    __pkg__ = err;
    return;
  }

  __pkg__ = JSON.parse(contents);
  __name__ = __pkg__.name;
  __version__ = __pkg__.version;
}),

globals.EVENTS = _.extend({
  // IRC specific events
}, globals.EVENTS);

var EVENTS = globals.EVENTS,
    pipe;

function network_setup(settings) {
};

function plugin_setup(pipe_) {
  pipe = pipe_; // tie the event pipe up a scope

  // Emit to notify the plugin was loaded
  pipe.emit(EVENTS.PLUGIN.LOADED, {
    name: __name__,
    version: __version__
  });
  // returns an object to access
  return {
    add: network_setup
  };
};

module.exports = plugin_setup;
