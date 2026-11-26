---
name: app-device-testing
description: >-
  原生 App 真机测试时使用：不重复测网页版已测功能，重点测异常场景、兼容性和原生能力；多机型同一流程出对比报告，报告以图表为主、功能结果放附录；异常预期写清兜底与友好提示；测完日志脱敏打包挂进报告。
  For use when testing a native App on real devices: do not re-test features already covered by the web version, and focus on exception scenarios, compatibility, and native capabilities; run the same flow across multiple devices to produce a comparison report that is chart-first with functional results in an appendix; write exception expectations with clear fallbacks and friendly prompts; after testing, sanitize and package the logs and attach them to the report.
---

# App 真机测试 · App Real-Device Testing

## 适用角色 · Applicable Roles
测试助手、临时测试助手（多机型时常并行扩容，一台真机一个块）。

Test assistant, temporary test assistant (often scaled up in parallel for multiple devices, one block per real device).

## 触发条件 · Trigger Conditions
- App 新版本提测、或需求涉及 App 端。
- 需要多机型兼容性对比。
- 需要验证网页版测不了的原生能力。

- A new App version is submitted for testing, or the requirement involves the App side.
- Multi-device compatibility comparison is needed.
- Native capabilities that cannot be tested in the web version need to be verified.

## 输入 · Inputs
- 网页版已测范围（避免重复）。
- 需求与用例中 App 相关部分。
- 机型清单（品牌、系统版本、内存档位）；⚠ 机型选择依据见 GAPS（可用线上用户设备/系统分布数据定范围）。
- App 安装包版本号。
- App 测试账号：只在本机受保护文件（600 权限）中运行时读取，**不 cat、不 echo、不进日志/报告/压缩包**，测完删除。

- The web version's tested scope (to avoid duplication).
- The App-related parts of the requirements and test cases.
- The device list (brand, OS version, memory tier); ⚠ the basis for device selection see GAPS (production user device/OS distribution data can define the scope).
- The App installer version number.
- App test accounts: read only at runtime from a protected local file (permission 600), **do not cat, do not echo, do not put into logs/reports/archives**, and delete after testing.

## 测试重点（有针对性，不重复网页版）· Testing Focus (targeted, not duplicating the web version)
| 类别 | 用例方向 |
|---|---|
| 异常场景 | 网络切换（Wi-Fi ↔ 移动网络 ↔ 断网）、弱网、请求超时、服务端报错、第三方页面加载失败、操作中途杀进程、重复点击 |
| 前后台 | 切后台再回来（短/长时间）、锁屏、来电/通知打断、系统回收后恢复、外部页面跳回 App |
| 原生能力 | 系统权限（相机、相册、通知、定位、存储）首次授权 / 拒绝 / 永久拒绝后的引导、深链/外链唤起、推送、分享、文件下载与打开、返回键行为 |
| 兼容性 | 不同品牌、系统版本、屏幕尺寸与刘海、字体缩放、深色模式、低内存机型 |
| 安装与升级 | 全新安装、覆盖升级、数据保留、强制/可选更新提示 |
| 性能指标 | 冷/热启动、首屏、页面切换、内存、CPU、流量、帧率（见下方图表） |

| Category | Test Case Direction |
|---|---|
| Exception scenarios | Network switching (Wi-Fi ↔ cellular ↔ offline), weak network, request timeout, server errors, third-party page load failure, killing the process mid-operation, repeated taps |
| Foreground/background | Switch to background and return (short/long duration), lock screen, interruption by incoming call/notification, recovery after system reclaim, returning to the App from an external page |
| Native capabilities | System permissions (camera, photos, notifications, location, storage) first-time grant / deny / guidance after permanent denial, deep-link/external-link launch, push, sharing, file download and open, back-key behavior |
| Compatibility | Different brands, OS versions, screen sizes and notches, font scaling, dark mode, low-memory devices |
| Install and upgrade | Fresh install, overwrite upgrade, data retention, forced/optional update prompts |
| Performance metrics | Cold/warm startup, first screen, page transitions, memory, CPU, traffic, frame rate (see charts below) |

**异常预期写法**：必须写清「合理兜底 + 易用性提示」——如「断网时显示可理解的提示与重试按钮，恢复网络后可继续，不直接显示错误码或白屏」。

**How to write exception expectations**: Must clearly state "reasonable fallback + usability prompt" — e.g. "when offline, show an understandable message and a retry button; after the network recovers it can continue; do not show a raw error code or a blank screen."

