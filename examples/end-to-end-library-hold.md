# 端到端示例：虚构需求「图书预约取书 + 到期自动释放」 · End-to-End Example: Fictional Requirement "Book Hold Pickup + Auto-Release on Expiry"

> 完全虚构，只用来演示各技能如何串起来。时间均为 {TZ}。
>
> Entirely fictional, used only to demonstrate how the skills string together. All times are in {TZ}.

**需求摘要**：读者在移动网页或 App 预约一本在架图书，系统锁定副本并生成取书单；48 小时内未取则自动释放；馆员后台可手工延期；外部「馆际互借」系统通过回调通知调书结果（成功 / 失败 / 延迟 / 重复 / 乱序）。不同分馆（子组织）的馆员只能看本分馆的取书单。

**Requirement summary**: a reader places a hold on an on-shelf book via the mobile web or the App; the system locks a copy and generates a pickup slip; if not picked up within 48 hours it is auto-released; a librarian can manually extend it in the backend; an external "interlibrary loan" system notifies the book-transfer result via callback (success / failure / delay / duplicate / out-of-order). Librarians of different branches (sub-organizations) can only see their own branch's pickup slips.

---

## 第 0 步：需求群巡检（requirement-watch） · Step 0: Requirements-group monitoring (requirement-watch)
通知助手前一天巡检到：产品说「到期时长可能从 48 小时改成 72 小时，还在讨论」。
→ 输出「对测试的影响：相关用例标待确认，提测时按最终结论改」。用户回「先不改」。主管只记录，不派改用例。

The notifier assistant, monitoring the day before, caught: product saying "the expiry duration may change from 48 hours to 72 hours, still under discussion".
→ Output: "Impact on testing: mark the relevant cases 'to be confirmed', and change them per the final conclusion at test-submission time." The user replied "leave it for now." The supervisor only records it and does not dispatch a case change.

## 第 1 步：主管拆任务（supervisor） · Step 1: Supervisor breaks down the task (supervisor)
用户 09:30 原话：「预约取书提测了，按老流程走，要快。」

User's words at 09:30: "The hold-pickup feature is submitted for test; follow the usual process, and be quick."
```text
1. 测试助手：读需求 → 用例稿三份 → 自评审（test-case-design / test-case-review）
2. 用户评审 → 缺陷助手落库（test-case-publish）
3. 测试助手：造数（test-data-factory，优先 {DATA_FACTORY_PROJECT}）
4. 执行：测试助手负责移动网页 + 后台；TestHelper-YYYYMMDD-1 负责 App 两台真机；TestHelper-YYYYMMDD-2 负责权限矩阵（parallel-helper-scale-out，原因：用户要快 + 三块互不依赖）
5. 不符合需求 → 缺陷助手提单 → 通知助手私信研发（bug-filing / notifier）
6. 测试助手合并报告、更新汇总页 → 主管汇总
```
译文 / English:
```text
1. Test assistant: read the requirement → three case drafts → self-review (test-case-design / test-case-review)
2. User review → defect assistant stores them (test-case-publish)
3. Test assistant: fabricate data (test-data-factory, preferring {DATA_FACTORY_PROJECT})
4. Execution: test assistant handles the mobile web + backend; TestHelper-YYYYMMDD-1 handles the App on two physical devices; TestHelper-YYYYMMDD-2 handles the permission matrix (parallel-helper-scale-out, reason: the user wants speed + the three blocks are independent)
5. Non-compliant with the requirement → defect assistant files a ticket → notifier assistant DMs the dev (bug-filing / notifier)
6. Test assistant merges the report, updates the summary page → supervisor summarizes
```

## 第 2 步：用例设计（test-case-design） · Step 2: Case design (test-case-design)
需求要点表 18 条；发现 2 处差异：

The requirement key-points table has 18 entries; 2 differences were found:

1. 原型显示「剩余 2 小时提醒」，需求文档没写 → 待确认。
2. 到期时长 48h（文档）vs 群里讨论 72h（未定稿）→ 按 48h 写，标待确认。

1. The prototype shows a "2 hours remaining reminder", which the requirements doc does not mention → to be confirmed.
2. Expiry duration 48h (doc) vs 72h discussed in the group (not finalized) → write for 48h, mark to be confirmed.

