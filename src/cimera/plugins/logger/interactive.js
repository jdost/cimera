var _ = require('underscore'),
  util = require('util'),
  fs = require('fs'),

  isPaused = true,
  isML = 0,
  MLCmd = "",
  isFile = false,
  pipe,
  logs = [],

  readline,
  output,

  EVENTS = global.EVENTS,

  commands = { },
  addCommand = function (name, func) {
    commands[name] = func;
  },
  pause = function () {
    isPaused = true;
    readline.setPrompt('', 0);
  };

addCommand(".close", function () {
  readline.close();
  pipe.emit(EVENTS.CLOSE);
  return true;
});
addCommand(".watch", function () {
  pause();
  while (logs.length) { output(logs.shift()); }
});
addCommand(".load", function (args) {
  fs.readFile(args, 'utf8', function (err, data) {
    if (err) { throw err; }
    readline.write(data);
  });
});
addCommand(".fake", function (args) {
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
addCommand(".ls", function () {
  traversal(EVENTS, function (raw, clean) {
    console.log("E - %s = %s", clean, raw);
  });
});

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
      pipe.emit(EVENTS.RAWCMD, cmd);
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

module.exports = function (pipe_) {
  pipe = pipe_;
};

module.exports.output = output;
