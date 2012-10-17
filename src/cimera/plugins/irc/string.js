var _ = require('underscore');

/**
 * parse is a function that will convert a static string with wildcards in it into
 * another string, filling in the wildcards based on the data object passed in, the
 * wildcards are defined with "${*}" where the "*" is the key in the data object
 * that will get replaced in the final string.
 *
 * > parse("hello ${name}!", { name: "world" })
 * "hello world!"
 * > parse("hello ${name}!", { foo: "bar" })
 * "hello ${name}!" // This is because the key 'name' is not defined in data
 *
 **/
var parse = function (base, data) {
  var words = base.split(" ");
  return _.map(words, function (word) {
    if (word.substr(0,2) !== "${" || word.indexOf("}") < 0)
      return word;
    var key = word.substr(2, word.indexOf("}") - 2);

    if (_.isUndefined(data[key]))
      return word;
    else
      return data[key] + word.substr(word.indexOf("}") + 1);
  }).join(" ");
};

/*
Improvements:
- expand the wildcards with a fallback value
  ex. ${name|No Name} (if 'name' is not a key, uses 'No Name')
- conditional values
  ex. ${?name} name: ${name} ${/?name} (style TBD)
- advanced filter/conversion functions?
  things like built in date formatting or such
  ex. ${date,dateFormat('%d/%m/%y')}
 */

module.exports = parse;
