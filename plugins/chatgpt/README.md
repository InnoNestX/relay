# relay for ChatGPT / GPT · ChatGPT / GPT 接入

ChatGPT has no formal "plugin package" anymore — the real ways to run relay are a **Custom GPT**
and/or an **MCP connector**. Both use the same relay content.

ChatGPT 已没有正式的"插件包"——跑 relay 的真实方式是**自定义 GPT**和/或 **MCP 连接器**,两者用同一份 relay 内容。

## A. Custom GPT · 自定义 GPT
1. Create a GPT (ChatGPT → Explore GPTs → Create). · 新建一个 GPT。
2. **Instructions**: paste the whole `plugins/system-prompt.md`. · 把 `plugins/system-prompt.md` 全文贴进"Instructions"。
3. **Knowledge**: upload the `skills/*/SKILL.md` files + `templates/scorecard.md` +
   `conventions/common-conventions.md`. The GPT then has all 24 skills + the rubric.
   **Knowledge** 里上传 `skills/*/SKILL.md` + `templates/scorecard.md` + `conventions/common-conventions.md`,GPT 即拥有全部技能与评分卡。
4. Start with: "Act as the relay supervisor for: <requirement>". · 用「Act as the relay supervisor for: <需求>」开始。

## B. MCP connector (Developer mode / connectors) · MCP 连接器
If your plan supports MCP connectors, add the relay server from `../mcp/config.md`
(Settings → Connectors / Developer mode). The model can then call `relay_get_skill` /
`relay_scorecard` live instead of uploading files.

若你的套餐支持 MCP 连接器,按 `../mcp/config.md` 添加 relay 服务(设置 → 连接器 / 开发者模式),
模型即可实时调用 `relay_get_skill` / `relay_scorecard`,无需上传文件。

> Always finish with the scoring gate: flow-followed check → score /100 → pass ≥ 80 or re-run.
> 交付前务必过打分门禁:核流程 → 打分 /100 → ≥ 80 放行,否则重跑。
