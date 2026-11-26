---
name: parallel-helper-scale-out
description: 测试助手忙不过来、同时有多个批次、用户要求测得快、已造好的数据需要尽快验证时，由主管为单个批次新建临时测试助手（TestHelper-YYYYMMDD-n）并行执行，批次结束请用户删除。 / When the test assistant is overloaded, there are multiple batches at once, the user asks to test faster, or already-built data needs validation soon, the supervisor spins up temporary test assistants (TestHelper-YYYYMMDD-n) for a single batch to run in parallel, and asks the user to delete them once the batch ends.
---

# 临时测试助手并行扩容 · Temporary Test Assistant Parallel Scale-Out

## 适用角色 · Applicable Roles
- **主管**：判断是否扩容、创建、派单、回收。
- **临时测试助手**：按本技能的权限边界工作。
- **测试助手**：接收临时助手回报，统一更新汇总页与发布。

- **Supervisor**: decide whether to scale out, create, dispatch, and reclaim.
- **Temporary test assistant**: work within the permission boundaries of this skill.
- **Test assistant**: receive the temporary assistants' reports and centrally update the summary index page and publish.

## 触发条件（满足任一即可扩容）· Triggers (scale out if any one is met)
1. 测试助手已有在测批次，又来新批次，排队会拖过当天。
2. 单批用例量大（参考：一个人当天跑不完），可按模块/端拆成多块并行。
3. 用户要求「测得快」「并发测」。
4. 已造好的测试数据有时效（会过期、会被跑批改状态、会被别人用掉），需要立刻验证。
5. 需要同时覆盖多台真机、多个账号角色、多个环境，且流程相同。
6. 一批缺陷复测数量多，可按研发或模块拆。

1. The test assistant already has a batch under test and another batch arrives, and queuing would drag past the end of the day.
2. A single batch has a large number of cases (rule of thumb: one person cannot finish them in a day), which can be split by module/platform into several chunks run in parallel.
3. The user asks to "test it faster" or "test it concurrently."
4. Already-built test data has a shelf life (it will expire, have its state changed by a batch job, or be used up by someone else) and needs immediate validation.
5. Multiple real devices, multiple account roles, or multiple environments must be covered at once, with the same flow.
6. A batch of defect re-tests is large and can be split by developer or by module.

> 不扩容的情况：任务需要写缺陷系统 / 发 IM / 写代码为主；或批次很小、测试助手当天能完成。

> When not to scale out: the task is primarily writing to the defect system / sending IMs / writing code; or the batch is small and the test assistant can finish it that day.

## 输入 · Inputs
- 批次范围（需求名称、模块、用例编号区间、待复测单号列表）。
- 用户原话与时间（作为授权依据）。
- 可用数据与账号用途（账号凭证在 {SECRET_VAULT}，运行时注入）。
- 当前已存在的临时助手清单（避免重名、避免超过 {MAX_PARALLEL_HELPERS}）。

- Batch scope (requirement name, module, test-case ID range, list of ticket numbers to re-test).
- The user's exact words and the time (as the authorization basis).
- Available data and account purposes (account credentials live in {SECRET_VAULT}, injected at runtime).
- The list of temporary assistants that already exist (to avoid name collisions and to avoid exceeding {MAX_PARALLEL_HELPERS}).

## 分步流程（主管）· Step-by-Step Process (Supervisor)
1. **拆块**：按「互不依赖、数据不冲突」拆：不同模块、不同端、不同角色账号、不同真机、不同研发的复测单。两个临时助手**不要共用同一批会改状态的数据**。
2. **命名**：`TestHelper-YYYYMMDD-n`（日期为创建日，n 当天从 1 递增）。
3. **创建**：用下方 profile 模板写清职责与禁止项；容量不足可**一次并行拉起多个**。
4. **派单**：用 `templates/handoff-messages.md` §1，额外写明「你的块」「不要碰的块」「回报给主管和测试助手」。
5. **跟进**：每个临时助手每完成一条就回报；阻塞的立刻上报，主管决定改派或等待。
6. **合并**：测试助手把各临时助手的结果合进同一份需求报告与汇总页（临时助手不改汇总页）。
7. **回收**：批次结束 → 主管提醒用户在侧栏删除，列出名称；不保留「僵尸助手」。联系不上的临时助手标「不再派活」。

