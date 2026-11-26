---
name: test-case-review
description: >-
  用例稿写完、落库之前使用：先由测试助手按清单自评审，再交用户（或指定评审人）评审，按评审意见修改，评审通过后才交缺陷助手落库。
  Used after a case draft is written and before it is published: the test assistant first self-reviews against the checklist, then hands it to the user (or a designated reviewer) for review, revises per the review comments, and only after approval hands it to the defect assistant to publish.
---

# 测试用例评审 · Test Case Review

> 说明：用户要求「用例生成需要评审」。评审人、通过标准、评审时限等细则尚未明确，本技能给出默认做法，带 ⚠ 的项见 `multi-agent-skills-gaps.md`，由使用者按自己团队补充。
>
> Note: the user requires that "generated cases must be reviewed." The reviewer, approval criteria, review deadline, and other details are not yet defined; this skill provides defaults. Items marked ⚠ are covered in `multi-agent-skills-gaps.md`, to be filled in by the user per their own team.

## 适用角色 · Applicable Roles
- 测试助手：自评审、组织评审、按意见修改。
- 主管：把评审稿与待确认清单汇总给评审人，收集结论。
- 评审人：⚠ 默认是**用户本人**；可配置为产品/研发/测试负责人。

- Test assistant: self-review, organize the review, revise per comments.
- Supervisor: compile the review draft and the to-be-confirmed list for the reviewer, and collect the conclusion.
- Reviewer: ⚠ by default the **user themselves**; configurable to product/development/QA lead.

## 触发条件 · Triggers
- 新用例稿完成；
- 已落库用例做了**批量**修改（提测时按最终结论统一改、口径大改）；
- 单条小改（按关单口径更新预期）**不必走完整评审**，在变更记录里注明即可。⚠

- A new case draft is complete;
- Published cases have been **bulk**-modified (unified revision to the final decision at test submission, or a major interpretation change);
- A small single-case change (updating the expected result per a close interpretation) **does not need a full review**; just note it in the change log. ⚠

## 输入 · Inputs
- 三份用例稿（md / json / 可视化稿）。
- 需求要点表、待确认清单、口径台账。

- The three case drafts (md / json / visual draft).
- The requirement points table, the to-be-confirmed list, the interpretation ledger.

## 分步流程 · Step-by-Step Process

### 第 1 步：自评审（测试助手，必做） · Step 1: Self-review (test assistant, mandatory)
逐项过「自评审清单」（见下），不通过的先改。自评审结果写在稿末：
```text
自评审：通过（YYYY-MM-DD HH:MM {TZ}）
覆盖：要点 N 个，全部覆盖；P0 a / P1 b / P2 c；共 M 条
待确认：K 条（编号见待确认清单）
```

Go through the "self-review checklist" (below) item by item, fixing any that fail first. Write the self-review result at the end of the draft:
```text
Self-review: passed (YYYY-MM-DD HH:MM {TZ})
Coverage: N points, all covered; P0 a / P1 b / P2 c; M cases total
To be confirmed: K items (IDs in the to-be-confirmed list)
```

### 第 2 步：提交评审 · Step 2: Submit for review
主管把以下内容一条消息发给评审人：
```text
<需求名称> 用例稿待评审
可视化稿：<可点链接>
条数：共 M 条（P0 a / P1 b / P2 c），覆盖要点 N 个
待确认（需你定口径）：1. … 2. …
重点请看：<高风险模块 / 与原型冲突处>
回复方式：「通过」/「按编号改：1. … 2. …」
```

The supervisor sends the reviewer the following in a single message:
```text
<requirement name> case draft awaiting review
Visual draft: <clickable link>
Count: M cases total (P0 a / P1 b / P2 c), covering N points
To be confirmed (needs your interpretation): 1. … 2. …
Please focus on: <high-risk modules / conflicts with prototype>
How to reply: "approved" / "fix by number: 1. … 2. …"
```

### 第 3 步：处理评审意见 · Step 3: Handle review comments
- 每条意见编号记录：`意见编号 · 涉及用例 · 意见 · 处理（已改/不改+理由）`。
- 意见涉及口径的，写进口径台账（谁说的、何时）。
- 改完后只把**变更清单**发回确认，不重发整份。

- Record each comment with a number: `comment ID · affected case · comment · disposition (fixed / not fixed + reason)`.
- For comments involving interpretation, record them in the interpretation ledger (who said it, when).
- After revising, send back only the **change list** for confirmation, not the whole document.

### 第 4 步：评审通过 → 落库 · Step 4: Approved → publish
- 评审通过（评审人回复「通过」「可以落库」，或主管转述的用户原话）后，交缺陷助手按 `test-case-publish` 落库。
- 用户说「直接落库 / 直接做」→ 自评审通过即可落库，不等外部评审。

