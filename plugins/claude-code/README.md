# relay for Claude Code · Claude Code 接入

relay ships as a **Claude Code plugin** — the repo root is the plugin (`.claude-plugin/plugin.json`,
`commands/`, and the `skills/` folder). Install it from the marketplace:

relay 本身就是一个 **Claude Code 插件**——仓库根即插件(`.claude-plugin/plugin.json`、`commands/`、
`skills/`)。从 marketplace 安装:

```text
/plugin marketplace add InnoNestX/relay
/plugin install relay@relay
```

Then · 然后:
- `/relay-start <requirement>` — act as the supervisor and run the whole flow. · 以主管身份跑完整流程。
- `/relay-score` — run the scoring gate on the current work. · 对当前工作跑打分门禁。
- The 24 skills auto-load as Claude Code skills. · 24 个技能作为 Claude Code 技能自动加载。

Prefer MCP instead? Add the server from `../mcp/config.md`. · 想用 MCP?见 `../mcp/config.md`。
