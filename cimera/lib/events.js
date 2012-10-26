var events = {},
  packets = {};
// Build systems
events.BUILD = {
  FAILURE: "CIMERABUILDFAILURE",    // name, reason
  STARTED: "CIMERABUILDSTARTED",    // name
  SUCCESS: "CIMERABUILDSUCCESSFUL"  // name
};
packets[events.BUILD.FAILURE] = "{ name, reason }";
packets[events.BUILD.STARTED] = "{ name }";
packets[events.BUILD.SUCCESS] = "{ name }";
// Version Control
events.VCS = {
  COMMIT: "CIMERAVCSCOMMIT"   // committer, commit_id, name, message, summary?
};
packets[events.VCS.COMMIT] = "{ committer, id, name, message }";
// Plugins
events.PLUGIN = {
  LOADED: "CIMERAPLUGINLOADED", // name, version
  ERROR: "CIMERAPLUGINERROR"    // name, msg
};
packets[events.PLUGIN.LOADED] = "{ name, version, description? }";
packets[events.PLUGIN.ERROR] = "{ name, message }";
// Top Level
events.RAWCMD = "CIMERACOMMAND"; // Array of split arguments
events.LOG = "CIMERALOGMSG"; // String to be logged and logging level
events.MSG = "CIMERASYSMSG";

packets[events.RAWCMD] = "[command string], [context object]";
packets[events.LOG] = "{ level, message }";
packets[events.MSG] = "[message string]";

exports.events = events;
exports.packets = packets;
