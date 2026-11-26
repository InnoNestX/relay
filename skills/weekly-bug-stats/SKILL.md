---
name: weekly-bug-stats
description: >-
  出周缺陷统计（发给负责人或写周报）时使用：统一口径「本周新增 X 个，已解决 Y 个，未解决 Z 个，其中以往遗留 N 个」，N 为 0 时整句省略。
  Use when producing weekly defect statistics (to send to the lead or write the weekly report): a uniform wording "X new this week, Y resolved, Z unresolved, of which N carried over from before", omitting the whole clause when N is 0.
---

# 周缺陷统计 · Weekly Defect Statistics

## 适用角色 · Applicable Roles
缺陷助手（只读导出与计数）；文档助手（写周报）；主管（汇总/经通知助手发送）。

Defect assistant (read-only export and counting); documentation assistant (writes the weekly report); supervisor (consolidates / sends via the notifier assistant).

## 触发条件 · Triggers
每周固定时间（⚠ 见 GAPS），或用户要求。

A fixed time each week (⚠ see GAPS), or on user request.

## 输入 · Inputs
缺陷助手只读导出：本周起止（{TZ}）、产品/项目范围内全部缺陷的创建时间、状态、指派、严重程度、是否文档项。

Defect assistant read-only export: this week's start/end ({TZ}), and for all defects within the product/project scope: creation time, status, assignee, severity, and whether it is a doc item.

## 口径定义 · Definitions / Counting Rules
| 项 | 定义 |
|---|---|
| 本周新增 X | 本周内创建的缺陷数 |
| 已解决 Y | 本周新增中状态为「已解决」或「已关闭」的（⚠ 是否只算本周新增见 GAPS） |
| 未解决 Z | **仍为激活**的缺陷，**不限本周**；已解决、待复测不算未解决 |
| 以往遗留 N | 本周开始前创建且仍未解决的缺陷 |

| Item | Definition |
|---|---|
| New this week X | Number of defects created within this week |
| Resolved Y | Among this week's new defects, those with status "Resolved" or "Closed" (⚠ whether to count only this week's new defects: see GAPS) |
| Unresolved Z | Defects **still active**, **not limited to this week**; resolved and pending-retest do not count as unresolved |
| Carried over N | Defects created before this week started and still unresolved |

- 指派给产品且无逻辑变更的文档项**不计研发缺陷**。
- 需要体现严重程度的（如有 2 级缺陷）在文案中注明。

- Doc items assigned to the product owner with no logic change **do not count as dev defects**.
- Where severity needs to be reflected (e.g. if there are level-2 defects), note it in the wording.

## 文案模板 · Wording Template
```text
本周新增 X 个，已解决 Y 个，未解决 Z 个，其中以往遗留 N 个。
```
N = 0 时整句「其中以往遗留 0 个」**省略**：
```text
本周新增 X 个，已解决 Y 个，未解决 Z 个。
```

English equivalent (the Chinese template above is authoritative):
```text
X new this week, Y resolved, Z unresolved, of which N carried over from before.
```
When N = 0, the whole clause "of which 0 carried over from before" is **omitted**:
```text
X new this week, Y resolved, Z unresolved.
```

## 分步流程 · Step-by-Step Process
1. 确定本周起止（{TZ}），系统时间换算。
2. 导出清单，剔除文档项。
3. 按口径计数，附明细表（单号链接、状态、指派）。
4. 生成文案；交主管 / 文档助手。

1. Determine this week's start/end ({TZ}), converting system time.
2. Export the list and exclude doc items.
3. Count per the rules and attach a detail table (ticket link, status, assignee).
4. Generate the wording; hand it to the supervisor / documentation assistant.

## 禁止项 · Prohibitions
- 把待复测算进未解决。
- N=0 还写「以往遗留 0 个」。

- Counting pending-retest as unresolved.
- Writing "0 carried over from before" when N=0.

## 自检清单 · Self-Check Checklist
- [ ] 起止时间已换算 — Start/end times converted
- [ ] 文档项已剔除 — Doc items excluded
- [ ] 口径符合定义 — Counting matches the definitions
- [ ] 附明细 — Detail attached
