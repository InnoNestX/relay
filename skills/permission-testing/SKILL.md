---
name: permission-testing
description: >-
  测多角色、多租户、多层级后台的菜单权限、操作权限和数据范围时使用：先按权限文档分配菜单与数据权限再登录，覆盖权限是否生效、数据范围是否正确、越权访问；未分配导致无数据不算 bug。
  For use when testing menu permissions, operation permissions, and data scope across multi-role, multi-tenant, multi-level back ends: assign menu and data permissions per the permissions document before logging in, and cover whether permissions take effect, whether the data scope is correct, and privilege-escalation access; no data due to unassigned permissions is not a bug.
---

# 权限与数据范围测试 · Permission and Data Scope Testing

## 适用角色 · Applicable Roles
测试助手、临时测试助手（执行）；缺陷助手（提单）。

Test assistant, temporary test assistant (execution); defect assistant (ticket filing).

## 触发条件 · Trigger Conditions
- 需求涉及角色、菜单、按钮权限、数据权限、租户/子组织隔离。
- 新增角色类型、改了权限模型、改了数据范围规则。
- 后台类需求在多角色下验收。

- The requirement involves roles, menus, button permissions, data permissions, or tenant/sub-organization isolation.
- A new role type is added, the permission model is changed, or data scope rules are changed.
- A back-end requirement is being accepted across multiple roles.

## 输入 · Inputs
- 权限分配文档 {PERMISSION_DOC}（角色类型、谁能创建谁、菜单来源、数据范围来源）。
- 需求中的权限要求。
- 现有租户/组织与账号清单 {DEFAULT_TENANTS}。

- Permission assignment document {PERMISSION_DOC} (role types, who can create whom, menu source, data scope source).
- The permission requirements in the specification.
- The list of existing tenants/organizations and accounts {DEFAULT_TENANTS}.

## 通用角色模型（按你的系统改名）· Generic Role Model (rename to fit your system)
| 层级 | 典型角色 | 菜单来源 | 数据范围来源 |
|---|---|---|---|
| 平台 | 平台管理员（全部菜单、全部租户，通常不能在界面创建） | 全部 | 全部 |
| 平台 | 平台操作员（由平台管理员创建） | 功能角色 | 「租户数据权限」角色 |
| 租户 | 租户管理员（建租户时自动创建） | 租户套餐 | 该租户全部子组织 |
| 租户 | 租户操作员（租户管理员或平台选定租户后创建） | 自定义角色（限套餐内） | 继承创建者，可用「指定子组织」角色收窄 |
| 子组织 | 子组织管理员（需特定权限码） | 套餐中子组织级菜单 | 本子组织，上级可扩展 |

| Level | Typical Role | Menu Source | Data Scope Source |
|---|---|---|---|
| Platform | Platform admin (all menus, all tenants, usually cannot be created in the UI) | All | All |
| Platform | Platform operator (created by the platform admin) | Functional role | "Tenant data permission" role |
| Tenant | Tenant admin (auto-created when the tenant is created) | Tenant package | All sub-organizations of that tenant |
| Tenant | Tenant operator (created by the tenant admin, or by the platform after selecting a tenant) | Custom role (limited to within the package) | Inherited from the creator, can be narrowed with the "designated sub-organization" role |
| Sub-org | Sub-organization admin (requires a specific permission code) | Sub-org-level menus within the package | This sub-organization; can be extended by a superior |

## 分步流程 · Step-by-Step Process
1. **建权限矩阵**：`角色 × 菜单 × 操作 × 数据范围`，每格写预期（可见/不可见、可操作/不可操作、能看到哪些数据）。
2. **准备账号**：优先复用现有账号；缺的在**现有租户下按角色新建**（不新建租户）。凭证运行时注入。
3. **先分配权限**：按 {PERMISSION_DOC} 给每个账号分配**菜单权限 + 数据权限**，记录分配内容。**未分配就登录看不到数据，不是 bug。**
4. **逐角色验证**：
   - 菜单：应见的都在、不应见的都不在；
   - 操作：按钮可见性与实际接口权限一致（隐藏按钮但接口能调 = 越权）；
   - 数据范围：列表、详情、报表、导出只含授权范围的数据；筛选下拉（如组织下拉）只列授权范围内的选项；
   - 越权：改 URL 参数 / 接口参数访问他人数据，应返回无权限且不泄露数据；
   - 变更生效：改权限后重新登录（或按系统规则刷新）生效；收回权限后立即不可见。
