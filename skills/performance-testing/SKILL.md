---
name: performance-testing
description: >-
  前端加载性能、弱网、包体积、第三方托管页渲染性能测试时使用：以稳定测试环境为主结论与对比基数，开发环境只作参考；给出可量化优化项并跟踪前后对比；报告站最多保留两份性能报告。
  For use when testing frontend load performance, weak network, bundle size, and third-party hosted-page rendering performance: base the main conclusions and comparison baseline on the stable test environment, with the development environment only for reference; give quantifiable optimization items and track before/after comparisons; keep at most two performance reports on the report site.
---

# 性能与弱网测试 · Performance and Weak-Network Testing

## 适用角色 · Applicable Roles
测试助手（执行与报告）；编码助手（维护报告站，如需）。

Test assistant (execution and reporting); coding assistant (maintaining the report site, if needed).

## 触发条件 · Trigger Conditions
- 性能专项（首屏、可交互、包体积、阻塞渲染资源）。
- 弱网专项（3G/慢网/高丢包下的可用性）。
- 研发宣布做了性能优化，需要前后对比。
- 第三方托管页的渲染/加载性能。

- A performance initiative (first screen, interactivity, bundle size, render-blocking resources).
- A weak-network initiative (usability under 3G/slow network/high packet loss).
- R&D announces a performance optimization and a before/after comparison is needed.
- The rendering/load performance of a third-party hosted page.

## 输入 · Inputs
- 被测页面清单与入口；托管页地址用 {HOSTED_PAGE_ENTRY} 建业务单获取。
- 环境：{TEST_ENV}（主）、{DEV_ENV}（参考）；各环境当前版本号/构建号。
- 上一份性能报告（作为基线）。

- The list of pages under test and their entry points; obtain the hosted-page address by filing a business ticket with {HOSTED_PAGE_ENTRY}.
- Environments: {TEST_ENV} (primary), {DEV_ENV} (reference); the current version/build number of each environment.
- The previous performance report (as the baseline).

## 指标（每页都采）· Metrics (collected for every page)
| 指标 | 说明 |
|---|---|
| 首次内容绘制 / 最大内容绘制 | 用户看到内容的时间 |
| 可交互时间 / 关键按钮可点时间 | 用户能操作的时间 |
| 总阻塞时间 | 主线程阻塞 |
| 主包体积 / 总传输体积 / 请求数 | 是否超标及原因（如混淆、未拆包） |
| 阻塞渲染资源 | 同步 CSS、同步脚本、串行加载的资源（如多语言包串行） |
| 弱网下的上述指标 | 至少一档慢网（如 3G）+ 正常网络对照 |

| Metric | Description |
|---|---|
| First Contentful Paint / Largest Contentful Paint | The time at which the user sees content |
| Time to Interactive / time until key buttons are clickable | The time at which the user can operate |
| Total Blocking Time | Main-thread blocking |
| Main bundle size / total transfer size / number of requests | Whether limits are exceeded and why (e.g. obfuscation, no code splitting) |
| Render-blocking resources | Synchronous CSS, synchronous scripts, serially loaded resources (e.g. serial i18n bundles) |
| The above metrics under weak network | At least one slow-network tier (e.g. 3G) + a normal-network control |

⚠ 各指标目标值/阈值见 GAPS。

⚠ The target values/thresholds for each metric see GAPS.

## 分步流程 · Step-by-Step Process
1. **记录版本**：每个环境的构建号；若环境长期未发版，说明「复测数字不会变」。
2. **基准环境**：**主结论与对比基数一律用 {TEST_ENV}**；{DEV_ENV} 数字只能作参考，并注明差异原因（如未开混淆导致包更小）。
3. **采集**：每页每网络档位多次采集取中位数（⚠ 次数见 GAPS），固定设备/视口/缓存策略（冷缓存 + 热缓存各一组）。
4. **分析**：定位瓶颈到具体资源；每个优化建议写成**可量化项**（「把 X 改异步，预计首屏 -Y 秒」）。
5. **前后对比**：研发优化上线后，同环境同方法复测，出「优化前 → 优化后」对比表与图。
6. **报告**：按下方结构；发布到 {REPORT_SITE} 的性能分区。
7. **保留上限**：性能分区**最多保留 {MAX_PERF_REPORTS} 份**报告，新报告上线时把最旧的移到 {ARCHIVE_DIR}（移出不删）。

