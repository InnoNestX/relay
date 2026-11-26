---
name: bug-filing
description: >-
  发现不符合最新需求的问题要提缺陷时使用：先确认需求在测，按「字数越少越好」写步骤/实际/预期，证据截图内嵌正文含需求截图，curl 删凭证头，按映射定严重程度；提完立刻经通知助手按研发合并私信，并把缺陷链接与消息链接回报用户。
  Use when a problem that does not match the latest requirement is found and a defect must be filed: first confirm the requirement is under test, write steps/actual/expected with "the fewer words the better", embed evidence screenshots in the body including the requirement screenshot, strip credential headers from curl, and set severity by the mapping; after filing, immediately send a per-developer merged DM via the notifier assistant, and report the defect link and message link back to the user.
---

# 提缺陷（判定 → 提单 → 通知 → 回报）· Filing a Defect (judge → file → notify → report back)

## 适用角色 · Applicable Roles
- 测试助手 / 临时测试助手：判定、准备提单稿（不写系统）。
- 缺陷助手：写入 {DEFECT_SYSTEM}。
- 通知助手：私信指派研发。
- 主管：汇总回报用户。

- Test assistant / temporary test assistant: judges and prepares the filing draft (does not write to the system).
- Defect assistant: writes to {DEFECT_SYSTEM}.
- Notifier assistant: DMs the assigned developer.
- Supervisor: consolidates and reports back to the user.

## 触发条件 · Triggers
- 执行中发现实际不符合最新需求，且口径明确。
- 用户按编号确认某疑似问题「是 bug」。
- 复测时发现新问题（与原单无关的另提）。

- During execution, the actual behavior is found not to match the latest requirement, and the rules/interpretation are clear.
- The user confirms by number that a suspected issue "is a bug".
- A new problem is found during retest (unrelated to the original ticket; file separately).

## 输入 · Inputs
- 问题现象、证据截图、需求描述截图。
- 需求名称、关联需求条目、指派研发（以任务的指派研发为准，不发给测试同事）。
- 用户提供的复现地址与 curl（如有）。

