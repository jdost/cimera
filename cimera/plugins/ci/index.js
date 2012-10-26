var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  EVENTS = global.EVENTS,
  pipe;

function start_build(name) {
  var end_packet = {
    name: name
  }, res = Math.random() < 0.5 ? EVENTS.BUILD.SUCCESS : EVENTS.BUILD.FAILURE;

  pipe.emit(EVENTS.BUILD.STARTED, {
    name: name
  });

  if (res === EVENTS.BUILD.FAILURE) { end_packet.reason = "Planned Failure"; }

  setTimeout(function () {
    pipe.emit(res, end_packet);
  }, Math.round(Math.random() * 500) + 200);
}

function bind_events() {
  pipe.on(EVENTS.VCS.COMMIT, function (commit) {
    start_build(commit.id);
  }).on(EVENTS.RAWCMD, function (command, context) {
    command = command.split(" ");
    if (command[0] === "build") { start_build("Manual"); }
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
