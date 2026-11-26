---
name: test-report
description: >-
  测试助手出测试报告、发布报告站、维护汇总页时使用：在线可打开的自包含报告，开头是编号的疑似问题清单，编号与聊天和缺陷系统三处同步，证据可点击，测完的需求从汇总页移除并归档。
  Use when the test assistant produces a test report, publishes the report site, or maintains the summary page: a self-contained report openable online, starting with a numbered list of suspected issues whose numbers stay synchronized across chat and the defect system, with clickable evidence; once a requirement is fully tested, remove it from the summary page and archive it.
---

# 测试报告、发布与汇总页 · Test Report, Publishing, and Summary Page

## 适用角色 · Applicable Roles
- 测试助手：写报告、发布、**唯一维护汇总页**。
- 临时测试助手：写本块报告稿，交测试助手合并（不改汇总页）。

- Test assistant: writes the report, publishes it, and is the **sole maintainer of the summary page**.
- Temporary test assistant: writes the draft of their own report block and hands it to the test assistant to merge (does not edit the summary page).

## 触发条件 · Triggers
- 一个需求 / 一批用例执行完成（或阶段性完成）。
- 提单拿到单号、缺陷状态变化、用户手动关单、复测有结论。
- 用户说某需求「已上线」/ 测试完成。

- A requirement / a batch of test cases finishes execution (or reaches a phase milestone).
- A bug is filed and gets a ticket number, a defect status changes, the user manually closes a ticket, or a retest reaches a conclusion.
- The user says a requirement is "live" / testing is complete.

## 输入 · Inputs
- 逐条执行结果与证据目录。
- 缺陷单号与状态（缺陷助手回报）。
- 口径台账、数据登记表。

- Per-item execution results and the evidence directory.
- Defect ticket numbers and statuses (reported back by the defect assistant).
- The rules/interpretation ledger and the data registry.

## 报告结构（从上到下，所有报告统一）· Report Structure (top to bottom, uniform across all reports)
1. **标题**：`<需求名称> 验收报告`。
2. **元信息**：用例文档链接、需求链接、任务链接、生成时间（{TZ}）、环境与版本。
3. **统计与结论**：通过 / 不通过 / 阻塞 / 未执行 计数；结论（通过 / 不通过 / 阻塞原因）。
4. **疑似问题待确认**：编号 1、2、3…（**与聊天一致**）；每条写现象、证据、是否已确认、单号/状态；没有就写「无」。
5. **待确认项**（口径问题）。
6. **逐条结果表**：用例 / 优先级 / 标题 / 结果 / 实际 / 证据 / 关联缺陷（链接 + 状态）/ 备注。
7. **缺陷表**：单号（链接）/ 用例 / 标题 / 状态 / 指派。
8. **造数与数据说明**：账号用途、租户、业务单号、配置原值与恢复情况、SQL（只读）。
9. **复测记录**（如有）：日期、结论、数据。
10. **方法与恢复记录**（App/性能类必有，日志压缩包挂这里）。

1. **Title**: `<requirement name> Acceptance Report`.
2. **Metadata**: test-case document link, requirement link, task link, generation time ({TZ}), environment and version.
3. **Statistics and conclusion**: counts of pass / fail / blocked / not executed; conclusion (pass / fail / blocking reason).
4. **Suspected issues pending confirmation**: numbered 1, 2, 3… (**consistent with chat**); for each, record the symptom, evidence, whether confirmed, and ticket number/status; if none, write "None".
5. **Items pending confirmation** (rules/interpretation questions).
6. **Per-item result table**: test case / priority / title / result / actual / evidence / linked defect (link + status) / notes.
7. **Defect table**: ticket number (link) / test case / title / status / assignee.
8. **Data setup and data notes**: account purpose, tenant, business order number, original config values and restoration status, SQL (read-only).
9. **Retest records** (if any): date, conclusion, data.
10. **Method and restoration records** (mandatory for App/performance types; the log archive is attached here).

App 报告：图表为主，功能结果放附录（见 `app-device-testing`）。性能报告见 `performance-testing`。

App reports: chart-focused, with functional results in an appendix (see `app-device-testing`). For performance reports, see `performance-testing`.

## 结果取值与颜色 · Result Values and Colors
| 结果 | 颜色 |
|---|---|
| 通过 / 已确认非 bug（按产品口径） | 绿 |
| 不通过 | 红 |
| 阻塞（必须写原因） | 黄褐 |
| 疑似 | 紫 |
| 待核验 / 待复测 / 未部署待复测 | 蓝 |
| 本期不测 | 灰 |

