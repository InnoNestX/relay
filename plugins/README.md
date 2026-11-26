# relay integrations · 各工具接入件

relay works with any model. Every integration wraps the same two things: the **skills**
(plain Markdown, or served by the **MCP server**) and the **scoring gate**. Pick your tool:

relay 对任何模型通用。每种接入都封装同样两样东西:**技能**(纯 Markdown,或由 **MCP 服务**提供)
和**打分门禁**。按你的工具选:

| Tool · 工具 | Form · 形态 | Folder · 目录 |
|---|---|---|
| Claude Code | Plugin (commands + skills) · 插件 | repo root `.claude-plugin/` → `plugins/claude-code/` |
| OpenClaw / ClawHub | Skill + bundle plugin · skill + 插件 | published on ClawHub |
| Cursor | Project rule + MCP · 规则 + MCP | `plugins/cursor/` |
| ChatGPT / GPT | Custom GPT + MCP connector · 自定义 GPT + MCP | `plugins/chatgpt/` |
| Google Gemini | Gem + Gemini CLI MCP · Gem + MCP | `plugins/gemini/` |
| Grok (xAI) | Custom instructions + MCP · 自定义指令 + MCP | `plugins/grok/` |
| DeepSeek / Muse / any | System prompt + MCP · 系统提示 + MCP | `plugins/system-prompt.md` |

- **Formal plugin packages** exist for Claude Code and OpenClaw/ClawHub — install them directly.
- **Everyone else** uses the same recipe: paste **`system-prompt.md`** as the system prompt /
  custom instructions / Gem, and (optionally) add the **MCP server** (`mcp/config.md`) for the full
  24 skills and the scoring gate on demand.

- Claude Code 与 OpenClaw/ClawHub 有**正式插件包**,可直接安装。
- 其余工具用同一套:把 **`system-prompt.md`** 作为系统提示/自定义指令/Gem,
  再(可选)接上 **MCP 服务**(`mcp/config.md`)按需加载完整 24 技能与打分门禁。
