#!/usr/bin/env node
import { build } from "esbuild";

// Node-only bundle (the container has no Bun). bun:sqlite / node:sqlite are
// loaded via createRequire at runtime and @opencode-ai/plugin is imported
// dynamically only on the OpenCode path, so all three stay external.
await build({
  entryPoints: ["src/dashboard-core.js"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: "dist/index.js",
  external: ["@opencode-ai/plugin", "node:sqlite", "bun:sqlite"],
});

console.log("Bundled metric-dashboard -> dist/index.js");
