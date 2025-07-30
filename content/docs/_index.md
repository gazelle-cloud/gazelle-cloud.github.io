---
breadcrumbs: false
toc: true
---

# Welcome to Gazelle

Gazelle is a lightweight platform for managing Azure landing zones as code—built on GitHub and Azure, and grounded in Cloud Adoption Framework and Platform Engineering principles. It gives application teams a fast, secure, and autonomous path to the cloud.

Designed for cloud-native workloads on Azure, Gazelle offers a lean, self-service experience with built-in security, cost tracking, and minimized reliance on centralized gate keeping.


## Platform Design

![platform overview](/platform-overview.png)


### GitHub – The Operational Backbone

- Platform logic and templates live in GitHub repositories.
- Teams interact via Issues and Pull Requests—no Azure Portal access required.
- All deployments handled through GitHub Actions, using standardized workflows.
- Teams manage their own landing zones—budgets, policy exemptions, and more—directly from GitHub.

### Azure – Where Cloud Resources Live

- Hosts core services like Azure Policy, Management Groups, Deployment Stacks, and Container Apps.
- Each landing zone contains resources like Log Analytics, Managed Identities, Alerts, and Networks.
- Application teams deploy and run workloads in Azure using their landing zones.


### Platform Layer – The Glue

- Offers GitHub-based self-service: teams request and manage environments via Issues.
- Enforces policy-driven guardrails for security and operational baseline.
- Structures management logic into modular, independently managed units.
- Manages cost ownership per application level.

### Landing Zones – Application Environments

- Each landing zone is isolated and self-contained.
- Includes default guardrails for security and operations.
- Where flexibility is needed, teams can exclude specific requirements using Azure Policy exemptions.
- Comes with a prebuilt “Getting Started” pipeline aligned with Gazelle standards.

## Key Benefits

| Feature             | What It Means                                                                 |
|---------------------|-------------------------------------------------------------------------------|
| **Lean Architecture**       | No centralized overhead—just what’s needed, nothing more.                |
| **Cost-Efficient**          | Pay only for usage. Avoids flat-fee services.                           |
| **Speed & Autonomy**        | Deploy in minutes. No tickets, no waiting.                              |
| **Decentralized**           | Each team runs their own stack, with minimal shared services.           |
| **Built-for-Purpose Modules** | Modules are task-oriented, not generic—easier to manage and evolve.    |
| **Everything-as-Code**      | No hidden state. All changes go through GitHub.                         |
