---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
<div style="margin: auto; text-align: center;">
<div class="hx:mt-6 hx:mb-6">
{{< hextra/hero-headline >}}
 Run Azure Landing Zones&nbsp;<br class="hx:sm:block hx:hidden" />on GitHub Actions 
{{< /hextra/hero-headline >}}
</div>

  <div style="height: 2rem;"></div>
<div class="hx:mb-12">
{{< hextra/hero-subtitle >}}
  Lean, Clean and build for Autonomy&nbsp;<br class="hx:sm:block hx:hidden" />With GitHub as management portal
{{< /hextra/hero-subtitle >}}
</div>
  <div style="height: 2 rem;"></div>

</div>


## Zero Cost
The platform bill is zero. Gazelle uses only free Azure management services and provisions essentials directly into each landing zone, shifting all runtime costs to the application’s own environment.

## Everything-as-Code
From landing zones to management groups, every part of the platform lives in GitHub as code. Teams request, update, and remove environments through Issues and Actions doing the rest.
 
## Isolation-By-Default
Every landing zone is a self-contained environment — nothing shared. Full runtime isolation lets application teams move autonomously in a true `you build it, you run it` model.




<!-- 

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
- **No Shared Services**: Each landing zone is fully independent. There are no shared components across teams or environments. -->