5. **层级与继承**：创建者范围被收窄后，其创建的下级范围是否随之变化（按需求）。
6. **记录**：每个角色截图证据；分配了哪些权限写进报告「造数与数据说明」。

1. **Build the permission matrix**: `role × menu × operation × data scope`, writing the expected value in each cell (visible/not visible, operable/not operable, which data can be seen).
2. **Prepare accounts**: Prefer reusing existing accounts; for missing ones, **create new accounts by role under an existing tenant** (do not create new tenants). Credentials injected at runtime.
3. **Assign permissions first**: Per {PERMISSION_DOC}, assign each account **menu permissions + data permissions**, and record what was assigned. **If you log in without assignment and see no data, that is not a bug.**
4. **Verify role by role**:
   - Menus: everything that should be visible is present, everything that should not be is absent;
   - Operations: button visibility matches the actual API permissions (a hidden button whose API can still be called = privilege escalation);
   - Data scope: lists, details, reports, and exports contain only data within the authorized scope; filter dropdowns (e.g. the organization dropdown) list only options within the authorized scope;
   - Privilege escalation: modifying URL parameters / API parameters to access others' data should return "no permission" and leak no data;
   - Change takes effect: after changing permissions, re-login (or refresh per system rules) applies them; after revoking permissions, they become invisible immediately.
5. **Hierarchy and inheritance**: After a creator's scope is narrowed, whether the scope of the subordinates they created changes accordingly (as required).
6. **Record**: Screenshot evidence for each role; which permissions were assigned goes into the report's "data setup and data notes" section.

## 判定规则 · Judgment Rules
- 未分配权限导致无数据 → 不是 bug。
- 分配了却不生效、数据范围超出授权、可越权访问 → 不符合需求，直接提单（越权类严重程度至少「中」，⚠ 是否升级为「高」见 GAPS）。
- 平台管理员能看到全部 → 正常，不作为越权。
- 测试结束收回临时提升的权限，恢复原配置。

- No data due to unassigned permissions → not a bug.
- Assigned but not taking effect, data scope exceeding authorization, or privilege-escalation access possible → does not meet the requirement, file a ticket directly (privilege-escalation severity at least "Medium"; ⚠ whether to escalate to "High" see GAPS).
- The platform admin being able to see everything → normal, not treated as privilege escalation.
- At the end of testing, revoke temporarily elevated permissions and restore the original configuration.

## 产出模板（权限矩阵）· Deliverable Template (permission matrix)
```text
| 角色 | 菜单A | 菜单B | 操作:导出 | 数据范围 | 越权测试 | 结果 |
| 租户操作员(指定子组织X) | 可见 | 不可见 | 可 | 仅X | 改参访问Y→无权限 | 通过 |
```

## 交接对象 · Handoff Targets
缺陷助手（提单）、测试助手（并入报告）。

Defect assistant (ticket filing), test assistant (merge into the report).

## 禁止项 · Prohibited Actions
- 不分配权限就判「看不到数据」为 bug。
- 为测试新建租户（除非需求就是测新建租户）。
- 用平台管理员账号冒充租户管理员测试。
- 测完不收回临时权限。

- Judging "cannot see data" as a bug without assigning permissions.
- Creating a new tenant for testing (unless the requirement is to test tenant creation itself).
- Using the platform admin account to impersonate a tenant admin for testing.
- Not revoking temporary permissions after testing.

## 常见错误 · Common Mistakes
- 只看页面按钮，不测接口层越权。
- 下拉框里列出了无权限范围的选项没发现。

- Looking only at page buttons without testing privilege escalation at the API layer.
- Failing to notice that a dropdown lists options outside the permitted scope.

## 自检清单 · Self-Check Checklist
- [ ] 权限矩阵完整 — Permission matrix is complete
- [ ] 每个账号的权限分配已记录 — Each account's permission assignment is recorded
- [ ] 菜单、操作、数据范围、越权、变更生效都测了 — Menus, operations, data scope, privilege escalation, and change-takes-effect are all tested
- [ ] 临时权限已收回 — Temporary permissions have been revoked
