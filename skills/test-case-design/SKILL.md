---
name: test-case-design
description: >-
  测试助手为一个需求生成测试用例稿时使用：读需求与原型，按正常/异常/边界/状态流转/幂等/并发/权限与数据范围拆用例，产出 md + json + 可视化稿三份同源文件，列出待确认差异，交评审后落库。
  Used when the test assistant generates a test-case draft for a requirement: read the requirement and prototype, break cases down by normal / exception / boundary / state transition / idempotency / concurrency / permission & data scope, produce three same-source files (md + json + visual draft), list open discrepancies to confirm, and hand off for review before publishing to the repository.
---

# 测试用例设计（生成逻辑） · Test Case Design (Generation Logic)

## 适用角色 · Applicable Roles
测试助手（主责）；临时测试助手可写稿，交测试助手合并。

Test assistant (primary owner); a temporary test assistant may write a draft and hand it to the test assistant to merge.

## 触发条件 · Triggers
- 需求提测或即将提测，需要新写用例。
- 需求最终结论已定，需要按最终口径统一修改用例。
- 用户手动关闭某缺陷（口径变化），需要更新对应用例预期。

- The requirement is submitted for testing or about to be, and new cases need to be written.
- The final decision on the requirement is settled, and cases need to be revised uniformly to the final interpretation.
- The user manually closes a defect (interpretation changes), and the corresponding case's expected result needs updating.

> **不触发**：需求还在讨论、变更未定稿 → 不改用例，只在口径台账记「讨论中」，提测时统一改。
>
> **Not triggered**: the requirement is still under discussion and the change is not finalized → do not change cases; only record "under discussion" in the interpretation ledger, and revise uniformly at test submission.

## 输入 · Inputs
1. 需求正文、需求文档最新版、原型、接口文档。
2. 关联任务与关联缺陷（含已关闭的，用来补回归点）。
3. 需求讨论群里产品/研发发布的变更（由通知助手只读查）。
4. 口径台账（已有口径、已确认非 bug、本期不测）。
5. 权限分配文档 {PERMISSION_DOC}（涉及多角色时）。

1. The requirement text, the latest version of the requirement document, the prototype, and the API documentation.
2. Linked tasks and linked defects (including closed ones, used to add regression points).
3. Changes posted by product/development in the requirement discussion group (read-only lookup by the notification assistant).
4. The interpretation ledger (existing interpretations, items confirmed as not-a-bug, items out of scope this round).
5. The permission assignment document {PERMISSION_DOC} (when multiple roles are involved).

## 分步流程 · Step-by-Step Process

### 第 1 步：读需求，建「需求要点表」 · Step 1: Read the requirement and build a "requirement points table"
逐段拆出可测试的要点，每条一行：
`要点编号 · 来源（文档章节/原型页/群消息）· 规则原文 · 涉及端 · 涉及角色`
同时标出：
- **差异**：需求与原型冲突、文档前后矛盾、文档与群里变更不一致；
- **缺口**：没写清的（默认值、上限、超时、排序、空状态、文案、错误提示、时区、取整规则）。

Break out testable points paragraph by paragraph, one per line:
`point ID · source (doc section / prototype page / group message) · original rule text · affected client · affected role`
At the same time, flag:
- **Discrepancies**: requirement conflicts with prototype, internal contradictions in the document, mismatch between the document and group changes;
- **Gaps**: things not clearly specified (default values, upper limits, timeouts, sorting, empty states, copy, error messages, time zone, rounding rules).

### 第 2 步：列差异，问口径 · Step 2: List discrepancies and ask for interpretation
- 把差异和缺口整理成编号清单，**先查口径台账和群消息**是否已有答案。
- 没有答案的交主管 → 经通知助手问产品/研发（委婉格式）。
- 得到口径后写进口径台账：**日期、版本、谁说的、原文位置、影响用例**。
- 没得到口径前，用例标「待确认」，不阻塞其他用例的编写。

