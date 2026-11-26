# relay MCP server · MCP 服务配置

The relay MCP server exposes `relay_list_skills`, `relay_get_skill`, `relay_get_file`, and
`relay_scorecard` to any MCP-capable client. Add one of these to your client's MCP config.

relay 的 MCP 服务向任意 MCP 客户端暴露 `relay_list_skills` / `relay_get_skill` /
`relay_get_file` / `relay_scorecard`。把下面任一段加进你客户端的 MCP 配置。

## Docker (no install) · Docker(免安装)
```json
{
  "mcpServers": {
    "relay": { "command": "docker", "args": ["run", "-i", "--rm", "xuxuclassmate/relay:0.2.0"] }
  }
}
```

## Local Node · 本地 Node
```json
{
  "mcpServers": {
    "relay": { "command": "node", "args": ["/absolute/path/to/relay/server/index.mjs"] }
  }
}
```

## Where this file goes · 配置文件位置
- **Claude Code**: `claude mcp add` or the project `.mcp.json`.
- **Cursor**: `.cursor/mcp.json` (project) or Settings → MCP (global) — see `plugins/cursor/`.
- **Gemini CLI**: `~/.gemini/settings.json` under `mcpServers` — see `plugins/gemini/`.
- **ChatGPT**: Settings → Connectors / Developer mode → add MCP server — see `plugins/chatgpt/`.
- **Any other MCP client**: same JSON under its `mcpServers` key.

> Tip · 提示: `docker run --rm xuxuclassmate/relay:0.2.0 list` and `... score` also work as a quick CLI
> without any MCP client. 不接客户端时,这两条命令也能直接用。
