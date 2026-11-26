---
name: bug-retest
description: >-
  复测研发已解决的缺陷时使用：先读研发最新解决备注，确认修复已部署，修好就关；没修好（含未部署修复包）备注过程与数据直接激活并通知研发，不再问用户；阻塞不算不通过；不另出报告、不设自动定时复测。
  Use when retesting defects that developers have marked resolved: first read the developer's latest resolution note, confirm the fix is deployed, and close if fixed; if not fixed (including a fix package not yet deployed), note the process and data, reactivate directly, and notify the developer without asking the user again; blocked does not count as fail; do not produce a separate report and do not set up automatic scheduled retests.
---

# 缺陷复测 · Defect Retest

## 适用角色 · Applicable Roles
测试助手、临时测试助手（执行与结论）；缺陷助手（导出、关单、激活）；通知助手（激活后通知研发）。

Test assistant, temporary test assistant (execution and conclusion); defect assistant (export, close, reactivate); notifier assistant (notify the developer after reactivation).

## 触发条件 · Triggers
- **用户提醒或交办**复测（不自动排定时复测）。
- 指派给用户、状态为「已解决」的缺陷批量复测。

- Retesting **prompted or assigned by the user** (do not auto-schedule retests).
- Batch retesting of defects assigned to the user with status "Resolved".

## 输入（缺陷助手只读导出，每张单）· Inputs (defect assistant read-only export, per ticket)
解决人、解决时间（换算 {TZ}）、解决方案、解决版本/分支、**研发最新解决备注全文**、最近 3 条历史备注、重现步骤全文、原截图。

Resolver, resolution time (converted to {TZ}), resolution, resolution version/branch, **the full text of the developer's latest resolution note**, the 3 most recent history notes, the full reproduction steps, and the original screenshots.

## 分步流程 · Step-by-Step Process
1. **导出**：缺陷助手导出上述字段到 `<工作目录>/retest/<日期>_notes.md`。
2. **先读研发最新备注**：按备注里说的修复范围和方式去验，不按自己的理解。
3. **确认已部署**：看前端静态资源 `Last-Modified` / 包版本号 / 后端版本；**未部署 → 记「未部署，待复测」，不判不通过**。
4. **造数**：原数据失效就按 `test-data-factory` 重造。
5. **执行**：前台能验的马上验；需要后台/高权限的排进后台队列。
6. **判定与处理**：
   | 结论 | 处理 |
   |---|---|
   | 通过 | 交缺陷助手**直接关闭**，备注复测结论 |
   | 不通过（未修好、不符合预期、测试环境未部署修复包但研发声称已部署） | 备注写清过程与数据 → **直接重新激活**并指派回研发，**不再问用户** → 通知助手私信研发（只读名单除外） |
   | 阻塞（无法判定） | 写明原因，**不算不通过**，不激活 |
   | 研发解决为「设计如此/不予解决」但与最新需求矛盾 | 不关不激活，汇总给用户决定 |
   | 指派产品的文档项 | 文档已更新 → 解决方案「已解决」后关闭 |
7. **更新报告**：复测**不另出报告**；有关联需求报告就更新那份（结果、缺陷表、汇总页三处同步）；没有报告就不做。
8. **回报**：每张单结论 + 链接；激活的附消息链接。

1. **Export**: the defect assistant exports the fields above to `<working directory>/retest/<date>_notes.md`.
2. **Read the developer's latest note first**: verify against the fix scope and method stated in the note, not your own interpretation.
3. **Confirm deployment**: check the front-end static resource `Last-Modified` / package version number / back-end version; **not deployed → record "Not deployed, pending retest", do not judge it fail**.
4. **Data setup**: if the original data is invalid, recreate it per `test-data-factory`.
5. **Execute**: verify what can be checked from the front end immediately; queue anything needing the back end/elevated privileges into the back-end queue.
6. **Judgment and handling**:
   | Conclusion | Handling |
   |---|---|
   | Pass | Hand to the defect assistant to **close directly**, noting the retest conclusion |
   | Fail (not fixed, does not match expectation, or the fix package is not deployed to the test environment though the developer claims it is) | Write the process and data clearly in the note → **reactivate directly** and assign back to the developer, **without asking the user again** → notifier assistant DMs the developer (except the read-only list) |
   | Blocked (cannot be judged) | State the reason; **does not count as fail**; do not reactivate |
   | Developer resolved as "By design / Won't fix" but it contradicts the latest requirement | Do not close or reactivate; consolidate for the user to decide |
   | Doc item assigned to the product owner | Document updated → close after setting the resolution to "Resolved" |