## 分步流程 · Step-by-Step Process
1. **定范围**：列出网页版已覆盖的功能，App 只测差异与原生部分；写进报告「测试范围与不测项」。
2. **定流程**：写一份**所有机型统一**的执行流程（步骤编号固定），保证可对比。
3. **采集**：每台机型按同一流程执行，同时采集性能指标和过程日志（系统日志 + App 日志 + 网络日志）。
4. **记录异常与恢复**：每个异常场景记录「触发方式 → 表现 → 是否自动恢复 → 用户需要做什么」。
5. **日志打包**：测完把过程日志打成压缩包，**先脱敏**（删除令牌、Cookie、账号密码、可定位个人的标识），用 `rg -i "bearer|cookie|token|password|secret"` 自查为 0 后再打包。
6. **出对比报告**（结构见下），压缩包挂在「方法与恢复记录」一节下供研发下载。
7. **清理**：删除本机账号文件，确认已删。

1. **Define the scope**: List the features already covered by the web version; the App only tests the differences and the native parts; write this into the report's "test scope and out-of-scope items."
2. **Define the flow**: Write a **single flow unified across all devices** (with fixed step numbering) to guarantee comparability.
3. **Collect**: Run each device through the same flow while collecting performance metrics and process logs (system logs + App logs + network logs).
4. **Record exceptions and recovery**: For each exception scenario, record "trigger method → behavior → whether it auto-recovers → what the user must do."
5. **Package logs**: After testing, package the process logs into an archive, **sanitizing first** (remove tokens, Cookies, account passwords, personally identifiable markers); self-check with `rg -i "bearer|cookie|token|password|secret"` showing 0 before packaging.
6. **Produce the comparison report** (structure below), with the archive attached under the "methods and recovery records" section for R&D to download.
7. **Clean up**: Delete the local account file and confirm its deletion.

## 报告结构（App 专用）· Report Structure (App-specific)
```text
1. 结论（一段话 + 推荐指标是否达标）
2. 疑似问题待确认（编号）
3. 机型对比图表（为主）
   - 启动耗时柱状图（冷/热，每机型）
   - 首屏/关键页面加载时间
   - 弱网/断网恢复时间
   - 内存/CPU/流量曲线
   - 推荐指标线（如冷启动 ≤ 目标值）——⚠ 目标值见 GAPS
4. 异常场景结果矩阵（场景 × 机型：通过/不通过/表现说明）
5. 兼容性问题清单（机型、系统、现象、截图）
6. 方法与恢复记录（执行流程、工具、每次异常的恢复过程）
   - 附件：脱敏日志压缩包
7. 附录：功能用例结果（逐条）
```

## 判定规则 · Judgment Rules
- 异常时直接甩错误码、白屏、卡死、需要杀进程才能恢复 → 不符合（兜底与提示是需求的一部分）。
- 网页版已测且 App 只是内嵌同一页面的功能 → 不重复测，除非涉及原生交互。
- 单机型独有问题 → 标明机型/系统，严重程度按影响面判断。

- On an exception, dumping a raw error code, a blank screen, a freeze, or requiring killing the process to recover → non-conformance (fallback and prompts are part of the requirement).
- A feature already tested in the web version where the App merely embeds the same page → do not re-test, unless native interaction is involved.
- An issue unique to a single device → note the device/OS, and judge severity by impact scope.

## 交接对象 · Handoff Targets
缺陷助手（提单，附机型信息与日志位置）、测试助手（汇总页）、主管（报告链接）。

Defect assistant (ticket filing, with device info and log location attached), test assistant (summary page), supervisor (report link).

## 禁止项 · Prohibited Actions
- 账号文件内容出现在任何输出里。
- 日志未脱敏就打包或外发。
- 只给功能表、不给图表。
- 各机型流程不一致导致无法对比。

- The contents of the account file appearing in any output.
- Packaging or sending out logs before sanitizing them.
- Giving only a functional table without charts.
- Inconsistent flows across devices making comparison impossible.

## 常见错误 · Common Mistakes
- 重复测了一遍网页版功能，浪费时间。
- 异常用例预期只写「提示错误」，无法判定。
- 压缩包里带了登录令牌。

- Re-testing the web version's features all over again, wasting time.
- Writing an exception case's expectation only as "show an error," which cannot be judged.
- The archive carrying a login token.

## 自检清单 · Self-Check Checklist
- [ ] 范围避开了网页版已测功能 — Scope avoids features already tested in the web version
- [ ] 所有机型同一流程 — All devices use the same flow
- [ ] 图表为主，功能结果在附录 — Chart-first, with functional results in the appendix
- [ ] 异常预期写了兜底与提示 — Exception expectations include fallbacks and prompts
- [ ] 日志已脱敏、自查为 0、已挂报告 — Logs sanitized, self-check is 0, and attached to the report
- [ ] 账号文件已删除 — Account file has been deleted
