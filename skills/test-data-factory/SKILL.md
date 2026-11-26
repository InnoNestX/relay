---
name: test-data-factory
description: >-
  测试需要数据时使用：测试助手自己造数，优先调用用户指定的造数项目和接口测试项目，覆盖批量业务单、多 IP 提交、模拟入账、模拟状态推进、模拟第三方回调（成功/失败/延迟/重复/乱序），复用现有租户账号，改配置必改回，SQL 只读核对。
  Used when testing needs data: the test assistant creates data themselves, preferring the user-designated data-factory project and API-test project, covering bulk business orders, multi-IP submission, simulated crediting, simulated state advancement, and simulated third-party callbacks (success / failure / delay / duplicate / out-of-order), reusing existing tenant accounts, always reverting any config change, and verifying with read-only SQL.
---

# 造数（测试数据工厂） · Data Creation (Test Data Factory)

## 适用角色 · Applicable Roles
- 测试助手 / 临时测试助手：**执行造数**、验证数据。
- 编码助手：写或改造数脚本、执行模拟入账（按分工）。
- 主管：只在需要新脚本时派编码助手。

- Test assistant / temporary test assistant: **create data** and verify it.
- Coding assistant: write or modify data-creation scripts, perform simulated crediting (per the division of labor).
- Supervisor: dispatch the coding assistant only when a new script is needed.

## 触发条件 · Triggers
- 用例需要特定状态的数据（已完成、已取消、跑批后、临界时间点……）。
- 需要批量数据、并发数据、多 IP 数据。
- 需要第三方回调的各种结果。
- 测试账号余额/额度不足。
- 性能/渲染测试需要第三方托管页地址。

- A case needs data in a specific state (completed, cancelled, post-batch, critical time point…).
- Bulk data, concurrent data, or multi-IP data is needed.
- Various third-party callback outcomes are needed.
- A test account has insufficient balance/quota.
- Performance/rendering testing needs a third-party hosted-page URL.

## 输入 · Inputs
- 用例清单中的「数据」列。
- 可用资源：{DATA_FACTORY_PROJECT}（用户指定造数项目）、{API_TEST_PROJECT}（接口测试项目）、{MOCK_API_BASE}（模拟接口）、{MULTI_IP_SUBMIT_ENTRY}、{HOSTED_PAGE_ENTRY}、{DEFAULT_TENANTS}。
- 凭证：只从 {SECRET_VAULT} 运行时注入。

- The "data" column of the case list.
- Available resources: {DATA_FACTORY_PROJECT} (the user-designated data-factory project), {API_TEST_PROJECT} (the API-test project), {MOCK_API_BASE} (the mock API), {MULTI_IP_SUBMIT_ENTRY}, {HOSTED_PAGE_ENTRY}, {DEFAULT_TENANTS}.
- Credentials: injected only at runtime from {SECRET_VAULT}.

## 造数优先级（从上到下选第一个能用的） · Data-Creation Priority (pick the first workable one, top to bottom)
1. **用户指定的造数项目 {DATA_FACTORY_PROJECT}**：通过 {DATA_FACTORY_ENTRY} 调用（⚠ 具体调用方式、参数约定见 GAPS，按你的项目填写）。
2. **用户的接口测试项目 {API_TEST_PROJECT}**：已有的接口用例可直接跑出数据。
3. **模拟接口 {MOCK_API_BASE}**：模拟入账、模拟状态推进（强制开始/结束/完结）、模拟第三方回调。
4. **现有页面 / 后台操作**：手工在测试环境操作产生数据。
5. **新脚本**：以上都不行才找编码助手写；脚本由编码助手写，测试助手执行。
6. **找研发/同事代造**：最后手段，尽量不麻烦别人。

1. **The user-designated data-factory project {DATA_FACTORY_PROJECT}**: invoke via {DATA_FACTORY_ENTRY} (⚠ the exact invocation method and parameter conventions are in GAPS; fill in per your project).
2. **The user's API-test project {API_TEST_PROJECT}**: existing API cases can produce data directly.
3. **The mock API {MOCK_API_BASE}**: simulated crediting, simulated state advancement (force start/end/finalize), simulated third-party callbacks.
4. **Existing pages / back-end operations**: manually operate in the test environment to produce data.
5. **A new script**: only when none of the above works, ask the coding assistant to write one; the coding assistant writes the script, the test assistant runs it.
6. **Ask development/colleagues to create it**: the last resort, avoid troubling others when possible.

## 分步流程 · Step-by-Step Process
1. **列数据需求**：从用例「数据」列汇总成表：`数据编号 · 用途（覆盖哪些用例）· 需要的状态 · 数量 · 账号角色 · 时效`。
2. **查可复用**：先看 {DEFAULT_TENANTS} 和已有数据能否满足；**优先复用现有租户/组织/账号，少新建，避免脏数据**。缺账号时在现有租户下按角色新建，或问用户要（不问同事要）。
3. **选造数方式**：按上面的优先级。
4. **调用造数项目**（配置化示例）：
   ```text
   项目：{DATA_FACTORY_PROJECT}
   入口：{DATA_FACTORY_ENTRY}
   参数：环境={TEST_ENV} 租户=<复用的租户> 账号=<测试账号用途名> 数量=<n> 状态=<目标状态> 时间偏移=<如 -14m59s>
   凭证：运行时注入（环境变量），不写进命令行历史、不打印
   输出：业务单号清单 → 写入 <工作目录>/data/<日期>_seed.csv
   ```
