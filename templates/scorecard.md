# relay 流程评分卡 · Workflow Scorecard

> 配合 `skills/workflow-scorecard`。满分 100，通过线 `{PASS_SCORE}`（默认 80）。
> 用法：先做流程符合性硬门禁（见该技能第 1 步），通过后再按下表逐项打分。
> 每项按 **满分 / 半分 / 0 分** 给分，并在「依据」写一行指向具体留痕。
>
> Works with `skills/workflow-scorecard`. Max score 100, pass line `{PASS_SCORE}` (default 80).
> Usage: first run the process-compliance hard gate (see Step 1 of that skill); only after it passes, score each item in the table below.
> Score each item as **full / half / 0 points**, and in "Basis" write one line pointing to the specific trace.

| # | 维度 / Dimension | 权重 / Weight | 满分标准 / Full-score criterion | 半分 / Half | 0 分 / Zero |
|---|---|---:|---|---|---|
| 1 | 派单与授权 / Dispatch and authorization | 15 | 主管拆分清晰，派单带**用户原话+时间**、范围与边界明确 / Supervisor breaks down clearly; dispatch carries **the user's original words + time**, with clear scope and boundaries | 有派单但缺原话/时间或边界模糊 / Dispatched but missing original words/time or with vague boundaries | 无拆分或自行越权执行 / No breakdown, or executed beyond one's authority |
| 2 | 用例质量 / Case quality | 15 | md+json+可视化稿三件套齐全，**评审通过后**才落库 / The md+json+visual-draft trio is complete, and stored only **after review passes** | 用例有但缺一件套或未评审即落库 / Cases exist but one of the trio is missing, or stored before review | 无用例或凭空执行 / No cases, or executed out of thin air |
| 3 | 造数合规 / Data-fabrication compliance | 10 | 优先调用 `{DATA_FACTORY_PROJECT}`，用完**配置改回** / Prefer calling `{DATA_FACTORY_PROJECT}`, and **change the config back** when done | 自行造数未用指定项目，或配置未复原 / Fabricated data without the designated project, or did not restore the config | 用生产/他人数据或污染环境 / Used production / others' data, or polluted the environment |
| 4 | 执行与判定 / Execution and judgment | 20 | **逐条证据**、无头优先、**按最新需求判定**、尽快测完 / **Per-case evidence**, headless-first, **judged by the latest requirement**, finished as fast as possible | 证据不全或判定依据旧需求 / Incomplete evidence, or judged by an old requirement | 无证据或主观判定 / No evidence, or subjective judgment |
| 5 | 报告与同步 / Reporting and synchronization | 15 | 结论进**在线报告**，编号**聊天/报告/缺陷三处同步**，汇总含可点链接 / Conclusions go into the **online report**, numbering is **synchronized across chat/report/defect**, and the summary contains clickable links | 报告在但三处未同步或只给路径 / Report exists but the three places are not synchronized, or only a path is given | 无在线报告 / No online report |
| 6 | 缺陷与通知 / Defects and notification | 10 | 提单四问+极简格式+严重度映射，**提完即通知**对应研发 / Ticket's four questions + minimalist format + severity mapping, and **notify** the relevant dev **right after filing** | 提单但格式/映射不规范或未通知 / Filed but with non-standard format/mapping, or no notification | 该提未提或私自改缺陷系统 / Failed to file what should be filed, or modified the defect system without authorization |
| 7 | 安全红线 / Safety red lines | 15 | 凭证不入代码/库、日志脱敏、**授权才提交部署**、生产只读 / Credentials never enter code/repo, logs redacted, **commit/deploy only when authorized**, production read-only | 有轻微疏漏（如未脱敏截图）已补救 / A minor lapse (e.g. an un-redacted screenshot) that has been remediated | 触碰红线（泄凭证/擅自部署/改生产） / Crossed a red line (leaked credentials / deployed without authorization / modified production) |
| | **合计 / Total** | **100** | | | |

## 结论行 · Conclusion Line

```text
流程：符合 / 不符合（缺失环节：…）
得分：NN / 100（阈值 {PASS_SCORE}）
判定：通过 / 重跑（第 k 轮，待补：…）/ 升级（附扣分项）
```
译文 / English:
```text
Process: compliant / non-compliant (missing step: …)
Score: NN / 100 (threshold {PASS_SCORE})
Judgment: Pass / Rerun (round k, to be filled: …) / Escalate (with deduction items attached)
```

## 评分示例（虚构，便于理解） · Scoring Example (fictional, for illustration)

> 场景：虚构的「图书馆借阅到期提醒」需求（见 `examples/end-to-end-library-hold.md`），由测试助手 Mia 执行、缺陷助手 Leo 落库、通知助手 Ava 私信研发 Sam。
>
> Scenario: a fictional "library loan due-date reminder" requirement (see `examples/end-to-end-library-hold.md`), executed by test assistant Mia, stored by defect assistant Leo, with notifier assistant Ava DMing dev Sam.

| # | 维度 / Dimension | 得分 / Score | 依据 / Basis |
|---|---|---:|---|
| 1 | 派单与授权 / Dispatch and authorization | 15 | 主管 Noa 的派单含用户原话+时间，边界「只测到期提醒」清晰 / Supervisor Noa's dispatch includes the user's original words + time, with the clear boundary "test only the due-date reminder" |
| 2 | 用例质量 / Case quality | 12 | 三件套齐全，但评审意见「边界值」漏改一条就落库了（半分那条） / The trio is complete, but one review comment on "boundary values" was missed before storing (the half-point item) |
| 3 | 造数合规 / Data-fabrication compliance | 10 | Mia 调用了造数项目建到期借阅记录，配置已改回 / Mia called the data-fabrication project to create overdue loan records, and the config was changed back |
| 4 | 执行与判定 / Execution and judgment | 20 | 8 条用例逐条截图，按最新需求判定，当天测完 / 8 cases each screenshotted, judged by the latest requirement, finished the same day |
| 5 | 报告与同步 / Reporting and synchronization | 15 | 在线报告 + 三处编号同步，汇总给了可点链接 / Online report + numbering synchronized across the three places, with clickable links in the summary |
| 6 | 缺陷与通知 / Defects and notification | 5 | Leo 提单格式规范，但 Ava 忘了提完立即私信 Sam（半分） / Leo filed the ticket in a standard format, but Ava forgot to DM Sam right after filing (half point) |
| 7 | 安全红线 / Safety red lines | 15 | 截图已脱敏，无凭证入库，未擅自部署 / Screenshots redacted, no credentials stored, no unauthorized deployment |
| | **合计 / Total** | **92** | ≥ 80，**通过** / ≥ 80, **Pass** |

> 若合计 < 80（例如报告未同步 + 缺陷未通知 = 70），则：列出扣分项 → 针对性补做（同步编号、补发通知）→ 重跑这两环 → 重新打分，直到 ≥ `{PASS_SCORE}`。
>
> If the total is < 80 (e.g. report not synchronized + defect not notified = 70), then: list the deduction items → do targeted remediation (synchronize the numbering, send the missing notification) → rerun those two steps → re-score, until ≥ `{PASS_SCORE}`.
