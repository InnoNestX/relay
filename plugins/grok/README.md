# relay for Grok (xAI) · Grok 接入

Grok has no plugin marketplace; relay runs through **custom instructions** plus, where your client
supports it, the **MCP server**.

Grok 没有插件市场;relay 通过**自定义指令**运行,客户端支持时再加 **MCP 服务**。

## A. Custom instructions / workspace · 自定义指令 / 工作区
Paste `plugins/system-prompt.md` into Grok's custom instructions (or a Workspace system prompt).
That gives Grok the roles, principles, and the scoring gate.

把 `plugins/system-prompt.md` 贴进 Grok 的自定义指令(或 Workspace 系统提示),
即获得角色分工、原则与打分门禁。

## B. Full skills · 完整技能
- If using the **Grok API / an MCP-capable client**, add the relay MCP server (`../mcp/config.md`)
  and let it call `relay_get_skill` / `relay_scorecard`.
  用 **Grok API / 支持 MCP 的客户端**时,按 `../mcp/config.md` 加 relay MCP 服务,调用上述工具。
- Otherwise, attach the `skills/*/SKILL.md` files to the conversation as reference.
  否则把 `skills/*/SKILL.md` 作为参考附进对话。

Start: "Act as the relay supervisor for: <requirement>", and finish with the scoring gate
(≥ 80 to pass, else re-run). · 用「Act as the relay supervisor for: <需求>」开始,交付前过打分门禁(≥80 放行,否则重跑)。
