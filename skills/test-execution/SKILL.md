---
name: test-execution
description: >-
  测试助手或临时测试助手执行用例、验收需求时使用：无头浏览器/接口优先，必要时有头或借用户已登录浏览器；逐条留证据；按最新需求判定通过/不通过/阻塞/疑似；可测的尽快测完，无争议直接关任务。
  For use when a test assistant or temporary test assistant executes test cases and validates requirements: prefer headless browser/API, use a headed browser or borrow the user's logged-in browser only when necessary; keep evidence for every case; judge pass/fail/blocked/suspected against the latest requirements; finish whatever is testable as fast as possible, and close uncontested tasks directly.
---

# 用例执行与验收 · Test Case Execution and Acceptance

## 适用角色 · Applicable Roles
测试助手、临时测试助手。

Test assistant, temporary test assistant.

## 触发条件 · Trigger Conditions
- 用例已落库（或用户说直接测），需求已在测试环境部署。
- 主管派测、用户点名测某需求。
- 待测任务列表 {MY_TASK_LIST} 里有可测任务。

- Test cases are already persisted (or the user says to test directly), and the requirement is deployed to the test environment.
- The supervisor assigns testing, or the user names a specific requirement to test.
- There are testable tasks in the pending task list {MY_TASK_LIST}.

## 输入 · Inputs
- 落库用例文档 / 用例 json。
- 数据登记表（`test-data-factory`）。
- 口径台账（最新口径、已确认非 bug、本期不测）。
- 账号用途与访问出口（凭证运行时注入）。

- Persisted test case document / test case json.
- Data registry sheet (`test-data-factory`).
- Decisions ledger (latest definitions, confirmed-not-a-bug items, out-of-scope-this-cycle items).
- Account purposes and access egress (credentials injected at runtime).

## 任务来源与顺序 · Task Source and Order
1. 待测对象以 {MY_TASK_LIST}「指派给我」为准。
2. 用户口头点名的需求 / 复测 **优先于列表顺序**。
3. 已造好数据、数据有时效的验证排最前。
4. **可测的需求/任务尽快测完**；量大时请主管扩容并行。

1. The objects to test are determined by the "assigned to me" items in {MY_TASK_LIST}.
2. Requirements / retests the user names verbally **take priority over the list order**.
3. Verifications whose data is already prepared and time-sensitive come first.
4. **Finish whatever requirements/tasks are testable as fast as possible**; when the volume is large, ask the supervisor to scale up for parallel work.

## 分步流程 · Step-by-Step Process

### 1. 环境确认 · Environment Verification
- 确认被测版本已部署：看前端静态资源 `Last-Modified` / 包版本号、后端版本接口或发布记录。
- 记录环境要素：分支/版本、环境、租户、账号用途名与内部 ID、业务单号、视口、时间（{TZ}）。

- Confirm the version under test is deployed: check the frontend static assets' `Last-Modified` / bundle version number, the backend version API, or the release record.
- Record environment details: branch/version, environment, tenant, account purpose name and internal ID, business ticket number, viewport, and time ({TZ}).

### 2. 选执行方式（从上到下）· Choose Execution Method (top to bottom)
1. **接口**：能用接口验证的先用接口（快、稳定、可批量）。
2. **无头浏览器**：页面类默认无头；移动网页用手机视口（如 430×932）。
3. **有头浏览器**：仅在需要演示、或无头无法完成时。
4. **用户已登录的浏览器**：没有账号凭证、只能用用户会话的系统才用；**一个标签页、不批量、不读 Cookie/令牌、不碰其他标签、用完关闭**，不再反复问用户。
- 后台请求只从 {ADMIN_ACCESS_ROUTE} 发出（直连可能被防火墙拦）。
- 后台登录：滑块类验证可由助手自己完成；二步验证码等需要用户的留空或请用户处理；**不猜密码（3 次锁号）**，失效就停，报主管。

