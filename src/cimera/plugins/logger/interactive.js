var _ = require('underscore'),
    util = require('util');

var isPaused = true,
    isML = 0, MLCmd = "",
    pipe,
    logs =[];

function traversal(obj, act, par) {
  if (!par) par = "";
  _.each(obj, function (v, k) {
    if (par.length) k = [par, k].join(".");
    if (_.isObject(v)) {
      traversal(v, act, k);
    } else {
      act(v, k);
    }
  });
};

var readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: function (line) {
    var hits = _.chain(commands)
      .keys()
      .filter(function (cmd) { cmd.indexOf(line) === 0; })
      .value();
    return hits.length ? hits : '';
  }
});

var commands = {
  ".c": function () {
    readline.close();
    pipe.emit(EVENTS.CLOSE);
    return true;
  },
  ".w": function () {
    isPaused = true;
    _.each(logs, function (str) { console.log(str) });
    logs = [];

    readline.setPrompt('', 0);
  },
  ".f": function (args) {
    var t_str = args;
    while (t_str.indexOf('{') !== -1) {
      isML++;
      t_str = t_str.substr(t_str.indexOf('{')+1);
    };
    var t_str = args;
    while (t_str.indexOf('}') !== -1) {
      isML--;
      t_str = t_str.substr(t_str.indexOf('}')+1);
    };

    if (isML) {
      MLCmd = MLCmd.length ? [MLCmd, args].join(' ') : args;
      readline.setPrompt('... ', 4);
    } else {
      var act = MLCmd.length ? [MLCmd, args].join(' ') : args;

      try {
        act = act.split(' ');
        var packet = JSON.parse(act.slice(1).join(' '));
        pipe.emit(act[0], packet);
      } catch(e) {
        console.error("ERROR %s", e);
      }

      readline.setPrompt('> ', 2);
      MLCmd = "";
    }
  },
  ".ls": function () {
    traversal(EVENTS, function (raw, clean) {
      console.log("E - %s = %s", clean, raw);
    });
  }
};

readline.setPrompt('', 0);
readline.on('line', function (raw) {
  if (isPaused) {
    if (raw !== '') return;
    readline.setPrompt('> ', 2);
    isPaused = false;
  } else if (isML) {
    commands['.f'].call(this, raw);
  } else {
    cmd = raw.split(' ');
    if (!commands[cmd[0]]) pipe.emit(EVENTS.RAWCMD, cmd);
    else if (commands[cmd[0]].call(this, cmd.slice(1).join(' '))) return;
  }

  readline.prompt();
});
readline.prompt();
output = function (str) {
  if (isPaused) console.log(str);
  else logs.push(str);
};

module.exports = function (pipe_) {
  pipe = pipe_;
};

module.exports.output = output;