| Result | Color |
|---|---|
| Pass / confirmed not a bug (per product rules) | Green |
| Fail | Red |
| Blocked (reason mandatory) | Yellow-brown |
| Suspected | Purple |
| Pending verification / pending retest / not deployed, pending retest | Blue |
| Not tested this round | Gray |

不得编造结果；没有记录的写「无记录」。

Do not fabricate results; where there is no record, write "No record".

## 证据展示 · Evidence Presentation
- 每个证据显示为可点击标签，图片带缩略图；点击弹窗可缩放、拖动、重置、关闭，同一用例多文件可左右切换（「1 / N」）。
- 文本类证据（txt/json/md/log/csv）弹窗内等宽显示。
- **纯内联脚本与样式，不依赖外网资源**（报告站需登录，外网资源可能被拦）。
- 文件用相对路径，必须真实存在于分享目录；缺失显示「文件缺失」并立刻补。

- Each piece of evidence shows as a clickable label, with images carrying a thumbnail; clicking opens a modal that supports zoom, drag, reset, and close, and multiple files for the same test case can be navigated left/right ("1 / N").
- Text-type evidence (txt/json/md/log/csv) displays in monospace inside the modal.
- **Scripts and styles must be fully inline, with no dependency on external resources** (the report site requires login, and external resources may be blocked).
- Files use relative paths and must actually exist in the share directory; a missing file shows "File missing" and must be supplied immediately.

## 分步流程 · Step-by-Step Process
1. **生成**：md → 自包含 HTML（含证据弹窗），放进 {REPORT_SHARE_DIR}/<需求简称>/report.html。只有 md 记录的需求也要补成 HTML。
2. **发布**：**自动发布**，不等用户确认、不让用户点任何发布卡片；发布的是**整个分享目录**（只挂子目录会导致其他报告 404）。
3. **更新汇总页**（见下节）。
4. **自检**：无头浏览器打开报告与汇总页，确认文本显示、弹窗缩放/切换正常，留截图。
5. **交付**：把**报告链接 + 汇总页链接**直接交主管转用户，附结论、计数、编号疑似问题、需用户决定事项。聊天里只发摘要和链接，结论以报告为准。

1. **Generate**: md → self-contained HTML (with the evidence modal), placed at {REPORT_SHARE_DIR}/<requirement short name>/report.html. Requirements recorded only in md must also be converted to HTML.
2. **Publish**: **publish automatically**, without waiting for user confirmation and without making the user click any publish card; publish the **entire share directory** (mounting only a subdirectory causes other reports to 404).
3. **Update the summary page** (see the next section).
4. **Self-check**: open the report and summary page in a headless browser, confirm text displays correctly and modal zoom/navigation work, and keep screenshots.
5. **Deliver**: hand the **report link + summary page link** directly to the supervisor to relay to the user, together with the conclusion, counts, numbered suspected issues, and items requiring a user decision. In chat send only a summary and links; the report is the source of truth for conclusions.

## 三处同步（单号一致性）· Three-Way Sync (ticket number consistency)
提单拿到单号后**立即同时更新**：报告逐条结果表、报告缺陷表、汇总页——全部写成单号链接 + 当前状态。
- 不得残留「NEW-x」「待提」；确实没提的写「未提单，待确认」。
- 每个不通过只要系统里已有单就必须关联。
- 定期全量核对：按标题、需求、步骤比对缺陷系统清单。
- 一张缺陷跨多个需求时，只在挂靠的需求计数，其他报告注明。

After filing a bug and getting a ticket number, **update all three at once immediately**: the report's per-item result table, the report's defect table, and the summary page — all written as a ticket-number link + current status.
- No leftover "NEW-x" or "pending filing" may remain; where a bug genuinely was not filed, write "Not filed, pending confirmation".
- Every fail must be linked to a ticket as long as one already exists in the system.
- Reconcile the full set periodically: compare against the defect system list by title, requirement, and steps.
- When one defect spans multiple requirements, count it only under the requirement it is attached to, and note it in the other reports.

