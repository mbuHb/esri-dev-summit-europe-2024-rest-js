# Node CLI Examples

This demo shows how to create a command-line application that interacts with the ArcGIS Online API.

At this point, the commands are very simple and intended to demonstrate how to build up tooling.

This project uses the `commander` module, which streamlines the creation of node cli applications. Check out the [README](https://github.com/tj/commander.js/blob/master/Readme.md) for more details.

### Installing

Run `npm install` from the `d7_portal-node-cli` folder. 

### Running

If you use this demo as a starting point for your own command line package, you would publish it to npm, then on the target systems run `npm install <your-cli-package>`, and it would be available as a command.

But, this is demo code, and thus the package is not "installed" via `npm install ...`, before we can call it as `portal exec <command> <params>` we need to run `npm link` in the `d7_portal-node-cli` folder. After you do that, the command should work.

Here is a post with information on creating node command line tools: [A Guide to Creating a NodeJs Command](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/)

### Commands

| command                         | description                   | example                                                  |
| ------------------------------- | ----------------------------- | -------------------------------------------------------- |
| `portal searchItems -s <query>` | search for items              | `portal searchItems -s dev`                              |
| `portal searchUsers -s <query>` | search for users              | `portal searchUsers -s ex`                               |
| `portal searchGroups -s <query>`| search for groups             | `portal searchGroups -s geo`                             |

## Acknowledgment

This sample is based on https://github.com/Esri/arcgis-rest-js/tree/main/demos/ago-node-cli sample created by Dave Bouwman <dbouwman@esri.com>

## Command samples

```sh
portal exec searchGroups -j '{\"q\":\"dev\",\"num\":5,\"start\":1}'
portal exec createGroup -j '{\"group\":{\"title\":\"Dev summit\", \"access\":\"public\"}}'
portal exec searchGroups -j '{\"q\":\"dev\",\"num\":5,\"start\":1}'
portal exec removeGroup -j '{\"id\":\"d16ef0f73e7f42f28256ec3bc7e0ca5b\"}'
portal exec searchItems -j '{\"q\":\"dev\",\"num\":6,\"start\":1}'
portal exec getItem -s a6411184f6cc467881186522e0bab7a4 -e .\output\a6411184f6cc467881186522e0bab7a4.json
portal exec searchUsers -s ex
portal exec searchGroups -s geo
```