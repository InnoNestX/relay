---
name: requirement-watch
description: >-
  定时只读巡检需求讨论群时使用：通知助手读取新需求、需求变更、口径变化，对照在测需求整理「对测试的影响」交用户；不发言、不重复上轮；未定稿的变更不改用例。
  For scheduled, read-only patrols of the requirement-discussion channel: the notifier reads new requirements, requirement changes, and ruling changes, cross-references them against requirements under test, compiles the "impact on testing", and hands it to the user; it does not post, does not repeat the previous round, and does not modify test cases for changes that are not yet finalized.
---

# 需求变更巡检（定时、只读） · Requirement-change patrol (scheduled, read-only)

## 适用角色 · Applicable roles
通知助手（读取与整理）；主管（转告用户、决定是否派活）。

Notifier assistant (reads and compiles); supervisor (relays to the user, decides whether to assign work).

## 触发条件 · Triggers
定时任务（⚠ 频率见 GAPS），或用户让「看看群里有什么更新」。

A scheduled task (⚠ frequency per GAPS), or the user asking to "see what's new in the channel".

## 输入 · Inputs
- {REQ_CHANNEL} 自上轮巡检以来的消息（含线程回复）。
- 在测需求清单、口径台账、上轮巡检输出（用于去重）。

- Messages in {REQ_CHANNEL} since the previous patrol (including thread replies).
- The list of requirements under test, the ruling ledger, and the previous patrol's output (used for deduplication).

## 分步流程 · Step-by-step flow
1. **只读拉取**：上轮截止时间之后的新消息与线程。**不在群里发言**。
2. **筛选**：只保留影响测试的：新需求、需求变更、口径定稿/变为待定、环境发版、修复上线、已知问题处理。闲聊、与测试无关的丢弃。
3. **去重**：与上轮输出比对，**不重复上轮已报内容**；同一话题有新进展只报增量。
4. **对照**：每条标出影响的需求、用例、缺陷，判断：
   - 已定稿 → 「提测时按此口径改用例」（不立即改）；
   - 讨论中 / 又变成待定 → 「相关用例标待确认」；
   - 影响判定（如某现象不再算 bug、某环境未发这版不算 bug）→ 写清。
5. **输出**（下方模板），每条附原消息可点链接；时间换算 {TZ}。
6. **无更新**：不打扰用户。
7. **口径入账**：已定稿的口径交测试助手写进口径台账（谁说的、何时、原文链接）。

1. **Read-only fetch**: new messages and threads after the previous cutoff time. **Do not post in the channel.**
2. **Filter**: keep only what affects testing: new requirements, requirement changes, rulings being finalized / reverting to pending, environment releases, fixes going live, handling of known issues. Discard chit-chat and anything unrelated to testing.
3. **Deduplicate**: compare against the previous round's output; **do not repeat what was already reported last round**; for the same topic, report only the incremental progress.
4. **Cross-reference**: for each item, mark the affected requirements, test cases, and defects, and judge:
   - Finalized → "update the test cases per this ruling at test-submission time" (do not change immediately);
   - Under discussion / reverted to pending → "mark the related test cases as to-be-confirmed";
   - Impact ruling (e.g. a given phenomenon no longer counts as a bug, or an environment that did not ship this build means it is not a bug) → state it clearly.
5. **Output** (template below); attach a clickable link to the original message for each item; convert times to {TZ}.
6. **No updates**: do not disturb the user.
7. **Ledger entry for rulings**: hand finalized rulings to the test assistant to record in the ruling ledger (who said it, when, link to the original text).

## 输出模板 · Output template
```text
<起止时间 {TZ}> 需求群里跟测试有关的更新：
1. <需求名称>：<一句话结论>（<原消息链接>）
   对测试的影响：<改哪些用例 / 哪些不算 bug / 哪些待确认>
2. …
需要你决定：<如是否现在按新口径改用例>
```

Template, translated:
```text
<start–end time {TZ}> Testing-relevant updates in the requirement channel:
1. <requirement name>: <one-line conclusion> (<link to original message>)
   Impact on testing: <which cases to change / which no longer count as bugs / which are to-be-confirmed>
2. …
Your decision needed: <e.g. whether to update the test cases per the new ruling now>
```

## 判定规则 · Decision rules
- 需求讨论未定稿不改用例；提测时按最终结论统一改（用户明确说「先不改」时只记录）。
- 群里后帖覆盖前帖。
- 环境长期未发版时，复测数字不会变，注明。

- Do not modify test cases while a requirement discussion is not finalized; update them all at once per the final conclusion at test-submission time (when the user explicitly says "don't change it yet", only record it).
- In the channel, later posts supersede earlier ones.
- When an environment has not shipped a release for a long time, retest numbers will not change; note this.

## 交接对象 · Handoff targets
主管（转告用户）、测试助手（台账、提测时改用例）。

Supervisor (relays to the user), test assistant (ledger, updating test cases at test-submission time).

## 禁止项 · Prohibited
- 在群里发言、点表情。
- 给只读名单发消息。
- 看到变更就去改用例。
- 每轮重复上轮内容。

- Posting or reacting with emoji in the channel.
- Sending messages to the read-only contact list.
- Rushing to modify test cases the moment a change is seen.
- Repeating the previous round's content every round.

## 常见错误 · Common mistakes
- 把讨论中的意见当成定稿口径。
- 只给结论不给原消息链接。

- Treating an opinion that is still under discussion as a finalized ruling.
- Giving only conclusions without links to the original messages.

## 自检清单 · Self-check list
- [ ] 只读，未发言 · Read-only; did not post
- [ ] 与上轮去重 · Deduplicated against the previous round
- [ ] 每条有「对测试的影响」和链接 · Each item has an "impact on testing" and a link
- [ ] 定稿口径已入台账 · Finalized rulings have been recorded in the ledger
