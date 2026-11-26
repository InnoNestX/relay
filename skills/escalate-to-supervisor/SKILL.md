---
name: escalate-to-supervisor
description: 除主管外的所有助手收到任务时先用：判断是否属于本职，属于就做，归属明确就转交，跨域或不清就推回主管重派。入口不改变分工。 / For every assistant except the supervisor to use first when receiving a task: decide whether it belongs to your own role — do it if so, forward it when ownership is clear, and push it back to the supervisor for re-assignment when it is cross-domain or unclear. The entry point does not change the division of labor.
---

# 接单判定与推回主管 · Task Intake Decision and Escalation to the Supervisor

## 适用角色 · Applicable Roles
测试助手、缺陷助手、通知助手、编码助手、文档助手、临时测试助手。

The test assistant, the defect assistant, the notification assistant, the coding assistant, the documentation assistant, and temporary test assistants.

## 触发条件 · Triggers
收到任何任务——无论来自用户本人、主管还是其他助手。

Receiving any task — whether from the user directly, the supervisor, or another assistant.

## 输入 · Inputs
- 任务原文（尽量是用户原话）。
- 分工表（`conventions/common-conventions.md` 第 2 节）。

- The original task text (the user's exact words where possible).
- The division-of-labor table (`conventions/common-conventions.md`, Section 2).

## 分步流程 · Step-by-Step Process
1. **对照分工表**判断归属：
   - 写 IM → 通知助手；写缺陷系统 → 缺陷助手；写知识库 → 文档助手；写代码/脚本/部署/模拟入账 → 编码助手；用例/执行/复测/报告/汇总页 → 测试助手。
2. **属于自己**：直接做；完成后按回报格式回报派单方（默认主管）。
3. **不属于但归属明确**：高优先级转给对应助手，附原文与已知上下文；抄告主管一句「已转 X」。
4. **跨域 / 归属不清 / 需要多个助手配合**：推回主管，附：
   ```text
   用户原话（时间）：「……」
   我的职责内能做：……（已做 / 未做）
   卡点：需要 <角色> 做 <什么>
   建议拆分：1. … 2. …
   ```
5. 等主管重派，不自己串联别的助手完成整件事（除非是固定的单步交接，如「缺陷单号 → 通知助手」）。

1. **Check against the division-of-labor table** to determine ownership:
   - Writing IMs → the notification assistant; writing to the defect system → the defect assistant; writing to the knowledge base → the documentation assistant; writing code/scripts/deployments/simulated bookkeeping → the coding assistant; test cases/execution/re-test/reports/the summary index page → the test assistant.
2. **It belongs to you**: do it directly; when done, report back to the dispatcher (the supervisor by default) in the report format.
3. **Not yours but ownership is clear**: forward it with high priority to the corresponding assistant, attaching the original text and known context; cc the supervisor with a one-liner "forwarded to X."
4. **Cross-domain / unclear ownership / needs multiple assistants to cooperate**: push it back to the supervisor, attaching:
   ```text
   用户原话（时间）：「……」
   我的职责内能做：……（已做 / 未做）
   卡点：需要 <角色> 做 <什么>
   建议拆分：1. … 2. …
   ```
   (User's exact words (time): "…". Within my role I can do: … (done / not done). Blocker: need <role> to do <what>. Suggested split: 1. … 2. ….)
5. Wait for the supervisor to re-assign; do not chain other assistants together yourself to complete the whole thing (unless it is a fixed single-step handoff, such as "defect ticket number → notification assistant").

## 判定规则 · Decision Rules
- 用户在哪个会话里说的都一样，**入口不改变分工**。
- 「顺便」的小事也不例外：测试助手不能顺手发一条 IM，缺陷助手不能顺手判 bug。
- 固定交接链可直接交给下一环，无需经主管：
  - 测试助手 →（确认的问题清单）→ 缺陷助手；
  - 缺陷助手 →（单号 + 指派研发）→ 通知助手；
  - 任何助手 →（发消息需求）→ 通知助手；
  - 测试助手 →（脚本需求）→ 编码助手。
- 下游收到「用户原话 + 时间」的转述即视为用户已确认，不再回头问用户。

- It makes no difference which session the user said it in — **the entry point does not change the division of labor**.
- Even small "while I'm at it" tasks are no exception: the test assistant cannot casually send an IM, and the defect assistant cannot casually adjudicate a bug.
- Fixed handoff chains may go straight to the next link without passing through the supervisor:
  - Test assistant →(confirmed issue list)→ defect assistant;
  - Defect assistant →(ticket number + assigned developer)→ notification assistant;
  - Any assistant →(a request to send a message)→ notification assistant;
  - Test assistant →(a script request)→ coding assistant.
- Once a downstream assistant receives the relayed "user's exact words + time," the user is considered to have confirmed; do not go back and ask the user again.

## 产出模板（回报）· Output Template (Report)
```text
结论：一句话
链接 / 编号：……
失败项：无 / ……
```

```text
结论：一句话
链接 / 编号：……
失败项：无 / ……
```
(Conclusion: one sentence. Link / ID: …. Failed items: none / ….)

## 交接对象 · Handoff Parties
主管（默认上游、推回对象）；固定交接链上的相邻助手。

The supervisor (the default upstream and escalation target); the adjacent assistant on a fixed handoff chain.

## 禁止项 · Prohibited
- 越权执行别的角色的外部写操作。
- 把推回写成「我做不了」而不给卡点和建议拆分。
- 自己拉多个助手组成临时流程绕过主管。

- Performing another role's external write operations beyond your authority.
- Writing an escalation as "I can't do it" without providing the blocker and a suggested split.
- Pulling multiple assistants together into an ad hoc workflow to bypass the supervisor.

## 常见错误 · Common Mistakes
- 用户直接在测试助手的会话里说「帮我通知下研发」，测试助手自己去发 → 应交通知助手。
- 推回时没附用户原话，主管只能再问一遍用户。

- The user says "please notify the developer for me" directly in the test assistant's session and the test assistant sends it itself → it should go to the notification assistant.
- Escalating without attaching the user's exact words, leaving the supervisor no choice but to ask the user again.

## 自检清单 · Self-Check Checklist
- [ ] 已对照分工表判断 — Judged against the division-of-labor table
- [ ] 转交 / 推回时附了用户原话与时间 — Attached the user's exact words and time when forwarding / escalating
- [ ] 抄告了主管 — CC'd the supervisor
- [ ] 没有越权写外部系统 — Did not write to external systems beyond your authority
