---
name: test-case-publish
description: >-
  缺陷助手把评审通过的用例稿写入缺陷/用例管理系统时使用：按系统要求的富文本格式写入、覆盖前先备份、写入后回读核对条数与格式，回报文档编号、链接、条数。
  Used when the defect assistant writes an approved case draft into the defect / case management system: write in the system's required rich-text format, back up before overwriting, read back after writing to verify count and format, and report the document ID, link, and count.
---

# 用例落库（写入 {DEFECT_SYSTEM}） · Publishing Cases (Writing into {DEFECT_SYSTEM})

## 适用角色 · Applicable Roles
缺陷助手（唯一可写 {DEFECT_SYSTEM} 的角色）。

The defect assistant (the only role allowed to write to {DEFECT_SYSTEM}).

## 触发条件 · Triggers
- 用例稿评审通过（或用户说直接落库）。
- 已落库用例需要按最终口径 / 关单口径更新。

- The case draft is approved (or the user says to publish directly).
- Published cases need updating per a final interpretation / close interpretation.

## 输入（由测试助手交来） · Inputs (handed over by the test assistant)
```text
文件：<路径>/<需求ID>_cases.<富文本>.html（另附 .md / .json 供核对）
目标：新建文档《<需求ID>-<简称> 测试用例》｜或原地更新文档 <编号>
条数：共 N 条（P0 a / P1 b / P2 c）
评审依据：<评审人> <时间> 「通过」
```

```text
File: <path>/<requirement ID>_cases.<rich text>.html (with .md / .json also attached for verification)
Target: create a new document "<requirement ID>-<short name> Test Cases" | or update document <ID> in place
Count: N cases total (P0 a / P1 b / P2 c)
Review basis: <reviewer> <time> "approved"
```

## 分步流程 · Step-by-Step Process
1. **核对输入**：三份文件条数一致；有评审通过依据；缺任何一项退回测试助手。
2. **格式检查**：内容必须是 {DEFECT_SYSTEM_RICH_FORMAT}：
   - 段落、标题使用系统原生段落/标题块；
   - 列表用真实有序/无序列表元素；
   - 表格用真实表格元素；
   - 链接用真实超链接；
   - **禁止 Markdown 原文**（`|---|`、裸 `##`、行首 `- `）。
3. **覆盖前备份**：原地更新时先导出旧版本到 `<工作目录>/doc_backup/<文档号>_before_<改动简称>.html`。
4. **写入**：新建或原地更新（不新建重复文档）。
5. **回读核对**：
   - 无 `|---`、无裸 `##`；
   - 摘要表链接可点；
   - 条数与输入一致（**以系统回读为准**，口头数字有误要更正）；
   - 与备份 diff 只有预期改动。
6. **回报**（给主管，抄测试助手）：
   ```text
   结论：已落库
   文档：<编号> <可点链接>
   条数：N（P0 a / P1 b / P2 c）——回读确认
   备份：<路径>（如为更新）
   失败项：无 / ……
   ```

1. **Verify inputs**: the three files have matching counts; there is a basis for approval; if any is missing, return to the test assistant.
2. **Format check**: the content must be {DEFECT_SYSTEM_RICH_FORMAT}:
   - paragraphs and headings use the system's native paragraph/heading blocks;
   - lists use real ordered/unordered list elements;
   - tables use real table elements;
   - links use real hyperlinks;
   - **raw Markdown is forbidden** (`|---|`, bare `##`, line-leading `- `).
3. **Back up before overwriting**: for in-place updates, first export the old version to `<工作目录>/doc_backup/<文档号>_before_<改动简称>.html`.
4. **Write**: create new or update in place (do not create a duplicate document).
5. **Read back and verify**:
   - no `|---`, no bare `##`;
   - summary-table links are clickable;
   - the count matches the input (**the system read-back is authoritative**; correct any erroneous verbal number);
   - the diff against the backup shows only the intended changes.
6. **Report** (to the supervisor, cc the test assistant):
   ```text
   Conclusion: published
   Document: <ID> <clickable link>
   Count: N (P0 a / P1 b / P2 c) — confirmed by read-back
   Backup: <path> (if an update)
   Failures: none / ……
   ```

## 判定规则 · Decision Rules
- 回读条数 ≠ 输入条数 → 不算完成，排查后重写。
- 系统渲染出 Markdown 原文 → 格式错误，重写。

- Read-back count ≠ input count → not complete; investigate and rewrite.
- The system renders raw Markdown → format error; rewrite.

## 交接对象 · Handoff Targets
上游：测试助手 / 主管。下游：主管（汇总给用户）。

Upstream: the test assistant / supervisor. Downstream: the supervisor (who reports to the user).

## 禁止项 · Prohibitions
- 未评审就落库（用户明确说直接落库除外）。
- 覆盖前不备份。
- 自己改用例内容（只负责落库；内容问题退回测试助手）。
- 判断用例是否正确。

- Publishing without review (except when the user explicitly says to publish directly).
- Not backing up before overwriting.
- Editing case content yourself (responsible only for publishing; return content issues to the test assistant).
- Judging whether a case is correct.

## 常见错误 · Common Mistakes
- 把 md 直接贴进系统，出现一堆 `|---|`。
- 新建了第二份同名文档而不是原地更新。

- Pasting md straight into the system, producing a pile of `|---|`.
- Creating a second document with the same name instead of updating in place.

## 自检清单 · Self-Check List
- [ ] 有评审依据 · There is a basis for approval
- [ ] 已备份（更新时）· Backed up (when updating)
- [ ] 回读：格式、链接、条数、diff 全部通过 · Read-back: format, links, count, and diff all pass
- [ ] 回报含编号、链接、条数 · The report includes the ID, link, and count
