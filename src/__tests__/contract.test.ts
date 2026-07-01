// Universal plugin contract via core's shared test-kit.
import { runPluginContract } from "../../core/src/testing.js";

runPluginContract({
  name: "metric-dashboard",
  entry: "dist/index.js",
  configName: "metric-dashboard",
  app: "both",
  commands: ["credits", "metric-dashboard-config"],
  deploy: "load",
  readme: true,
});
