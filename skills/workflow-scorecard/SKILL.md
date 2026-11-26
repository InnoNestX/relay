---
name: workflow-scorecard
description: >-
  所有助手交付前自评、主管收尾前复核时使用：按 relay 流程给本次执行打分（满分 100），
  先判断是否按流程走、再看是否达到 {PASS_SCORE} 分。没按流程走就强制回到流程从缺失环节重走；
  走完但低于阈值就触发优化重跑，直到达标。这是 relay 的兜底门禁。
  For every assistant to self-assess before delivery and for the supervisor to review before wrap-up:
  score this execution against the relay workflow (out of 100) — first decide whether the workflow was
  followed, then whether it reaches {PASS_SCORE}. If the workflow was not followed, force a return to the
  workflow and re-run from the missing step; if it was followed but falls below the threshold, trigger an
  optimization re-run until it passes. This is relay's backstop gate.
---

# 流程评分与门禁（relay 兜底机制）· Workflow Scoring and Gate (relay's Backstop Mechanism)

一句话：**先问“有没有按 relay 流程走”，再问“走得好不好（分数）”。前者是硬门禁，后者决定是否重跑。**

In one sentence: **first ask "was the relay workflow followed," then ask "how well was it done (the score)." The former is a hard gate; the latter decides whether to re-run.**

## 适用角色 · Applicable Roles
- 全部助手：交付 / 回报前对自己这一环做**自评**。
- 主管：收尾、汇总给用户前做**整体复核**，并决定放行或打回重跑。

- All assistants: do a **self-assessment** of your own link before delivering / reporting.
- Supervisor: do an **overall review** before wrap-up and before summarizing to the user, and decide whether to pass it through or send it back for a re-run.

## 触发条件（满足任一）· Triggers (any one)
- 任一助手准备交付产物或回报结果前。
- 主管收到下游回报、准备汇总给用户前。
- 用户说「打分」「按流程检查」「复核一下流程」「这次走得合不合规」。
- 调用 MCP `relay_score` 或 CLI `relay score`。

- Before any assistant is about to deliver an artifact or report a result.
- Before the supervisor, having received a downstream report, is about to summarize to the user.
- The user says "score it," "check against the workflow," "review the workflow," or "was this run compliant."
- Calling the MCP `relay_score` or the CLI `relay score`.

## 输入 · Inputs
- 用户原话（带时间）与**最新需求**。
- 实际执行留痕：派单记录、用例稿（md+json+可视化）、评审意见、造数记录、执行证据、报告链接、缺陷单号、通知消息、口径台账。
- 评分卡 `{SCORECARD}`（默认 `templates/scorecard.md`）与阈值 `{PASS_SCORE}`（默认 80）。

- The user's exact words (with timestamp) and the **latest requirement**.
- The actual execution trail: dispatch records, draft test cases (md+json+visualization), review comments, test-data-build records, execution evidence, report links, defect ticket numbers, notification messages, and the criteria ledger.
- The scorecard `{SCORECARD}` (default `templates/scorecard.md`) and the threshold `{PASS_SCORE}` (default 80).

## 分步流程 · Step-by-Step Process

### 1. 流程符合性检查（硬门禁，先于打分）· Workflow Conformance Check (hard gate, before scoring)
逐项核对关键环节是否**存在且顺序正确**：
1. 主管拆分 + 派单**带用户原话与时间**。
2. 用例稿三件套（md + json + 可视化稿）→ **评审通过后**才落库。
3. 造数**优先调用** `{DATA_FACTORY_PROJECT}`，用完配置改回。
4. 执行**逐条证据**、无头优先、**按最新需求判定**。
5. 结论进**在线报告**，编号在**聊天 / 报告 / 缺陷系统三处同步**。
6. 不符合最新需求的问题 → **提单 + 通知**。
7. **安全红线**全程无触碰（凭证不入代码/库、脱敏、授权才提交部署）。

Verify item by item that the key steps **exist and are in the correct order**:
1. The supervisor's split + dispatch **carries the user's exact words and the time**.
2. The three-part draft test cases (md + json + visualized draft) → filed into the system **only after review approval**.
3. Test-data building **preferably calls** `{DATA_FACTORY_PROJECT}`, and the config is changed back when done.
4. Execution has **per-item evidence**, prefers headless, and **judges by the latest requirement**.
5. Conclusions go into the **online report**, with IDs **synced across all three places: chat / report / the defect system**.
6. Issues not conforming to the latest requirement → **file a ticket + notify**.
7. **Security red lines** are untouched throughout (credentials never enter code/the repo, data is masked, deployment is submitted only with authorization).

判定：
- 若 `{ENFORCE_FLOW}` 为 true，**只要有关键环节缺失或乱序 → 判「未按流程」→ 不进入打分，直接从缺失环节起按 relay 流程强制重走**，走完回到第 1 步重检。
- 全部关键环节齐全且顺序正确 → 进入第 2 步打分。

Decision:
- If `{ENFORCE_FLOW}` is true, **whenever a key step is missing or out of order → judge it "workflow not followed" → do not proceed to scoring; force a re-run along the relay workflow starting from the missing step**, and after completing it, return to Step 1 to re-check.
- All key steps present and in correct order → proceed to scoring in Step 2.

### 2. 打分（按评分卡逐项给分，合计满分 100）· Scoring (score each item on the scorecard, 100 total)
打开 `{SCORECARD}`，对每个维度：按「满分 / 半分 / 0 分」标准给分，并写**一行依据**（指向具体留痕）。加总得到总分。

