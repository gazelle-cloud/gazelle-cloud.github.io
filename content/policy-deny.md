---
linkTitle: Deny Until Secure
title: Deny Until Secure-  Security-First by Policy
breadcrumbs: false
weight: 65
cascade:
  type: docs  
toc: true
---

## Overview

Gazelle enforces a **deny-by-default** security model using Azure Policy. Resources that fail to meet platform security baselines are denied at deployment time—preventing insecure configurations from ever entering the environment. This “Deny Until Secure” approach ensures that all workloads meet core security and operational standards _before_ they go live.

## Policy-Driven Enforcement

All platform security requirements are encoded as Azure Policy definitions. Each policy enforces a single compliance condition and is deployed through a centralized pipeline.

- **Deny by Default**: Key security policies use the `Deny` effect, blocking deployments that violate baseline rules.  
- **Auto-Remediation**: Non-critical configurations (e.g., tags, diagnostics) are enforced using `DeployIfNotExists` or `Modify` effects, which fix issues automatically.
- **Custom Definitions**: Policies are authored and deployed at the top-level management group. Every landing zone inherits them via scoped assignments.

## Enforced Security Standards

Gazelle policies target critical risk areas and enforce minimum security baselines. Key policies include:

### 🔐 Deny Local Authentication

- **Goal**: Enforce identity-based access via Entra ID.
- **Effect**: `Deny` policies block use of local auth (e.g., connection strings, access keys).
- **Impact**: All access is governed via RBAC and Entra ID.

### 🌐 Deny Public Network Access

- **Goal**: Block exposure to the public internet.
- **Effect**: Requires private endpoints or service endpoints.
- **Impact**: Reduces attack surface; enforces private connectivity by default.

### 📍 Allowed Locations

- **Goal**: Constrain deployment to a single, centrally-managed Azure region.
- **Effect**: `Deny` on all non-approved regions.
- **Impact**: Simplifies networking and cost forecasting.

### ✅ Config Diagnostic Settings

- **Goal**: Enforce logging and observability from day one.
- **Effect**: `DeployIfNotExists` configures diagnostic settings automatically.
- **Impact**: Ensures diagnostic logs are routed to Log Analytics.

### ✅ Allowed Resources

- **Goal**: Whitelist only pre-approved Azure services.
- **Effect**: `Deny` all non-whitelisted resource types.
- **Impact**: Prevents the use of insecure or unsupported services.

## Enforcement Scope

- **Definition Scope**: Top-level management group
- **Assignment Scope**: Child management groups (e.g., `online`)
- **Identity**: A dedicated managed identity is assigned to Azure Policy, with `Contributor` rights for deploying `Modify` and `DeployIfNotExists` effects.

## Why Deny First?

Denying insecure resources at deployment time ensures that:

- Teams get **immediate feedback** and can correct issues before rollout.
- Insecure or misconfigured infrastructure **never reaches production**.
- The platform remains **secure by default**, even for teams without deep cloud security knowledge.

This model shifts security left—enforcing compliance at the point of deployment, not after the fact.

## Exceptions & Flexibility

While policies are strict by default, Gazelle provides a mechanism for controlled flexibility:

- Teams can **request policy exemptions** by editing landing zone parameter files.
- Each exemption is traceable, auditable, and scoped only to the requesting environment.

## Governance Implications

- **No Manual Overrides**: All policy behavior—including exemptions—is managed as code.
- **Test Validation**: Changes are first deployed to a mirrored test environment, where behavior can be validated without impact.
- **Drift-Free Enforcement**: Policies are redeployed continuously; manual config drift is overwritten or blocked.

## Summary

“Deny Until Secure” is foundational to Gazelle’s security posture. By enforcing minimum baselines through code and blocking noncompliant resources, the platform ensures security is not optional—and never an afterthought.