- After approval (the reviewer replies "approved" or "ok to publish", or the supervisor relays the user's own words), hand off to the defect assistant to publish per `test-case-publish`.
- If the user says "just publish / just do it" → publishing may proceed once self-review passes, without waiting for external review.

## 自评审清单（判定标准） · Self-Review Checklist (Acceptance Criteria)
**完整性 · Completeness**
- [ ] 需求要点表每一条都有对应用例（覆盖一览无空格）· Every point in the requirement points table has a corresponding case (no gaps in the coverage overview)
- [ ] 覆盖矩阵各维度已逐一判断（不适用的写明理由）· Each dimension of the coverage matrix has been assessed one by one (reasons given for those not applicable)
- [ ] 关联缺陷（含已关闭）已转回归用例 · Linked defects (including closed) have been converted into regression cases
- [ ] 权限类需求覆盖了每个角色的菜单、操作、数据范围和越权 · Permission requirements cover each role's menus, operations, data scope, and unauthorized access

**正确性 · Correctness**
- [ ] 每条预期与**最新需求**一致，引用的口径在台账里有来源 · Every expected result matches the **latest requirement**, and cited interpretations have a source in the ledger
- [ ] 无与原型冲突却未标待确认的条目 · No items that conflict with the prototype yet are left unmarked as to-be-confirmed
- [ ] 异常预期写了兜底与友好提示 · Exception expectations include a fallback and a friendly message

**可执行性 · Executability**
- [ ] 步骤可直接照做，数据可造（写明造数方式或数据来源）· Steps can be followed directly, data can be produced (state the data-creation method or data source)
- [ ] 预期可判定（有具体值、状态、文案），无「正常」「无异常」这类模糊词 · Expectations are decidable (concrete values, states, copy), with no vague words like "normal" or "no anomaly"
- [ ] 一条只验证一个预期 · Each case verifies only one expected result

**规范性 · Conformance**
- [ ] 编号、优先级、类型、模块齐全 · ID, priority, type, and module are all present
- [ ] 公共前置只写一次，单条前置是增量 · Common preconditions are written once, per-case preconditions are incremental
- [ ] 三份文件条数一致，链接可点 · The three files have matching counts and clickable links
- [ ] 无凭证、无真实个人信息 · No credentials, no real personal information

## 判定规则 · Decision Rules
- ⚠ 通过标准默认：评审人明确回复通过；或无阻断意见且所有「待确认」已有默认处理。
- 评审未通过不得落库；时间紧时可「先落库、标评审中」——需用户同意。⚠
- 评审人提出的意见与最新需求冲突 → 列出冲突，交评审人定，不擅自取舍。

- ⚠ Default approval criteria: the reviewer explicitly replies "approved"; or there are no blocking comments and all "to-be-confirmed" items have a default disposition.
- Cases must not be published without approval; when time is tight, "publish first, mark as under review" is allowed — requires the user's consent. ⚠
- When a reviewer's comment conflicts with the latest requirement → list the conflict and let the reviewer decide; do not choose on your own.

## 产出 · Outputs
- 评审意见处理表（附在用例稿末尾「评审记录」节）。
- 评审结论：通过时间、评审人、版本。

- A review-comment disposition table (appended in the "Review Record" section at the end of the case draft).
- The review conclusion: approval time, reviewer, version.

## 交接对象 · Handoff Targets
评审人（经主管）、缺陷助手（落库）、口径台账。

The reviewer (via the supervisor), the defect assistant (publishing), the interpretation ledger.

## 禁止项 · Prohibitions
- 跳过自评审直接送审。
- 未通过评审就落库（用户明确说直接落库除外）。
- 口头改了口径不进台账。

- Skipping self-review and sending straight to review.
- Publishing before approval (except when the user explicitly says to publish directly).
- Changing an interpretation verbally without recording it in the ledger.

## 常见错误 · Common Mistakes
- 评审意见只在聊天里，用例稿里找不到 → 必须写进「评审记录」。
- 改完整份重发，评审人不知道改了哪里 → 只发变更清单。

- Review comments live only in chat and cannot be found in the case draft → they must be written into the "Review Record".
- Resending the whole revised document so the reviewer cannot tell what changed → send only the change list.

## 自检清单 · Self-Check List
- [ ] 自评审记录已写在稿末 · The self-review record is written at the end of the draft
- [ ] 评审意见逐条有处理结论 · Each review comment has a disposition
- [ ] 口径类意见已进台账 · Interpretation-related comments have been recorded in the ledger
- [ ] 有明确的评审通过依据（原话 + 时间）· There is a clear basis for approval (original words + time)
