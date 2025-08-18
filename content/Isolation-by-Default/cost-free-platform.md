---
linkTitle: Cost Free Platform
description: "How the platform eliminates its own cloud costs by design, using Azure’s free governance services, and shifting all usage costs directly to application teams from day one"
breadcrumbs: true
weight: 20
cascade:
  type: docs
toc: true
---
# Platform Cost-Free by Design 

From the moment the platform spins up, its own cost is kept out of the bill — completely.  
Not reduced, not offset — just gone.

The trick is simple: the platform’s own services are stateless and avoid powerful compute. They don’t store customer data, they don’t process high-volume workloads, and they don’t rely on billable shared infrastructure. No state means no storage, no CPU, no ongoing bill. Everything runs on Azure’s free governance tier — management groups, policy, deployment stacks, subscription creation, and a few others. The moment you introduce a billable service like Virtual WAN or premium PaaS, you’ve broken the model. So I don’t.

> If the platform ever bills you, it’s doing someone else’s job.

## Autonomy by Design

The goal is to give application teams full autonomy. They choose the infrastructure they need, they own it, and they carry its cost.

The platform doesn’t run your web apps or databases — you do. It doesn’t manage your network traffic. That’s your call. Gazelle’s job is to hand you a safe, isolated landing zone with the right guardrails, and then get out of your way.

There’s no showback or chargeback model — the cost never touches the platform. It stays with the app team from day one, directly tied to their Azure subscription and invoice section. No reallocation spreadsheets, no accounting gymnastics.

Autonomy here isn’t “you’re on your own” — it’s “you’re in control.” You can deploy however you like (Bicep, Terraform, ClickOps) and integrate whatever cloud services make sense for your workload. The platform won’t block you from moving.

## All You Need, Shipped Day One

Instead of introducing bottlenecks by centralizing operational services, I ship all the essentials directly into the landing zone.

Budgets, policies, networking, monitoring, identities — they arrive with the landing zone itself. The platform manages them centrally via automation, ensuring consistency across the tenant, but the cost belongs to the app team because the resources live in their subscription. And again, zero cost from initial infrastructure if it's on idle.

That consistency doesn’t limit flexibility. Want to peer your VNet to another landing zone? Go ahead. Need different policy exemptions for a test environment? Edit your landing zone parameters, PR it, and you’re done. You get guardrails.

## Engine for Landing Zones

The platform is essentially an engine for creating landing zones. Each one is isolated by default — no shared networks, no accidental dependencies, no public endpoints unless you explicitly open them.

The platform builds these environments entirely with Azure’s free governance services:
- Management Groups for hierarchy
- Azure Policy for guardrails implementation
- Deployment Stacks for resource lifecycle management
- Subscription Creation APIs for environment isolation
- RBAC roles for access control
- Managed Identities for passwordless authentication

Because these are free-tier services, the platform can create as many landing zones as you need without adding to the bill.

## Design for Zero Cost
### Monitoring
Every landing zone ships with its own Log Analytics workspace and pre-configured diagnostic settings. The platform decides what activity logs to collect, but the data lives with the app team — and so does the cost.

### Network Peering
Network isolation is the default — nothing talks unless you say so. When two landing zones need to communicate, VNet peering is the tool for the job. The platform doesn’t try to act as a middleman; that would turn me into a bottleneck. Instead, app teams own the configuration. The only central rule is unique CIDR ranges across the tenant, so peering “just works” without IP conflicts. Secure by default, flexible when needed.

### Defender for Cloud
Platform’s secure configuration baseline is enforced via Azure Policy, so most known misconfigurations never make it through the door. Paid Defender for Cloud tiers are excluded of recommendations on purpose — the security baseline decision is already implemented. If you want the advanced capabilities, they’re right there for you to turn on — and to own the cost.

### Advisory Alerts
Activity log alerts and log search alerts aren’t free — they bill per action and add up fast. To keep the platform cost-free, I rely on Advisory alerts, which come at no charge. They don’t offer the same depth or granularity as paid alerts, but they’re still useful for surfacing signals about platform health and catching issues early. For anything beyond that, application teams use their own monitoring in landing zones — and they own both the data and the bill.

## Scope and Cost Boundaries

The platform uses some external services, but their cost sits outside the platform itself:

- Entra ID licensing — advanced identity features like Conditional Access require premium licenses. The platform relies on Entra ID for authentication, but the license is a tenant-level responsibility, not part of the platform’s bill.
- GitHub hosting — all automation runs through GitHub Actions. To keep outputs away from public eyes, the platform assumes a GitHub Team plan or higher. It’s required for secure operation.

A few Azure services technically bill by usage, but their free tiers more than cover the platform’s needs:

- Log Analytics Workspace — Log Analytics Workspace — the platform management subscription has one, but with such a small footprint, the free 5 GB/month is plenty.
- Container Apps — used for lightweight automation tasks, where the free minutes cover executions that take only seconds.


## Shared Responsibility

This model keeps responsibilities clean:
- The platform defines the rules and enforces the baseline.
- Application teams build what they want inside those rules, own their data, and pay only for what they use.

The result is a governance-first, cost-free platform that never becomes a bottleneck — and never surprises you with a bill.



