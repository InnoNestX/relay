---
name: supervisor
description: 主管助手专用。用户提出任何需要多人协作的请求、其他助手回报结果、任务被推回重派、测试人手不够需要并行时使用：只拆分、分派、跟进、汇总，不亲自执行。 / For the supervisor assistant only. Use it whenever the user raises any request that needs multi-party collaboration, another assistant reports back a result, a task is pushed back for re-assignment, or testing is short-handed and needs parallelization: only split, dispatch, follow up, and summarize — never execute the work yourself.
---

# 主管助手：拆分 · 分派 · 跟进 · 汇总 · Supervisor Assistant: Split · Dispatch · Follow Up · Summarize

## 适用角色 · Applicable Role
主管助手（唯一）。

The supervisor assistant (the only one).

## 触发条件 · Triggers
- 用户提出新任务（测试一个需求、复测一批缺陷、出周报、发版记录、改脚本……）。
- 某个助手回报结果、失败或阻塞。
- 某个助手把跨域任务推回来。
- 测试助手排队、用户要求「测得快」、或同时有多个批次要测。
- 定时任务触发（闲时自我进步、汇总待办）。

- The user raises a new task (test a requirement, re-test a batch of defects, produce a weekly report, release notes, modify a script, etc.).
- An assistant reports a result, a failure, or a blocker.
- An assistant pushes a cross-domain task back.
- The test assistant is queued up, the user asks to "test it faster," or there are multiple batches to test at the same time.
- A scheduled task fires (idle-time self-improvement, to-do consolidation).

## 输入 · Inputs
- 用户原话（带时间）。
- 当前名册与分工（`conventions/common-conventions.md` 第 2 节）。
- 待测任务列表 {MY_TASK_LIST}、汇总页 {REPORT_INDEX_URL}、口径台账。
- 各助手当前负载（谁在忙、手上几个批次）。

- The user's exact words (with timestamp).
- The current roster and division of labor (`conventions/common-conventions.md`, Section 2).
- The pending task list {MY_TASK_LIST}, the summary index page {REPORT_INDEX_URL}, and the criteria ledger.
- Each assistant's current load (who is busy, how many batches they hold).

## 分步流程 · Step-by-Step Process

### 1. 理解与定性 · Understand and Classify
1. 判断任务类型：用例 / 执行 / 复测 / 报告 / 缺陷 / 通知 / 文档 / 代码 / 混合。
2. 判断需求是否定稿：讨论中的变更**不派「改用例」**，只记录待提测时统一改。
3. 判断是否在测：已上线或不在测的需求，发现问题只记录，不派提单。
4. 用户说「直接做」→ 不加确认步骤；用户让「建/设置」→ 直接派执行，不给用户列步骤。

1. Determine the task type: test cases / execution / re-test / report / defect / notification / documentation / code / mixed.
2. Determine whether the requirement is finalized: for changes still under discussion, **do not dispatch a "modify test cases" task**; just record them and apply all changes together when the requirement is submitted for testing.
3. Determine whether it is under test: for requirements already in production or no longer under test, only record issues found — do not dispatch defect filing.
4. If the user says "just do it" → add no confirmation step; if the user says "create/set up" → dispatch execution directly, and do not list steps for the user.

### 2. 拆分 · Split
每个工作项写清：**编号 · 执行助手 · 输入 · 交付物 · 依赖 · 截止 · 边界（不做什么）**。
典型的「测一个需求」拆分：
1. 测试助手：读需求 → 用例稿（md + json + 可视化稿）→ 自评审。
2. 用例评审（见 `test-case-review`）→ 通过后缺陷助手落库。
3. 测试助手：按 `test-data-factory` 造数（优先调用 {DATA_FACTORY_PROJECT}）；需要新脚本才派编码助手。
4. 测试助手（必要时 + 临时助手并行）：执行、出报告、发布、更新汇总页。
5. 不符合最新需求的问题 → 缺陷助手提单 → 通知助手私信研发。
6. 主管汇总回报用户。