1. **Chunk the work**: split by "mutually independent, no data conflict" — different modules, different platforms, different role accounts, different real devices, re-test tickets from different developers. Two temporary assistants **must not share the same batch of state-changing data**.
2. **Naming**: `TestHelper-YYYYMMDD-n` (the date is the creation day; n increments from 1 within that day).
3. **Create**: use the profile template below to spell out responsibilities and prohibitions; when capacity is short, you may **spin up several in parallel at once**.
4. **Dispatch**: use `templates/handoff-messages.md` §1, additionally spelling out "your chunk," "the chunk not to touch," and "report to the supervisor and the test assistant."
5. **Follow up**: each temporary assistant reports after completing each item; blockers are escalated immediately, and the supervisor decides whether to re-assign or wait.
6. **Merge**: the test assistant merges each temporary assistant's results into a single requirement report and the summary index page (temporary assistants do not edit the summary page).
7. **Reclaim**: batch ends → the supervisor reminds the user to delete them in the sidebar, listing the names; do not leave "zombie assistants." Temporary assistants that cannot be reached are marked "no longer assign work."

## 临时助手权限 · Temporary Assistant Permissions

| 可以做 | 禁止做 |
|---|---|
| 读需求、写用例稿（交测试助手并入） | 写缺陷系统（建/改/关单、任务、文档） |
| 造数执行与造数验证（调用 {DATA_FACTORY_PROJECT}、模拟接口） | 发 IM、写知识库 |
| 执行 / 验收（默认无头） | 写代码、commit、push、写批量脚本 |
| bug 复测并给出结论稿 | 修改汇总页 |
| 出该块的报告稿 | 登录只限测试助手使用的专属高权限账号 |
| | 写共用令牌文件、运行管理员登录脚本 |
| | 私信研发；把疑似问题直接提单 |
| | 在用户本机打开有头浏览器（除非主管明确要求） |

| May do | Must not do |
|---|---|
| Read requirements, write draft test cases (handed to the test assistant to merge) | Write to the defect system (create/modify/close tickets, tasks, documents) |
| Build and validate test data (call {DATA_FACTORY_PROJECT}, mock interfaces) | Send IMs, write to the knowledge base |
| Execute / accept (headless by default) | Write code, commit, push, write batch scripts |
| Re-test bugs and produce a draft conclusion | Modify the summary index page |
| Produce the draft report for that chunk | Log in to the high-privilege account reserved for the test assistant only |
| | Write to the shared token file, run the admin login script |
| | DM developers; file suspected issues as tickets directly |
| | Open a headed browser on the user's local machine (unless the supervisor explicitly requires it) |

问题处理：不符合最新需求的列清单交测试助手 → 缺陷助手提单；拿不准的写进报告「疑似问题待确认」。

Issue handling: list items that do not conform to the latest requirement and hand them to the test assistant → the defect assistant files tickets; for anything uncertain, write it into the report as "suspected issue pending confirmation."

## Profile 模板（创建时粘贴）· Profile Template (paste when creating)
```text
临时测试执行助手 TestHelper-YYYYMMDD-n，由主管为单个测试批次新建。
只做：读需求、写用例稿、造数执行/验收、bug 复测、出本块报告稿，结果回报主管与测试助手。
禁止：写缺陷系统、发 IM、写知识库、写代码/commit/push、改汇总页、登录专属高权限账号、写共用令牌文件、运行管理员登录脚本、私信研发。
安全：凭证运行时注入，不打印不落盘；不读 Cookie；不猜密码；默认无头；后台只从 {ADMIN_ACCESS_ROUTE} 访问。
判定：按最新需求，符合即通过；不符合列清单交测试助手提单；拿不准写「疑似问题待确认」。
数据：优先复用现有租户/账号；改配置先记原值、验证完马上改回。
批次结束请用户在侧栏删除。
```

```text
临时测试执行助手 TestHelper-YYYYMMDD-n，由主管为单个测试批次新建。
只做：读需求、写用例稿、造数执行/验收、bug 复测、出本块报告稿，结果回报主管与测试助手。
禁止：写缺陷系统、发 IM、写知识库、写代码/commit/push、改汇总页、登录专属高权限账号、写共用令牌文件、运行管理员登录脚本、私信研发。
安全：凭证运行时注入，不打印不落盘；不读 Cookie；不猜密码；默认无头；后台只从 {ADMIN_ACCESS_ROUTE} 访问。
判定：按最新需求，符合即通过；不符合列清单交测试助手提单；拿不准写「疑似问题待确认」。
数据：优先复用现有租户/账号；改配置先记原值、验证完马上改回。
批次结束请用户在侧栏删除。
```
(Temporary test-execution assistant TestHelper-YYYYMMDD-n, created by the supervisor for a single test batch.
Only do: read requirements, write draft test cases, build/accept test data, re-test bugs, produce the draft report for this chunk, and report results to the supervisor and the test assistant.
Prohibited: writing to the defect system, sending IMs, writing to the knowledge base, writing code/commit/push, editing the summary index page, logging in to the reserved high-privilege account, writing to the shared token file, running the admin login script, DMing developers.
Security: credentials are injected at runtime, never printed or written to disk; do not read Cookies; do not guess passwords; headless by default; the backend is accessed only via {ADMIN_ACCESS_ROUTE}.
Decisions: judge by the latest requirement — conforming means pass; list non-conforming items and hand them to the test assistant to file tickets; write anything uncertain as "suspected issue pending confirmation."
Data: prefer reusing existing tenants/accounts; when changing a config, record the original value first and change it back immediately after validation.
When the batch ends, ask the user to delete it in the sidebar.)

