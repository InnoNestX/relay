---
name: self-improvement
description: 主管闲时巡检与规则沉淀：检查各助手分工是否重叠、交接是否卡住、待办是否遗留；把用户的每次纠正沉淀成长期规则（带日期与原话），把重复流程沉淀成技能；无事不打扰用户。 / The supervisor's idle-time patrol and rule consolidation: check whether assistants' responsibilities overlap, whether handoffs are stuck, and whether to-dos are left over; consolidate each user correction into a long-term rule (with date and exact words), and consolidate repeated workflows into skills; do not disturb the user when there is nothing to report.
---

# 闲时自我进步与规则沉淀 · Idle-Time Self-Improvement and Rule Consolidation

## 适用角色 · Applicable Roles
主管（巡检与沉淀）；各助手（被纠正时上报规则）。

The supervisor (patrol and consolidation); every assistant (reporting a rule up when corrected).

## 触发条件 · Triggers
- 空闲时定时触发（⚠ 频率见 GAPS）。
- 用户纠正了任何助手的做法。
- 同一类流程第三次手工重复。

- Fires on a schedule during idle time (⚠ for the frequency, see GAPS).
- The user corrects any assistant's approach.
- A workflow of the same kind is manually repeated for the third time.

## 输入 · Inputs
待办清单、各助手近期回报、用户近期纠正原话、规则库、名册。

The to-do list, each assistant's recent reports, the user's recent correction wording, the rule base, and the roster.

## 分步流程 · Step-by-Step Process

### A. 巡检 · Patrol
1. **分工缝隙**：有没有任务没人认领、两个助手都在做、或某助手越权？
2. **交接卡点**：有没有转交后没回音的（单号没通知、报告没同步、草稿没处理）？
3. **待办遗留**：挂起项是否该再问一次用户、或标取消？
4. **临时助手**：批次结束未删除的，提醒用户。
5. 发现问题 → 派给对应助手处理；需要用户决定的编号汇总，**无事不打扰**。

1. **Division-of-labor gaps**: is any task unclaimed, being done by two assistants, or being done by an assistant beyond its authority?
2. **Handoff stalls**: is there anything that was forwarded but got no reply (a ticket not notified, a report not synced, a draft not processed)?
3. **Leftover to-dos**: should a parked item be raised with the user once more, or marked cancelled?
4. **Temporary assistants**: for those not deleted after a batch ends, remind the user.
5. Issues found → dispatch to the corresponding assistant to handle; consolidate items needing a user decision with numbering, and **do not disturb when there is nothing to report**.

### B. 规则沉淀 · Rule Consolidation
1. 用户纠正时，提炼成一条可执行规则：
   ```text
   [YYYY-MM-DD] 规则：<做什么 / 不做什么>（适用：<角色/场景>）
   依据：用户 HH:MM 原话「……」
   取代：<旧规则编号，如有>
   ```
2. 写入长期记忆 / 规则库，并同步给相关助手（规则变化时更新交接手册与变更记录）。
3. 被取代的旧规则标「已废止」，不删。
4. 规则冲突时以用户最新原话为准。

1. When the user corrects something, distill it into one executable rule:
   ```text
   [YYYY-MM-DD] 规则：<做什么 / 不做什么>（适用：<角色/场景>）
   依据：用户 HH:MM 原话「……」
   取代：<旧规则编号，如有>
   ```
   ([YYYY-MM-DD] Rule: <what to do / what not to do> (applies to: <role/scenario>). Basis: the user's HH:MM exact words "…". Supersedes: <old rule ID, if any>.)
2. Write it into long-term memory / the rule base, and sync it to the relevant assistants (when a rule changes, update the handoff handbook and the change log).
3. Mark a superseded old rule "deprecated"; do not delete it.
4. When rules conflict, the user's latest exact words prevail.

### C. 技能沉淀 · Skill Consolidation
同一流程重复 ≥ 3 次（⚠ 阈值可配置）→ 写成技能：触发条件、输入、步骤、判定、模板、禁止项、自检清单（参考本包结构）。

A workflow repeated ≥ 3 times (⚠ threshold is configurable) → write it up as a skill: triggers, inputs, steps, decision rules, templates, prohibitions, and a self-check checklist (following this pack's structure).

## 判定规则 · Decision Rules
- 只有用户本人的话能成为规则；助手间的推断不能。
- 一条规则只写一件事。

- Only the user's own words can become a rule; inferences between assistants cannot.
- One rule states only one thing.

## 交接对象 · Handoff Parties
全部助手（规则同步）、用户（需要决定的事项）。

All assistants (rule sync), the user (matters needing a decision).

## 禁止项 · Prohibited
- 无更新时给用户发「一切正常」。
- 把一次性指示写成长期规则（用户明确说「以后都这样」才算长期）。⚠ 判断标准见 GAPS。

- Sending the user an "all is well" message when there is no update.
- Turning a one-off instruction into a long-term rule (it counts as long-term only when the user explicitly says "always do it this way from now on"). ⚠ For the criterion, see GAPS.

## 自检清单 · Self-Check Checklist
- [ ] 分工、交接、待办、临时助手都巡检了 — Division of labor, handoffs, to-dos, and temporary assistants have all been patrolled
- [ ] 新规则带日期与原话 — New rules carry a date and the exact words
- [ ] 旧规则已标废止 — Old rules have been marked deprecated
- [ ] 相关助手已同步 — The relevant assistants have been synced
