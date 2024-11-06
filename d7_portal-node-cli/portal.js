#!/usr/bin/env node

const { ArcGISIdentityManager } = require("@esri/arcgis-rest-request");
const dotenv = require("dotenv");

/**
 * This demo uses the commander module, which streamlines the creation of command-line-applications
 */
const program = require("commander");

program.version("0.0.1");

// Read in the environment variables
dotenv.config();

// Setup authentication
const manager = new ArcGISIdentityManager({
  portal: process.env.PORTAL_URL,
  username: process.env.PORTAL_USERNAME,
  password: process.env.PORTAL_PASSWORD,
});

// Set up command handler and options
const portalCommands = require("./lib/portal-commands");
program
  .command("exec")
  .description("Execute a portal command")
  .arguments("<cmd>", 'Command to execute')
  .option("-j, --json <json>", "Json options to pass to the command")
  .option("-s, --string <param>", "String options to pass to the command")
  .option("-e, --export <filePath>", "Output response to file")
  .action((command, options) => {
    let params;
    if (options.json) {
      params = JSON.parse(options.json);
    } else if (options.string) {
      params = options.string;
    }
    console.log("Executing portal command: ", command, params);

    portalCommands.execute(command, params, manager, options.export);
  });

program.parse(process.argv);
