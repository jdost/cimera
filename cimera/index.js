var __pkg__ = require('./package.json'),
  __name__ = __pkg__.name,
  __version__ = __pkg__.version,

  PLUGIN_DIR = "./plugins/",
  DEBUG = false,

  EventEmitter = require('events').EventEmitter,
  _ = require('underscore'),
  util = require('util');

global.EVENTS = require('./lib/events.js').events;

var pipe = (function (base) {
  return base;
}(new EventEmitter()));
module.exports = pipe;

var loadPlugin = module.exports.loadPlugin = function (properties, name) {
  var plugin, temp;

  if (!name) {
    _.each(properties, loadPlugin);
    return;
  }

  if (typeof properties === 'string') {
    temp = properties;
    properties = name;
    name = temp;
  }

  plugin = require(PLUGIN_DIR + name);
  plugin(pipe, properties);
};

var help_lines = [
  util.format("Cimera v%s", __version__),
  util.format("USAGE: %s [arguments]", process.title),
  "Arguments:",
  "  -d / --debug:\t\tEnable debug flags irregardless of settings in config",
  "  -c / --config [file]:\tLoads [file] as the config file (default: ./settings.json)",
  "  -p / --plugins [dir]:\tTells where to look for cimera plugins (default: [cimera_folder]/plugins/)",
  "  -h / --help:\t\tPrint this help message",
  "  -v / --version:\tPrint the version information",
  ""
];

var load = module.exports.load = function (settings) {
  if (settings.generic) { loadPlugin(settings.generic); }
};

module.exports.cli = function () {
  var args = process.argv,
    i = 0,
    settings_file = process.cwd() + "/settings.json",
    arg;

  for (i = 0; i < args.length; i++) {
    arg = args[i];
    switch (arg) {
      case "-d":
      case "--debug":
        DEBUG = true;
        break;
      case "-c":
      case "--config":
        i++;
        if (i >= args.length) {
          console.log("ERROR: second argument for \"%s\" not specified", args[i-1]);
          process.exit(2);
        }
        settings_file = args[i];
        break;
      case "-p":
      case "--plugins":
        i++;
        if (i >= args.length) {
          console.log("ERROR: second argument for \"%s\" not specified", args[i-1]);
          process.exit(2);
        }
        if (args[i][0] === "/") { PLUGIN_DIR = args[i]; }
        else if (args[i][0] === "." && args[i][1] === "/") { PLUGIN_DIR = process.cwd() + args[i].substr(1); }
        else { PLUGIN_DIR = process.cwd() + args[i]; }

        if (PLUGIN_DIR.substr(-1) !== "/") { PLUGIN_DIR = PLUGIN_DIR + "/"; }
        break;
      case "-h":
      case "--help":
        _.each(help_lines, function (line) { console.log(line); });
        process.exit(0);
        break;
      case "-v":
      case "--version":
        console.log("%s v%s", __name__, __version__);
        process.exit(0);
        break;
    }
  }

  require('fs').readFile(settings_file, function (err, contents) {
    if (err) {
      console.log("The specified file (%s) could be not loaded", settings_file);
      process.exit(1);
      return;
    }

    var settings = JSON.parse(contents);
    load(settings);
  });
};
