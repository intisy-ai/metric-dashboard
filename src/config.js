// metric-dashboard config + logging — delegated to the shared core library
// so every plugin uses one config + logging system. Public API kept stable for
// dashboard-core.js (getAppConfigDir, getPluginConfig, writeLog).
import { getAppConfigDir, loadConfig, defineConfig, makeWriteLog } from "../core/src/index.js";

const PACKAGE_NAME = "metric-dashboard";

// register defaults so the loader can discover + edit them (writes no file on load)
defineConfig(PACKAGE_NAME, {
  logging: true,
  port: 3456,
  sync_interval_ms: 60000,
  snapshot_ttl_ms: 5000,
  remote_cache_ttl_ms: 15000,
  db_path: "",
  enabled: true,
  host: "",
  sync_enabled: true,
});

export { getAppConfigDir };

export function getPluginConfig(configDir = getAppConfigDir()) {
  return loadConfig(PACKAGE_NAME, configDir);
}

export const writeLog = makeWriteLog(PACKAGE_NAME);
