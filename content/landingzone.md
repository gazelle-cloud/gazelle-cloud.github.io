---
linkTitle: Landing Zones
title: Landing Zones-  What They Mean for Application Teams
breadcrumbs: false
weight: 80
cascade:
  type: docs  
toc: true
---

Landing zones aren’t just an infrastructure concept—they’re the interface where application teams interact with the platform. In Gazelle, a landing zone is a secure, autonomous, and fully provisioned Azure subscription scoped to a single app and environment (e.g., app-prod, app-test). It comes pre-configured with policies, logging, and access controls so teams can build without worrying about foundational setup.

From the app team’s perspective, a landing zone is your starting point. It's where all your infrastructure lives. It's how you deploy, monitor, secure, and pay for cloud resources—end to end.

## What You Get

Each landing zone is provisioned using a GitHub Issue. Behind the scenes, the platform deploys:

- **A fresh Azure subscription** scoped to your app and environment  
- **Predefined Azure Policies** that enforce security and operational standards  
- **Log Analytics workspace** for centralized observability  
- **Custom RBAC roles** for scoped team access  
- **Budget alerts** tied to your invoice section  
- **Whitelisted services only**—ensuring compatibility and support  

No need to configure networking, policies, or identity integrations. It's done for you.

## Team Autonomy—Within Guardrails

Landing zones are built for autonomy. You manage:

- Your own GitHub repo (with starter Bicep modules and workflows)
- Your own infrastructure, costs, and runtime config
- Your own policy exemptions (file an issue, explain the use case)

But you operate within clear platform boundaries:

- **Deny-first policy enforcement**: insecure configs (e.g., public access, local auth) are blocked at deployment
- **Single-region deployments**: enforced via policy and GitHub variable  
- **Service whitelisting**: only approved resources are allowed  
- **No cross-subscription networking by default**: use VNet peering if needed  

## Cost Visibility & Accountability

Budgets are real, and you're responsible for them.

- **Invoice Section per App**: All landing zones for your app (dev/test/prod) roll up to one billing scope
- **Budget Alerts**: Get notified directly when usage approaches thresholds
- **Cost Ownership**: App owners are responsible for their spend—no shared pools, no surprises

## No Shared Services, No Surprise Dependencies

Every landing zone is isolated:

- No shared virtual networks  
- No shared identity services  
- No centralized logging dependencies  
- No surprises if another team makes a change  

This design avoids unintended coupling between teams and supports clean teardown or rebuild.

## Getting Started

The starter repo gives you:

- **Prebuilt Bicep modules** for all whitelisted services  
- **GitHub Actions workflows** aligned with platform standards  
- **Ready-to-use deployment patterns**—consistent with platform modules  

You can start small and iterate, using the same automation stack the platform team uses. And because it's all managed via GitHub, every change is versioned, reviewable, and reproducible.

## Operational Implications

- You don’t need deep platform expertise to get started  
- You *do* need to understand your responsibilities—especially around cost and policy compliance  
- You get flexibility, but you also own what you build  

This isn’t “just provision and forget.” It's cloud on your terms—with governance built in.

---

A landing zone isn’t just where your app lives. It’s where your operational maturity starts