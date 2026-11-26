# relay · 多智能体开发+测试工作流

> 一个 QA/开发者 + 一队 AI 助手的协作规范:**主管只派单、专员各管一个外部写出口、临时助手按需并行**,覆盖需求→用例→评审→造数→执行→报告→缺陷→通知→发版的全流程。每个技能都写清了触发、输入、步骤、判定、产出、交接、禁止项、常见错误、自检。
> 收尾有**兜底打分门禁**:没按流程走就强制走,走完分数不达标(默认 80)就自动优化重跑。
>
> A rulebook for one engineer working with a team of AI assistants across the whole dev+test lifecycle — plus a **scoring gate** that enforces the flow and re-runs until it passes. Model-agnostic: the skills are plain Markdown, usable by **Claude Code, GPT, Gemini, Cursor, Muse, DeepSeek** and any other agent.

## 它是什么 · What it is

- **技能包 (`skills/`)** — 24 个技能(主管、测试、缺陷、通知、编码、文档 + 流程评分),纯 Markdown,任何模型可读。
- **薄服务 (`server/`)** — 一个 MCP 服务 + `relay` CLI,把技能、模板、评分门禁喂给任意 MCP 客户端。
- **多形态分发** — Claude Code 插件、Cursor 规则、ClawHub skill + plugin、Docker 镜像、本地直接运行。
- **脱敏** — 所有系统/平台都是 `{占位符}`(见 `config/placeholders.example.yaml`),示例是虚构场景与人名,不含任何真实行业或工作平台。

## 核心原则 · Core principles

1. 主管只调度不干活。
2. 一类外部写操作只有一个出口(IM→通知;缺陷系统→缺陷;知识库→文档;代码/部署→编码)。
3. 按最新需求判定:符合即过,不符合提单,拿不准升级。
4. 结论进在线报告,编号三处同步。
5. 测试不排队:忙不过来就并行拉临时助手。
6. 安全红线高于一切。
7. **兜底:每次交付前过评分门禁** —— 见下。

## 兜底打分门禁 · The scoring gate

`skills/workflow-scorecard` + `templates/scorecard.md`:

1. **先硬门禁**:核对关键环节是否齐全且顺序正确。没按流程 → **强制从缺失环节起重走**。
2. **再打分**:按评分卡逐项给分(满分 100)。
3. **判定**:`总分 ≥ PASS_SCORE`(默认 80,可在 `config` 配)→ 通过;低于 → 列扣分项、针对性优化、**重跑对应环节**,直到达标或升级。

## 快速上手 · Quick start

```bash
# 列出技能 / 看评分门禁
node server/cli.mjs list
node server/cli.mjs score

# 作为 MCP 服务(任意 MCP 客户端)
node server/index.mjs            # 本地
docker run -i --rm xuxuclassmate/relay   # 容器
```

### Claude Code 插件
```text
/plugin marketplace add InnoNestX/relay
/plugin install relay@relay
# 然后 /relay-start <需求> 、 /relay-score
```

### Cursor
把 `plugins/cursor/relay.mdc` 放进 `.cursor/rules/`,或把 relay MCP 加到 Cursor 的 MCP 配置:
```json
{ "mcpServers": { "relay": { "command": "docker", "args": ["run","-i","--rm","xuxuclassmate/relay"] } } }
```

### ClawHub
- skill:在 ClawHub 搜索 `relay` 安装,或 `clawhub install relay`。
- plugin(OpenClaw 包):`clawhub package` 里获取 `relay`。

### GPT / Gemini / DeepSeek / Muse 等
技能是纯 Markdown:把 `skills/` 作为系统提示/知识库喂给模型,或接 relay MCP(支持 MCP 的客户端)。`relay install generic --dir ./relay-pack` 可一键导出整包。

## 目录 · Layout
```text
relay/
├── skills/                 # 24 个技能(含 workflow-scorecard)
├── conventions/            # 公共底座
├── templates/              # 交接/报告/用例 schema/评分卡
├── config/placeholders.example.yaml
├── examples/               # 虚构端到端示例
├── server/                 # MCP + relay CLI
├── commands/               # Claude Code slash 命令
├── plugins/cursor/         # Cursor 规则
├── .claude-plugin/         # Claude Code 插件清单 + marketplace
├── Dockerfile
└── docs/                   # GitHub Pages 文档站
```

## 许可 · License
MIT,见 `LICENSE`。