5. **典型场景做法**：
   | 场景 | 做法 |
   |---|---|
   | 批量业务单 | 造数项目批量提交，数量、时间偏移参数化，直接覆盖临界时间点 |
   | 多 IP / 限流与防刷 | 用 {MULTI_IP_SUBMIT_ENTRY}，**每次请求换不同出口 IP**，验证按 IP 的限制与统计 |
   | 余额 / 额度不足 | **不找用户手动加**：用模拟入账接口给测试账号加（测试环境、测试账号、按分工由编码助手或授权的测试助手执行） |
   | 需要已完结状态的数据 | 用模拟状态推进 / 模拟完结，不等真实流程（用户明确说「禁止模拟」的需求除外） |
   | 第三方回调 | 构造回调请求覆盖 5 种：**成功、失败、延迟、重复、乱序**；记录每次请求体（删凭证）与系统最终状态 |
   | 渲染 / 性能测试 | 用 {HOSTED_PAGE_ENTRY} 建业务单，拿返回的托管页地址做加载/渲染测试 |
   | 权限测试账号 | 在现有租户下按角色新建，先按 {PERMISSION_DOC} 分配菜单与数据权限 |
   | 全局配置相关 | 先记原值 → 改 → 验证 → **马上改回** → 报告里记前后值 |
6. **验证数据**：造完立刻用接口 / 页面 / 只读 SQL 核对状态正确；**已造好的数据尽快验证**（有时效的优先）。
7. **登记**：写进报告「造数与数据说明」：账号用途名（不写密码）、租户、业务单号、配置原值与恢复情况、SQL（只读）。

1. **List data needs**: compile from the case "data" column into a table: `data ID · purpose (which cases it covers) · required state · quantity · account role · validity period`.
2. **Check reusability**: first see whether {DEFAULT_TENANTS} and existing data suffice; **prefer reusing existing tenants/orgs/accounts, create few new ones, and avoid dirty data**. When accounts are missing, create them by role under an existing tenant, or ask the user (not colleagues).
3. **Choose a creation method**: per the priority above.
4. **Invoke the data-factory project** (configurable example):
   ```text
   项目：{DATA_FACTORY_PROJECT}
   入口：{DATA_FACTORY_ENTRY}
   参数：环境={TEST_ENV} 租户=<复用的租户> 账号=<测试账号用途名> 数量=<n> 状态=<目标状态> 时间偏移=<如 -14m59s>
   凭证：运行时注入（环境变量），不写进命令行历史、不打印
   输出：业务单号清单 → 写入 <工作目录>/data/<日期>_seed.csv
   ```
   English reference for the fields above (keep the Chinese template in actual use):
   ```text
   Project: {DATA_FACTORY_PROJECT}
   Entry: {DATA_FACTORY_ENTRY}
   Params: env={TEST_ENV} tenant=<reused tenant> account=<test account purpose name> quantity=<n> state=<target state> time offset=<e.g. -14m59s>
   Credentials: injected at runtime (env vars), not written to shell history, not printed
   Output: list of business order IDs → written to <工作目录>/data/<日期>_seed.csv
   ```
5. **Typical scenarios**:
   | 场景 · Scenario | 做法 · Approach |
   |---|---|
   | 批量业务单 · Bulk business orders | 造数项目批量提交，数量、时间偏移参数化，直接覆盖临界时间点 · The data-factory project bulk-submits, with quantity and time offset parameterized, directly covering critical time points |
   | 多 IP / 限流与防刷 · Multi-IP / rate-limit & anti-abuse | 用 {MULTI_IP_SUBMIT_ENTRY}，**每次请求换不同出口 IP**，验证按 IP 的限制与统计 · Use {MULTI_IP_SUBMIT_ENTRY}, **switch to a different egress IP per request**, verify per-IP limits and counting |
   | 余额 / 额度不足 · Insufficient balance / quota | **不找用户手动加**：用模拟入账接口给测试账号加（测试环境、测试账号、按分工由编码助手或授权的测试助手执行）· **Do not ask the user to add it manually**: use the simulated-crediting API to top up the test account (test environment, test account, run by the coding assistant or an authorized test assistant per the division of labor) |
   | 需要已完结状态的数据 · Data needing a finalized state | 用模拟状态推进 / 模拟完结，不等真实流程（用户明确说「禁止模拟」的需求除外）· Use simulated state advancement / simulated finalization, do not wait for the real flow (except requirements where the user explicitly says "no simulation") |
   | 第三方回调 · Third-party callbacks | 构造回调请求覆盖 5 种：**成功、失败、延迟、重复、乱序**；记录每次请求体（删凭证）与系统最终状态 · Construct callback requests covering 5 kinds: **success, failure, delay, duplicate, out-of-order**; record each request body (strip credentials) and the system's final state |
   | 渲染 / 性能测试 · Rendering / performance testing | 用 {HOSTED_PAGE_ENTRY} 建业务单，拿返回的托管页地址做加载/渲染测试 · Use {HOSTED_PAGE_ENTRY} to create a business order and take the returned hosted-page URL for load/rendering tests |
   | 权限测试账号 · Permission test accounts | 在现有租户下按角色新建，先按 {PERMISSION_DOC} 分配菜单与数据权限 · Create by role under an existing tenant, first assigning menu and data permissions per {PERMISSION_DOC} |
   | 全局配置相关 · Global-config related | 先记原值 → 改 → 验证 → **马上改回** → 报告里记前后值 · Record the original value → change → verify → **revert immediately** → record before/after values in the report |
