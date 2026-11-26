# 口径台账模板（每个需求一份，或全项目一份） · Caliber Ledger Template (one per requirement, or one for the whole project)

> 用途：记录所有「需求没写清 → 问到的口径」和「已确认非 bug」，作为判定依据，避免同类问题反复报。
>
> Purpose: record every "requirement unclear → caliber obtained by asking" and every "confirmed not a bug", to serve as the basis for judgment and avoid repeatedly reporting the same kind of issue.

## A. 需求口径 · Requirement Caliber

| # | 日期 {TZ} / Date {TZ} | 需求名称 / 版本 / Requirement name / version | 问题 / Issue | 结论口径 / Concluded caliber | 谁说的 / Who said it | 原文位置（消息/文档链接） / Source location (message/doc link) | 影响的用例 / Cases affected | 状态 / Status |
|---|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD HH:MM | <需求名> V1.x | <差异或疑问> | <最终口径> | <角色/姓名> | <链接> | TC-… | 已定 / 讨论中 / 已被 #n 覆盖 |

> 字段译文 / Column meanings: 需求名 = requirement name; 差异或疑问 = difference or question; 最终口径 = final caliber; 角色/姓名 = role/name; 链接 = link; 状态值 = 已定 (Settled) / 讨论中 (Under discussion) / 已被 #n 覆盖 (Superseded by #n).

规则：

Rules:

- 「讨论中」的口径不改用例，只在用例旁标「待确认」。
- 后帖覆盖前帖时，旧行状态改「已被 #n 覆盖」，不删除。

- A caliber that is "Under discussion" does not change the cases; just mark "To be confirmed" next to the case.
- When a later post overrides an earlier one, change the old row's status to "Superseded by #n"; do not delete it.

## B. 已确认非 bug（以后同类不再报） · Confirmed Not a Bug (do not report similar cases again)

| # | 口径 / Caliber | 来源（谁、何时、关联缺陷单） / Source (who, when, related defect ticket) | 适用范围 / Scope |
|---|---|---|---|
| 1 | <例：某显示类数据每 30 秒刷新，判定前需等待 30 秒以上> | <产品 MM-DD，缺陷单 #… 设计如此关闭> | <模块> |

> 行示例译文 / Row example (English): <e.g. a certain display-type datum refreshes every 30 seconds; wait more than 30 seconds before judging> | <Product MM-DD, defect ticket #… closed as by-design> | <module>.

## C. 本期不测 · Out of Scope This Cycle

| # | 范围 / Scope | 来源 / Source | 报告中标记 / Marking in the report |
|---|---|---|---|
| 1 | <例：某子功能本期不做> | <产品 MM-DD> | 本期不测（灰色，不判失败） |

> 行示例译文 / Row example (English): <e.g. a certain sub-feature is not built this cycle> | <Product MM-DD> | Out of scope this cycle (greyed out, not judged as failed).
