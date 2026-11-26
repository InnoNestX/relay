---
name: release-notes
description: >-
  文档助手写知识库发版记录与小结时使用：首块为「小结」，每端一行按固定端顺序，「端：新增：A、B；优化：C；修复：D」每段最多 3 个短语；修复只写无需求关联的老缺陷；格式与收录口径必须与以往发版页完全一致。
  For the docs assistant when writing knowledge-base release notes and summaries: the first block is the "Summary", one line per platform in a fixed platform order, in the form "Platform: Added: A, B; Improved: C; Fixed: D", with at most 3 phrases per segment; under Fixed, list only legacy defects with no requirement association; the format and inclusion criteria must match past release pages exactly.
---

# 发版记录与小结 · Release notes and summary

## 适用角色 · Applicable roles
文档助手（写知识库）；缺陷助手（只读导出条目）；主管（派单与汇总）。

Docs assistant (writes the knowledge base); defect assistant (read-only export of items); supervisor (assigns and consolidates).

## 触发条件 · Triggers
- 某环境发版，需要写发版记录页。
- 用户要求补写或更新发版小结。

- An environment ships a release, requiring a release-notes page.
- The user asks to add or update a release summary.

## 输入 · Inputs
- 本次发版范围内的需求、任务、缺陷清单（缺陷助手导出：标题、类型、关联需求、关闭人、端、业务范围）。
- **以往发版页**（作为格式和收录口径的唯一标准）。

- The list of requirements, tasks, and defects within this release's scope (exported by the defect assistant: title, type, associated requirement, closer, platform, business domain).
- **Past release pages** (the single standard for format and inclusion criteria).

## 收录口径 · Inclusion criteria
- 只收 {RELEASE_SCOPE_CLOSERS} **关闭**的、属于 {RELEASE_SCOPE_DOMAIN} 的需求、任务和缺陷。
- 其他人关闭的、其他业务范围的**都不收**。
- ⚠ 口径如有变化以用户最新原话为准。

- Include only requirements, tasks, and defects **closed** by {RELEASE_SCOPE_CLOSERS} and belonging to {RELEASE_SCOPE_DOMAIN}.
- Items closed by others, or in other business domains, are **excluded**.
- ⚠ If the criteria change, the user's latest exact words prevail.

## 分步流程 · Step-by-step flow
1. **读以往发版页**：记下块结构、字段、表格列、措辞风格。
2. **筛条目**：按收录口径过滤。
3. **分端归类**：按 {PLATFORM_ORDER}（例：移动网页、PC、App、平台后台、租户后台）。
4. **写小结**（页面**首个正文块**，用醒目块样式）：
   ```text
   小结
   移动网页：新增：A、B；优化：C；修复：D
   PC：新增：E；修复：F
   平台后台：新增：G、H、I
   ```
   - 每端一行，按固定顺序；不涉及的端不写；
   - 每段（新增/优化/修复）**最多 3 个短语**；
   - **修复只写无需求关联的老缺陷**（1–3 点）；
   - 不写来源注释。
5. **写正文**：与以往页**完全相同的结构**；**不加以前没有的字段**（如关闭时间）。
6. **自检后发布**，回报页面链接。

1. **Read past release pages**: note the block structure, fields, table columns, and wording style.
2. **Filter items**: filter per the inclusion criteria.
3. **Group by platform**: per {PLATFORM_ORDER} (e.g. mobile web, PC, App, platform back office, tenant back office).
4. **Write the summary** (the page's **first body block**, using a prominent block style):
   ```text
   小结
   移动网页：新增：A、B；优化：C；修复：D
   PC：新增：E；修复：F
   平台后台：新增：G、H、I
   ```
   (The block above reads: "Summary — Mobile web: Added: A, B; Improved: C; Fixed: D / PC: Added: E; Fixed: F / Platform back office: Added: G, H, I".)
   - One line per platform, in the fixed order; omit platforms not involved;
   - Each segment (Added / Improved / Fixed) has **at most 3 phrases**;
   - **Under Fixed, list only legacy defects with no requirement association** (1–3 points);
   - Do not write source annotations.
5. **Write the body**: with the **exact same structure** as past pages; **do not add fields that did not exist before** (such as a close time).
6. **Self-check, then publish**, and report the page link.

## 判定规则 · Decision rules
- 格式、字段、收录口径与以往页不一致 = 不合格，返工。
- 有需求关联的缺陷修复归在对应需求下，不进「修复」。

- Any inconsistency in format, fields, or inclusion criteria versus past pages = fail; rework it.
- Defect fixes that have a requirement association go under the corresponding requirement, not under "Fixed".

## 交接对象 · Handoff targets
缺陷助手（导出）、主管（回报）。

Defect assistant (export), supervisor (report-back).

## 禁止项 · Prohibited
- 新增以往没有的字段或栏目。
- 收录范围外的条目。
- 小结超过 3 个短语一段。

- Adding fields or columns that did not exist before.
- Items outside the inclusion scope.
- A summary segment with more than 3 phrases.

## 常见错误 · Common mistakes
- 加了「关闭时间」列。
- 把别人关闭的条目收进来。

- Adding a "close time" column.
- Including items closed by others.

## 自检清单 · Self-check list
- [ ] 首块为小结，端顺序正确 · The first block is the summary, with the correct platform order
- [ ] 每段 ≤ 3 短语 · Each segment has ≤ 3 phrases
- [ ] 修复只含无需求关联的老缺陷 · Fixed contains only legacy defects with no requirement association
- [ ] 结构与以往页一致，无新增字段 · Structure matches past pages, with no added fields
- [ ] 收录口径正确 · The inclusion criteria are correct
