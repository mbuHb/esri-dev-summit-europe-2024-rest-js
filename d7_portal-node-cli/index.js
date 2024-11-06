/**
 * Re-export the commands so they can be used in other contexts
 */
const portalCommands = require("./lib/portal-commands");

// just re-export the commands so they can be run in another script
module.exports = {
  exec: portalCommands
};