1. **API**: Prefer the API for anything that can be verified via API (fast, stable, batchable).
2. **Headless browser**: Headless by default for page-based cases; use a phone viewport (e.g. 430×932) for mobile web.
3. **Headed browser**: Only when a demo is needed, or when headless cannot complete the task.
4. **The user's logged-in browser**: Only for systems with no account credentials, where only the user's session works; **one tab only, no batching, do not read Cookies/tokens, do not touch other tabs, close it when done**, and do not keep asking the user repeatedly.
- Admin/backend requests are sent only from {ADMIN_ACCESS_ROUTE} (a direct connection may be blocked by the firewall).
- Backend login: slider-type verifications may be completed by the assistant itself; two-step verification codes and the like that require the user should be left blank or handed to the user; **do not guess passwords (3 attempts lock the account)**, stop when credentials fail, and report to the supervisor.

### 3. 逐条执行 · Execute Case by Case
- 按用例步骤执行，记录实际结果。
- 每条留证据：截图 `shots/`、接口返回/DOM/文本 `ev/`、缺陷截图 `bugshots/`、SQL `sql/`；文件名带用例号与日期，如 `TC-WEB-ORDER-F-001_20260101_1504.png`。
- 显示类数据有刷新周期的，等过一个周期再判定（台账里有记录的按台账）。
- 定时/跑批类：跑批前后各验一次。

- Execute the test case steps and record the actual result.
- Keep evidence for every case: screenshots in `shots/`, API responses/DOM/text in `ev/`, defect screenshots in `bugshots/`, SQL in `sql/`; file names include the case number and date, e.g. `TC-WEB-ORDER-F-001_20260101_1504.png`.
- For displayed data with a refresh cycle, wait one cycle before judging (follow the ledger when it has a record).
- For scheduled/batch jobs: verify once before and once after the batch run.

### 4. 判定（每条用例）· Judgment (per test case)
| 结果 | 条件 | 后续 |
|---|---|---|
| 通过 | 实际**符合最新需求**（不是符合过时用例） | 记录证据 |
| 不通过 | 实际不符合最新需求，且需求口径明确 | **直接**进 `bug-filing` 提单，不用先问用户 |
| 疑似 | 需求没写清、需要产品口径才能判 | 写进报告开头「疑似问题待确认」编号清单，交用户 |
| 阻塞 | 环境/数据/权限/依赖缺失，无法执行 | 写明原因（如「等高权限账号」「无符合前提的数据」）；需要研发的经通知助手催，同时继续测其他用例 |
| 本期不测 | 台账「本期不测」 | 标灰，不判失败 |
| 已确认非 bug | 台账「已确认非 bug」或用户关单口径 | 记「已确认非 bug／按产品口径」 |

| Result | Condition | Follow-up |
|---|---|---|
| Pass | Actual **matches the latest requirement** (not matching an outdated case) | Record evidence |
| Fail | Actual does not match the latest requirement, and the requirement definition is clear | **Directly** file a ticket via `bug-filing`; no need to ask the user first |
| Suspected | The requirement is unclear and a product definition is needed to judge | Add to the numbered "suspected issues pending confirmation" list at the top of the report, and hand to the user |
| Blocked | Missing environment/data/permission/dependency makes execution impossible | State the reason (e.g. "waiting for a high-privilege account", "no data meeting the preconditions"); for items needing R&D, chase via the notification assistant while continuing to test other cases |
| Out of scope this cycle | Ledger says "out of scope this cycle" | Mark as grayed out, do not judge as failed |
| Confirmed not a bug | Ledger says "confirmed not a bug" or the user's ticket-closing definition | Record "confirmed not a bug / per product definition" |

其他判定规则：

