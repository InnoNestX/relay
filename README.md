# relay — multi-agent dev+test workflow

> Docs are in English. 中文:use the language toggle on the [docs site](https://innonestx.github.io/relay/).

> A rulebook for one engineer working with a team of AI assistants across the whole dev+test
> lifecycle — plus a **scoring gate** that enforces the flow and re-runs until it passes.
> Model-agnostic: the skills are plain Markdown, usable by **Claude Code, GPT, Gemini, Cursor,
> Muse, Grok, DeepSeek** and any other agent. **Skill content is bilingual (English + 中文).**

## What it is

- **Skills (`skills/`)** — 24 skills (supervisor, testing, defects, notifier, coder, docs +
  workflow scoring), plain Markdown, **bilingual**, readable by any model.
- **Thin server (`server/`)** — an MCP server + a `relay` CLI that feed the skills, templates and
  the scoring gate to any MCP client.
- **Ships everywhere** — Claude Code plugin, Cursor, ChatGPT, Gemini, Grok, ClawHub (skill +
  plugin), MCP, Docker, local. Per-tool integrations live in **`plugins/`**.
- **Desensitized** — every system is a `{placeholder}` (see `config/placeholders.example.yaml`);
  examples use fictional people and scenarios — no real platform or industry.

## Core principles

1. The supervisor only dispatches (quoting the user's words + time), follows up and summarizes — never executes.
2. One owner per external write channel: chat → notifier, defect system → defect manager, knowledge base → docs, code/deploy → coder.
3. Judge against the latest requirement: pass if it matches, file a defect if not, escalate if unclear.
4. Conclusions live in an online report; issue numbers stay in sync across chat, report and defect system.
5. Testing never queues — scale out parallel helpers; testers create their own data.
6. Security red lines override everything.
7. **Every delivery passes the scoring gate** (below).

## The scoring gate

`skills/workflow-scorecard` + `templates/scorecard.md`:

1. **Hard gate first** — check every key step happened and in order. If not, force the flow from the missing step before scoring.
2. **Score out of 100** against the rubric, one line of evidence per row.
3. **Verdict** — `score ≥ PASS_SCORE` (default **80**, set in `config`) → pass; below → list the lost points, optimize, and re-run the weak steps until it passes or escalate.

## Quick start

```bash
node server/cli.mjs list            # list skills + pass score
node server/cli.mjs score           # print the scoring gate
node server/index.mjs               # run as an MCP server (stdio)
docker run -i --rm xuxuclassmate/relay   # same, in a container
```

### Claude Code
```text
/plugin marketplace add InnoNestX/relay
/plugin install relay@relay
# then  /relay-start <requirement>   ·   /relay-score
```

### Cursor
Copy `plugins/cursor/relay.mdc` into `.cursor/rules/`, and/or add `plugins/cursor/mcp.json` to `.cursor/mcp.json`.

### ClawHub
`clawhub install relay` (skill) · `clawhub package` → `relay` (OpenClaw plugin).

### GPT · Gemini · Grok · DeepSeek · Muse · others
Each tool has a ready-made integration under **`plugins/`** (`chatgpt/`, `gemini/`, `grok/`,
`cursor/`, `claude-code/`, `mcp/`). Paste `plugins/system-prompt.md` as the system prompt / custom
instructions / Gem, then optionally add the MCP server (`plugins/mcp/config.md`), or export the whole
pack with `relay install generic --dir ./relay-pack`. See `plugins/README.md`.

## Layout
```text
relay/
├── skills/                 # 24 bilingual skills (incl. workflow-scorecard)
├── conventions/            # shared base rules
├── templates/              # handoff / report / test-case schema / scorecard
├── config/placeholders.example.yaml
├── examples/               # fictional end-to-end walkthrough
├── server/                 # MCP + relay CLI
├── commands/               # Claude Code slash commands
├── plugins/                # integrations: system-prompt + mcp/ chatgpt/ gemini/ grok/ cursor/ claude-code/
├── Dockerfile
└── docs/                   # GitHub Pages site (English, with a 中文 toggle)
```

## Docs & links
- Docs site: https://innonestx.github.io/relay/ (English by default, switch to 中文)
- Docker Hub: https://hub.docker.com/r/xuxuclassmate/relay
- ClawHub: https://clawhub.ai/xuxuclassmate

## License
MIT — see `LICENSE`.
