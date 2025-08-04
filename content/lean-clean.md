---
linkTitle: Lean, Clean by Design  
title: What It Means to Be “Lean, Clean by Design” in a Cloud Platform  
breadcrumbs: false  
weight: 53 
cascade:
  type: docs  
toc: true
---

## Overview

“Lean, clean by design” is more than a slogan in Gazelle—it’s a structural principle. The platform is deliberately built to minimize unnecessary complexity, enforce secure defaults, and ensure that everything—from cost to compliance—can be validated, managed, and operated as code. The goal is to keep the platform simple to operate, cost-effective to run, and safe by default.

## Principles in Practice

### Lean: Minimize Overhead and Manual Intervention

- **No Manual Changes**: All platform and landing zone operations flow through GitHub. No portal access, no hand-tuned infrastructure.
- **Composable Modules**: Each platform capability (monitoring, policy, access control) is packaged into small, task-scoped Bicep modules. This eliminates bloat and avoids broad, monolithic templates.
- **Cost Efficiency**: Gazelle avoids fixed-cost services that don’t align with its usage-based model (e.g., Defender for Cloud paid plans).
- **Single Region Constraint**: Enforced via policy and GitHub variables, reducing latency risks and network complexity.
- **Minimal Infrastructure for Automation**: Operational tasks run as scheduled Container App Jobs, using free-tier compute and no VNet integration.

### Clean: Enforce Secure Defaults and Prevent Drift

- **Deny-First Policies**: Core security requirements (e.g., no public endpoints, no local auth methods) are enforced using Azure Policy with a `Deny` effect.
- **DeployIfNotExists for Ops**: Operational standards (e.g., tagging, diagnostics) are auto-applied using `DeployIfNotExists` to prevent config drift without blocking deployments.
- **Custom Roles**: Access control is scoped to least privilege and managed entirely as code. Orphaned assignments are cleaned up via automation.
- **Policy-Driven Guardrails**: Only whitelisted Azure services are permitted; policies explicitly block non-compliant services.

### By Design: Reproducibility and Automation Everywhere

- **Big Bang Workflow**: The entire platform can be destroyed and rebuilt on demand. All deployments are reproducible from code, with no drift or hidden state.
- **Standardized Pipelines**: Every deployment follows the same structure—triggered from GitHub, authenticated via federated credentials, and validated in a test mirror before production.
- **Output-as-Interface**: Resource IDs and configuration values are shared between modules via GitHub Variables, avoiding tight coupling between components.
- **Environment Isolation**: Each landing zone is an independent Azure subscription, with its own billing, policies, and no network access to other zones by default.

## Design Rationale

This approach reduces risk, simplifies operations, and improves scalability:
- Security is enforced proactively rather than reactively.
- Teams get autonomy without compromising compliance.
- The platform remains understandable and maintainable even as it scales.

Gazelle doesn’t aim to support every use case—but what it does support, it supports cleanly and predictably. That’s what it means to be “lean, clean by design.”
