# relay for Cursor · Cursor 接入

Two pieces — use either or both.

两部分,任选其一或都用。

1. **Project rule** · 项目规则: copy `relay.mdc` into your repo's `.cursor/rules/`. Cursor will
   apply the relay workflow + scoring gate as a rule.
   把 `relay.mdc` 放进仓库的 `.cursor/rules/`,Cursor 会把 relay 流程 + 打分门禁作为规则应用。

2. **MCP server** (full 24 skills on demand) · MCP 服务(按需加载完整 24 技能): copy `mcp.json`
   to your repo's `.cursor/mcp.json` (or merge its `mcpServers` into Settings → MCP).
   把 `mcp.json` 放进仓库 `.cursor/mcp.json`(或并入 设置 → MCP)。

Then ask Cursor to "run the relay workflow" or "score this against relay"; it will read the rule and
call `relay_list_skills` / `relay_get_skill` / `relay_scorecard`.

然后让 Cursor「按 relay 流程做」或「用 relay 给这次打分」,它会读规则并调用上述 MCP 工具。
