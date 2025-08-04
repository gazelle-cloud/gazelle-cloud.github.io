---
breadcrumbs: false
cascade:
  type: docs  
toc: false
---
<div style="margin: auto; text-align: center;">
<div class="hx:mt-6 hx:mb-6">
{{< hextra/hero-headline >}}
  Run Azure landing zones&nbsp;<br class="hx:sm:block hx:hidden" />with GitHub Actions
{{< /hextra/hero-headline >}}
</div>

  <div style="height: 3rem;"></div>

</div>

## Meet Gazelle

Gazelle is a collection of tools and services for managing Azure landing zones entirely as code—no manual steps, no portal clicks. Every environment is provisioned, updated, and destroyed through GitHub Issues and Actions.

There’s no central ops team pushing buttons. Just application teams managing their own environments, safely and independently, within clearly defined platform guardrails.

Everything runs through automation. Everything is visible in GitHub.

## What Gazelle Does

- **Self Service**: Provision, update, and tear down environments using GitHub Issues and Actions. No portals.
- **Provides Autonomy**: Application teams build and operate independently, within platform guardrails. You build it-you run it.
- **Safe Configuration by Default**: Every environment inherits a secure baseline—via Azure Policy, access controls, network isolation, and logging. This helps teams meet organizational requirements without needing deep cloud expertise.
- **Per-App Cost Visibility**: Each application gets its own invoice section, with budgets and alerts configured.

## How Gazelle Is Built	

- **Everything-as-Code**: policy, access control, or landing zone are managed as code in GitHub. Nothing is configured by hand.
- **Modular Design**: The platform is built from modular building blocks—each independently defined and deployed through its own pipeline.
- **Reproducible**: A full `Big Bang` workflow can destroy and rebuild the entire platform from scratch at any time.
- **Test Environment**: Platform changes deploy first to a mirrored test environment. All updates are validated before reaching production.

## Built-In Constraints

- **Single Region**: All resources deploy to a single region. The region is centrally defined in GitHub variables to standardize deployment.
- **Whitelisted Azure Resources**: Only approved services are deployable. Others are blocked by policy.
- **Network Isolation**: By default, landing zones have no network connectivity to each other or to on-premises systems.
- **No Shared Services**: Each landing zone is fully independent. There are no shared components across teams or environments.
