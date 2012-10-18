// Build systems
exports.BUILD = {
  FAILURE: "CIMERABUILDFAILURE",    // name, reason
  STARTED: "CIMERABUILDSTARTED",    // name
  SUCCESS: "CIMERABUILDSUCCESSFUL"  // name
};
// Version Control
exports.VCS = {
  COMMIT: "CIMERAVCSCOMMIT"   // committer, commit_id, name, message, summary?
};
// Plugins
exports.PLUGIN = {
  LOADED: "CIMERAPLUGINLOADED", // name, version
  ERROR: "CIMERAPLUGINERROR"    // name, msg
};
// Top Level
exports.RAWCMD = "CIMERACOMMAND"; // Array of split arguments
