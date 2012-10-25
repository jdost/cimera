var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  _ = require("underscore"),
  md5 = require("crypto").createHash('md5');

global.EVENTS = _.extend({
  FAKEVCS: "FAKEVCS"
}, global.EVENTS);

var EVENTS = global.EVENTS,
  pipe;

function fake_event(packet) {
  md5.update(Math.random().toString());
  var id = md5.digest('hex').substr(0, 8);
  if (packet.type === "commit") {
    packet.id = id;
    pipe.emit(EVENTS.VCS.COMMIT, packet);
  }
}

function bind_events() {
  pipe.on(EVENTS.FAKEVCS, function (p) {
    if (!p.type) { return; }
    fake_event(p);
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
