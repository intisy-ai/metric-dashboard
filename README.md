# metric-dashboard

[![npm version](https://img.shields.io/npm/v/metric-dashboard)](https://www.npmjs.com/package/metric-dashboard)
[![npm downloads](https://img.shields.io/npm/dm/metric-dashboard)](https://www.npmjs.com/package/metric-dashboard)
[![CI](https://github.com/intisy/metric-dashboard/actions/workflows/publish.yml/badge.svg)](https://github.com/intisy/metric-dashboard/actions/workflows/publish.yml)

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

- `src/` — JavaScript source (`dashboard-core.js` core + `config.js` config/logging)
- `dist/` — Compiled bundle (`dist/index.js` is the single dual-app entry, built with esbuild)

## Installation

### Via plugin-updater (recommended)
Add to `~/.config/opencode/config/plugins.json`:
```json
[{ "name": "metric-dashboard", "url": "https://github.com/intisy/metric-dashboard", "enabled": true }]
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

## Logging

Logs to `~/.config/opencode/logs/YYYY-MM-DD/metric-dashboard-HH-MM-SS.log` (Claude: under `~/.claude/`).
Set `"logging": false` in config to disable.

## License

MIT
