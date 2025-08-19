---
linkTitle: Platform Automation
description: "How I automate landing zone operations with Azure Container Apps jobs, PowerShell, and Bicep"
breadcrumbs: true
weight: 40
cascade:
  type: docs
toc: true
---

## Identity

Every automation job in the platform runs under the same user-assigned managed identity. It’s predictable, auditable, and keeps the automation plane clean — no system-assigned identities spread across resources.

To keep privileges tight, I created a custom Azure role called Platform Automation. That role has only the permissions automation needs to function, nothing more. It’s assigned once — at the top-level management group — so the identity can reach anything it must. If a job needs additional rights, you edit the role definition in code (/automation/parameters/custom-role.json). The change flows everywhere automatically.

The identity also needs visibility into Entra ID. For that, I grant it Directory.Read.All via Microsoft Graph. This part is slightly different: Graph doesn’t yet support full lifecycle management (you can’t delete permissions via templates), so I fall back to a classic deployment model for extensibility. I know this requires manual cleanup.

## work in progress

note for myself... why not to move compute for automation to gh actions?

## Automation Jobs

The platform includes scheduled automation jobs that handle routine maintenance tasks. They reduce manual effort, catch drift early, and keep the environment clean without human intervention.

- Cleanup Roles — Scans all subscriptions for orphaned role assignments, where an Entra ID object (user, group, or service principal) has been deleted but the role assignment remains. This keeps access control clean and ensures no orphaned assignments linger. The job runs at the subscription scope and uses Directory.Read.All via Microsoft Graph to check directory objects.

- Remediate Policies — Detects resources that are out of compliance and automatically applies the fix, like enforcing required tags or wiring up diagnostic settings. This ensures platform guardrails are always applied, without waiting for someone to notice and correct it by hand.