- Organize discrepancies and gaps into a numbered list, and **first check the interpretation ledger and group messages** for existing answers.
- For those without answers, hand off to the supervisor → ask product/development via the notification assistant (in a tactful format).
- Once an interpretation is obtained, record it in the interpretation ledger: **date, version, who said it, location of the original text, affected cases**.
- Before an interpretation is obtained, mark the case "to be confirmed" and do not block the writing of other cases.

### 第 3 步：按维度拆用例（覆盖矩阵） · Step 3: Break cases down by dimension (coverage matrix)
对每个要点，逐一过以下维度，适用就出用例：

For each point, go through the following dimensions one by one, and produce a case wherever applicable:

| 维度 · Dimension | 要覆盖的点 · Points to cover | 示例写法 · Example |
|---|---|---|
| 正常流程 · Normal flow | 主路径、每个可选分支、每个入口 · Main path, each optional branch, each entry point | 「从列表页进入 → 提交 → 详情页状态正确」 · "Enter from the list page → submit → status correct on the detail page" |
| 异常 · Exception | 必填缺失、格式错误、依赖服务失败、网络中断、超时、第三方回调失败 · Missing required fields, format errors, dependency service failure, network interruption, timeout, third-party callback failure | 「第三方返回失败时，单据回滚并给出可理解提示，不直接显示错误码」 · "When the third party returns a failure, the record rolls back and a comprehensible message is shown, not a raw error code" |
| 边界 · Boundary | 最小/最大值、刚好等于、±1、空、超长、特殊字符、临界时间点（如 14:59:59 / 15:00:00 / 15:00:01） · Min/max values, exactly equal, ±1, empty, overlength, special characters, critical time points (e.g. 14:59:59 / 15:00:00 / 15:00:01) | 「数量等于上限可提交；上限+1 被拦且提示上限值」 · "Quantity equal to the limit can be submitted; limit+1 is blocked with the limit value shown" |
| 状态流转 · State transition | 每个合法流转、每个非法流转、终态不可逆、并行状态冲突 · Each legal transition, each illegal transition, irreversible terminal state, parallel state conflict | 「已取消的单据不能再被确认」 · "A cancelled record cannot be confirmed again" |
| 幂等 · Idempotency | 重复提交、重复回调、重试、刷新后重复操作 · Duplicate submission, duplicate callback, retry, repeated operation after refresh | 「同一回调重复 3 次，只处理一次，余额变动只发生一次」 · "The same callback repeated 3 times is processed only once, and the balance changes only once" |
| 并发 · Concurrency | 多端同时操作、多账号抢同一资源、多 IP 同时提交 · Simultaneous operation from multiple clients, multiple accounts contending for one resource, multiple IPs submitting at once | 「两个账号同时占用最后 1 个名额，只有 1 个成功」 · "Two accounts take the last slot simultaneously; only one succeeds" |
| 乱序/延迟 · Out-of-order / delay | 回调先到后到、延迟到达、过期后到达 · Callbacks arriving early/late, delayed arrival, arrival after expiry | 「失败回调晚于成功回调到达，最终状态仍为成功」 · "A failure callback arriving after a success callback still leaves the final state as success" |
| 权限与数据范围 · Permission & data scope | 每个角色能见的菜单、能操作的按钮、能看到的数据范围、越权访问 · Menus each role can see, buttons each can operate, data scope each can view, unauthorized access | 「子组织操作员只能看到被授权组织的数据，改 URL 参数访问其他组织返回无权限」 · "A sub-org operator can only see data of authorized orgs; altering the URL parameter to access other orgs returns no-permission" |
| 展示与格式 · Display & format | 金额/数量小数位、时区、多语言、空状态、长文本截断、乱码 · Decimal places for amount/quantity, time zone, i18n, empty state, long-text truncation, garbled text | 「展示类金额统一两位小数；输入框保持整数」 · "Displayed amounts use two decimals uniformly; input fields stay integer" |
| 兼容与环境 · Compatibility & environment | 端（移动网页/PC/App）、视口、浏览器、弱网 · Clients (mobile web / PC / App), viewport, browser, weak network | 「移动视口 430×932 下按钮不遮挡」 · "At mobile viewport 430×932 the button is not obscured" |
| 数据一致性 · Data consistency | 前台与后台、列表与详情、报表与明细、导出与页面 · Front-end vs back-end, list vs detail, report vs line items, export vs page | 「报表汇总值 = 明细之和」 · "Report total = sum of line items" |
| 跑批/定时 · Batch job / scheduled | 定时任务触发前后、T+1 数据 · Before and after a scheduled task fires, T+1 data | 「跑批前不显示，跑批后显示；跑批前看不到不算缺陷」 · "Not shown before the batch job, shown after; not visible before the job is not a defect" |
| 回归 · Regression | 关联缺陷（含已关闭）复现点、被改动影响的老功能 · Reproduction points of linked defects (including closed), old features affected by the change | 「#历史缺陷 场景不再复现」 · "The #historical-defect scenario no longer reproduces" |

