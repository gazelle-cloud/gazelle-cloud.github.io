---
linkTitle: Design Principles
description: "How I design Azure landing zones — covering cost, network, identity, and monitoring for autonomous teams at zero platform cost"
breadcrumbs: false
weight: 10
cascade:
  type: docs  
toc: true
sidebar:
  open: true
---


From day one, the goal was clear: let application teams move fast without bottlenecks. That meant isolation at every layer — network, identity, cost, operations, even region. And because every capability is [managed entirely as code](/docs/platform-as-code/), the guardrails stay identical everywhere, enforced automatically with no need of manual drift.

## Application Autonomy

Each workload runs in its own [landing zone](/docs/landing-zone/) — a fully independent cloud environment with budgets, networking, diagnostics, and baseline policies already in place. No shared dependencies, no accidental leakage between workloads. You get a ready-to-go foundation that lets you start building immediately, without waiting on central teams.

## Network

Each landing zone comes with a fresh Azure virtual network. By default, there's no network connectivity — not to on-prem, not to other landing zones. Azure Policy also blocks direct public access. If access is needed, it must be explicitly opened via local PaaS resource firewall rules. This keeps the surface area minimal and the blast radius small.

If workloads in different landing zones need to talk, they can — through virtual network peering. But that’s an explicit configuration. Nothing is automatic or implied. Everything is isolated — intentionally.

## Identity

There’s only one way into Azure: `Entra ID`. All other authentication methods are blocked by policy.

I'm working toward eliminating direct human access entirely. That said, some operations — like restarting a service — are practical to allow. For that, I use custom RBAC roles that match what people actually do — like cloud engineers to operate the platform. Each role only gets what they actually need.

These roles are assigned at the management group level, providing coverage across multiple landing zones. At the same time, access is limited so it doesn’t interfere with what’s defined in code. The code is the source of truth, and deployments will always apply it as-is.

## Resource Organization

Each landing zone starts as a clean Azure subscription with a predefined blueprint applied. This gives me a one-to-one mapping: one environment, one application, one landing zone.

No mixing environments in the same landing zone. If you need dev, staging, and prod — you get three isolated landing zones. This prevents developers from accidentally breaking production while testing in dev, and it keeps cost tracking clean and boundaries clear.

## Cost

Application teams have full ownership of their costs. Each application is mapped to its own [Azure invoice section](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/mca-section-invoice), which includes all associated environments.

Budget alerts are set at the landing zone level — default at 80%, because if you're hitting 100%, it's already too late. Alerts are also configured at the invoice section level to give broader visibility across the application’s total spend.

[The platform runs at zero cost](/docs/design-principles/cost-efficiency/), even at full speed, because it’s built on Azure’s free services. Flat-fee traps like Virtual WAN are avoided by design. Everything is free. If the platform bills, it’s doing someone else’s job.

## No Shared Services

The platform is intentionally built without shared services. That’s a conscious choice.

No central teams managing network traffic or logging stacks. If an app team needs something, they own it. This avoids bottlenecks and keeps the `you build it, you run it` model clean and scalable.

Instead of building shared services, the platform bakes in the essentials directly into each landing zone. For example, monitoring is built-in — every landing zone gets its own Log Analytics workspace, provisioned automatically during setup. Diagnostic settings are applied using centrally managed policies. The platform defines what gets collected, but the data and cost stay with the app team.

Think about it like this: the platform sets the rules — teams own the outcome. That’s a shared responsibility model by design.

## Single Region Deployment

To keep things simple and predictable, all deployments happen in a single Azure region.

That region is centrally defined — set once at the GitHub org level and pulled into every deployment pipeline. This avoids the complexity (and cost) of cross-region deployments — unless a different setup actually makes sense.

## Whitelisting Approach

In Gazelle, nothing runs unless it’s explicitly approved. Every landing zone starts with a tight allow-list of Azure resource types — think storage accounts, virtual networks — and anything outside that list is denied by policy. This keeps the platform intentional: no surprise services, no chasing misconfigurations after the fact. When a new Azure service is needed, it can be [whitelisted](/docs/design-principles/whitelisting) once — and instantly available to everyone.
