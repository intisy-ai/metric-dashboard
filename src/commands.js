// Cross-app slash-commands for metric-dashboard plus the CLI action behind the
// config command. Deployed to both apps by core's deployCommands; the config
// command shells back into this bundle (`node <bundle> config …`).
import { configCommand, runConfigCli } from "../core/src/index.js";

export const METRIC_COMMANDS = [
  configCommand("metric-dashboard"),
  {
    name: "credits",
    description: "View credit usage dashboard",
    body: "The metric-dashboard usage dashboard is served at http://127.0.0.1:3456 while the plugin is active. Tell the user to open it to view credit/usage metrics.",
  },
];

export async function maybeRunCli(pluginName) {
  const argv = process.argv.slice(2);
  if (argv[0] === "config") {
    runConfigCli(pluginName, argv.slice(1));
    return true;
  }
  return false;
}