覆盖矩阵节选：

Coverage matrix (excerpt):

| 要点 / Key point | 用例 / Case | 维度 / Dimension |
|---|---|---|
| 到期释放 / Auto-release on expiry | 47:59:59 取书成功；48:00:01 已释放 / 47:59:59 pickup succeeds; 48:00:01 already released | 边界 / Boundary |
| 取书单状态 / Pickup slip status | 已释放的单不能再取书 / A released slip cannot be picked up again | 状态流转 / State transition |
| 调书回调 / Book-transfer callback | 同一成功回调重复 3 次只处理一次 / The same success callback arriving 3 times is processed only once | 幂等 / Idempotency |
| 调书回调 / Book-transfer callback | 失败回调晚于成功回调到达，最终仍为成功 / A failure callback arriving after the success callback still ends as success | 乱序 / Out-of-order |
| 最后一本 / Last copy | 两个读者同时预约最后 1 个副本，仅 1 个成功，另一人看到可理解提示 / Two readers hold the last copy at once; only 1 succeeds, the other sees an understandable prompt | 并发 / Concurrency |
| 分馆权限 / Branch permission | 分馆 A 馆员改参数访问分馆 B 的单 → 无权限 / Branch A librarian tampers with a parameter to access branch B's slip → no permission | 权限 / Permission |

产出 `LIB-HOLD_cases.md / .json / .html`，共 146 条（P0 38 / P1 71 / P2 37）。

Output `LIB-HOLD_cases.md / .json / .html`, 146 cases total (P0 38 / P1 71 / P2 37).

## 第 3 步：评审（test-case-review） · Step 3: Review (test-case-review)
自评审通过后，主管发给用户：「可视化稿 <链接>，146 条，待确认 2 条，重点看并发与回调。」
用户回：「通过，第 1 条按有提醒写。」→ 口径写进台账（日期、用户、原话）→ 缺陷助手落库，回读 146 条一致。

After the self-review passes, the supervisor sends to the user: "Visual draft <link>, 146 cases, 2 to be confirmed; please focus on concurrency and callbacks."
The user replies: "Approved; write item 1 as having a reminder." → the caliber is written into the ledger (date, user, original words) → the defect assistant stores them, and the read-back confirms 146 cases match.

## 第 4 步：造数（test-data-factory） · Step 4: Data fabrication (test-data-factory)
| 数据 / Data | 方式 / Method |
|---|---|
| 50 张取书单，创建时间偏移 -47h59m59s ~ -48h00m01s / 50 pickup slips, creation-time offset -47h59m59s ~ -48h00m01s | {DATA_FACTORY_PROJECT} 批量，参数化时间偏移 / {DATA_FACTORY_PROJECT} in batch, parameterized time offset |
| 多 IP 同时预约最后一本 / Multiple IPs holding the last copy at once | {MULTI_IP_SUBMIT_ENTRY}，每次请求换出口 IP / {MULTI_IP_SUBMIT_ENTRY}, rotating the egress IP per request |
| 调书回调 5 种 / 5 kinds of book-transfer callback | {MOCK_API_BASE} 构造回调 / Build callbacks via {MOCK_API_BASE} |
| 读者账户额度不足 / Reader account with insufficient quota | 模拟入账接口补额度（不找用户手动加） / Top up the quota via the simulated-posting API (not asking the user to add it manually) |
| 分馆馆员账号 / Branch librarian account | 在现有组织下按角色新建，按 {PERMISSION_DOC} 分配菜单与数据权限 / Create new under an existing organization by role, assigning menu and data permissions per {PERMISSION_DOC} |
| 全局「最大预约数」配置 / Global "max holds" config | 记原值 3 → 改 1 验证 → 立即改回 3 / Record original value 3 → change to 1 to verify → change back to 3 immediately |

造完立即验证状态（数据有时效，跑批每小时释放一次）。

Verify the status immediately after fabrication (the data is time-sensitive; the batch job releases once per hour).

## 第 5 步：执行（test-execution / app-device-testing / permission-testing） · Step 5: Execution (test-execution / app-device-testing / permission-testing)
- 测试助手：接口 + 无头浏览器，移动视口 430×932。
- TestHelper-1：两台真机同一流程；重点断网、切后台、通知权限拒绝；日志脱敏打包。
- TestHelper-2：权限矩阵 5 个角色。
- 结果：通过 131 / 不通过 4 / 阻塞 2（馆际互借测试桩未部署）/ 未执行 9（本期不测）。