Open `{SCORECARD}`, and for each dimension: score it by the "full / half / zero" standard and write **one line of justification** (pointing to concrete evidence in the trail). Sum to get the total score.

### 3. 判定与门禁 · Decision and Gate
- 总分 **≥ `{PASS_SCORE}`** → **通过**，可交付 / 汇总。
- 总分 **< `{PASS_SCORE}`** → **不通过**：
  1. 列出所有扣分项及原因。
  2. 按 `self-improvement` 为每个扣分项产出**具体优化动作**（不是只补分数）。
  3. **重跑对应环节**（不是重走全部，只补短板环节）。
  4. 重新打分。记为第 k 轮。
  5. 循环直到 ≥ `{PASS_SCORE}`；或达到 `{MAX_OPTIMIZE_ROUNDS}` 轮 / 连续两轮分数不再提升 → **升级主管或用户**，附扣分项与已尝试的优化。

- Total score **≥ `{PASS_SCORE}`** → **pass**; may deliver / summarize.
- Total score **< `{PASS_SCORE}`** → **fail**:
  1. List all deducted items and their reasons.
  2. Per `self-improvement`, produce a **concrete optimization action** for each deducted item (not merely bumping the score).
  3. **Re-run the corresponding step** (not the whole thing — only fix the weak-link step).
  4. Re-score. Record it as round k.
  5. Loop until ≥ `{PASS_SCORE}`; or upon reaching `{MAX_OPTIMIZE_ROUNDS}` rounds / two consecutive rounds with no further improvement → **escalate to the supervisor or the user**, attaching the deducted items and the optimizations already attempted.

### 4. 记录 · Record
把每轮评分写进口径台账或报告尾部：`轮次 · 流程符合(是/否) · 总分 · 扣分项 · 优化动作`。

Write each round's scoring into the criteria ledger or the end of the report: `轮次 · 流程符合(是/否) · 总分 · 扣分项 · 优化动作` (round · workflow conformance (yes/no) · total score · deducted items · optimization actions).

## 判定规则 · Decision Rules
- **流程符合性优先于分数**：没按流程走，分数再高也不放行。
- 阈值以 `{PASS_SCORE}` 为准，用户可临时指定其它分数。
- 本分数只评估「本次是否遵循 relay 流程」，**不替代测试结论本身**（通过/不通过仍由执行证据决定）。

- **Workflow conformance takes priority over the score**: if the workflow was not followed, do not pass it through no matter how high the score.
- The threshold follows `{PASS_SCORE}`; the user may specify a different score temporarily.
- This score only assesses "whether this run followed the relay workflow"; it **does not replace the test conclusion itself** (pass/fail is still decided by execution evidence).

## 产出模板 · Output Template
`{SCORECARD}` 的评分表 + 一行结论：
```text
流程：符合 / 不符合（缺失环节：…）
得分：NN / 100（阈值 {PASS_SCORE}）
判定：通过 / 重跑（第 k 轮，待补：…）/ 升级（附扣分项）
```

The `{SCORECARD}` scoring table + a one-line conclusion:
```text
流程：符合 / 不符合（缺失环节：…）
得分：NN / 100（阈值 {PASS_SCORE}）
判定：通过 / 重跑（第 k 轮，待补：…）/ 升级（附扣分项）
```
(Workflow: conforms / does not conform (missing step: …). Score: NN / 100 (threshold {PASS_SCORE}). Decision: pass / re-run (round k, to fix: …) / escalate (with deducted items).)

## 交接对象 · Handoff Parties
上游：各助手自评 → 主管复核。下游：不通过时打回对应执行助手重跑；升级时交主管 / 用户。

Upstream: each assistant self-assesses → the supervisor reviews. Downstream: on a fail, send it back to the corresponding executing assistant for a re-run; on escalation, hand it to the supervisor / the user.

## 禁止项 · Prohibited
- 未按流程却直接打分放行。
- 分数不达标仍交付或汇总给用户。
- 重跑时只改分数、不做实际优化动作。
- 把「流程分」当成测试通过率或质量结论。

- Scoring and passing something through directly when the workflow was not followed.
- Delivering or summarizing to the user even though the score does not meet the bar.
- Changing only the score on a re-run without taking any actual optimization action.
- Treating the "workflow score" as the test pass rate or a quality conclusion.

## 常见错误 · Common Mistakes
- 只看分数、不先核流程是否真的走了。
- 扣分项笼统（「执行不够好」），没指到具体环节与留痕。
- 达不到阈值就手动抬分而不是重跑。

- Looking only at the score without first verifying whether the workflow was actually followed.
- Vague deducted items ("execution wasn't good enough") that point to no concrete step or evidence.
- Manually raising the score when it falls short of the threshold instead of re-running.

## 自检清单 · Self-Check Checklist
- [ ] 关键环节齐全且顺序正确（否则已强制重走）— Key steps are all present and in correct order (otherwise a forced re-run has been triggered)
- [ ] 每个评分维度有分数 + 一行依据 — Every scoring dimension has a score + one line of justification
- [ ] 总分已与 `{PASS_SCORE}` 比较并给出判定 — The total score has been compared against `{PASS_SCORE}` and a decision given
- [ ] 不达标已触发**针对性**优化并重跑，记录了轮次 — If below the bar, a **targeted** optimization and re-run have been triggered, with the round recorded
- [ ] 评分结果已写入台账 / 报告 — The scoring result has been written into the ledger / report
