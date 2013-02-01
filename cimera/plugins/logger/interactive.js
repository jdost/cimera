var _ = require('underscore'),
  util = require('util'),
  fs = require('fs'),

  isPaused = true,
  isML = 0,
  MLCmd = "",
  isFile = false,
  pipe,
  settings,
  logs = [],

  readline,
  output,

  EVENTS = global.EVENTS,
  LEADER = "/",

  commands = { },
  addCommand = function (name, func) {
    if (util.isArray(name)) {
      _.each(name, function (n) { commands[n] = func; });
    } else {
      commands[name] = func;
    }
  },
  pause = function () {
    isPaused = true;
    readline.setPrompt('', 0);
  };

var setupCommands = function () {
  addCommand([LEADER + "close", LEADER + "c"], function () {
    readline.close();
    pipe.emit(EVENTS.CLOSE);
    return true;
  });
  addCommand([LEADER + "watch", LEADER + "w"], function () {
    pause();
    while (logs.length) { output(logs.shift()); }
  });
  addCommand(LEADER + "load", function (args) {
    fs.readFile(args, 'utf8', function (err, data) {
      if (err) { throw err; }
      readline.write(data);
    });
  });
  addCommand([LEADER + "fake", LEADER + "f"], function (args) {
    var t_str = args, act, packet;
    while (t_str.indexOf('{') !== -1) {
      isML += 1;
      t_str = t_str.substr(t_str.indexOf('{') + 1);
    }
    t_str = args;
    while (t_str.indexOf('}') !== -1) {
      isML -= 1;
      t_str = t_str.substr(t_str.indexOf('}') + 1);
    }

    if (isML) {
      MLCmd = MLCmd.length ? [MLCmd, args].join(' ') : args;
      readline.setPrompt('... ', 4);
    } else {
      act = MLCmd.length ? [MLCmd, args].join(' ') : args;

      try {
        act = act.split(' ');
        packet = JSON.parse(act.slice(1).join(' '));
        pipe.emit(act[0], packet);
      } catch (e) {
        console.error("ERROR %s", e);
      }

      readline.setPrompt('> ', 2);
      MLCmd = "";
    }
  });

  addCommand(LEADER + "ls", function () {
    var packets = require("../../lib/events").packets;
    traversal(EVENTS, function (raw, clean) {
      console.log("E - %s(%s) -> %s", clean, raw, packets[raw]);
    });
  });
};

function traversal(obj, act, par) {
  if (!par) { par = ""; }
  _.each(obj, function (v, k) {
    if (par.length) { k = [par, k].join("."); }
    if (_.isObject(v)) {
      traversal(v, act, k);
    } else {
      act(v, k);
    }
  });
}
readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: function (line) {
    var hits = _.chain(commands)
      .keys()
      .filter(function (cmd) { return cmd.indexOf(line) === 0; })
      .value();
    return hits.length ? hits : '';
  }
});

function handle_input(raw) {
  var cmd;
  if (isPaused) {
    if (raw !== '') { return; }
    readline.setPrompt('> ', 2);
    isPaused = false;
  } else if (isML) {
    commands['.fake'].call(this, raw);
  } else {
    cmd = raw.split(' ');
    if (!commands[cmd[0]]) {
      pipe.emit(EVENTS.RAWCMD, raw);
    } else if (commands[cmd[0]].call(this, cmd.slice(1).join(' '))) {
      return;
    }
  }

  readline.prompt();
}

readline.setPrompt('', 0);
readline.on('line', handle_input);
readline.prompt();
output = function (str) {
  if (isPaused) {
    console.log(str);
  } else {
    logs.push(str);
  }
};

module.exports = function (pipe_, settings_) {
  pipe = pipe_;
  settings = settings_;

  if (settings.debug.prefix) { LEADER = settings.debug.prefix; }

  setupCommands();
};

module.exports.output = output;
