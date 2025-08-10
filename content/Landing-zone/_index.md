---
linkTitle: Landing zone
breadcrumbs: false
weight: 30
cascade:
  type: docs  
toc: true
sidebar:
  open: false
---


## Built Your Way

Each landing zone arrives pre-built with the essentials — budgets, networking, identity, monitoring, and baseline policies — so you can start building immediately. From there, it’s up to you how to configure resources: code, ClickOps, or a mix of both. The platform doesn’t mandate the workflow; the guardrails stay in place no matter how you deploy. Autonomy means choosing the approach that fits your project and your technical expertise.

## Cost

Budgets are created on day one. The default alert threshold is 80% — because if you hear at 100%, you learned too late. Cost ownership is local to your app; we keep visibility high and surprises low.

## Identity

Every landing zone ships with a user-assigned managed identity at the subscription scope `Owner` so your pipelines can deploy immediately. I use federated credentials (Entra ID ↔︎ GitHub) scoped to `org/repo/environment`, so pipelines authenticates without secrets. 

If you’re the app owner, you start with `Role Based Access Admin` role for your subscription. From there, design access your way — as code or via ClickOps.

Local Authentication methods (like access keys, or connection strings) is not allowed and denied by policy. Entra ID is the single entry point.

## Self-service

You request a landing zone via a GitHub Issue by providing few basic parameters. The pipeline runs, and you’ll get an Azure email confirming your budget alerts — that’s your “green light” that the zone is ready. To tweak anything (budget, policy exemptions, network range), edit your landing-zone parameter file and open a Pull Request.

## Network

You get a fresh virtual network — isolated by default. No on-prem links. No cross-zone links. Public access is denied by policy. If two landing zones must talk, you add VNet peering — nothing is implicit. The default CIDR is `/24` (≈254 usable IPs); you can request a different range up front. We keep ranges unique across the tenant so peering never causes IP conflicts.

## Defender for Cloud

Out of the box we keep it lean: paid Defender plans are not enabled by default, so you won’t drown in noisy recommendations, they are suppressed.

Security alerts route to the owner email so accountability is crystal clear.

## Resource group

Centrally managed landing zone pieces — the VNet, the user-assigned identity, and your Log Analytics workspace — live in a dedicated `landing-zone-resources` resource group that’s protected via Azure Deployment Stacks. Protection rules strike a balance: easy daily ops, hard to accidentally mess up.

## Monitor

Every landing zone ships with monitoring and diagnostics already wired in — its own Log Analytics workspace and activity logging from day one. The platform defines what’s collected; the data and cost belong to the team. You get visibility from the moment your zone is created, without having to set up monitoring for each resource you deploy in Azure.

## Policy baseline

Azure policies configured by default:

- **Allowed locations**: single-region deployments, to reduce cost, keep consistency between environments and streamline deployment experience. The region is centrally defined at github variables, and reused by pipelines.
- **Allowed resource types**: only approved resources can be deployed, everything else - deny. 
- **Deny public network access**: network access to Azure PaaS services should be restricted using local firewalls or virtual networks, to reduce attack surface.
- **Deny local (non-Entra) auth**: Entra ID is the only one way to get authenticate, everything else - deny be default
- **Deny cross-tenant replication**: data replication between azure tenants is not allowed by default.
- **Configure diagnostic settings**: diagnostic settings applied on all whitelisted resources. 

If you  need an exception, propose a policy exemption by editing your landing zone parameter file and Pull Request.


# TL;DR

* Request with a GitHub Issue; you’re shipping code minutes later.
* Budgets at 80% and cost ownership by app.
* Passwordless GitHub→Entra federation; User-Assigned managed Identity with subscription `Owner` for pipelines.
* VNet is isolated by default; peering is explicit; public is denied by default.
* Monitoring, diagnostics, and action groups are prewired to your Log Analytics workspace.
* Guardrails via Azure Policy; exemptions via PR when you accept the risk.
* In your landing zone, you choose how to build — code, ClickOps, or both — the guardrails still apply.