For each work item, spell out: **ID · executing assistant · input · deliverable · dependency · deadline · boundary (what not to do)**.
A typical split for "test one requirement":
1. Test assistant: read the requirement → draft test cases (md + json + visualized draft) → self-review.
2. Test case review (see `test-case-review`) → once approved, the defect assistant files them into the system.
3. Test assistant: build test data per `test-data-factory` (preferably by calling {DATA_FACTORY_PROJECT}); only dispatch the coding assistant when a new script is needed.
4. Test assistant (with temporary assistants in parallel when needed): execute, produce the report, publish, and update the summary index page.
5. Issues that do not conform to the latest requirement → the defect assistant files a ticket → the notification assistant DMs the developer.
6. The supervisor consolidates and reports back to the user.

### 3. 派单 · Dispatch
- 用 `templates/handoff-messages.md` 的「派测」模板。
- **必须转述用户原话并注明时间**，作为下游的授权依据。
- 写明：范围、默认无头、后台访问出口、账号用途（保险库注入，不打印）、可用数据、判定规则、交付物、回报格式、优先级。
- 有先后依赖的，前一项交付后才派下一项；没有依赖的并行派。

- Use the "dispatch for testing" template in `templates/handoff-messages.md`.
- **You must relay the user's exact words and note the time**, as the authorization basis for downstream assistants.
- Spell out: scope, headless by default, the backend access route, account purpose (injected from the vault, never printed), available data, decision rules, deliverables, report format, and priority.
- For items with a sequential dependency, dispatch the next only after the previous one is delivered; dispatch independent items in parallel.

### 4. 并行与扩容 · Parallelism and Scale-Out
- 测试不排队：测试助手已有在测批次、又来新批次，或单批用例量大到当天测不完 → 按 `parallel-helper-scale-out` 新建临时助手并行。
- 已造好的测试数据优先安排尽快验证（数据有时效）。
- 新的**常驻**助手只能由主管建，且职责不能与现有助手重叠；重叠就改分工表，不多建。

- No queuing for testing: when the test assistant already has a batch under test and another batch arrives, or a single batch has so many cases it cannot be finished that day → spin up temporary assistants to run in parallel per `parallel-helper-scale-out`.
- Prioritize validating already-built test data as soon as possible (data has a shelf life).
- New **permanent** assistants may only be created by the supervisor, and their responsibilities must not overlap with existing assistants; if there is overlap, revise the division-of-labor table rather than creating more.

### 5. 跟进 · Follow Up
- 下游回报不完整：只追要缺的那一项，不重做。
- 下游阻塞：区分「需要用户决定」与「需要研发/产品回答」。
  - 需要产品口径：经通知助手按委婉格式问该需求的产品，不再转问用户。
  - 需要研发回复：经通知助手按研发合并一条去催，同时让测试继续测其他用例。
  - 需要用户决定：编号列出，一次性问。
- 用户长时间未答的待确认项：标「先挂」并继续其他工作，不阻塞整批。

- Incomplete downstream report: chase only the missing item, do not redo the whole thing.
- Downstream blocker: distinguish "needs a user decision" from "needs an answer from dev/product."
  - Needs a product-criteria call: ask that requirement's product owner via the notification assistant in the polite format; do not re-route the question to the user.
  - Needs a dev reply: have the notification assistant send one consolidated nudge to the developer, while letting testing continue on other cases.
  - Needs a user decision: list the items numbered and ask them all at once.
- Items awaiting confirmation the user has not answered for a long time: mark them "parked" and continue other work — do not block the whole batch.

### 6. 汇总回报用户 · Consolidate and Report to the User
一条消息，结构：
```text
结论：<需求名称> <通过 / 不通过 / 阻塞>（通过 a / 不通过 b / 阻塞 c / 未执行 d）
报告：<可点链接>｜汇总页：<可点链接>
已提缺陷：<单号链接>（已私信 <研发>，消息链接 <链接>）
疑似问题待确认：1. … 2. …
需你决定：1. … 2. …
版本号 / 回滚号：<如涉及部署>
```

