---
linkTitle: Flat Management Groups
title: Flat Azure Management Group Hierarchy
breadcrumbs: false
weight: 11  
cascade:
  type: docs  
toc: true
---

## Overview

Gazelle implements a **flat, one-level-deep Azure Management Group hierarchy**. This structure supports platform automation, policy enforcement, and access control without adding unnecessary complexity. Each layer has a distinct role in managing and governing the platform.

## Hierarchy Design

### Tenant Root

- **Purpose**: Reserved for emergency accounts only.
- **Access**: No platform services or policies are assigned here.
- **Constraints**: No day-to-day operations or deployments are scoped at the tenant root.

### Top-Level Management Groups

Gazelle defines two top-level management groups:

- `test`: mirrors production to validate platform changes safely.
- `prod`: hosts the production environment and all operational landing zones.

**Key properties:**

- **Symmetrical Structure**: Both hierarchies are structurally identical. This allows pipelines and modules to behave consistently across environments.
- **Test-First**: Production’s service connection can access the test hierarchy. This enables early adopters to validate changes in `test` before promoting to `prod`.
- **Central Scope**: Policy definitions, custom roles, access control modules, and deployment stacks are deployed at this level.
- **Stack Location**: Platform deployment stacks (e.g., policy, access control, automation) are scoped here, enabling centralized lifecycle management.
  
### Child Management Groups

Each top-level group has child groups representing functional domains. Current structure:

- `platform`: Hosts shared platform components.
- `online`: Hosts application workloads.

**Behavior and constraints:**

- **Landing Zones**: New landing zones are provisioned into subscriptions under these child management groups. The deployment stack resides at the child level, aligning with the environment.
- **Scoped Policies**: Policies are assigned at the child management group level. This allows operational and security requirements to differ across domains.
- **RBAC Segmentation**: Although application engineers may receive `Owner` access at the subscription level, resource protection via Deployment Stacks ensures critical platform resources remain immutable.
- **Stack Protection**: The deployment stack prevents accidental deletion or mutation of protected resources. Engineers operate within their subscription scope, but cannot override centrally managed resources.

## Design Rationale

- **Flat Hierarchy**: Simplifies access control and automation. By avoiding deep nesting, Gazelle maintains clarity and reduces the risk of inherited misconfigurations.
- **Test Mirror**: Keeping `test` and `prod` hierarchies structurally identical enables pre-production validation of platform changes—an essential step in Gazelle’s change flow.
- **Scoped Enforcement**: Assigning policies and access control at the child level allows different parts of the platform to enforce different controls, while reusing the same set of definitions.

## Operational Alignment

- **Automated Platform Management**: All platform code is deployed through GitHub Actions, using Deployment Stacks for lifecycle control.
- **Policy-as-Code**: Custom policy definitions are authored at the top-level and assigned at the child level. This separation allows reuse while enabling contextual enforcement.
- **Access Control as Code**: Custom role definitions and assignments are applied per environment. Each group receives just enough permission to operate safely.

For more on how Gazelle configures platform capabilities across this hierarchy, see:

- [Access Control](/docs/access-control)
- [Policy](/docs/policy)
- [Deployment Stacks](/docs/platform-management#deployment-stacks)
- [Automation](/docs/automation)
