---
breadcrumbs: false
cascade:
  type: docs  
toc: false
---


# Gazelle  
**Azure landing zones as code — self-service, policy-driven, and fully automated via GitHub**

Gazelle lets teams provision Azure environments in minutes—without requiring Azure access or manual approvals. Everything runs through GitHub. Every environment is isolated. Every operation is code-driven.

Built for autonomy with guardrails, Gazelle eliminates the traditional bottlenecks of cloud provisioning while maintaining control over cost, and safe configuration.

---

## What Gazelle Does

- **Self Service**: Provision, update, and tear down landing zones using GitHub Issues and Actions. No portals.
- **Provides Autonomy**: Application teams build and operate independently, within platform guardrails. You build it-you run it.
- **Safe Configuration by Default**: Every environment inherits a secure baseline—via Azure Policy, access controls, network isolation, and logging. This helps teams meet organizational requirements without needing deep cloud expertise.
- **Per-App Cost Visibility**: Each application gets its own invoice section, with budgets and alerts configured.

## Built-In Constraints

- **Single Region**: All resources deploy to a single region. The region is centrally defined in GitHub variables to standardize deployment.
- **Whitelisted Azure Resources**: Only approved services are deployable. Others are blocked by policy.
- **Network Isolation**: By default, landing zones have no network connectivity to each other or to on-premises systems.
- **No Shared Services**: Each landing zone is fully independent. There are no shared components across teams or environments.

## How Gazelle Is Built	

- **Everything-as-Code**: Infrastructure, policy, access, and budgets are managed as code in GitHub. Nothing is configured by hand.
- **Composable Architecture**: The platform is built from modular building blocks—each independently defined and deployed through its own pipeline.
- **Reproducible by Design**: A full `Big Bang` workflow can destroy and rebuild the entire platform from scratch at any time.
- **Test Environment**: Platform changes deploy first to a mirrored test environment. All updates are validated before reaching production.