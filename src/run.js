var cimera = require('./cimera'),
    fs = require('fs');

fs.readFile('settings.json', function (err, contents) {
  if (err) throw err;
  var modules = JSON.parse(contents);

  if (modules.generic) cimera.loadPlugin(modules.generic);
});
