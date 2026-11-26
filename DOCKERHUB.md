# relay · multi-agent dev+test workflow

**relay** is a model-agnostic multi-agent workflow for the whole dev + test lifecycle: a supervisor
dispatches, specialists each own one write channel, parallel helpers scale out — and a **scoring
gate** checks the flow was followed and re-runs until it passes (default pass 80, configurable).
Bilingual (中文 + English).

**relay** 是一套模型无关的多智能体开发+测试全流程:主管派单、专员各管一个写出口、临时助手并行,
并用**打分门禁**核验流程、不达标就重跑(默认通过线 80,可配)。内容中英双语。

- Source · 源码: https://github.com/InnoNestX/relay
- Docs · 文档: https://innonestx.github.io/relay/
- ClawHub: `clawhub install relay` (skill) · `clawhub package` → relay (plugin)

## Tags · 标签
- `latest`, `0.2.0` — multi-arch (arm64 / amd64).

## Use as an MCP server · 作为 MCP 服务
Point any MCP client (Claude Code, Cursor, Gemini CLI, ChatGPT connectors, …) at:
把任意 MCP 客户端指向:

```json
{ "mcpServers": { "relay": { "command": "docker", "args": ["run","-i","--rm","xuxuclassmate/relay"] } } }
```

Tools exposed · 暴露的工具: `relay_list_skills`, `relay_get_skill`, `relay_get_file`, `relay_scorecard`.

## Use as a CLI · 作为命令行
```bash
docker run --rm xuxuclassmate/relay list        # list the 24 skills · 列出 24 个技能
docker run --rm xuxuclassmate/relay show supervisor
docker run --rm xuxuclassmate/relay score       # print the scoring gate · 打印打分门禁
docker run --rm xuxuclassmate/relay help
```

## What's inside · 镜像内含
The full relay pack: 24 bilingual skills, shared conventions, templates (incl. the scorecard),
a fictional end-to-end example, and the thin MCP/CLI server. Everything is desensitized —
systems are `{placeholders}`, examples use fictional names.

完整 relay 包:24 个双语技能、公共规范、模板(含评分卡)、一个虚构端到端示例,以及薄 MCP/CLI 服务。
全部脱敏——系统为 `{占位符}`,示例用虚构人名。

MIT · InnoNestX
