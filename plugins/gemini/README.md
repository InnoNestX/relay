# relay for Google Gemini · Gemini 接入

Two ways, depending on whether you use the Gemini app or the Gemini CLI.

两种方式,取决于你用 Gemini 应用还是 Gemini CLI。

## A. Gemini app — a Gem · Gemini 应用 — 建一个 Gem
1. Gemini → Gems → New Gem. · 新建 Gem。
2. **Instructions**: paste `plugins/system-prompt.md`. · 指令里贴 `plugins/system-prompt.md`。
3. Attach the `skills/*/SKILL.md` + `templates/scorecard.md` as knowledge files. · 把这些文件作为知识附上。

## B. Gemini CLI — MCP server · Gemini CLI — MCP 服务
Add relay to `~/.gemini/settings.json`:

把 relay 加进 `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "relay": { "command": "docker", "args": ["run", "-i", "--rm", "xuxuclassmate/relay:0.4.1@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787"] }
  }
}
```

Then the CLI can call `relay_list_skills` / `relay_get_skill` / `relay_scorecard`. See
`../mcp/config.md` for the local-Node variant.

之后 CLI 即可调用上述工具。本地 Node 变体见 `../mcp/config.md`。

> Finish every task with the scoring gate: flow check → score /100 → ≥ 80 pass, else re-run.
> 每次交付前过打分门禁:核流程 → 打分 /100 → ≥80 放行,否则重跑。
