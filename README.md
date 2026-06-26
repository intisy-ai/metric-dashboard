# metric-dashboard

[![npm version](https://img.shields.io/npm/v/metric-dashboard)](https://www.npmjs.com/package/metric-dashboard)
[![npm downloads](https://img.shields.io/npm/dm/metric-dashboard)](https://www.npmjs.com/package/metric-dashboard)
[![CI](https://github.com/intisy-ai/metric-dashboard/actions/workflows/publish.yml/badge.svg)](https://github.com/intisy-ai/metric-dashboard/actions/workflows/publish.yml)

Credit and billing dashboard for OpenCode and Claude Code from a single codebase. It aggregates session costs, token usage, model breakdowns, and account quotas across both apps, serves a local web UI, and optionally syncs a snapshot across your devices via Firebase.

## Under-the-Hood Architecture

```mermaid
flowchart TD
    subgraph Entry [dist/index.js — single bundle]
        DETECT{argv contains<br/>"claude"?}
    end

    subgraph Sources [Local data sources]
        OCDB[(opencode.db<br/>node:sqlite / bun:sqlite)]
        CCJSONL[~/.claude/projects/*.jsonl]
        ACCTS[*-accounts.json quotas]
    end

    subgraph Core [Dashboard core]
        AGG[Snapshot builder<br/>sessions + models + costByDay]
        SRV[node:http server :3456]
        FB[Firebase REST sync]
        AGG --> SRV
        AGG <--> FB
    end

    DETECT -->|yes: Claude daemon| Core
    DETECT -->|no: OpenCode plugin| Core
    OCDB --> AGG
    CCJSONL --> AGG
    ACCTS --> AGG
    SRV -->|HTML + /api/data| BROWSER[Browser UI]
    FB <-->|/devices snapshot| FBDB[(Firebase RTDB)]
```

## Structure

- `src/` — JavaScript source (`dashboard-core.js` core + `config.js` config/logging + `commands.js`)
- `core/` — git submodule ([`intisy-ai/core`](https://github.com/intisy-ai/core)): shared config, logging, and the cross-app command framework — bundled into `dist/index.js` by esbuild
- `dist/` — Compiled bundle (`dist/index.js` is the single dual-app entry, built with esbuild; generated, not committed)

## Installation

### Via plugin-updater (recommended)
Add to `~/.config/opencode/config/plugins.json`:
```json
[{ "name": "metric-dashboard", "url": "https://github.com/intisy-ai/metric-dashboard", "enabled": true }]
```

### Via npm
```bash
npm install metric-dashboard
```

Open the dashboard at http://127.0.0.1:3456 (Claude Code: run `/credits`).

> SQLite-backed OpenCode session history uses Node's built-in `node:sqlite` (Node 22.5+). On older Node the dashboard still runs and shows file-based and Claude Code history; on OpenCode's Bun runtime it uses `bun:sqlite` automatically.

## Configuration

Config file: `~/.config/opencode/config/metric-dashboard.json` (preferred) or `~/.config/opencode/metric-dashboard.json` (fallback). For Claude Code, replace `opencode` with `claude`.

```json
{
  "logging": true
}
```

Firebase cross-device sync is optional: drop a service-account JSON at `<configDir>/config/firebase-service-account.json` to enable it.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `logging` | boolean | `true` | Write a per-session log file. Set `false` to disable. |

Every key is editable from chat via `/metric-dashboard-config`.

## Commands

Deployed automatically to both apps on load (`~/.config/opencode/command/` and `~/.claude/commands/`):

| Command | Description |
| --- | --- |
| `/credits` | Show where the live usage dashboard is served (http://127.0.0.1:3456). |
| `/metric-dashboard-config` | View/change any config key: `list`, `get <key>`, `set <key> <value>`. 100% of the config is reachable here. |

## Dependencies

- **`core`** (required) — bundled git submodule; no separate install.
- **`node:sqlite`** (optional) — Node 22.5+ built-in for OpenCode SQLite history; falls back to `bun:sqlite` or file-based history.
- **Firebase service account** (optional) — enables cross-device snapshot sync.

## Logging

Logs to `~/.config/opencode/logs/YYYY-MM-DD/metric-dashboard-HH-MM-SS.log` (Claude: under `~/.claude/`).
Set `"logging": false` in config to disable.

## License

MIT
