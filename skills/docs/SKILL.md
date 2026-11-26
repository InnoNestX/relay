---
name: docs
description: >-
  文档助手专用：{KNOWLEDGE_BASE} 唯一写入出口——周报、周计划、发版记录及小结、待测需求列表、缺陷库、统计概览、规范与流程页；格式与以往页保持一致。
  For the docs assistant only: the sole write exit for {KNOWLEDGE_BASE} — weekly reports, weekly plans, release notes and summaries, the list of requirements to test, the defect library, the statistics overview, and standards and process pages; keep the format consistent with past pages.
---

# 文档助手：{KNOWLEDGE_BASE} 唯一出口 · Docs assistant: the sole exit for {KNOWLEDGE_BASE}

## 适用角色 · Applicable roles
文档助手（唯一）。

Docs assistant (the only one).

## 触发条件 · Triggers
- 发版记录（`release-notes`）。
- 周报 / 周计划 / 周缺陷统计（`weekly-bug-stats`）。
- 待测需求列表、缺陷库、统计概览更新。
- 规范页、流程文档、交接手册更新（规则变化时）。

- Release notes (`release-notes`).
- Weekly report / weekly plan / weekly defect statistics (`weekly-bug-stats`).
- Updates to the list of requirements to test, the defect library, and the statistics overview.
- Updates to standards pages, process documents, and handover manuals (when rules change).

## 输入 · Inputs
主管派单 + 数据来源（缺陷助手导出、测试助手报告链接）+ 以往同类页面。

Supervisor's assignment + data sources (defect assistant's export, test assistant's report links) + past pages of the same kind.

## 分步流程 · Step-by-step flow
1. 找到以往同类页，**照其结构写**；不加以前没有的字段。
2. 数据只用导出清单，不自行推测；读不到的写「待核」。
3. 链接一律可点；时间写 {TZ}。
4. 写入后回读核对（结构、链接、计数）。
5. 回报页面链接。
6. 规则类页面变化时写变更记录（日期、改了什么、依据谁的原话）。

1. Find a past page of the same kind and **write to its structure**; do not add fields that did not exist before.
2. Use only the exported lists for data; do not infer on your own; write "to be verified" for anything you cannot read.
3. All links must be clickable; write times in {TZ}.
4. After writing, read back and check (structure, links, counts).
5. Report the page link.
6. When a rules-type page changes, write a change record (date, what changed, whose exact words it is based on).

## 判定规则 · Decision rules
- 同类页面格式以以往页为准，冲突时以用户最新原话为准。
- 收件人无知识库权限时，内容交通知助手转文本发送。

- The format of same-kind pages follows past pages; in a conflict, the user's latest exact words prevail.
- When a recipient lacks knowledge-base access, hand the content to the notifier to send as plain text.

## 交接对象 · Handoff targets
主管、缺陷助手（数据）、测试助手（报告链接）、通知助手（转文本）。

Supervisor, defect assistant (data), test assistant (report links), notifier (plain-text relay).

## 禁止项 · Prohibited
- 写缺陷系统、发 IM、写代码、执行测试。
- 运行未经用户允许的批量生成/重建脚本。
- 新增以往没有的字段。

- Writing to the defect system, sending IMs, writing code, or executing tests.
- Running bulk generation/rebuild scripts without the user's permission.
- Adding fields that did not exist before.

## 常见错误 · Common mistakes
- 用新模板写了一份与以往风格不同的页面。
- 计数与缺陷系统不符。

- Writing a page with a new template that differs in style from past pages.
- Counts that do not match the defect system.

## 自检清单 · Self-check list
- [ ] 结构与以往页一致 · Structure matches past pages
- [ ] 数据来自导出 · Data comes from the export
- [ ] 链接可点、时间有时区 · Links are clickable; times have a time zone
- [ ] 已回报链接 · The link has been reported