Other judgment rules:
- 用例过时但实际符合最新需求 → 通过，并请测试助手按口径更新用例。
- 已上线或不在测的需求发现问题 → **只记录**进报告/台账，不提单、不通知研发。
- 权限未分配导致看不到数据 → 不是 bug（见 `permission-testing`）。
- 跑批前看不到 T+1 数据 → 不是 bug。
- 不得编造结果；没有记录的写「无记录」。

- Case is outdated but the actual behavior matches the latest requirement → Pass, and ask the test assistant to update the case per the definition.
- A problem found in a requirement already released or not under test → **only record** it in the report/ledger; do not file a ticket and do not notify R&D.
- Not seeing data because permissions are unassigned → not a bug (see `permission-testing`).
- Not seeing T+1 data before the batch run → not a bug.
- Do not fabricate results; write "no record" where there is none.

### 5. 收尾 · Wrap-up
- 恢复所有改过的配置，记录前后值。
- 按 `test-report` 出报告、发布、更新汇总页、把链接交主管。
- **可测任务测完且无争议缺陷** → 交缺陷助手直接关任务，不必再问用户。

- Restore all modified configurations and record the before/after values.
- Produce the report per `test-report`, publish it, update the summary page, and hand the link to the supervisor.
- **When testable tasks are done and the defects are uncontested** → hand off to the defect assistant to close the task directly, without asking the user again.

## 产出 · Deliverables
- 逐条结果（用例 / 优先级 / 标题 / 结果 / 实际 / 证据 / 关联缺陷 / 备注）。
- 不符合需求清单（交提单）、疑似问题清单、阻塞清单。
- 证据目录。

- Per-case results (case / priority / title / result / actual / evidence / linked defect / notes).
- List of non-conformances (handed off for ticket filing), list of suspected issues, list of blockers.
- Evidence directory.

## 交接对象 · Handoff Targets
- 缺陷助手：不符合需求的问题（按 `bug-filing` 格式）、关任务。
- 通知助手（经主管或固定链）：阻塞催研发。
- 编码助手：脚本需求。
- 主管：报告链接与结论。

- Defect assistant: non-conformance issues (in `bug-filing` format), and task closing.
- Notification assistant (via the supervisor or fixed chain): chasing R&D on blockers.
- Coding assistant: script requirements.
- Supervisor: report link and conclusions.

## 禁止项 · Prohibited Actions
- 自己写缺陷系统、发 IM。
- 默认在用户本机开有头浏览器。
- 读 Cookie / 令牌；猜密码。
- 因为用例过时判不通过。
- 只在聊天里给结论不写报告。

- Writing your own defect system or sending IMs.
- Opening a headed browser on the user's machine by default.
- Reading Cookies / tokens; guessing passwords.
- Judging a case as failed just because it is outdated.
- Giving conclusions only in chat without writing a report.

## 常见错误 · Common Mistakes
- 研发标了已部署但前端没更新就判失败 → 先查 `Last-Modified`。
- 刷新类数据刚改完就判 → 等一个刷新周期。
- 后台请求从被拦的出口发 → 改走 {ADMIN_ACCESS_ROUTE}。
- 阻塞时停下整批等 → 应该催的同时继续测其他。

- R&D marked it deployed but the frontend has not updated, and you judge it failed → check `Last-Modified` first.
- Judging refresh-type data right after a change → wait one refresh cycle.
- Sending backend requests from a blocked egress → switch to {ADMIN_ACCESS_ROUTE}.
- Stopping the whole batch to wait when blocked → you should chase while continuing to test the rest.

## 自检清单 · Self-Check Checklist
- [ ] 版本已确认部署 — Deployment of the version confirmed
- [ ] 每条有结果与证据 — Every case has a result and evidence
- [ ] 判定依据是最新需求 — Judgment is based on the latest requirements
- [ ] 不符合的已交提单，疑似的已编号 — Non-conformances filed as tickets, suspected issues numbered
- [ ] 配置已恢复 — Configurations restored
- [ ] 报告已发布、链接已交 — Report published and link handed off
