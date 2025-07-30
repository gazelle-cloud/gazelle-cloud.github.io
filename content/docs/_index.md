---
breadcrumbs: false
toc: true
---

# Welcome to Gazelle

Gazelle is a lightweight platform for managing Azure landing zones as code, built on GitHub and aligned with the Cloud Adoption Framework and Platform Engineering principles. It empowers application teams with a fast, secure, and autonomous path to the cloud.

Gazelle is ideal for teams deploying cloud-native workloads to Azure who want a lean, self-service platform with built-in security, and cost tracking—without the overhead of centralized gate keeping.

## Why Gazelle?

Managing Azure at scale often means juggling inconsistent environments, manual changes, and fragmented access controls. Gazelle replaces that chaos with structure:

- **Everything-as-code**: Identity, policy, budget, and infra are all GitHub-managed.
- **Self-service by design**: Teams deploy and manage their own landing zones through GitHub Issues.
- **Safe-by-default**: Azure Policies prevent prevent security misconfigurations by default.

## Platform Design

![platform overview](/platform-overview.png)


### GitHub – The Operational Backbone

- Platform logic and templates live in GitHub repositories.
- Teams interact via **Issues** and **Pull Requests**—no Azure Portal access required.
- All deployments handled through **GitHub Actions**, using standardized workflows.
- Teams manage their own landing zones—budgets, policy exemptions, and more—directly from GitHub.

### Azure – Where Cloud Resources Live

- Hosts core services like Azure Policy, Management Groups, Deployment Stacks, and Container Apps.
- Each landing zone contains resources like Log Analytics, Managed Identities, Alerts, and Networks.
- Application workloads run in isolated environments.

### Platform Layer – The Glue

- Offers GitHub-based self-service: teams request and manage environments via Issues.
- Enforces **policy-driven guardrails** for network, identity, monitoring, and diagnostics.
- Structures all logic into modular, independently managed units.
- Manages cost ownership using budget alerts and invoice sections.


### Landing Zones – Application Environments

- Each landing zone is isolated and self-contained.
- Includes default guardrails for security and observability.
- Teams can **relax guardrails** where needed using Azure policy exemptions.
- Comes with a prebuilt “Getting Started” pipeline aligned with Gazelle standards.

## Key Benefits at a Glance

| Feature             | What It Means                                                                 |
|---------------------|-------------------------------------------------------------------------------|
| **Lean Architecture**       | No centralized overhead—just what’s needed, nothing more.                |
| **Cost-Efficient**          | Pay only for usage. Avoids flat-fee services.                           |
| **Speed & Autonomy**        | Deploy in minutes. No tickets, no waiting.                              |
| **Decentralized**           | Each team runs their own stack, with minimal shared services.           |
| **Built-for-Purpose Modules** | Modules are task-oriented, not generic—easier to manage and evolve.    |
| **Everything-as-Code**      | No hidden state. All changes go through GitHub.                         |
