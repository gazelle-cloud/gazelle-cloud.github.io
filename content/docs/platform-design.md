---
breadcrumbs: false
toc: true
---

## Platform Design
Gazelle is a lightweight platform for managing Azure landing zones as code—built on GitHub and Azure, and grounded in Cloud Adoption Framework and Platform Engineering principles. It gives application teams a fast, secure, and autonomous path to the cloud.

Designed for cloud-native workloads on Azure, Gazelle offers a lean, self-service experience with built-in security, cost tracking, and minimal reliance on centralized gatekeeping.

![platform overview](/platform-overview.png)


### GitHub – The Operational Backbone

- Platform management logic and templates live in GitHub repositories.
- Teams [interact with the platform via Issues](/docs/platform-management/#operational-flow) and Pull Requests—no Azure Portal access required.
- All deployments handled through GitHub Actions, using [standardized workflows.](/docs/platform-management/#standardized-deployments)
- Teams manage their own landing zones—budgets, policy exemptions, and more—directly from GitHub.

### Azure – Where Cloud Resources Live

- Hosts platform services like Azure Policy, Management Groups, Deployment Stacks, and Container Apps.
- Each landing zone contains resources like Log Analytics, Managed Identities, Alerts, and Networks.
- Application teams deploy and run workloads in Azure using their assigned landing zones.


### Platform Layer – The Glue

- Provides GitHub-based self-service: teams request and manage environments via Issues.
- Enforces [policy-driven guardrails](/docs/platform-management/policy/) for security and operational baselines.
- Structures management logic into [modular, independently managed units.](/docs/platform-management/#small-task-oriented-modules)
- [Tracks cost ownership](/docs/platform-management/tenant-level/#invoice-sections) at the application level using Azure billing services.

### Landing Zones – Application Environments

- Each landing zone is isolated and self-contained.
- Includes [default guardrails](/docs/platform-management/policy/#applied-policies) for security and operations.
- Where flexibility is needed, teams can exclude specific requirements using Azure Policy exemptions.
- Comes with a “Getting Started” pipelines aligned with Gazelle standards.