拆分原则：
- **一条用例只验证一个预期**；多个预期拆多条。
- 前置**增量书写**：公共前置只在文档开头写一次，单条只写额外前置。
- 异常用例的预期必须写清「**合理兜底 + 易用性提示**」，不能接受「直接甩错误码」。
- 本期不测的写进「本期不测」并标灰，不出用例或出用例标「本期不测」。

Breakdown principles:
- **One case verifies only one expected result**; split multiple expectations into multiple cases.
- Preconditions are written **incrementally**: common preconditions appear once at the top of the document, and each case states only its extra preconditions.
- The expected result of an exception case must clearly state "**reasonable fallback + usability message**"; "just dumping an error code" is not acceptable.
- Items out of scope this round go into "Out of scope this round" and are greyed out; produce no case, or produce a case marked "Out of scope this round".

### 第 4 步：定优先级与类型 · Step 4: Set priority and type
- 优先级：P0 / P1 / P2（判定细则未统一，见 GAPS；默认：主路径与金额与数据正确性类 P0，常用异常与权限 P1，展示与低频边界 P2）。
- 类型：功能 / 异常 / 边界 / 权限 / 性能 / 兼容 / 回归。
- 编号：`TC-<端>-<模块>-<F|E>-NNN`（F=功能，E=异常/边界），如 `TC-WEB-ORDER-F-001`、`TC-ADM-REPORT-E-016`。

- Priority: P0 / P1 / P2 (detailed criteria not yet unified, see GAPS; default: main path, amount, and data-correctness as P0; common exceptions and permissions as P1; display and low-frequency boundaries as P2).
- Type: functional / exception / boundary / permission / performance / compatibility / regression.
- ID: `TC-<client>-<module>-<F|E>-NNN` (F = functional, E = exception/boundary), e.g. `TC-WEB-ORDER-F-001`, `TC-ADM-REPORT-E-016`.

### 第 5 步：产出三份同源文件 · Step 5: Produce three same-source files
放在 `<工作目录>/<需求简称>/`：
1. `<需求ID>_cases.md`——给人看；
2. `<需求ID>_cases.json`——给缺陷助手批量落库（结构见 `templates/test-cases.schema.json`）；
3. `<需求ID>_cases.<富文本>.html`——可视化稿，浏览器直接打开，同时作为落库格式（{DEFECT_SYSTEM_RICH_FORMAT}）。

三份必须**同源生成**（从 json 渲染出 md 与 html），条数一致。

Place them under `<工作目录>/<需求简称>/`:
1. `<需求ID>_cases.md` — for people to read;
2. `<需求ID>_cases.json` — for the defect assistant to bulk-publish to the repository (structure in `templates/test-cases.schema.json`);
3. `<需求ID>_cases.<富文本>.html` — the visual draft, opened directly in a browser, and also the publish format ({DEFECT_SYSTEM_RICH_FORMAT}).

The three must be **generated from the same source** (md and html rendered from the json), with identical case counts.

### 第 6 步：自评审后提交评审 · Step 6: Self-review, then submit for review
按 `test-case-review` 的自查清单过一遍，再交评审。

Go through the self-check list in `test-case-review` once, then submit for review.

