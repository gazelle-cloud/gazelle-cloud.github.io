---
title: Cost Management
linkTitle: Cost Management
breadcrumbs: true
weight: 70
cascade:
  type: docs
toc: true
---

## Overview

Gazelle decentralizes cost management. Each application team receives its own invoice section, owns its budget, and sees all usage across dev, test, and prod. No central mediation, no hidden usage—teams have direct financial visibility and responsibility.

This structure aligns with Gazelle's principles of autonomy and accountability while keeping governance enforceable through policy and automation.

## Platform-Level Billing Configuration

Billing is configured at the tenant level using a Microsoft Customer Agreement (MCA) billing account. Key elements include:

- **Invoice Sections per App**: Each application is mapped to a dedicated invoice section. All subscriptions (dev, test, prod) under that application share the same section.
- **Owner Visibility**: Application teams can view usage and budget status directly in the Azure Portal or Cost Management APIs.
- **Budget Alerts**: Alerts are triggered when consumption approaches the defined budget threshold and sent directly to the owning team.
- **Classic ARM Deployment**: Invoice sections are deployed using classic templates. Deployment Stacks are not used here due to Azure's lack of support for deleting invoice sections.

> Only the production environment provisions and configures invoice sections. Test environments do not trigger billing resources.

## Landing Zone Cost Ownership

Every landing zone is deployed into its own subscription, and all subscriptions for a given app share one invoice section. This enables:

- **Per-App Consolidation**: All environments (dev, test, prod) are billed to the same invoice section, giving a complete view of app-level costs.
- **Clear Responsibility**: Application owners are directly responsible for cost tracking and responding to alerts.
- **No Shared Services**: Billing is not split across shared infrastructure—each app owns its full cost footprint.

## Cost Control by Design

Gazelle embeds cost awareness into platform architecture:

- **Single Region**: All deployments occur in a single Azure region (centrally defined via GitHub variables). This simplifies architecture and avoids multi-region cost surprises.
- **Whitelisted Resources**: Only pre-approved Azure services can be deployed. This prevents accidental use of unsupported or high-cost services.
- **Network Isolation**: No cross-zone or cross-subscription traffic by default. Reduces hidden costs from inter-zone bandwidth or shared resources.
- **Diagnostic Cost Locality**: Each landing zone routes logs to its own Log Analytics workspace. Monitoring cost is borne by the application—not the platform.

## Budget Alerting

Budgets are enforced through Azure-native budget alerts:

- **Alerts Triggered at Thresholds**: Alerts notify the app owner as spend nears its budget (e.g., 80%, 100%).
- **Direct Routing**: Alerts route directly to team email—no intermediary.
- **No Spend Blocking**: Gazelle does not block spend; it alerts and relies on team responsibility to act.

## Design Rationale

This model works because Gazelle combines policy-enforced constraints with team-level autonomy:

- Platform enforces limits (region, service type, network access) to prevent runaway spend.
- Teams see and control their own cost exposure—without needing help from the platform team.
- Infrastructure-as-Code means cost management configurations are versioned and reviewable.

## Summary

Gazelle’s cost model enables financial clarity and team ownership. By embedding budgets, alerts, and visibility directly into each application’s environment, teams are empowered to manage costs responsibly—within tight guardrails that keep the platform safe and scalable.