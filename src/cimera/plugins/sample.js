var _ = require('underscore');
globals.EVENTS = _.extend({
  // Plugin specific events
}, globals.EVENTS);

var stream = globals.TEST_STREAM;
var EVENTS = globals.EVENTS;

var pipe;
var BUILD = 'build',
    ERROR = 'error',
    RAW = 'command';

var buffer;

function notify(type) {
  return function (data) {
    console.log(type, data);
  }
}

function command(rawCmd) {
  pipe.emit(events.RAWCOMMAND, rawCmd);
}

stream.bind('data', command);

function setup(pipe_) {
  pipe = pipe_;

  pipe.on(events.BUILDSUCCESS, notify(BUILD));
  pipe.on(events.RAWCOMMAND, notify(RAW));
}
exports.setup = setup;
