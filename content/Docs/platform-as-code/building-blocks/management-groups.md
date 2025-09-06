---
linkTitle: Management Groups
description: "Azure Landing Zones: Management Groups structure — flat hierarchy"
breadcrumbs: true
weight: 10
cascade:
  type: docs
toc: true
---
# Azure Landing Zone Hierarchy

Gazelle is built from [modular blocks](/docs/platform-as-code/#building-blocks), each designed to be deployed and managed independently end-to-end. This page covers the Azure Management Groups, with focus on flat Management Group hierarchy. The Management Group is the first Azure resource deployed to the Gazelle tenant. While it is a relatively simple resource with few configuration options, its structure sets the foundation for how the entire tenant will be managed. 

## Flat Hierarchy
Gazelle uses a two-layer Management Group structure to keep the hierarchy flat and predictable — without deep trees or nesting. Directly under the tenant root are three parallel groups: gazelle-test, gazelle-prod, and Subscription-Bank. These groups are created during the initial tenant setup.

From there, scaling happens horizontally. New child Management Groups are added under gazelle-[env] by editing a single parameter file: `building-blocks/management-groups/parameters/managementGroups.bicepparam`

```bicep 
param childManagementGroupNames = [
  'platform'
  'isolation'
]
```

This approach allows you to reuse proven patterns for access control and Azure Policies, making it easy to expand without adding complexity.


## Top Level Management Groups

The gazelle-[env] Management Group (where [env] is either test or prod) forms the foundation of the hierarchy. It sits directly under the tenant root. The purpose of this Management Group is to provide:
- **Access Control**: Role assignments at this scope flow down to every child Management Group and subscription. It’s the single place to grant “all landing zones" visibility and control.
- **Custom Policy Definitions**: All custom Azure Policy definitions live here so every child can reuse them without duplication.
- **Foundational deployments**: Platform-wide Deployment Stacks handle identity, policy, RBAC, and the hierarchy itself. If it’s core to the platform, it lands here first.


## Child Management Groups

Each child Management Group defines its own operational and security baseline, which applies only to the Azure subscriptions within its scope. The purpose of a child Management Group is to provide:

- **Policy Assignments**: Guardrails applied here are tuned to the child’s purpose — whether it’s `platform`, ``isolation``, or something new.
- **Access Control** — Role Based Access Control (RBAC) here covers every subscription under the child Management Group, making it easier to manage environment-specific roles.
- **Deployment Stacks**: Landing zone stacks live here, with unwanted actions protection on centrally managed resources.


| Responsibility        | Top-Level Management Group | Child Management Group |
|-----------------------|----------------------------|------------------------|
| **Access Control**    | All child MGs + subscriptions	 | All subscriptions in its scope |
| **Policy**            | Hosts reusable custom definitions	| Assigns environment-specific rules |
| **Deployment Stacks** | Foundational, platform-wide deployments	| Landing zone deployments with protections |
| **Subscription Grouping** | N/A | Groups by operational or security requirements |

## Subscription Bank

The Subscription-Bank Management Group sits directly under the tenant root, alongside `gazelle-test` and `gazelle-prod`. The role of this `Subscription Bank`:

- **Default Landing Place**:  All newly created subscriptions are placed here before being moved into the correct child Management Group during the landing zone deployment flow.

- **Cleanup & Reuse**: Subscriptions return here when a landing zone is decommissioned. After resources and configurations are removed, the subscription is ready to be reused. This approach is particularly valuable when operating under a Microsoft Customer Agreement, where the number of subscriptions per billing account is limited.
  
Because subscriptions in the bank are empty, changes can be applied directly without a test cycle. Both `gazelle-test` and `gazelle-prod` service principals have permissions to read and move subscriptions as needed.


## Test Environment

[Test is a perfect mirror of production](/docs/platform-as-code/#test-environments) — down to the same hierarchy, policies, access control, and deployment logic. The only difference is the suffix:
- Test groups end with -test
- Production groups end with -prod

These suffixes are applied automatically through GitHub workflow templates. That way, the environment context is baked into the deployment process. If it works in test, it works in prod — exactly the same way. That symmetry keeps surprises to a minimum.