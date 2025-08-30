---
linkTitle: Landing zone
description: "An Azure landing zone in Gazelle is a self-service environment with budgets, identity, monitoring, and policies — built for team autonomy"
breadcrumbs: false
weight: 30
cascade:
  type: docs  
toc: true
sidebar:
  open: true
---

# What Is a Landing Zone?

Think of a landing zone as a blueprint dropped onto an empty Azure subscription. It’s the starting line — a shaped environment with budgets, networking, identity, monitoring, and policies in place.  

The exact shape of that blueprint varies from tenant to tenant. Some companies lean heavier on cost controls, others on network design, others on security hardening. That’s the flexibility: a landing zone isn’t one-size-fits-all, it’s an opinionated starting point tailored to how the company wants to run in the cloud.  

In Gazelle, I aim for the right balance between centralized and decentralized control — enough guardrails to keep the platform consistent, while still giving application teams a smooth path in the cloud.

## Built Your Way

Each landing zone arrives pre-built with the essentials — budgets, networking, identity, monitoring, and baseline policies — so you can start building immediately. From there, it’s up to you how to configure resources: code, ClickOps, or a mix of both. The platform doesn’t mandate the workflow. Autonomy means choosing the approach that fits your project — while guardrails keep you safe no matter how you deploy.

## Self-service

You request a landing zone through a GitHub Issue with just a few parameters. The pipeline provisions a ready-to-use subscription with guardrails already in place.  
Configuration lives in a parameter file — budgets, policies, network ranges, and more — making it the single source of truth. Updates are simple: edit the file, open a Pull Request, and the change flows automatically into Azure.  
Every step is captured in GitHub, so it’s always clear who requested the zone, how it’s configured, and what changed over time. Teams get full autonomy, while the platform remains transparent and consistent.

## GitHub Repo  

In Gazelle, a landing zone is more than just an Azure subscription — the GitHub repository is part of it. The repo holds everything that ties the environment together: getting-started deployment templates, global and environment-specific parameters, and the authentication link between GitHub and Azure.  

During setup, a new repo is cloned from a starter template that includes “hello world” examples, so teams can deploy something real on day one. Every landing zone comes with a GitHub repo pre-configured for its subscription. Environment variables handle the mapping, so the repo already “knows” where to deploy. The deployment flow is baked in from day one.

## Cost

Budgets are created on day one with an 80% alert threshold — because if you only hear at 100%, it’s already too late. Cost ownership is local to your app; we keep visibility high and surprises low.

## Identity

Every landing zone ships with a user-assigned managed identity at the subscription scope `Owner` so infrastructure pipelines can deploy immediately. I use federated credentials (Entra ID ↔︎ GitHub) scoped to `org/repo/environment`, so pipelines authenticate without secrets. 


## Network

You get a fresh virtual network — isolated by default. No on-prem links. No cross-zone links. Public access is denied by policy. If two landing zones need to talk, you add VNet peering — nothing is implicit. The default CIDR is `/24` (≈254 usable IPs); you can request a different range up front. We keep ranges unique across the tenant so peering never causes IP conflicts.

## Defender for Cloud

Out of the box, paid Defender plans are disabled to avoid noisy recommendations. Security alerts go straight to the owner for clear accountability.

Security alerts route to the owner email.

## Centrally Managed Resources

Centrally managed landing zone resources — the VNet, the user-assigned identity, and your Log Analytics workspace — live in a dedicated `landing-zone-resources` resource group that’s protected via Azure Deployment Stacks. Protection rules strike a balance: easy daily ops, but resistant to accidental changes.

## Monitor

Every landing zone ships with monitoring and diagnostics already wired in — its own Log Analytics workspace and activity logging from day one. The platform defines what’s collected; the data and cost belong to the team. You get visibility from the moment your zone is created, without having to set up monitoring for each resource you deploy in Azure.

## Policy baseline

Azure policies configured by default:

- **Allowed locations**: single-region deployments, to reduce cost, keep consistency between environments and streamline deployment experience. The region is centrally defined at GitHub variables, and reused by pipelines.
- **Allowed resource types**: only approved resources can be deployed, everything else is denied. 
- **Deny public network access**: network access to Azure PaaS services should be restricted using local firewalls or virtual networks, to reduce attack surface.
- **Deny local (non-Entra) auth**: Entra ID is the only one way to get authenticate, everything else - deny be default
- **Deny cross-tenant replication**: data replication between azure tenants is not allowed by default.
- **Deny weak TLS**: the network traffic should be encrypted using TLS 1.2.
- **Configure diagnostic settings**: diagnostic settings applied on all whitelisted resources. 

If you  need an exception, propose a policy exemption by editing your landing zone parameter file and Pull Request.