---
linkTitle: Access Control
description: "Manage Azure access control with Bicep: custom role definitions and assignments tied to Entra ID groups, lifecycle-managed in code for clean, automated RBAC"
breadcrumbs: true
weight: 30
cascade:
  type: docs
toc: true
---

## No Human Touch

Direct human access is minimized by design — nobody edits infrastructure by hand. If someone were to change an Azure service manually, the next deployment would overwrite it, or worse, leave the environment drifting out of sync. Either way, consistency across environments is broken. To avoid that, I only allow custom roles for operations that make sense — like restarting a service — and nothing beyond that. Roles are pared down to just enough permissions, never more

## Custom Roles

Every custom role starts from Reader. From there, I add only the specific actions required for the job function. A platform engineer role, for example, can operate platform services but cannot modify Azure resources defined in code. This keeps operations safe without breaking Infrastructure-as-Code.

## Lifecycle Management

From the deployment perspective, a role definition and its assignment form a single unit. They are created together, updated together, and retired together when no longer needed. Each role is tied to a single scope and a single Entra ID group — no sharing, no reassigning. If another scope or group needs access, it gets its own role defined in code.

If a role isn’t needed anymore, deleting the block removes both the definition and the assignment in one step. Nothing lingers — no orphaned roles, no leftover permissions. Just clean state, exactly as the code defines it.

## Assignments

Assignments are always scoped at the management group level and linked to Entra ID groups — never to individuals. Membership stays managed centrally in Entra ID, while permissions live entirely in code. Identity ownership in one place, access control in another. Clear, automated, reproducible.