1. **Record versions**: The build number of each environment; if an environment has not released for a long time, note that "the retested numbers will not change."
2. **Baseline environment**: **Always use {TEST_ENV} for the main conclusions and comparison baseline**; {DEV_ENV} numbers can only serve as reference, with the reason for the difference noted (e.g. obfuscation disabled makes the bundle smaller).
3. **Collect**: Collect multiple times per page per network tier and take the median (⚠ the count see GAPS), with fixed device/viewport/cache strategy (one set each of cold cache + warm cache).
4. **Analyze**: Pinpoint bottlenecks down to specific resources; write each optimization suggestion as a **quantifiable item** ("make X async, expected first screen -Y seconds").
5. **Before/after comparison**: After the R&D optimization goes live, retest in the same environment with the same method, and produce a "before → after" comparison table and chart.
6. **Report**: Follow the structure below; publish to the performance section of {REPORT_SITE}.
7. **Retention limit**: The performance section **keeps at most {MAX_PERF_REPORTS}** reports; when a new report goes live, move the oldest to {ARCHIVE_DIR} (move out, do not delete).

## 报告结构 · Report Structure
```text
1. 结论（基于 {TEST_ENV}）：达标/不达标项、最大瓶颈
2. 疑似问题待确认（编号）
3. 指标总表（页面 × 指标 × 网络档位），超标标红
4. 图表：各页 LCP/TTI 柱状图；弱网对比；包体积构成
5. 优化建议（可量化，按收益排序，标负责人/状态）
6. 优化前后对比（如有）
7. 参考数据：{DEV_ENV}（注明仅供参考及差异原因）
8. 方法：工具、设备、网络档位、采集次数、缓存策略、版本号
```

## 判定规则 · Judgment Rules
- 主结论只能来自 {TEST_ENV}。
- 开发环境数字变好但测试环境未发版 → 不能写「已优化」。
- 性能问题提单严重程度默认「中」（映射见 `bug-filing`）。

- The main conclusions may come only from {TEST_ENV}.
- Development-environment numbers improve but the test environment has not released → you cannot write "already optimized."
- The default severity for a performance ticket is "Medium" (for the mapping see `bug-filing`).

## 交接对象 · Handoff Targets
缺陷助手（性能单）、通知助手（经主管，同步研发结论）、编码助手（报告站维护）。

Defect assistant (performance tickets), notification assistant (via the supervisor, syncing conclusions to R&D), coding assistant (report site maintenance).

## 禁止项 · Prohibited Actions
- 把开发环境数字写成主结论。
- 不记版本号就对比。
- 报告站超过保留上限。

- Writing development-environment numbers as the main conclusions.
- Comparing without recording version numbers.
- Exceeding the retention limit on the report site.

## 常见错误 · Common Mistakes
- 单次采集就下结论，波动大。
- 优化建议写「建议优化性能」这种不可执行的话。

- Drawing conclusions from a single collection, which has large variance.
- Writing optimization suggestions as non-actionable statements like "suggest optimizing performance."

## 自检清单 · Self-Check Checklist
- [ ] 主结论基于 {TEST_ENV}，版本号已记录 — Main conclusions based on {TEST_ENV}, version numbers recorded
- [ ] 多次采集取中位数 — Multiple collections with the median taken
- [ ] 建议可量化 — Suggestions are quantifiable
- [ ] 前后对比同环境同方法 — Before/after comparison uses the same environment and method
- [ ] 性能分区不超过 {MAX_PERF_REPORTS} 份 — The performance section does not exceed {MAX_PERF_REPORTS} reports