## 汇总页（只由测试助手改）· Summary Page (edited only by the test assistant)
- 位置：分享根目录，根链接直接显示汇总页而不是目录列表。
- 列：需求名称（链接需求，附状态/任务号/用例文档链接）｜测试报告（链接；无写「暂无报告」）｜需求测试状态（如「有激活缺陷 n，待复测 m」「测试中」「测试完成可关」「阻塞（原因）」「复测不通过，待处理」标红）｜未关闭缺陷数（总数 + 研发 n / 文档项 m 拆分，列单号与状态）。
- 分区：上部「指派给我」；下部「非指派 / 历史」；工具目录、原始数据、备份不列。
- 注明生成时间（{TZ}）与统计口径。
- **不放内部手册/交接文档入口**（⚠ 是否需要可配置）。
- 读不到缺陷状态写「待核」，不猜。
- 更新时机：新增/更新报告、拿到单号、缺陷状态变化、用户手动关单、用户说已上线——**立即**更新并发布。

- Location: the share root directory, with the root link showing the summary page directly rather than a directory listing.
- Columns: requirement name (links to the requirement, with status/task number/test-case document link) | test report (link; if none, "No report yet") | requirement test status (e.g. "n active defects, m pending retest", "testing", "testing complete, closable", "blocked (reason)", "retest failed, pending action" in red) | number of unclosed defects (total + split into dev n / doc items m, listing ticket numbers and statuses).
- Sections: upper "Assigned to me"; lower "Unassigned / History"; tool directories, raw data, and backups are not listed.
- Note the generation time ({TZ}) and the statistics rules.
- **Do not include entry links to internal manuals/handover documents** (⚠ whether this is needed is configurable).
- If a defect status cannot be read, write "Pending verification"; do not guess.
- Update timing: when a report is added/updated, a ticket number is obtained, a defect status changes, the user manually closes a ticket, or the user says it is live — update and publish **immediately**.

## 测完 / 已上线 · Testing Complete / Live
1. 立即停测，从测试队列移除。
2. 汇总页**整行删除**。
3. 报告目录移到 {ARCHIVE_DIR}（**移出不删除**），分享目录不留 .bak/作废目录。
4. 回报：需求名称、目录、归档位置。

1. Stop testing immediately and remove it from the test queue.
2. **Delete the entire row** from the summary page.
3. Move the report directory to {ARCHIVE_DIR} (**move out, do not delete**); leave no .bak/obsolete directories in the share directory.
4. Report back: requirement name, directory, and archive location.

## 交接对象 · Handover Targets
主管（交付链接）、缺陷助手（核对单号状态）。

Supervisor (deliver links), defect assistant (reconcile ticket statuses).

## 禁止项 · Prohibitions
- 只在聊天里给结论、不出报告。
- 等用户点发布。
- 临时助手改汇总页。
- 报告里出现凭证。
- 分享目录留备份。

- Giving a conclusion only in chat without producing a report.
- Waiting for the user to click publish.
- A temporary assistant editing the summary page.
- Credentials appearing in a report.
- Leaving backups in the share directory.

## 常见错误 · Common Mistakes
- 只发布了子目录 → 其他报告 404。
- 证据写成纯文本路径 → 不可点。
- 聊天编号与报告编号不一致。
- 用户手动关的单还挂「不通过」→ 改「已确认非 bug／按产品口径」，并让缺陷助手更新用例预期。

- Publishing only a subdirectory → other reports 404.
- Writing evidence as a plain-text path → not clickable.
- Chat numbering inconsistent with report numbering.
- A ticket the user manually closed still marked "fail" → change it to "confirmed not a bug / per product rules" and have the defect assistant update the test case's expected result.

## 自检清单 · Self-Check Checklist
- [ ] 开头有编号疑似问题（没有写「无」） — Numbered suspected issues at the start (write "None" if there are none)
- [ ] 每个不通过关联单号或标「未提单，待确认」 — Every fail linked to a ticket or marked "Not filed, pending confirmation"
- [ ] 三处单号与状态一致，无「NEW-」「待提」 — Ticket numbers and statuses consistent across all three places, with no "NEW-" or "pending filing"
- [ ] 证据全部可点击，无「文件缺失」 — All evidence clickable, no "File missing"
- [ ] 配置已恢复并记录 — Config restored and recorded
- [ ] 汇总页已更新（分区、计数、拆分、生成时间） — Summary page updated (sections, counts, split, generation time)
- [ ] 已发布，链接已交 — Published and links delivered
- [ ] 无明文凭证 — No plaintext credentials