6. **Verify the data**: right after creation, use the API / page / read-only SQL to verify the state is correct; **verify created data as soon as possible** (prioritize the time-sensitive ones).
7. **Register it**: write into the report's "Data creation and data notes": account purpose name (no password), tenant, business order IDs, config original values and whether restored, SQL (read-only).

## 判定规则 · Decision Rules
- 测试环境可以自由造单；凑满数量、上限类场景不受「小额」约束（仅测试环境、测试账号）。
- 余额变动类操作尽量小额。
- 跑批（T+1）类数据：跑批前看不到不算 bug，跑批后再判定；必要时排定点测试。
- 造数失败（造数项目报错）≠ 被测功能 bug：先排查造数参数与环境，确认是被测系统问题才进入判定。
- SQL 核对：测试库可读；**生产只 SELECT**。

- In the test environment, orders may be created freely; scenarios for hitting quantities or upper limits are not bound by the "small amount" rule (test environment and test accounts only).
- Keep balance-changing operations to small amounts where possible.
- Batch (T+1) data: not being visible before the batch run is not a bug; judge after the batch run; schedule a timed test if necessary.
- Data-creation failure (the data-factory project errors out) ≠ a bug in the feature under test: first investigate the creation parameters and environment, and only enter judgment once it is confirmed to be an issue in the system under test.
- SQL verification: the test database is readable; **production is SELECT only**.

## 产出模板（数据登记表） · Output Template (Data Registration Table)
```text
| 数据编号 | 用途（用例） | 账号用途 | 租户 | 业务单号 | 造数方式 | 状态核对 | 备注 |
| D-01 | TC-…-001~005 | 普通用户A | 租户X | B… | 造数项目 | 已核对 | 时间偏移 -14m59s |
配置变更：<配置项> 原值 a → 测试值 b → 已恢复 a（HH:MM {TZ}）
```

English reference (keep the Chinese template in actual use):
```text
| Data ID | Purpose (cases) | Account purpose | Tenant | Business order ID | Creation method | State verified | Notes |
| D-01 | TC-…-001~005 | Normal user A | Tenant X | B… | Data-factory project | Verified | Time offset -14m59s |
Config change: <config item> original a → test value b → restored to a (HH:MM {TZ})
```

## 交接对象 · Handoff Targets
- 编码助手：需要新脚本或模拟入账时（附数据需求表）。
- 主管：造数受阻（缺权限、缺账号、项目不可用）时上报。

- Coding assistant: when a new script or simulated crediting is needed (attach the data-needs table).
- Supervisor: escalate when data creation is blocked (missing permissions, missing accounts, project unavailable).

## 禁止项 · Prohibitions
- 找用户手动加余额 / 代造数据（可用模拟接口时）。
- 在生产造数或写数据。
- 改了全局配置不改回。
- 把凭证写进脚本参数、命令历史、数据文件。
- 为造数新建大量租户/组织。

- Asking the user to manually add balance / create data for you (when a mock API is available).
- Creating or writing data in production.
- Changing global config without reverting it.
- Writing credentials into script parameters, command history, or data files.
- Creating large numbers of tenants/orgs just to create data.

## 常见错误 · Common Mistakes
- 造完数据隔天才验证，状态已被跑批改掉。
- 回调只测了成功，漏了重复和乱序。
- 多个助手共用同一批会改状态的数据，互相污染。

- Verifying created data only the next day, after the batch run has changed its state.
- Testing only the success callback, missing duplicate and out-of-order.
- Multiple assistants sharing the same batch of state-changing data and polluting each other's.

## 自检清单 · Self-Check List
- [ ] 优先用了 {DATA_FACTORY_PROJECT} / {API_TEST_PROJECT} · Preferred {DATA_FACTORY_PROJECT} / {API_TEST_PROJECT}
- [ ] 复用了现有租户与账号 · Reused existing tenants and accounts
- [ ] 回调 5 种情况都造了（如适用）· All 5 callback cases were created (if applicable)
- [ ] 数据已立即验证 · Data was verified immediately
- [ ] 配置已恢复并记录 · Config was restored and recorded
- [ ] 数据登记表已写进报告，无凭证 · The data registration table is in the report, with no credentials