## 回报模板（临时助手 → 主管 + 测试助手）· Report Template (temporary assistant → supervisor + test assistant)
```text
块：<需求名称> / <模块或单号范围>
结论：通过 a / 不通过 b / 阻塞 c / 未执行 d
报告稿：<路径或链接>
不符合需求（待提单）：1. 标题｜步骤｜实际｜预期｜证据路径
疑似问题待确认：1. …
复测结论：#单号 通过 / 不通过（过程与数据）/ 阻塞（原因）
数据：用到的账号用途、业务单号、配置原值与恢复情况
```

```text
块：<需求名称> / <模块或单号范围>
结论：通过 a / 不通过 b / 阻塞 c / 未执行 d
报告稿：<路径或链接>
不符合需求（待提单）：1. 标题｜步骤｜实际｜预期｜证据路径
疑似问题待确认：1. …
复测结论：#单号 通过 / 不通过（过程与数据）/ 阻塞（原因）
数据：用到的账号用途、业务单号、配置原值与恢复情况
```
(Chunk: <requirement name> / <module or ticket-number range>. Conclusion: passed a / failed b / blocked c / not executed d. Draft report: <path or link>. Non-conforming (to be filed): 1. title | steps | actual | expected | evidence path. Suspected issues pending confirmation: 1. …. Re-test conclusion: #ticket passed / failed (process and data) / blocked (reason). Data: account purposes used, business ticket numbers, original config values and their restoration status.)

## 判定规则 · Decision Rules
- 扩容判断以「不让测试排队」为原则，宁可多开不让用户等。
- 并行块之间数据隔离；共享配置的用例放同一块串行做。
- 同一需求只出一份最终报告（由测试助手合并）。

- The scale-out decision follows the principle of "no queuing for testing"; prefer opening more rather than making the user wait.
- Isolate data between parallel chunks; put cases that share a config into the same chunk and run them serially.
- Produce only one final report per requirement (merged by the test assistant).

## 交接对象 · Handoff Parties
主管（上游与回收）、测试助手（结果合并、汇总页）、缺陷助手（经测试助手提单）。

The supervisor (upstream and reclamation), the test assistant (result merge, summary index page), the defect assistant (filing tickets via the test assistant).

## 禁止项 · Prohibited
- 临时助手做任何外部写操作。
- 多个临时助手同时改汇总页或同一份报告。
- 批次结束不回收。
- 新建「常驻」助手绕过主管或与现有职责重叠。

- Temporary assistants performing any external write operation.
- Multiple temporary assistants editing the summary index page or the same report at the same time.
- Failing to reclaim after the batch ends.
- Creating a "permanent" assistant that bypasses the supervisor or overlaps with existing responsibilities.

## 常见错误 · Common Mistakes
- 两个临时助手用同一账号同时改配置 → 互相污染结果。
- 临时助手直接私信研发 → 违反唯一出口。
- 忘记提醒用户删除 → 名册越来越乱。

- Two temporary assistants changing a config with the same account at the same time → they contaminate each other's results.
- A temporary assistant DMing a developer directly → violates the single-exit rule.
- Forgetting to remind the user to delete → the roster grows messier and messier.

## 自检清单 · Self-Check Checklist
- [ ] 命名符合 `TestHelper-YYYYMMDD-n` — Naming follows `TestHelper-YYYYMMDD-n`
- [ ] 每个块数据隔离、范围不重叠 — Each chunk has isolated data and non-overlapping scope
- [ ] Profile 写了禁止项 — The profile spells out the prohibitions
- [ ] 结果已由测试助手合并进报告与汇总页 — Results have been merged by the test assistant into the report and the summary index page
- [ ] 批次结束已提醒用户删除 — The user has been reminded to delete once the batch ended
