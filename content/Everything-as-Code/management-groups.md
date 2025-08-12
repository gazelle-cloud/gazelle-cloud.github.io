---
linkTitle: Management Groups
description: "Flat hierarchy management groups — how top and child scopes work together"
breadcrumbs: true
weight: 20
cascade:
  type: docs
toc: true
---


## Flat Hierarchy

I wanted the management group structure to be as simple and predictable as possible. No deep trees, no hidden complexity. Just one top-level management group, and as many children as we need — all side by side.

Why? Because every extra layer you nest is another place for a misconfiguration to hide. Instead of stacking, Gazelle scales horizontally: add a child, reuse proven patterns, move on. Adding a new child is literally one parameter away:
```bicep
//management-groups/parameters/managementGroups.bicepparam  
param childManagementGroupNames = [
  'platform'
  'isolation'
]
```
That’s it. The new management group appears, ready for its own policies, access control, and landing zones.

## Top Level Management Group

Everything starts here — directly under the tenant root.

- **Access Control**: Role assignments at this scope flow down to every child and subscription. It’s the single place to grant “all tenant” visibility and control.
- **Custom Policy Definitions**: All custom Azure Policy definitions live here so every child can reuse them without duplication.
- **Foundational deployments**: Platform-wide Deployment Stacks handle identity, policy, RBAC, and the hierarchy itself. If it’s core to the platform, it lands here first.

## Child Management Groups

This is where governance meets flexibility. Each child defines its own operational or security baseline without losing the tenant-wide guardrails.

- **Policy Assignments**: Guardrails applied here are tuned to the child’s purpose — whether it’s `platform`, ``isolation``, or something new.
- **Access Control** — RBAC here covers every subscription under the child, making it easier to manage environment-specific roles.
- **Deployment Stacks**: Landing zone stacks live here, with unwanted actions protection on centrally managed resources.


| Responsibility        | Top-Level Management Group | Child Management Group |
|-----------------------|----------------------------|------------------------|
| **Access Control**    | All child MGs + subscriptions	 | All subscriptions in its scope |
| **Policy**            | Hosts reusable custom definitions	| Assigns environment-specific rules |
| **Deployment Stacks** | Foundational, platform-wide deployments	| Landing zone deployments with protections |
| **Subscription Grouping** | N/A | Groups by operational or security requirements |

## Test Environment

Test is a perfect mirror of production — down to the same hierarchy, policies, access control, and deployment logic. The only difference is the suffix:
- Test groups end with -test
- Production groups end with -prod

These suffixes come straight from the GitHub workflow templates. That way, the environment context is baked into the deployment process. If it works in test, it works in prod — exactly the same way. That symmetry keeps surprises to a minimum.