---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
# Azure landing zones

This is a hands-on project called Gazelle, designed to explore Azure, modern software engineering practices, and platform engineering principles. The main goal of Gazelle is to deepen understanding of [Azure landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/) by building a lightweight, production-like environment that shows how teams can move fast in the cloud—without getting stuck in centralized processes.  
All the code is publicly available in a [GitHub repository](https://github.com/gazelle-cloud/Azure-landing-zones)—adapt what works for your team.

## High-Level Overview

Gazelle demonstrates a decentralized approach to Azure landing zone design, where application teams can provision and manage their own environments with minimal dependency on a central platform team. The focus is on enabling fast, and compliant delivery by shifting ownership to the teams closest to the work.

To support this, the environment leverages Azure-native services and integrates with GitHub for  deployment workflows and self service, as well as Entra ID for secure identity and access management.

![landing-zone-platform](/gazelle-platform-high-level.png)

## Design Principles

- **Lightweight Platform**: This platform keeps shared services to a minimum to avoid overhead and unnecessary friction. Instead of using centrally managed components, each landing zone includes the core services it needs—so teams can configure things based on what works best for them. This design trades cost for speed and autonomy.
- **Test Environment**: A dedicated test environment closely mirrors the production setup, allowing for safe experimentation and thorough validation of changes before deployment. Main branch protections enforce a workflow where all changes must first be tested in this environment, ensuring only verified updates are promoted to production.
- **BigBang**: BigBang is a GitHub Actions pipeline that wraps up all Azure platform capabilities and configurations into a single, automated deployment. With one click, you can bring up a fully working environment—perfect for disaster recovery or refreshing the test setup.
- **Self Service**: Teams shouldn’t have to wait on others to get things done. This platform lets app teams spin up and manage their own landing zones through GitHub Issues. They can tweak budgets, exclude certain resources from security baselines, and handle other environment-specific needs—all without relying on a centralized team.
- **Cost Efficiency**: You only pay for what you use. When the platform is running full speed, the cost scales with usage. When it’s idle, it should cost nothing. Services with flat fees—such as Virtual WAN—are intentionally avoided, as they incur cost even when idle. Instead, the platform uses Azure’s consumption-based services, which scale with usage and help maintain predictable, efficient costs.
- **Small, Task Oriented Modules**: Everything is broken down into small, focused Bicep modules. That makes the platform codebase easier to understand, change, and maintain. You can tweak one part without accidentally messing up others.
- **Fully Automated Deployments**: Every part of the platform is deployed through automation—no manual steps, no configuration drift. This ensures consistency, repeatability, and strict adherence to infrastructure-as-code practices.


## Design Areas
### Billing
Billing is designed for clarity and ownership. Each application has its own [invoice section](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/mca-section-invoice) under a Microsoft Customer Agreement, enabling direct cost tracking across all of its environments. This gives app teams a clear, consolidated view of their total spend. Budgets and alerts are configured at two levels:
 - At the invoice section level, to monitor total application cost across all environments.
 - At the individual landing zone level, to track spend per environment (e.g., test, prod).

This layered approach gives teams both the high-level picture and the ability to zoom in. When forecasted costs approach budget thresholds—whether at the app level or for a specific environment—automated alerts are sent to the application owner. That gives teams time to respond before costs get out of hand. 

Platform team gets visibility into the bigger picture by reviewing budget data across all applications (invoice sections). This lets monitor trends, identify optimization opportunities, and guide overall cloud cost strategy, without stepping into the day-to-day responsibilities of app teams.

### Identity

Identity is built around Entra ID as the single source of truth. Local authentication methods like connection strings and access keys are disabled by Azure Policy—they’re considered unsafe and out of scope for this platform. All authentication is handled through Entra ID and authorized via Role-Based Access Control (RBAC), following modern identity and access management patterns.

Each landing zone has its own dedicated user-assigned managed identity, used by the automation deployment pipeline. This identity is granted Owner permissions at the subscription level and is configured with [federated credentials](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure) that authenticate directly from the application’s GitHub repository. It integrates seamlessly with the getting-started deployment pipeline—no passwords, no extra configuration—just provisioning resources straight from code to Azure.
### Resource Organization

The platform uses a flat Azure Management Group hierarchy, grouping subscriptions by compliance and operational requirements to avoid Azure Policy conflicts and keep governance simple. Subscriptions are organized into three categories:

- Platform – for foundational Azure resources required to operate the platform itself.
- Online – for all application landing zones without any network connectivity to on-prem environments.
- Playground – an unrestricted space for learning, exploration, and rapid prototyping.

The platform is limited to single-region deployments to reduce complexity and cost. The target region is centrally managed as an environment variable in GitHub. Pipelines automatically pull this value, so application teams don’t need to manage regional settings themselves.  
In the event of a regional outage, the globally defined region variable can be updated, pipelines re-run, and the platform redeployed to a new region—no manual intervention, no rework.

Landing zones follow a strict one app, one environment model. Each zone maps directly to a specific application and environment—for example, BigData-test. This structure enforces clear ownership, maintains separation of duties, and ensures that changes in one environment (like test) don’t impact others (like prod).

Each landing zone includes a dedicated `landing-zone-resources` resource group for centrally managed services like virtual networks or Log Analytics workspaces. These resources are protected by [Azure Deployment Stacks](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deployment-stacks?tabs=azure-powershell#protect-managed-resources), which allow safe customization (e.g., adding subnets) while blocking destructive operations like deletes. This balances team flexibility with operational safeguards.

### Network

Networking is built with isolation as the default. There is no out-of-the-box connectivity to other landing zones, on-premises networks. Public access is blocked using Azure Policy, ensuring that all traffic is secure and controlled. Platform-as-a-Service (PaaS) resources—like storage accounts or databases—must restrict traffic using service endpoints, and configure local firewalls accordingly.

If network communication is needed, it must be set up explicitly via virtual network peering—always under the control of the owning team.

Only secure traffic is allowed. Azure Policy blocks the use of HTTP. All traffic must use HTTPS and follow modern TLS configurations to ensure encrypted, secure communication.

Virtual network address space is configurable. By default, each landing zone receives a /24 CIDR block, providing up to 255 IP addresses. A unique range is assigned during zone creation to prevent IP conflicts and make peering straightforward. Application teams are free to define their own subnets to match the needs of their workloads. 

### Security

Microsoft Defender for Cloud is configured at the free tier across all landing zones to monitor security posture. It continuously scans resources and flags potential misconfigurations or vulnerabilities.

To avoid recommendation fatigue, non-applicable recommendations are filtered out, so teams can focus on what actually matters—without being overwhelmed by noise.

Security alerts are routed directly to the responsible application teams. They're expected to respond to security issues the same way they handle app errors or performance problems—with full ownership and accountability.

### Compliance

Governance follows a policy-driven approach, ensuring that security baselines and operational standards are met out of the box—without manual intervention from the platform team.

Security baselines use a `Deny` effect: if a resource doesn’t meet platform security requirements, it simply won’t get deployed. This gives application teams immediate feedback about misconfigurations and lets them correct issues early—before anything goes live.

Platform operational requirements—such as tags or diagnostic settings—are applied using `DeployIfNotExists` or `Modify` effects. These policies auto-configure non-critical settings in the background, reducing friction while keeping the platform consistent and reliable.

Only approved Azure services are allowed. This whitelisting model aligns with both security and operational goals, reducing risk and ensuring predictable behavior across all landing zones.

Azure Policies are grouped by compliance scope, and their names start with the policy effect—like 'Deny Public Network Access' or 'Config Diagnostic Settings'. This makes it easy for teams to understand both the intent and the impact of each policy.

Where flexibility is needed, teams can exclude specific resources by editing the landing zone’s parameter file—striking a balance between governance and team autonomy.