## 文档结构（md 与 html 一致） · Document Structure (md and html identical)
```text
# <需求ID>-<需求简称> 测试用例
## 摘要表
| 需求文档 | 需求条目 | 原型 | 用例文档自身 | 环境 |   ← 全部可点链接
## 公共前置（只写一次）
## 待确认清单（编号，含差异来源与当前默认）
## 覆盖一览（要点 × 维度矩阵；各优先级条数）
## 模块 A
### TC-WEB-A-F-001 标题
- 优先级 / 类型 / 模块
- 前置（增量）
- 数据
- 步骤 1. 2. 3.
- 预期
## 模块 B …
## 本期不测
## 变更记录（MM-DD 按 <口径/缺陷单> 更新了哪些条）
```

英文对照（结构相同，仅用于理解，实际文档保持上面的中文标题）· English reference (same structure, for understanding only; the actual document keeps the Chinese headings above):
```text
# <requirement ID>-<short name> Test Cases
## Summary table
| Requirement doc | Requirement item | Prototype | The case document itself | Environment |   ← all clickable links
## Common preconditions (written once)
## To-be-confirmed list (numbered, with discrepancy source and current default)
## Coverage overview (points × dimensions matrix; case count per priority)
## Module A
### TC-WEB-A-F-001 title
- priority / type / module
- preconditions (incremental)
- data
- steps 1. 2. 3.
- expected
## Module B …
## Out of scope this round
## Change log (on MM-DD, which items were updated per <interpretation / defect ticket>)
```

## 判定规则 · Decision Rules
- 需求与原型冲突 → 列差异问，不自行选一个。
- 群里变更新于文档 → 以群里为准，但只采纳**已定稿**的；讨论中的标待确认。
- 用户手动关单 → 对应用例预期按关单口径更新，并注「MM-DD 按 #单号 关单口径更新」。

- Requirement conflicts with prototype → list the discrepancy and ask; do not pick one on your own.
- A group change is newer than the document → the group prevails, but adopt only what is **finalized**; mark items under discussion as to-be-confirmed.
- The user manually closes a ticket → update the corresponding case's expected result to the close interpretation, and note "updated on MM-DD per the close interpretation of #ticket".

## 交接对象 · Handoff Targets
- 评审：见 `test-case-review`。
- 落库：缺陷助手（`test-case-publish`）。
- 口径问题：主管 → 通知助手。

- Review: see `test-case-review`.
- Publishing to the repository: the defect assistant (`test-case-publish`).
- Interpretation questions: supervisor → notification assistant.

## 禁止项 · Prohibitions
- 自己写缺陷系统（落库交缺陷助手）。
- 需求未定稿就改用例。
- 预期写「系统报错」「提示错误码」这种不可判定的描述。
- 一条用例塞多个预期。

- Writing to the defect system yourself (publishing is the defect assistant's job).
- Changing cases before the requirement is finalized.
- Writing undecidable expected results such as "system errors out" or "shows an error code".
- Packing multiple expected results into one case.

## 常见错误 · Common Mistakes
- 只写正常流程，漏了幂等、并发、乱序。
- 前置每条都抄一遍，文档冗长。
- md 和 json 条数不一致（手工分别改导致）。
- 没把关联的已关闭缺陷转成回归用例。

- Writing only the normal flow, missing idempotency, concurrency, and out-of-order.
- Copying preconditions into every case, making the document verbose.
- md and json case counts not matching (caused by editing each by hand separately).
- Not converting linked closed defects into regression cases.

## 自检清单 · Self-Check List
- [ ] 每个要点至少过了一遍覆盖矩阵 · Each point has been run through the coverage matrix at least once
- [ ] 差异/缺口已编号列出，已得到口径的写进台账 · Discrepancies/gaps are numbered and listed, and those with an interpretation are recorded in the ledger
- [ ] 异常预期有兜底与友好提示 · Exception expectations include a fallback and a friendly message
- [ ] 三份文件同源、条数一致、链接可点 · The three files are same-source, counts match, and links are clickable
- [ ] 优先级与类型每条都有 · Every case has a priority and type
- [ ] 本期不测已单列 · Out-of-scope-this-round items are listed separately
