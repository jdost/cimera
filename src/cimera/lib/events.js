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
  LOADED: "CIMERAPLUGINLOADED",  // Called when a plugin finishes loading
      // name
  ERROR: "CIMERAPLUGINERROR"    // name, msg
};
// Commands
exports.CMDHELP = "CIMERACMDHELP"; // Return call from HELPREQ when getting the help
  // text for a command from across the plugins
exports.HELPREQ = "CIMERAGETHELP"; // Request event for the help text from commands
  // across the plugins
exports.EXECBUILD = "CIMERABUILDCMD";
exports.RAWCOMMAND = "CIMERARAWCOMMAND";
