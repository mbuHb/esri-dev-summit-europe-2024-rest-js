const portalApi = require("@esri/arcgis-rest-portal");
const fs = require('fs');
const path = require('path');

// Define the configuration for each command
const commandsConfig = {
  searchGroups: {
    // Add authentication to the request params
    addAuth: true,
    // Define the output fields to display
    output: ['id', 'title', 'owner'],
    // Define a template for the string option
    templateForString: `{ "q": "{string}", "num": 10, "start": 1 }`
  },
  getItem: {
    addAuth: false,
    output: ['id', 'title', 'owner', 'type', 'url']
  },
  searchUsers: {
    addAuth: true,
    output: ['id', 'username', 'email', 'role'],
    templateForString: `{ "q": "{string}", "num": 10, "start": 1 }`
  },
  searchItems: {
    addAuth: true,
    output: ['id', 'title', 'owner'],
    templateForString: `{ "q": "{string}", "num": 10, "start": 1 }`
  },
  createGroup: {
    addAuth: true,
    output: ['*']
  },
  removeGroup: {
    addAuth: true,
    output: ['*']
  }
}

module.exports = {
  execute: (command, options, manager, exportToFile) => {
    // If we have a command config, use it to set up the params
    const commandConfig = commandsConfig?.[command];

    // Parse the options
    let params;
    if (typeof options === 'string' && commandConfig.templateForString) {
        params = JSON.parse(commandConfig.templateForString.replace('{string}', options));
    } else {
      params = options;
    }
    // Add authentication to params if needed
    if (commandConfig?.addAuth) {
      params.authentication = manager;
    }

    // Execute any command from arcgis-rest-portal https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-portal/
    return portalApi[command](
      params,
      !commandConfig?.addAuth ? {authentication: manager} : undefined
    )
      .then((response) => {
        // Log the results to console
        console.info(`Results for ${command} command:`);
        // If we have an output configuration, use it to display the results
        if (commandConfig?.output) {
          // Display the results in a table if we have multiple results
          if (response.results && Array.isArray(response.results)) {
            response.results.forEach((entry, idx) => {
              // Display all results if output is set to *
              if (commandConfig.output[0] === '*') {
                console.info(JSON.stringify(entry, null, 2));
              } else {
                // Display only the requested fields
                let output = [];
                commandConfig.output.forEach((key) => {
                  output.push(`${key}: ${entry[key]}`);
                });
                console.info(`${idx+1} - ${output.join(' | ')}`);
              }
            });
            // Display the total number of items found
            console.info(`Total ${response.total} items found.`);
          } else {
            if (commandConfig.output[0] === '*') {
              console.info(JSON.stringify(response, null, 2));
            } else {
              let output = [];
              commandConfig.output.forEach((key) => {
                output.push(`${key}: ${response[key]}`);
              });
              console.info(output.join(' | '));
            }
          }
        // If we don't have an output configuration, display the results as JSON
        } else {
          console.info(JSON.stringify(response, null, 2));
        }
        // Export the results to a file if requested
        if (exportToFile) {
          const dir = path.dirname(exportToFile);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(exportToFile, JSON.stringify(response, null, 2));
          console.info(`Results exported to ${exportToFile}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });

  }
};
