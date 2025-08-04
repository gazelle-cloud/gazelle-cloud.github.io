---
linkTitle: Shared Services
title: Why Gazelle Avoids Shared Services—and What That Enables
breadcrumbs: false
weight: 51
cascade:
  type: docs  
toc: true
---

## No Shared Services by Design

Gazelle explicitly avoids shared services across landing zones. Each environment is self-contained, provisioned into a dedicated Azure subscription, and configured with everything it needs to operate independently.

This includes:

- **No shared monitoring**: Each landing zone emits its own diagnostic logs to its own Log Analytics workspace.
- **No shared automation**: Platform jobs are scoped to control-plane operations. Application-level automation is owned and deployed by the application team.
- **No shared networking**: Landing zones are isolated by default; there is no transit connectivity between them unless explicitly configured.
- **No shared identity services**: Each environment inherits Entra ID-based access controls and policies but operates without dependence on a central identity runtime.

## Technical Rationale

Avoiding shared services simplifies:

- **Isolation and Fault Domain Boundaries**: No shared runtime means one team's misconfiguration can't break another's environment.
- **Cost Attribution**: With each landing zone tied to its own invoice section, there is clear cost ownership and clean visibility.
- **Security Posture**: Policies enforce deny-by-default rules (e.g., no public access, no local auth) within each zone, reducing attack surface without requiring a shared trust boundary.
- **Autonomy**: Teams manage their own budgets, request policy exemptions, and operate within guardrails independently—without needing platform support for every change.

## What This Enables

### 1. **Full Lifecycle Autonomy**
Teams can provision, operate, and destroy their own environments using GitHub Actions—without dependencies on a shared runtime. This model reinforces team ownership and decouples velocity from centralized bottlenecks.

### 2. **Reliable Policy Enforcement**
Platform-level policies (e.g., deny public access, enforce diagnostic settings) are assigned at the landing zone scope. Because there are no shared components, enforcement is consistent and isolated—no special exemptions required to accommodate shared infrastructure.

### 3. **Clean Access Boundaries**
Custom RBAC roles are assigned per zone via code. With no shared identity layers or runtime access points, Gazelle eliminates lateral movement risk between zones. This supports zero-trust principles by default.

### 4. **Fail-Fast Operations**
Failures in one zone don't propagate. If a team misconfigures a resource or violates a policy, the error is scoped to their subscription. Logs, policy effects, and enforcement are local—making troubleshooting easier and lower impact.

### 5. **No Hidden Coupling**
Each landing zone can evolve at its own pace. There’s no dependency on shared versioning, runtime services, or integration points. This makes refactoring safer and more predictable over time.

## Summary

Gazelle avoids shared services to enforce strong boundaries between teams, simplify governance, and reduce operational overhead. This design choice is central to enabling autonomous, policy-compliant landing zones that scale with minimal coordination cost.