- The problem symptom, evidence screenshots, and requirement description screenshot.
- The requirement name, the linked requirement entry, and the assigned developer (based on the task's assigned developer; do not send to testing colleagues).
- The reproduction URL and curl provided by the user (if any).

## 提单前判定（四问，全部「是」才提）· Pre-Filing Judgment (four questions; file only if all are "yes")
1. **需求在测吗？** 已上线或不在本轮测试范围 → 不提，只记录进报告/台账，也不通知研发。拿不准先确认在测。
2. **口径明确吗？** 不明确 → 写进「疑似问题待确认」交用户，不提。
3. **不是已确认非 bug 吗？** 查口径台账。
4. **不是环境/权限/跑批/数据问题吗？** 未分配权限、跑批前、修复包未部署、造数参数错 → 不提。

1. **Is the requirement under test?** If it is already live or outside this round's test scope → do not file; only record it in the report/ledger, and do not notify the developer. If unsure, first confirm it is under test.
2. **Are the rules/interpretation clear?** If unclear → write it into "Suspected issues pending confirmation" for the user; do not file.
3. **Is it not already confirmed to be a non-bug?** Check the rules/interpretation ledger.
4. **Is it not an environment/permission/batch-job/data issue?** Unassigned permissions, before the batch job runs, the fix package not yet deployed, or wrong data-setup parameters → do not file.

> 现行规则：**结果符合最新需求即通过，不符合就直接提单，不用先问用户。**

> Current rule: **If the result matches the latest requirement, it passes; if it does not, file a ticket directly — no need to ask the user first.**

## 提单内容规范 · Filing Content Standards
- **字数越少越好**：在能说明问题的前提下，步骤、实际、预期**各一两句**。
- **截图内嵌正文**（重现步骤里），不作为附件；每张单都必须有证据截图，不能只有文字。
- 附**需求描述截图**，证明预期来源。
  - 乱码类问题可不附需求截图（乱码本身即证据），但必须有问题截图。
  - **找不到需求截图**：先交用户审，不提单。
- 复现信息：页面地址、账号**用途与登录方式**（如「签名单点登录，不用密码」）、业务单号等；**绝不写密码、令牌、签名串**。
- 用户给了复现地址和 curl 才写进去；curl **删掉 Authorization / Bearer / Cookie / token 等凭证头**。没给就不写。
- 脱敏后的接口返回可作为补充附件。

- **The fewer words the better**: as long as the problem is clear, keep steps, actual, and expected to **one or two sentences each**.
- **Embed screenshots in the body** (inside the reproduction steps), not as attachments; every ticket must have an evidence screenshot, not text alone.
- Attach the **requirement description screenshot** to prove the source of the expected result.
  - For garbled-text (encoding) issues, the requirement screenshot may be omitted (the garbled text is itself the evidence), but a problem screenshot is still mandatory.
  - **If the requirement screenshot cannot be found**: submit it to the user for review first; do not file.
- Reproduction info: the page URL, the account's **purpose and login method** (e.g. "signed single sign-on, no password needed"), business order number, etc.; **never write passwords, tokens, or signature strings**.
- Only include a reproduction URL and curl if the user provided them; from curl, **strip credential headers such as Authorization / Bearer / Cookie / token**. If not provided, do not write them.
- A desensitized API response may be included as a supplementary attachment.

## 严重程度映射 · Severity Mapping
| 判断 | {DEFECT_SYSTEM} 级别 |
|---|---|
| 高 | 2 |
| 中 | 3 |
| 性能类 | 3 |
| 低 | 4 |
| 最高（1 级） | ⚠ 使用条件见 GAPS |

| Judgment | {DEFECT_SYSTEM} level |
|---|---|
| High | 2 |
| Medium | 3 |
| Performance type | 3 |
| Low | 4 |
| Highest (level 1) | ⚠ usage conditions see GAPS |

⚠ 高/中/低的判定细则见 GAPS；默认：主流程不可用、数据/金额错误、越权 → 高；功能部分异常、有绕过方式 → 中；文案、样式、低频展示 → 低。

⚠ The detailed rules for high/medium/low are in GAPS; defaults: main flow unusable, data/amount errors, privilege escalation → high; partial functional anomaly with a workaround → medium; copy, styling, low-frequency display → low.

## 分步流程 · Step-by-Step Process
1. **测试助手准备提单稿**（模板见下），交缺陷助手。
2. **缺陷助手提单**：上传截图并内嵌正文；关联需求条目；指派研发；设严重程度。
3. **回读检查**：无头打开缺陷详情页，确认截图能显示、无凭证。
4. **拿到单号立即通知**：缺陷助手把「单号 + 指派研发 + 需求名称」交通知助手；通知助手**按研发合并成一条**私信（模板见 `notifier`），**不能只提不通知**。
   - {READ_ONLY_CONTACTS} 里的研发：只提单，不发消息。
5. **三处同步**：测试助手更新报告结果表、缺陷表、汇总页（见 `test-report`）。
6. **回报用户**（经主管）：每张单的**完整缺陷链接** + **消息链接**。

1. **The test assistant prepares the filing draft** (template below) and hands it to the defect assistant.
2. **The defect assistant files the ticket**: uploads screenshots and embeds them in the body; links the requirement entry; assigns the developer; sets severity.
3. **Read-back check**: open the defect detail page headlessly and confirm the screenshots display and no credentials are present.
4. **Notify immediately once the ticket number is obtained**: the defect assistant hands "ticket number + assigned developer + requirement name" to the notifier assistant; the notifier assistant sends **one DM merged per developer** (template in `notifier`), and **must not file without notifying**.
   - Developers in {READ_ONLY_CONTACTS}: file the ticket only, send no message.
5. **Three-way sync**: the test assistant updates the report result table, defect table, and summary page (see `test-report`).
6. **Report back to the user** (via the supervisor): each ticket's **full defect link** + **message link**.

## 提单稿模板（测试助手 → 缺陷助手）· Filing Draft Template (test assistant → defect assistant)
```text
依据：<用户 MM-DD HH:MM 规则 / 原话>，以下问题提单（关联需求 <需求名称>）：
1. 标题：<一句话现象>｜指派：<研发>｜严重程度：<高/中/低/性能 → 级别>
   步骤：<一两句>
   实际：<一两句>
   预期：<一两句>（依据：需求截图）
   截图（内嵌正文，必填）：问题截图 <路径>；需求截图 <路径>（乱码类可无）
   复现信息：<页面>｜账号用途与登录方式｜业务单号
   复现 curl：<用户提供才写，已删凭证头>
提完回报每张单完整链接，并交通知助手私信指派研发。
```

Translation of the template above (do not use in place of the Chinese template; the Chinese block is authoritative):
- 依据 = Basis: `<user MM-DD HH:MM rule / verbatim>`, file the following problems (linked requirement `<requirement name>`):
- 标题 = Title: `<one-sentence symptom>` | 指派 = Assignee: `<developer>` | 严重程度 = Severity: `<high/medium/low/performance → level>`
- 步骤 = Steps: `<one or two sentences>`
- 实际 = Actual: `<one or two sentences>`
- 预期 = Expected: `<one or two sentences>` (basis: requirement screenshot)
- 截图 = Screenshots (embedded in body, mandatory): problem screenshot `<path>`; requirement screenshot `<path>` (may be omitted for garbled-text cases)
- 复现信息 = Reproduction info: `<page>` | account purpose and login method | business order number
- 复现 curl = Reproduction curl: `<only if the user provided it, with credential headers stripped>`
- After filing, report each ticket's full link and hand it to the notifier assistant to DM the assigned developer.

## 特殊情况 · Special Cases
- **指派给产品的单**：多为需求文档更新；未提出逻辑变更的不算研发 bug（周统计不计）。产品更新文档后，解决方案设「**已解决**」（不是「设计如此」），然后可关。
- **研发把单解决为「设计如此 / 不予解决」但与最新需求矛盾**：不自行关或激活，汇总给用户决定。
- **用户说「不是 bug / 设计如此，关掉」**：缺陷助手按「设计如此」关，备注用户原话口径；报告改「已确认非 bug」；口径进台账；用户说不用通知就不通知。
- **用户说「是 bug，等研发解决」**：保持不通过，挂单号，计入研发 bug。

- **Tickets assigned to the product owner**: mostly requirement-document updates; those that do not introduce a logic change do not count as dev bugs (not counted in weekly stats). After the product owner updates the document, set the resolution to "**Resolved**" (not "By design"), then it can be closed.
- **A developer resolves a ticket as "By design / Won't fix" but it contradicts the latest requirement**: do not close or reactivate it yourself; consolidate it for the user to decide.
- **The user says "not a bug / by design, close it"**: the defect assistant closes it as "By design", noting the user's verbatim rule; the report is changed to "confirmed not a bug"; the rule goes into the ledger; if the user says no notification is needed, do not notify.
- **The user says "it is a bug, wait for the developer to fix it"**: keep it as fail, attach the ticket number, and count it as a dev bug.

## 交接对象 · Handover Targets
测试助手 → 缺陷助手 → 通知助手 → 主管 → 用户。

Test assistant → defect assistant → notifier assistant → supervisor → user.

## 禁止项 · Prohibitions
- 已上线 / 不在测的需求提单。
- 只提单不通知研发（只读名单除外）。
- 正文无截图、只有附件。
- curl 带凭证头。
- 测试助手自己写缺陷系统。
- 把疑似问题当确定问题提单。

- Filing against a requirement that is already live / not under test.
- Filing without notifying the developer (except the read-only contact list).
- A body with no screenshot, only attachments.
- curl carrying credential headers.
- The test assistant writing to the defect system themselves.
- Filing a suspected issue as a confirmed problem.

## 常见错误 · Common Mistakes
- 描述写成长篇大论 → 研发不看。
- 通知里写需求编号 → 研发看不懂，要写需求名称。
- 提完没回填三处 → 报告残留「待提」。

- Writing the description as a long essay → developers won't read it.
- Writing the requirement number in the notification → developers can't make sense of it; write the requirement name instead.
- Not backfilling the three places after filing → the report retains "pending filing".

## 自检清单 · Self-Check Checklist
- [ ] 四问全部通过 — All four questions passed
- [ ] 步骤/实际/预期各一两句 — Steps/actual/expected each one or two sentences
- [ ] 正文内嵌问题截图 + 需求截图（乱码类除外） — Problem screenshot + requirement screenshot embedded in the body (except garbled-text cases)
- [ ] 无任何凭证 — No credentials of any kind
- [ ] 严重程度按映射 — Severity set per the mapping
- [ ] 已私信研发（按人合并），消息链接已拿到 — Developer DMed (merged per person), message link obtained
- [ ] 三处已同步，链接已回报用户 — All three places synced, links reported back to the user