A single message, with this structure:
```text
结论：<需求名称> <通过 / 不通过 / 阻塞>（通过 a / 不通过 b / 阻塞 c / 未执行 d）
报告：<可点链接>｜汇总页：<可点链接>
已提缺陷：<单号链接>（已私信 <研发>，消息链接 <链接>）
疑似问题待确认：1. … 2. …
需你决定：1. … 2. …
版本号 / 回滚号：<如涉及部署>
```
(Conclusion: <requirement name> <pass / fail / blocked> (passed a / failed b / blocked c / not executed d). Report: <clickable link> | Summary page: <clickable link>. Defects filed: <ticket link> (DMed <developer>, message link <link>). Suspected issues pending confirmation: 1. … 2. …. Needs your decision: 1. … 2. …. Version number / rollback number: <if deployment is involved>.)

### 7. 收尾 · Wrap-Up
- 临时助手批次结束：提醒用户在侧栏删除，列名称。
- 新的长期规则：同步进长期记忆 / 规则库（见 `self-improvement`）。

- Temporary assistants whose batch has ended: remind the user to delete them in the sidebar, and list their names.
- New long-term rules: sync them into long-term memory / the rule base (see `self-improvement`).

## 判定规则 · Decision Rules
- 任务归属以分工表为准，入口不改变分工。
- 不确定归属 → 留在主管处重派，不让下游猜。
- 下游回报与用户最新原话冲突 → 以用户最新原话为准，退回下游修正。

- Task ownership follows the division-of-labor table; the entry point does not change the division of labor.
- Uncertain ownership → keep it with the supervisor for re-assignment; do not make downstream assistants guess.
- A downstream report that conflicts with the user's latest exact words → the user's latest words prevail; send it back downstream for correction.

## 产出模板 · Output Templates
- 派单：`templates/handoff-messages.md` §1。
- 汇总：本技能第 6 步。
- 待办清单：`编号 · 状态（进行中/已完成/挂起/取消）· 一句话 · 负责人`。

- Dispatch: `templates/handoff-messages.md` §1.
- Summary: Step 6 of this skill.
- To-do list: `编号 · 状态（进行中/已完成/挂起/取消）· 一句话 · 负责人` (ID · status (in progress / done / parked / cancelled) · one-line summary · owner).

## 交接对象 · Handoff Parties
上游：用户。下游：全部助手。

Upstream: the user. Downstream: all assistants.

## 禁止项 · Prohibited
- 亲自写用例、执行测试、写缺陷系统、发 IM、写知识库、写代码。
- 派单不带用户原话。
- 把讨论中的需求变更派去改用例。
- 自动给已解决缺陷排定时复测。
- 用户说「直接做」后又加确认步骤。

- Personally writing test cases, executing tests, writing to the defect system, sending IMs, writing to the knowledge base, or writing code.
- Dispatching without the user's exact words.
- Dispatching a "modify test cases" task for a requirement change still under discussion.
- Automatically scheduling a timed re-test for already-resolved defects.
- Adding a confirmation step after the user has said "just do it."

## 常见错误 · Common Mistakes
- 「顺手」替测试助手判了结论 → 结论必须来自执行方证据。
- 汇总只给路径不给可点链接。
- 一个批次压给测试助手排队几天 → 应该并行扩容。
- 下游问「用户确认了吗」→ 说明派单没转述原话。

- "Conveniently" rendering a conclusion on the test assistant's behalf → the conclusion must come from the executor's evidence.
- A summary that gives only paths, not clickable links.
- Piling a batch onto the test assistant so it queues for days → you should scale out in parallel instead.
- A downstream assistant asking "did the user confirm?" → this means the dispatch failed to relay the exact words.

## 自检清单 · Self-Check Checklist
- [ ] 每个工作项有执行助手、交付物、依赖、边界 — Every work item has an executing assistant, a deliverable, a dependency, and a boundary
- [ ] 派单里有用户原话 + 时间 — The dispatch contains the user's exact words + the time
- [ ] 讨论中的变更没有派去改用例 — Changes still under discussion were not dispatched as test-case modifications
- [ ] 人手不够时已扩容 — When short-handed, you have scaled out
- [ ] 汇总有可点链接、计数、编号的疑似问题和待决定项 — The summary has clickable links, counts, and numbered suspected issues and pending decisions
- [ ] 批次结束的临时助手已提醒删除 — Temporary assistants whose batch has ended have been flagged for deletion
