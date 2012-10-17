var vows = require('vows'),
    assert = require('assert');

var stream = require('stream'),
    util = require('util');

function test_stream () {
  this.test = true;
};
util.inherits(test_stream, stream.Stream);

var cimera = require('./cimera');
var e = globals.EVENTS;

vows.describe('cimera').addBatch({
  'Test': {
    topic: function () {
      return cimera.pipe;
    },
    'send something': function (pipe) {
      var pluginName = "testPI";
      pipe.once(e.PLUGIN.LOADED, function (name) {
        assert.equal(name, pluginName);
      });
      pipe.emit(e.PLUGIN.LOADED, pluginName);
    }
  }
}).export(module);
