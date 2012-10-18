var __pkg__ = require('./package.json'),
    __name__ = __pkg__.name,
    __version__ = __pkg__.version;

var EVENTS = global.EVENTS,
    pipe;

function plugin_setup(pipe_, settings) {
  pipe = pipe_;

  pipe.emit(EVENTS.PLUGIN.LOADED, {
    name: __name__,
    version: __version__
  });
  return;
};
module.exports = plugin_setup;