- Test assistant: API + headless browser, mobile viewport 430×932.
- TestHelper-1: the same flow on two physical devices; focus on network disconnection, backgrounding, and notification-permission denial; redact and package the logs.
- TestHelper-2: permission matrix with 5 roles.
- Results: Pass 131 / Fail 4 / Blocked 2 (the interlibrary-loan test stub is not deployed) / Not executed 9 (out of scope this cycle).

判定举例：

Examples of judgment:

- 「重复回调导致额度扣两次」→ 不符合需求，口径明确 → 直接提单。
- 「剩余 2 小时提醒文案用词」需求没写 → 疑似问题 1，交用户。
- 分馆馆员看不到数据 → 发现是没分配数据权限 → 不是 bug。

- "A duplicate callback deducts the quota twice" → non-compliant with the requirement, caliber is clear → file a ticket directly.
- "Wording of the 2 hours remaining reminder copy" is not written in the requirement → suspected issue 1, hand to the user.
- "A branch librarian cannot see data" → found to be an unassigned data permission → not a bug.

## 第 6 步：提单与通知（bug-filing / notifier） · Step 6: Ticket filing and notification (bug-filing / notifier)
测试助手交提单稿（步骤/实际/预期各一句，内嵌问题截图 + 需求截图，严重程度：高 → 2）。缺陷助手提单、回读截图可见，单号交通知助手。通知助手按研发合并：

The test assistant hands over a ticket draft (steps/actual/expected, one sentence each, with the problem screenshot + requirement screenshot embedded, severity: High → 2). The defect assistant files the ticket, reads back to confirm the screenshots are visible, and hands the ticket numbers to the notifier assistant. The notifier assistant merges by dev:
```text
<研发>老师好，「图书预约取书」刚提了 2 个问题指给您：
• <#单号> 重复回调导致额度扣两次
• <#单号> 已释放的取书单仍可点「取书」
需要大佬帮个忙看一下，辛苦了！
```
译文 / English:
```text
Hi Teacher <dev>, just filed 2 issues on "Book Hold Pickup" assigned to you:
• <#ticket-number> A duplicate callback deducts the quota twice
• <#ticket-number> A released pickup slip still shows a clickable "Pick up"
Need a favor from you to take a look, thanks for your trouble!
```
测试助手三处同步单号。

The test assistant synchronizes the ticket numbers across the three places.

## 第 7 步：报告与汇总（test-report / supervisor） · Step 7: Report and summary (test-report / supervisor)
报告自动发布，开头疑似问题 1 条。主管汇总给用户：结论、报告链接、汇总页链接、缺陷链接 + 消息链接、疑似问题 1、需决定事项。批次结束提醒用户删除两个临时助手。

The report is auto-published, with 1 suspected issue at the top. The supervisor summarizes to the user: conclusion, report link, summary-page link, defect links + message links, suspected issue 1, items needing a decision. At the end of the batch, remind the user to delete the two temporary assistants.

## 第 8 步：复测（bug-retest） · Step 8: Retest (bug-retest)
两天后用户说「复测一下」。缺陷助手导出研发备注 → 测试助手确认已部署 → 一张通过关闭；一张前端包 `Last-Modified` 未更新 → 记「未部署，待复测」，不判不通过。更新原报告，不另出报告。

Two days later the user says "do a retest." The defect assistant exports the dev notes → the test assistant confirms it is deployed → one ticket passes and is closed; for another, the frontend bundle's `Last-Modified` is not updated → record "not deployed, awaiting retest" and do not fail it. Update the original report; do not issue a separate report.

## 第 9 步：口径定稿后 · Step 9: After the caliber is finalized
群里最终定了 72 小时，该变更随下一版提测。测试助手按最终结论统一修改相关用例 → 评审 → 落库，变更记录注明「MM-DD 按 <口径> 更新」。

The group finally settled on 72 hours, and this change is submitted for test with the next version. The test assistant uniformly modifies the relevant cases per the final conclusion → review → store, with the change record noting "Updated on MM-DD per <caliber>".
