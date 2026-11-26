# 交接消息模板 · Handoff Message Templates

> 所有模板里的账号只写「用途名」；凭证一律运行时注入，不出现在消息里。
>
> In all templates, accounts are written only by their "purpose name"; credentials are always injected at runtime and never appear in messages.

## 1. 主管 → 测试助手 / 临时测试助手（派测） · Supervisor → Test assistant / Temporary test assistant (dispatch for testing)
```text
用户 HH:MM 原话：「……」
任务：<需求名称>（任务 <编号>，用例文档 <链接>）
你的块：<模块 / 用例区间 / 单号列表>；不要碰：<其他块>
方式：默认无头；后台走 {ADMIN_ACCESS_ROUTE}；账号用途 <名>（保险库注入，不打印）
数据：可复用 <租户/账号>；需要的数据自己造，优先 {DATA_FACTORY_PROJECT}；改配置先记原值、验证完马上改回
判定：按最新需求，符合即通过；不符合直接提单（交缺陷助手，正文贴截图）；拿不准写报告开头编号「疑似问题待确认」
交付：报告自动发布 + 汇总页更新（临时助手不改汇总页，回报测试助手）
回报：报告链接、结论、计数、疑似问题编号、未关闭缺陷、需用户决定事项
优先级：先 A 再 B
```
译文 / English:
```text
User's words at HH:MM: "……"
Task: <requirement name> (task <number>, case document <link>)
Your block: <module / case range / ticket-number list>; do not touch: <other blocks>
Method: headless by default; access the backend via {ADMIN_ACCESS_ROUTE}; account purpose <name> (injected from the vault, not printed)
Data: you may reuse <tenant/account>; fabricate the data you need yourself, preferring {DATA_FACTORY_PROJECT}; before changing a config record the original value, and change it back immediately after verifying
Judgment: by the latest requirement — compliant means Pass; if non-compliant, file a ticket directly (hand to the defect assistant, paste screenshots in the body); if unsure, number it at the top of the report as "Suspected issue to be confirmed"
Delivery: report auto-published + summary page updated (temporary assistants do not modify the summary page; report back to the test assistant)
Report back: report link, conclusion, counts, suspected-issue numbers, unclosed defects, items needing a user decision
Priority: A first, then B
```

## 2. 测试助手 → 缺陷助手（用例落库） · Test assistant → Defect assistant (store cases)
```text
请落库：
- 文件：<路径>/<需求ID>_cases.<富文本>.html（另附 md/json 供核对）
- 目标：新建《<需求ID>-<简称> 测试用例》｜原地更新 <文档号>（先备份到 <路径>）
- 条数：共 N（P0 a / P1 b / P2 c）
- 评审依据：<评审人> <时间>「通过」
回读核对格式、链接、条数、diff，回报编号 + 链接 + 条数 + 失败项。
```
译文 / English:
```text
Please store these:
- File: <path>/<requirement ID>_cases.<rich text>.html (md/json also attached for cross-check)
- Target: create new "<requirement ID>-<short name> Test Cases" | update <document number> in place (back up to <path> first)
- Count: N total (P0 a / P1 b / P2 c)
- Review basis: <reviewer> <time> "Passed"
Read back to verify format, links, count, and diff; report back the number + link + count + failed items.
```

## 3. 测试助手 → 缺陷助手（提单） · Test assistant → Defect assistant (file a ticket)
见 `skills/bug-filing/SKILL.md`「提单稿模板」。

See the "Ticket draft template" in `skills/bug-filing/SKILL.md`.

## 4. 测试助手 → 缺陷助手（复测结论） · Test assistant → Defect assistant (retest conclusion)
```text
#单号 关闭 / 激活（指派：<研发>）
【复测通过 / 不通过】YYYY-MM-DD HH:MM {TZ}
环境 / 数据 / 步骤 / 预期 / 实际 / 部署观察 / 截图
激活后交通知助手私信研发（只读名单除外）；改完回读状态告诉我。
```
译文 / English:
```text
#ticket-number close / reactivate (assignee: <dev>)
[Retest Pass / Fail] YYYY-MM-DD HH:MM {TZ}
Environment / data / steps / expected / actual / deployment observation / screenshots
After reactivating, hand to the notifier assistant to DM the dev (except those on the read-only list); after the change, read back the status and tell me.
```

## 5. 任意助手 → 通知助手 · Any assistant → Notifier assistant
```text
收件人：<姓名/频道>
是否测试：否 / 联调测试，勿真实发送
文案或意图：<…>（需求名称 + 单号链接）
期望：直接发 / 先出草稿
回报消息链接。
```
译文 / English:
```text
Recipient: <name/channel>
Is it a test: No / Integration test, do not send for real
Copy or intent: <…> (requirement name + ticket-number link)
Expectation: send directly / draft first
Report back the message link.
```

## 6. 测试助手 / 临时助手 → 主管（回报） · Test assistant / Temporary assistant → Supervisor (report back)
```text
结论：<需求名称> 通过 / 不通过 / 阻塞（通过 a / 不通过 b / 阻塞 c / 未执行 d）
报告：<链接>｜汇总页：<链接>（已发布）
疑似问题待确认：1. … 2. …
未关闭缺陷：研发 <#x 激活>、<#y 待复测>；文档项 <#z>
需用户决定：1. …
阻塞原因：<…>
```
译文 / English:
```text
Conclusion: <requirement name> Pass / Fail / Blocked (Pass a / Fail b / Blocked c / Not executed d)
Report: <link> | Summary page: <link> (published)
Suspected issues to be confirmed: 1. … 2. …
Unclosed defects: dev <#x reactivated>, <#y awaiting retest>; documentation item <#z>
Needs user decision: 1. …
Blocking reason: <…>
```

## 7. 任意助手 → 主管（推回） · Any assistant → Supervisor (push back)
```text
用户原话（时间）：「……」
我能做的：……（已做 / 未做）
卡点：需要 <角色> 做 <什么>
建议拆分：1. … 2. …
```
译文 / English:
```text
User's original words (time): "……"
What I can do: …… (done / not done)
Blocker: need <role> to do <what>
Suggested breakdown: 1. … 2. …
```

## 8. 主管 → 用户（汇总） · Supervisor → User (summary)
见 `skills/supervisor/SKILL.md` 第 6 步。

See Step 6 of `skills/supervisor/SKILL.md`.