7. **Update the report**: a retest **does not produce a separate report**; if there is a linked requirement report, update it (three-way sync of result, defect table, summary page); if there is no report, do nothing.
8. **Report back**: each ticket's conclusion + link; for reactivated ones, attach the message link.

## 复测备注模板（交缺陷助手照录）· Retest Note Template (hand to the defect assistant to copy verbatim)
```text
【复测通过 / 复测不通过】YYYY-MM-DD HH:MM {TZ}
环境：<环境/版本>，租户 <名>，账号用途 <名>，执行方式 <无头/接口>，视口 <w×h>
数据：<业务单号/配置>
步骤：<…>
预期：<…>
实际：<…>
部署观察：<静态资源 Last-Modified / 版本号>
截图：<相对路径>
```

Translation of the template above (the Chinese block is authoritative):
- 【复测通过 / 复测不通过】 = [Retest passed / Retest failed] YYYY-MM-DD HH:MM {TZ}
- 环境 = Environment: `<environment/version>`, 租户 = tenant `<name>`, 账号用途 = account purpose `<name>`, 执行方式 = execution method `<headless/API>`, 视口 = viewport `<w×h>`
- 数据 = Data: `<business order number/config>`
- 步骤 = Steps: `<…>`
- 预期 = Expected: `<…>`
- 实际 = Actual: `<…>`
- 部署观察 = Deployment observation: `<static resource Last-Modified / version number>`
- 截图 = Screenshot: `<relative path>`

## 判定规则 · Judgment Rules
- 只有研发明确修复且已部署的版本上验证不通过，才算不通过。
- 激活不需要用户确认。
- 不设自动定时复测；汇总页可标「已解决待复测」。

- Only when verification fails on a version that the developer explicitly fixed and that is deployed does it count as fail.
- Reactivation does not require user confirmation.
- Do not set up automatic scheduled retests; the summary page may be marked "Resolved, pending retest".

## 交接对象 · Handover Targets
缺陷助手（关/激活）、通知助手（激活通知）、测试助手（报告同步）、主管（回报）。

Defect assistant (close/reactivate), notifier assistant (reactivation notice), test assistant (report sync), supervisor (report back).

## 禁止项 · Prohibitions
- 不读研发备注就复测。
- 未部署就判不通过。
- 复测不通过后再去问用户「要不要激活」。
- 给复测单独出一份新报告。
- 自动排定时复测。

- Retesting without reading the developer's note.
- Judging it fail before deployment.
- Asking the user "should I reactivate" after a retest fails.
- Producing a separate new report for a retest.
- Auto-scheduling retests.

## 常见错误 · Common Mistakes
- 用旧数据复测，数据状态已变导致误判。
- 激活备注只写「未修复」，研发无法定位。

- Retesting with stale data, where the data state has changed and causes a misjudgment.
- A reactivation note that says only "not fixed", leaving the developer unable to locate the problem.

## 自检清单 · Self-Check Checklist
- [ ] 已读研发最新备注 — Developer's latest note read
- [ ] 已确认部署 — Deployment confirmed
- [ ] 备注含环境/数据/步骤/预期/实际/截图 — Note includes environment/data/steps/expected/actual/screenshot
- [ ] 激活后已通知研发 — Developer notified after reactivation
- [ ] 关联报告三处已同步 — Linked report synced across all three places
