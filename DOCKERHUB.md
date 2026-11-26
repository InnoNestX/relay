# relay · multi-agent dev+test workflow

**relay** is a model-agnostic multi-agent workflow for the whole dev + test lifecycle: a supervisor
dispatches, specialists each own one write channel, parallel helpers scale out — and a **scoring
gate** checks the flow was followed and re-runs until it passes (default pass 80, configurable).

- Source: https://github.com/InnoNestX/relay
- Docs: https://innonestx.github.io/relay/  (English, with a 中文 toggle)
- ClawHub: `clawhub install relay` (skill) · `clawhub package` → relay (plugin)

## Tags
- `latest`, `0.2.0` — multi-arch (arm64 / amd64).

## Use as an MCP server
Point any MCP client (Claude Code, Cursor, Gemini CLI, ChatGPT connectors, …) at:

```json
{ "mcpServers": { "relay": { "command": "docker", "args": ["run","-i","--rm","xuxuclassmate/relay:0.4.0@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787"] } } }
```

Tools exposed: `relay_list_skills`, `relay_get_skill`, `relay_get_file`, `relay_scorecard`.

## Use as a CLI
```bash
docker run --rm xuxuclassmate/relay:0.4.0@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787 list        # list the 24 skills
docker run --rm xuxuclassmate/relay:0.4.0@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787 show supervisor
docker run --rm xuxuclassmate/relay:0.4.0@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787 score       # print the scoring gate
docker run --rm xuxuclassmate/relay:0.4.0@sha256:c48cf3271c0ee4e62b9bdf9a803ca4ec48dcb1648c3798796f9f495ab258a787 help
```

## What's inside
The full relay pack: 24 skills (bilingual content), shared conventions, templates (incl. the
scorecard), a fictional end-to-end example, and the thin MCP/CLI server. Everything is desensitized —
systems are `{placeholders}`, examples use fictional names.

MIT · InnoNestX
